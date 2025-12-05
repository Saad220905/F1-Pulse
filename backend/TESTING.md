# Testing Your Trained Model

## Quick Start

### 1. Start the API Server

```bash
cd backend
python main.py
```

Or use the convenience script:
```bash
bash start_server.sh
```

The server will start on `http://localhost:8000`

### 2. Check Model Status

In a new terminal:
```bash
curl http://localhost:8000/model/status
```

Expected response:
```json
{
  "ml_model_available": true,
  "model_loaded": true,
  "using_ml_model": true,
  "model_file_exists": true,
  "model_file_path": "backend/models/f1_model.cbm"
}
```

### 3. Test a Prediction

The model needs race data from FastF1. To make a prediction, you need:
- Year (2025)
- Round number (1-24 for 2025 season)

**Example: Predict Round 1 (Bahrain Grand Prix)**
```bash
# First, get available races
curl http://localhost:8000/races?year=2025

# Then predict a specific race (you'll need the race_id from above)
curl http://localhost:8000/predict/1
```

### 4. View API Documentation

Open in browser: http://localhost:8000/docs

This provides an interactive interface to test all endpoints.

## Important Notes

### ML Model vs CSV Fallback

- **ML Model**: Uses real-time FastF1 data, requires qualifying data to be available
- **CSV Fallback**: Uses pre-computed predictions from CSV files

The API automatically:
1. Tries to use ML model if available and race data exists
2. Falls back to CSV if ML model fails or data unavailable

### Making Predictions with ML Model

The ML model needs:
- Qualifying session data (Q1, Q2, Q3) for the race
- This data is only available after qualifying has happened

For **future races** (before qualifying):
- The API will try to use ML model but may fall back to CSV
- This is expected behavior

For **past races** (after qualifying):
- ML model should work if FastF1 has the data cached

## Testing Checklist

- [ ] Server starts without errors
- [ ] Model status shows `model_loaded: true`
- [ ] Can list available races
- [ ] Can make predictions (may use CSV fallback for future races)
- [ ] Frontend can connect to API

## Troubleshooting

**Model not loading?**
- Check: `ls models/f1_model.cbm`
- Check server logs for errors
- Verify: `curl http://localhost:8000/model/status`

**Predictions failing?**
- Check if race has qualifying data available
- Try a past race (round 1-3 of 2025 if they've happened)
- Check server logs for FastF1 errors

**Frontend can't connect?**
- Verify API is running on port 8000
- Check CORS settings in `main.py`
- Verify `NEXT_PUBLIC_API_URL` in frontend

