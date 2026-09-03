import pytest
from datetime import datetime
from forecaster import DemandForecaster, SERVICE_CATEGORIES
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["supportedCategories"] == SERVICE_CATEGORIES


def test_demand_forecaster_direct():
    forecaster = DemandForecaster()
    now = datetime(2026, 9, 7)  # A Monday
    results = forecaster.generate_forecast("test-coop-123", now, days=5)

    assert len(results) == 5
    for day in results:
        assert "date" in day
        assert len(day["forecasts"]) == len(SERVICE_CATEGORIES)
        for cat_f in day["forecasts"]:
            assert cat_f["category"] in SERVICE_CATEGORIES
            assert cat_f["expectedDemand"] > 0
            assert 0.0 <= cat_f["confidenceScore"] <= 1.0


def test_forecast_api_endpoint():
    response = client.post("/forecast", json={
        "cooperativeId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "days": 7
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 7
    assert data[0]["forecasts"][0]["expectedDemand"] > 0


def test_forecast_invalid_days():
    response = client.post("/forecast", json={
        "cooperativeId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "days": 45  # Exceeds max 30
    })
    assert response.status_code == 422
