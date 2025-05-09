"""add_sold_fields_and_remove_is_sold

Revision ID: add_sold_fields_and_remove_is_sold
Revises: 
Create Date: 2023-08-02 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid


# revision identifiers, used by Alembic.
revision = str(uuid.uuid4())
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create the sold_to_id and sold_at columns
    op.add_column('vehicles', sa.Column('sold_to_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('customers.id'), nullable=True))
    op.add_column('vehicles', sa.Column('sold_at', sa.DateTime(timezone=True), nullable=True))
    
    # Create a temporary connection and execute SQL to migrate data
    conn = op.get_bind()
    
    # For any vehicles marked as 'sold', set the sold_to_id to NULL (as we don't know the customer)
    # and set the sold_at to current_timestamp
    conn.execute(
        sa.text(
            """
            UPDATE vehicles 
            SET sold_at = NOW()
            WHERE is_sold = TRUE;
            """
        )
    )
    
    # Remove the is_sold column
    op.drop_column('vehicles', 'is_sold')


def downgrade():
    # Add back the is_sold column
    op.add_column('vehicles', sa.Column('is_sold', sa.Boolean(), nullable=False, server_default=sa.text('false')))
    
    # Create a temporary connection and execute SQL to migrate data back
    conn = op.get_bind()
    
    # Set is_sold to TRUE for any vehicles that have a sold_to_id
    conn.execute(
        sa.text(
            """
            UPDATE vehicles 
            SET is_sold = TRUE
            WHERE sold_to_id IS NOT NULL;
            """
        )
    )
    
    # Remove the sold_to_id and sold_at columns
    op.drop_column('vehicles', 'sold_at')
    op.drop_column('vehicles', 'sold_to_id') 