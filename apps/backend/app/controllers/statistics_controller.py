from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi_utils.cbv import cbv

from app.models.statistics_model import DashboardStatistics
from app.schemas import User
from app.utilities.auth_utility import get_current_user
from app.services.statistics_service import StatisticsService, get_statistics_service

router = APIRouter(prefix="/organizations/{organization_id}/statistics")


@cbv(router)
class StatisticsController:
    statistics_service: StatisticsService = Depends(get_statistics_service)

    @router.get(
        "/dashboard",
        status_code=200,
        response_model=DashboardStatistics,
        description="Get dashboard statistics for an organization"
    )
    def get_dashboard_statistics(
        self,
        organization_id: UUID,
        current_user: User = Depends(get_current_user),
    ):
        return self.statistics_service.get_dashboard_statistics(organization_id) 