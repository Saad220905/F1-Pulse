# F1 Race Predictor - FastAPI Backend

This is the FastAPI backend for the F1 Race Predictor application. It loads prediction data from CSV files and provides a RESTful API for race predictions.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Add your CSV data files:
   - Place your CSV files in the `backend/data/` directory:
     - `predictions_2025_flat.csv` - Prediction data
     - `races.csv` - Race metadata
     - `circuits.csv` - Circuit metadata
   - See `data/README.md` for detailed file structure requirements

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## Data Files

The backend expects CSV files in the `backend/data/` directory:

### predictions_2025_flat.csv
Required columns:
- `raceId` - Race identifier
- `driverRef` - Driver reference name
- `team` - Team name
- `grid` - Starting grid position (optional)
- `pred_pos` - Predicted finishing position
- `finish_pos` - Actual finishing position (optional, for comparison)

### races.csv
Required columns:
- `raceId` - Race identifier
- `year` - Year of the race
- `round` - Round number in the season
- `circuitId` - Circuit identifier
- `name` - Grand Prix name
- `date` - Race date

### circuits.csv
Required columns:
- `circuitId` - Circuit identifier
- `name` - Circuit name
- `location` - Location/city
- `country` - Country

## API Endpoints

### Health Check
- `GET /` - Root endpoint with status
- `GET /health` - Detailed health check including data loading status

### Race Listing
- `GET /races?year=2025` - Get list of available races
  - Response:
    ```json
    {
      "races": [
        {
          "raceId": 1234,
          "label": "01 | Bahrain Grand Prix — Bahrain International Circuit (Sakhir, Bahrain)",
          "name": "Bahrain Grand Prix",
          "circuit": "Bahrain International Circuit",
          "location": "Sakhir",
          "country": "Bahrain",
          "round": 1,
          "date": "2025-03-02",
          "year": 2025
        }
      ],
      "total": 24
    }
    ```

### Predictions
- `POST /predict` - Predict race results by search
  - Request body:
    ```json
    {
      "race_name": "Monaco Grand Prix",
      "circuit_name": "Circuit de Monaco" (optional),
      "race_date": "2025-05-26" (optional),
      "race_id": 1234 (optional)
    }
    ```
  - Response:
    ```json
    {
      "race_name": "Monaco Grand Prix",
      "race_id": 1234,
      "predicted_winner": "max_verstappen",
      "predicted_winner_team": "Red Bull Racing",
      "top_3": [
        {"driver": "max_verstappen", "team": "Red Bull Racing", "position": 1},
        {"driver": "lewis_hamilton", "team": "Mercedes", "position": 2},
        {"driver": "charles_leclerc", "team": "Ferrari", "position": 3}
      ],
      "full_predictions": [
        {
          "driverRef": "max_verstappen",
          "driver_name": "max_verstappen",
          "team": "Red Bull Racing",
          "predicted_position": 1,
          "grid_position": 1
        }
      ],
      "confidence": 0.85,
      "circuit_name": "Circuit de Monaco",
      "race_date": "2025-05-26",
      "round": 6,
      "location": "Monte Carlo",
      "country": "Monaco"
    }
    ```

- `GET /predict/{race_id}` - Get predictions by race ID
  - Example: `GET /predict/1234`
  - Returns the same response format as POST /predict

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- **Automatic Data Loading**: CSV files are loaded on startup
- **Flexible Search**: Find races by name, circuit, date, or ID
- **Full Predictions**: Returns complete race predictions, not just top 3
- **Error Handling**: Graceful handling of missing data or invalid requests
- **Logging**: Comprehensive logging for debugging

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js default)
- `http://127.0.0.1:3000`

If you're running the frontend on a different port, update the `allow_origins` list in `main.py`.

## Troubleshooting

### Data Not Loading
- Check that CSV files are in `backend/data/` directory
- Verify file names match exactly: `predictions_2025_flat.csv`, `races.csv`, `circuits.csv`
- Check that CSV files have proper headers
- Review server logs for specific error messages

### Race Not Found
- Verify the race exists in your `races.csv` file
- Check that the year matches (default is 2025)
- Try using the race ID directly: `GET /predict/{race_id}`
- Use `GET /races` to see all available races

### Prediction Errors
- Ensure `predictions_2025_flat.csv` contains data for the requested race
- Check that `raceId` values match between files
- Verify required columns exist in prediction data

## Development

### Adding Support for Other Years
To support multiple years, modify the `_build_metadata()` method in `F1Predictor` class to filter by year parameter.

### Improving Confidence Scores
The current confidence is a placeholder (0.85). To add real confidence scores:
1. Include confidence data in your prediction CSV
2. Update the `predict()` method to use actual confidence values
3. Consider calculating confidence based on prediction variance or model outputs

### Extending the API
The codebase is structured to easily add new endpoints:
- Add new route handlers in `main.py`
- Extend `F1Predictor` class with new methods
- Update Pydantic models for new request/response formats
