from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from app.controllers import auth_controller
from app.controllers import vehicles_controller
from app.controllers import organizations_controller
from app.controllers import brands_controller
from app.controllers import customers_controller
from app.controllers import statistics_controller
from scalar_fastapi import get_scalar_api_reference
import os

app = FastAPI(title="DealerHub API", version="1.0.0", docs_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000,https://wheelbase.abhishek.pl",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller.router, tags=["Auth"])
app.include_router(vehicles_controller.router, tags=["Vehicles"])
app.include_router(organizations_controller.router, tags=["Organizations"])
app.include_router(brands_controller.router, tags=["Brands"])
app.include_router(customers_controller.router, tags=["Customers"])
app.include_router(statistics_controller.router, tags=["Statistics"])

add_pagination(app)

@app.get("/docs", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(openapi_url=app.openapi_url, title=app.title)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
