from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import date

class VehicleStatistics(BaseModel):
    total_count: int = Field(description="Total number of vehicles")
    available_count: int = Field(description="Number of available (unsold) vehicles")
    fuel_type_distribution: Dict[str, int] = Field(description="Count of vehicles by fuel type")
    brand_distribution: Dict[str, int] = Field(description="Count of vehicles by brand")
    sales_by_month: Dict[str, int] = Field(description="Number of vehicles sold by month")
    avg_days_to_sell: Optional[float] = Field(description="Average days from listing to sale", default=None)

    class Config:
        schema_extra = {"description": "Statistics about vehicles"}

class CustomerStatistics(BaseModel):
    total_count: int = Field(description="Total number of customers")
    customers_by_month: Dict[str, int] = Field(description="Number of new customers by month")

    class Config:
        schema_extra = {"description": "Statistics about customers"}

class DashboardStatistics(BaseModel):
    vehicles: VehicleStatistics = Field(description="Vehicle statistics")
    customers: CustomerStatistics = Field(description="Customer statistics")
    total_revenue: float = Field(description="Total revenue from vehicle sales")
    revenue_by_month: Dict[str, float] = Field(description="Revenue by month")

    class Config:
        schema_extra = {"description": "Combined statistics for dashboard"}
