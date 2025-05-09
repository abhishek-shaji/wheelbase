from uuid import UUID
from sqlalchemy import or_
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer_model import CustomerCreate, CustomerFilter, CustomerResponse
from app.schemas import Customer, User, Organization
from app.services.base_service import BaseService


class CustomerService(BaseService):
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, organization_id: UUID, current_user: User, filter: CustomerFilter = None):
        query = (
            self.db.query(Customer)
            .filter(Customer.organization_id == organization_id)
        )

        # Check if user has access to this organization
        self._check_organization_access(organization_id, current_user)

        # Apply search filter if provided
        if filter and filter.search:
            search = f"%{filter.search}%"
            query = query.filter(
                or_(
                    Customer.first_name.ilike(search),
                    Customer.last_name.ilike(search),
                    Customer.email.ilike(search),
                    Customer.phone.ilike(search),
                )
            )

        customers = query.all()
        return customers

    def get_one(self, id: UUID, organization_id: UUID, current_user: User):
        # Check if user has access to this organization
        self._check_organization_access(organization_id, current_user)

        customer = (
            self.db.query(Customer)
            .filter(
                Customer.id == id,
                Customer.organization_id == organization_id,
            )
            .first()
        )
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
            
        return customer

    def create(self, organization_id: UUID, form_data: CustomerCreate, current_user: User):
        # Check if user has access to this organization
        self._check_organization_access(organization_id, current_user)

        customer = Customer(
            first_name=form_data.first_name,
            last_name=form_data.last_name,
            email=str(form_data.email),
            phone=form_data.phone,
            organization_id=organization_id,
            created_by_id=current_user.id,
        )

        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)

        return customer

    def update(self, id: UUID, organization_id: UUID, form_data: CustomerCreate, current_user: User):
        customer = self.get_one(id, organization_id, current_user)

        customer.first_name = form_data.first_name
        customer.last_name = form_data.last_name
        customer.email = str(form_data.email)
        customer.phone = form_data.phone
        customer.updated_by_id = current_user.id
        
        self.db.commit()
        self.db.refresh(customer)
        
        return customer

    def delete(self, id: UUID, organization_id: UUID, current_user: User):
        customer = self.get_one(id, organization_id, current_user)
            
        self.db.delete(customer)
        self.db.commit()
        
        return None

    def _check_organization_access(self, organization_id: UUID, current_user: User):
        organization = (
            self.db.query(Organization)
            .filter(
                Organization.id == organization_id,
                Organization.created_by_id == current_user.id,
            )
            .first()
        )
        
        if not organization:
            raise HTTPException(status_code=404, detail="Organization not found")


def get_customer_service(db: Session = Depends(get_db)):
    return CustomerService(db) 