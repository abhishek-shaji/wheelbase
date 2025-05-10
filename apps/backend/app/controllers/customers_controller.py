from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session

from app.models.customer_model import CustomerCreate, CustomerFilter, CustomerResponse
from app.schemas import User
from app.database import get_db
from app.utilities.auth_utility import get_current_user
from app.services.customers_service import CustomerService, get_customer_service

router = APIRouter(prefix="/organizations/{organization_id}/customers")


@cbv(router)
class CustomersController:
    db: Session = Depends(get_db)
    customer_service: CustomerService = Depends(get_customer_service)

    @router.post(
        "/",
        status_code=201,
        response_model=CustomerResponse,
        description="Create a new customer for an organization",
    )
    def create_customer(
        self,
        organization_id: UUID,
        form_data: CustomerCreate,
        current_user: User = Depends(get_current_user),
    ):
        return self.customer_service.create(organization_id, form_data, current_user)

    @router.get(
        "/",
        status_code=200,
        response_model=List[CustomerResponse],
        description="Get a list of customers for an organization",
    )
    def get_customers(
        self,
        organization_id: UUID,
        search: str = Query(None, description="Search term for filtering customers"),
        current_user: User = Depends(get_current_user),
    ):
        filter = CustomerFilter(search=search) if search else None
        return self.customer_service.get_all(organization_id, current_user, filter)

    @router.get(
        "/{customer_id}",
        status_code=200,
        response_model=CustomerResponse,
        description="Get a customer by its ID",
    )
    def get_customer(
        self,
        organization_id: UUID,
        customer_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        return self.customer_service.get_one(customer_id, organization_id, current_user)

    @router.put(
        "/{customer_id}",
        status_code=200,
        response_model=CustomerResponse,
        description="Update an existing customer",
    )
    def update_customer(
        self,
        organization_id: UUID,
        customer_id: UUID,
        form_data: CustomerCreate,
        current_user: User = Depends(get_current_user),
    ):
        return self.customer_service.update(customer_id, organization_id, form_data, current_user)

    @router.delete(
        "/{customer_id}",
        status_code=204,
        description="Delete a customer",
    )
    def delete_customer(
        self,
        organization_id: UUID,
        customer_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        self.customer_service.delete(customer_id, organization_id, current_user)
        return
