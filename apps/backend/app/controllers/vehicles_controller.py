from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv
from fastapi_pagination import Page

from app.models.vehicle_model import VehicleCreate, VehicleResponse, VehicleFilter, VehicleMarkAsSold
from app.schemas import User
from app.utilities.auth_utility import get_current_user
from app.services.vehicles_service import VehiclesService, get_vehicles_service

router = APIRouter(prefix="/organizations/{organization_id}/vehicles")


@cbv(router)
class VehiclesController:
    vehicles_service: VehiclesService = Depends(get_vehicles_service)

    @router.post(
        "/",
        status_code=201,
        response_model=VehicleResponse,
    )
    def create_vehicle(
        self,
        organization_id: UUID,
        form_data: VehicleCreate,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.create(form_data, current_user, organization_id)

    @router.get(
        "/",
        status_code=200,
        response_model=Page[VehicleResponse],
    )
    def get_vehicles(
        self,
        organization_id: UUID,
        filter_params: VehicleFilter = Depends(),
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.get_all(current_user, organization_id, filter_params)

    @router.get(
        "/{vehicle_id}",
        status_code=200,
        response_model=VehicleResponse,
    )
    def get_vehicle(
        self,
        organization_id: UUID,
        vehicle_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.get_one(vehicle_id, organization_id, current_user)

    @router.put(
        "/{vehicle_id}",
        status_code=200,
        response_model=VehicleResponse,
    )
    def update_vehicle(
        self,
        organization_id: UUID,
        vehicle_id: UUID,
        form_data: VehicleCreate,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.update(vehicle_id, form_data, current_user, organization_id)
        
    @router.post(
        "/{vehicle_id}/mark-as-sold",
        status_code=200,
        response_model=VehicleResponse,
    )
    def mark_vehicle_as_sold(
        self,
        organization_id: UUID,
        vehicle_id: UUID,
        form_data: VehicleMarkAsSold,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.mark_as_sold(vehicle_id, form_data, current_user, organization_id)
        
    @router.post(
        "/{vehicle_id}/mark-as-unsold",
        status_code=200,
        response_model=VehicleResponse,
    )
    def mark_vehicle_as_unsold(
        self,
        organization_id: UUID,
        vehicle_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.mark_as_unsold(vehicle_id, current_user, organization_id)

    @router.delete(
        "/{vehicle_id}",
        status_code=204,
    )
    def delete_vehicle(
        self,
        organization_id: UUID,
        vehicle_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        return self.vehicles_service.delete(vehicle_id, organization_id, current_user) 