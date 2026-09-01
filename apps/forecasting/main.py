from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime, timedelta

app = FastAPI(title="Forecasting Service", version="0.1.0")

class ForecastRequest(BaseModel):
    cooperativeId: str
    days: int = 7

class CategoryForecast(BaseModel):
    category: str
    expectedDemand: int
    confidenceScore: float

class ForecastResponse(BaseModel):
    date: str
    forecasts: List[CategoryForecast]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/forecast", response_model=List[ForecastResponse])
def get_forecast(req: ForecastRequest):
    """
    Mock forecasting endpoint returning simulated demand for the next N days.
    """
    categories = ["ELECTRICIAN", "PLUMBER", "CLEANER", "CAREGIVER"]
    results = []
    
    today = datetime.now()
    for i in range(req.days):
        date_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
        
        day_forecasts = []
        for cat in categories:
            # Simulate random demand between 5 and 50 jobs
            demand = random.randint(5, 50)
            confidence = round(random.uniform(0.70, 0.98), 2)
            
            day_forecasts.append(
                CategoryForecast(
                    category=cat,
                    expectedDemand=demand,
                    confidenceScore=confidence
                )
            )
            
        results.append(ForecastResponse(date=date_str, forecasts=day_forecasts))
        
    return results
