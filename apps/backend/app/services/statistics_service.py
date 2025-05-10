from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract, text
from datetime import datetime, timedelta, date
from uuid import UUID
from fastapi import Depends, HTTPException
from typing import Dict

from app.database import get_db
from app.schemas import Vehicle, Customer, Brand
from app.models.statistics_model import VehicleStatistics, CustomerStatistics, DashboardStatistics

class StatisticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_vehicle_statistics(self, organization_id: UUID) -> VehicleStatistics:
        # Total count of vehicles
        total_count = self.db.query(func.count(Vehicle.id)).filter(
            Vehicle.organization_id == organization_id
        ).scalar() or 0

        # Count of available (unsold) vehicles
        available_count = self.db.query(func.count(Vehicle.id)).filter(
            Vehicle.organization_id == organization_id,
            Vehicle.sold_to_id.is_(None)
        ).scalar() or 0

        # Fuel type distribution
        fuel_type_query = self.db.query(
            Vehicle.fuel_type,
            func.count(Vehicle.id)
        ).filter(
            Vehicle.organization_id == organization_id
        ).group_by(Vehicle.fuel_type).all()

        fuel_type_distribution = {fuel_type: count for fuel_type, count in fuel_type_query}

        # Brand distribution
        brand_query = self.db.query(
            Brand.name,
            func.count(Vehicle.id)
        ).join(Vehicle, Vehicle.brand_id == Brand.id).filter(
            Vehicle.organization_id == organization_id
        ).group_by(Brand.name).all()

        brand_distribution = {brand_name: count for brand_name, count in brand_query}

        # Sales by day (last 7 days)
        current_date = datetime.now()
        start_date = (current_date - timedelta(days=7))

        # Create a dictionary with all 7 days
        sales_by_month = {}
        for i in range(7):
            day = current_date - timedelta(days=i)
            day_str = day.strftime('%Y-%m-%d')
            sales_by_month[day_str] = 0

        # Fill in actual sales data
        sales_query = self.db.query(
            func.to_char(Vehicle.sold_at, 'YYYY-MM-DD'),
            func.count(Vehicle.id)
        ).filter(
            Vehicle.organization_id == organization_id,
            Vehicle.sold_at.is_not(None),
            Vehicle.sold_at >= start_date
        ).group_by(func.to_char(Vehicle.sold_at, 'YYYY-MM-DD')).all()

        # Update the dictionary with actual data
        for day, count in sales_query:
            sales_by_month[day] = count

        return VehicleStatistics(
            total_count=total_count,
            available_count=available_count,
            fuel_type_distribution=fuel_type_distribution,
            brand_distribution=brand_distribution,
            sales_by_month=sales_by_month,
        )

    def get_customer_statistics(self, organization_id: UUID) -> CustomerStatistics:
        total_count = self.db.query(func.count(Customer.id)).filter(
            Customer.organization_id == organization_id
        ).scalar() or 0

        current_date = datetime.now()
        start_date = (current_date - timedelta(days=7))
        customers_by_month = {}

        for i in range(7):
            day = current_date - timedelta(days=i)
            day_str = day.strftime('%Y-%m-%d')
            customers_by_month[day_str] = 0

        customers_query = self.db.query(
            func.to_char(Customer.created_at, 'YYYY-MM-DD'),
            func.count(Customer.id)
        ).filter(
            Customer.organization_id == organization_id,
            Customer.created_at >= start_date
        ).group_by(func.to_char(Customer.created_at, 'YYYY-MM-DD')).all()

        for day, count in customers_query:
            customers_by_month[day] = count

        return CustomerStatistics(
            total_count=total_count,
            customers_by_month=customers_by_month
        )

    def get_dashboard_statistics(self, organization_id: UUID) -> DashboardStatistics:
        vehicle_stats = self.get_vehicle_statistics(organization_id)
        customer_stats = self.get_customer_statistics(organization_id)

        # Total revenue
        total_revenue = self.db.query(func.sum(Vehicle.price)).filter(
            Vehicle.organization_id == organization_id,
            Vehicle.sold_to_id.is_not(None)
        ).scalar() or 0.0

        # Revenue by day (last 7 days)
        current_date = datetime.now()
        start_date = (current_date - timedelta(days=7))

        # Create a dictionary with all 7 days
        revenue_by_month = {}
        for i in range(7):
            day = current_date - timedelta(days=i)
            day_str = day.strftime('%Y-%m-%d')
            revenue_by_month[day_str] = 0.0

        # Fill in actual revenue data
        revenue_query = self.db.query(
            func.to_char(Vehicle.sold_at, 'YYYY-MM-DD'),
            func.sum(Vehicle.price)
        ).filter(
            Vehicle.organization_id == organization_id,
            Vehicle.sold_at.is_not(None),
            Vehicle.sold_at >= start_date
        ).group_by(func.to_char(Vehicle.sold_at, 'YYYY-MM-DD')).all()

        # Update the dictionary with actual data
        for day, revenue in revenue_query:
            revenue_by_month[day] = float(revenue)

        return DashboardStatistics(
            vehicles=vehicle_stats,
            customers=customer_stats,
            total_revenue=total_revenue,
            revenue_by_month=revenue_by_month
        )

def get_statistics_service(db: Session = Depends(get_db)) -> StatisticsService:
    return StatisticsService(db)
