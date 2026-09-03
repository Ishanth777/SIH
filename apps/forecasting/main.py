from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from forecaster import DemandForecaster, SERVICE_CATEGORIES

app = FastAPI(
    title="Cooperative Labour Demand Forecasting Service",
    version="1.0.0",
    description="Time-series and ML demand forecasting for cooperative federations and societies.",
)

forecaster = DemandForecaster(model_version="1.0.0")


class ForecastRequest(BaseModel):
    cooperativeId: str = Field(..., description="UUID of the cooperative society")
    days: int = Field(default=7, ge=1, le=30, description="Forecast horizon in days (1-30)")


class CategoryForecast(BaseModel):
    category: str
    expectedDemand: int
    confidenceScore: float


class ForecastResponse(BaseModel):
    date: str
    forecasts: List[CategoryForecast]


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "forecasting",
        "version": "1.0.0",
        "supportedCategories": SERVICE_CATEGORIES,
    }


@app.post("/forecast", response_model=List[ForecastResponse])
def get_forecast(req: ForecastRequest):
    """
    Generate demand forecasts for the specified cooperative society across all service categories.
    Uses day-of-week seasonality, society scale bias, and confidence horizon degradation.
    """
    try:
        today = datetime.now()
        results = forecaster.generate_forecast(
            cooperative_id=req.cooperativeId,
            start_date=today,
            days=req.days,
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting calculation failed: {str(e)}")
