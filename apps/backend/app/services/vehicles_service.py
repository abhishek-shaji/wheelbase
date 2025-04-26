from typing import List, Optional
from uuid import UUID
from sqlalchemy import or_

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate
from fastapi_pagination.utils import disable_installed_extensions_check

from app.models.vehicle_model import VehicleCreate, VehicleResponse, VehicleFilter
from app.schemas import User, Vehicle, Brand, Organization
from app.database import get_db
from app.services.base_service import BaseService


class VehiclesService(BaseService):
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, current_user: User, organization_id: UUID, filter_params: VehicleFilter):
        query = self.db.query(Vehicle).filter(
            Vehicle.created_by_id == current_user.id,
            Vehicle.organization_id == organization_id
        )

        if filter_params.search:
            search_term = f"%{filter_params.search}%"
            query = query.filter(
                or_(
                    Vehicle.model.ilike(search_term),
                    Vehicle.vin_number.ilike(search_term),
                    Vehicle.registration_number.ilike(search_term)
                )
            )

        if filter_params.is_new is not None:
            query = query.filter(Vehicle.is_new == filter_params.is_new)

        vehicles = query.all()

        vehicle_responses = []

        for vehicle in vehicles:
            vehicle_responses.append(VehicleResponse.model_validate(vehicle))

        return paginate(vehicle_responses)

    def get_one(self, id: UUID, organization_id: UUID, current_user: User):
        vehicle = (
            self.db.query(Vehicle)
            .filter(
                Vehicle.id == id,
                Vehicle.created_by_id == current_user.id,
                Vehicle.organization_id == organization_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        return vehicle

    def create(self, form_data: VehicleCreate, current_user: User, organization_id: UUID):
        brand = self.db.query(Brand).filter(Brand.id == form_data.brand_id).first()
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")

        organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        if not organization:
            raise HTTPException(status_code=404, detail="Organization not found")

        vehicle = Vehicle(
            registration_number=form_data.registration_number,
            vin_number=form_data.vin_number,
            is_new=form_data.is_new,
            kms_driven=form_data.kms_driven,
            brand_id=form_data.brand_id,
            organization_id=organization_id,
            model=form_data.model,
            price=form_data.price,
            first_registration=form_data.first_registration,
            created_by_id=current_user.id,
        )
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)

        return vehicle

    def update(self, id: UUID, form_data: VehicleCreate, current_user: User, organization_id: UUID):
        brand = self.db.query(Brand).filter(Brand.id == form_data.brand_id).first()
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")

        organization = self.db.query(Organization).filter(Organization.id == organization_id).first()
        if not organization:
            raise HTTPException(status_code=404, detail="Organization not found")

        vehicle = (
            self.db.query(Vehicle)
            .filter(
                Vehicle.id == id,
                Vehicle.created_by_id == current_user.id,
                Vehicle.organization_id == organization_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        vehicle.registration_number = form_data.registration_number
        vehicle.vin_number = form_data.vin_number
        vehicle.is_new = form_data.is_new
        vehicle.kms_driven = form_data.kms_driven
        vehicle.brand_id = form_data.brand_id
        vehicle.organization_id = organization_id
        vehicle.model = form_data.model
        vehicle.price = form_data.price
        vehicle.first_registration = form_data.first_registration
        vehicle.updated_by_id = current_user.id

        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, id: UUID, organization_id: UUID, current_user: User):
        vehicle = (
            self.db.query(Vehicle)
            .filter(
                Vehicle.id == id,
                Vehicle.created_by_id == current_user.id,
                Vehicle.organization_id == organization_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        self.db.delete(vehicle)
        self.db.commit()

        return


def get_vehicles_service(db: Session = Depends(get_db)):
    return VehiclesService(db)
