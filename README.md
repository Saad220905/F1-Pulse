# 🏎️ F1 Race Predictor

An AI-powered Formula 1 race result predictor with a beautiful, user-friendly interface. Perfect for both F1 enthusiasts and newcomers to the sport.

## Features

- 🤖 **AI-Powered Predictions**: Get instant race predictions using machine learning
- 🎨 **Beautiful UI**: Modern, intuitive interface that's easy to use
- 🚀 **Fast Performance**: Built with Next.js for optimal speed
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🌙 **Dark Mode**: Automatic dark mode support

## Project Structure

```
f1-pulse/
├── app/                    # Next.js frontend application
│   ├── page.tsx           # Main prediction interface
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── backend/                # FastAPI backend
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend documentation
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Your trained F1 prediction model (or use the mock predictions for testing)

### Frontend Setup (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup (FastAPI)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Integrating Your AI Model

1. Place your trained model file in the `backend/` directory
2. Update `backend/main.py`:
   - Modify the `F1Predictor` class to load your model
   - Update the `predict()` method to use your actual model
   - See `backend/README.md` for detailed instructions

## How to Use

1. **Start both servers**:
   - Frontend: `npm run dev` (runs on port 3000)
   - Backend: `python backend/main.py` (runs on port 8000)

2. **Open the app** in your browser at `http://localhost:3000`

3. **Enter a race name** (e.g., "Monaco Grand Prix")

4. **Optionally add**:
   - Circuit name (e.g., "Circuit de Monaco")
   - Race date

5. **Click "Get Prediction"** to see AI-powered race predictions!

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health check
- `POST /predict` - Get race predictions
  - Request: `{ "race_name": "Monaco Grand Prix", "circuit_name": "...", "race_date": "..." }`
  - Response: `{ "predicted_winner": "...", "top_3": [...], "confidence": 0.85, ... }`

## API Documentation

When the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Configuration

### Changing the Backend URL

If your FastAPI server runs on a different port or URL, update the fetch URL in `app/page.tsx`:

```typescript
const response = await fetch('http://localhost:8000/predict', {
  // ... your config
});
```

### CORS Configuration

If you need to allow requests from different origins, update the CORS settings in `backend/main.py`:

```python
allow_origins=["http://localhost:3000", "http://your-frontend-url.com"]
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, Pydantic
- **Deployment**: Ready for Vercel (frontend) and any Python hosting (backend)

## Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload  # Start with auto-reload
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

## Support

For issues or questions:
- Check the backend README: `backend/README.md`
- Review the API documentation at `http://localhost:8000/docs`

---

Built with ❤️ for F1 fans and AI enthusiasts
