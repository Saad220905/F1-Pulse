# F1 Pulse Backend API

FastAPI backend service for F1 race predictions using machine learning models.

## Overview

This is a standalone FastAPI application that provides REST API endpoints for:
- F1 race predictions using CatBoost ML models
- Driver and team statistics
- Race metadata and standings
- Custom scenario predictions

## Prerequisites

- Python 3.11+ (recommended)
- pip
- Virtual environment (recommended)

## Local Development Setup

1. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure required data files exist**:
   ```
   backend/
   ├── data/
   │   ├── races.csv
   │   ├── circuits.csv
   │   └── predictions_2025_flat.csv (optional)
   ├── models/
   │   └── f1_model.cbm
   └── F1_predict_md.py
   ```

4. **Set environment variables** (optional for local dev):
   ```bash
   export ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
   ```

5. **Run the server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Or using Python directly:
   ```bash
   python main.py
   ```

6. **Verify it's running**:
   - Health check: http://localhost:8000/health
   - API docs: http://localhost:8000/docs

## API Endpoints

### Health & Info
- `GET /` - Root endpoint
- `GET /health` - Health check with system status

### Predictions
- `GET /predict/{race_id}` - Get prediction for a specific race
- `POST /predict/custom` - Get prediction for custom scenario

### Data
- `GET /races?year={year}` - Get available races for a year
- `GET /drivers` - Get driver information
- `GET /statistics` - Get overall statistics
- `GET /standings?year={year}` - Get championship standings

### Comparisons
- `GET /compare/{race_id}` - Compare predictions with actual results

## Environment Variables

### Required for Production
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
  - Example: `https://your-app.vercel.app,https://*.vercel.app,http://localhost:3000`

### Optional
- `PORT`: Port number (defaults to 8000, set by platform in production)

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Create a new service
3. Set **Root Directory** to `backend`
4. Railway will auto-detect Python and use `Procfile` or `railway.json`
5. Add environment variable:
   - Key: `ALLOWED_ORIGINS`
   - Value: Your frontend URL(s)

### Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable:
   - Key: `ALLOWED_ORIGINS`
   - Value: Your frontend URL(s)

### Other Platforms

The backend can be deployed to any platform that supports Python:
- Heroku (using `Procfile`)
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- DigitalOcean App Platform

Just ensure:
- Root directory is set to `backend/`
- `requirements.txt` is installed
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- `ALLOWED_ORIGINS` environment variable is set

## Project Structure

```
backend/
├── main.py                 # FastAPI application and endpoints
├── F1_predict_md.py        # ML model class and prediction logic
├── requirements.txt        # Python dependencies
├── Procfile               # Railway/Heroku deployment config
├── railway.json           # Railway-specific config
├── render.yaml            # Render deployment config
├── data/                  # CSV data files
│   ├── races.csv
│   ├── circuits.csv
│   └── predictions_2025_flat.csv
├── models/                # ML model files
│   └── f1_model.cbm
└── README.md              # This file
```

## Dependencies

Key dependencies:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `catboost` - ML model library
- `fastf1` - F1 data fetching
- `pandas` - Data manipulation
- `numpy` - Numerical operations
- `pydantic` - Data validation

See `requirements.txt` for complete list.

## Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:8000/health

# Get races
curl http://localhost:8000/races?year=2025

# Get prediction
curl http://localhost:8000/predict/1
```

Or use the interactive docs at `/docs` when the server is running.

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that the URL matches exactly (including `https://`)

### Model Not Found
- Ensure `models/f1_model.cbm` exists
- Check that `F1_predict_md.py` is in the backend directory

### Data Files Missing
- Ensure `data/races.csv` and `data/circuits.csv` exist
- Run data generation scripts if needed

### Port Already in Use
- Change the port: `uvicorn main:app --port 8001`
- Or kill the process using port 8000

## Support

For issues or questions:
- Check the main project README
- Review API documentation at `/docs` endpoint
- Check deployment guide: `../DEPLOYMENT.md`
