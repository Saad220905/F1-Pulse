'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RaceInfo {
  raceId: number;
  label: string;
  name: string;
  circuit: string;
  location: string;
  country: string;
  round: number;
  date: string;
  year: number;
}

interface DriverPrediction {
  driverRef: string;
  driver_name: string;
  team: string;
  predicted_position: number;
  grid_position?: number;
}

interface PredictionResult {
  race_name: string;
  race_id: number;
  predicted_winner: string;
  predicted_winner_team: string;
  top_3: Array<{ driver: string; team: string; position: string | number }>;
  full_predictions: DriverPrediction[];
  confidence: number;
  race_date?: string;
  circuit_name?: string;
  round?: number;
  location?: string;
  country?: string;
}

export default function Home() {
  const [raceName, setRaceName] = useState('');
  const [circuitName, setCircuitName] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [availableRaces, setAvailableRaces] = useState<RaceInfo[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'select' | 'manual'>('select');

  // Load available races on mount
  useEffect(() => {
    loadAvailableRaces();
  }, []);

  const loadAvailableRaces = async () => {
    setLoadingRaces(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/races?year=2025`);
      if (response.ok) {
        const data = await response.json();
        setAvailableRaces(data.races || []);
      }
    } catch (err) {
      console.error('Failed to load races:', err);
    } finally {
      setLoadingRaces(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      let response;
      if (searchMode === 'select' && selectedRaceId) {
        // Use race ID endpoint
        response = await fetch(`${apiUrl}/predict/${selectedRaceId}`);
      } else {
        // Use search endpoint
        if (!raceName.trim() && searchMode === 'manual') {
          setError('Please enter a race name or select a race');
          setLoading(false);
          return;
        }
        
        response = await fetch(`${apiUrl}/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            race_name: raceName || undefined,
            circuit_name: circuitName || undefined,
            race_date: raceDate || undefined,
            race_id: selectedRaceId || undefined,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to get prediction' }));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction. Make sure the FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRaceSelect = (raceId: number) => {
    setSelectedRaceId(raceId);
    const race = availableRaces.find(r => r.raceId === raceId);
    if (race) {
      setRaceName(race.name);
      setCircuitName(race.circuit);
      setRaceDate(race.date);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6 animate-pulse-slow">
            <span className="text-7xl">🏎️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            F1 Race Predictor
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Predict Formula 1 race results with AI
          </p>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Select a race from the 2025 season or search manually
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <span className="text-blue-800 dark:text-blue-200 text-xs">
              🤖 Predictions are generated in real-time using your trained ML model
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              📊 View Dashboard
            </Link>
            <Link
              href="/drivers"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              👤 Driver Profiles
            </Link>
            <Link
              href="/standings"
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              🏆 Standings
            </Link>
            <Link
              href="/what-is-f1"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Learn About F1
            </Link>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchMode('select')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                searchMode === 'select'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              📋 Select from List
            </button>
            <button
              onClick={() => setSearchMode('manual')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                searchMode === 'manual'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🔍 Search Manually
            </button>
          </div>

          <div className="space-y-6">
            {searchMode === 'select' ? (
              <div>
                <label htmlFor="raceSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Race <span className="text-red-500">*</span>
                </label>
                {loadingRaces ? (
                  <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-gray-500">Loading races...</span>
                  </div>
                ) : (
                  <select
                    id="raceSelect"
                    value={selectedRaceId || ''}
                    onChange={(e) => handleRaceSelect(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  >
                    <option value="">-- Select a race --</option>
                    {availableRaces.map((race) => (
                      <option key={race.raceId} value={race.raceId}>
                        {race.label}
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Choose from available 2025 F1 races
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="raceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Race Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="raceName"
                    type="text"
                    value={raceName}
                    onChange={(e) => setRaceName(e.target.value)}
                    placeholder="e.g., Monaco Grand Prix, British Grand Prix"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter the name of the F1 race you want to predict
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="circuitName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Circuit Name (Optional)
                    </label>
                    <input
                      id="circuitName"
                      type="text"
                      value={circuitName}
                      onChange={(e) => setCircuitName(e.target.value)}
                      placeholder="e.g., Circuit de Monaco"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="raceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Race Date (Optional)
                    </label>
                    <input
                      id="raceDate"
                      type="date"
                      value={raceDate}
                      onChange={(e) => setRaceDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handlePredict}
              disabled={loading || (searchMode === 'select' && !selectedRaceId) || (searchMode === 'manual' && !raceName.trim())}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating prediction with AI model...
                </span>
              ) : (
                '🚀 Get Prediction'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-1">Prediction Error</p>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                {error.includes('qualifying') || error.includes('Qualifying') ? (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                      <strong>Note:</strong> The ML model needs qualifying data to make predictions. 
                      For future races, predictions will be available after qualifying sessions are completed.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Results Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🏆 Prediction Results
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 border-2 border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">🥇</span>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Predicted Winner</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.predicted_winner}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.predicted_winner_team}</p>
                    </div>
                  </div>
                  {result.confidence && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {result.top_3 && result.top_3.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 3 Finishers</h3>
                    <div className="space-y-3">
                      {result.top_3?.map((driver, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-4">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                            <div>
                              <span className="text-lg font-medium text-gray-900 dark:text-white">
                                {index + 1}. {driver.driver}
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{driver.team}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.race_name && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Race:</span> {result.race_name}
                          {result.round && ` (Round ${result.round})`}
                        </p>
                        {result.circuit_name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">Circuit:</span> {result.circuit_name}
                            {result.location && `, ${result.location}`}
                            {result.country && `, ${result.country}`}
                          </p>
                        )}
                        {result.race_date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="font-medium">Date:</span> {new Date(result.race_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <a
                        href={`/compare/${result.race_id}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        📊 Compare with Actual Results
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Predictions Table */}
            {result.full_predictions && result.full_predictions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  📊 Full Race Predictions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Position</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Driver</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Grid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.full_predictions?.map((pred, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {pred.predicted_position}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {pred.driver_name}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {pred.team}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {pred.grid_position !== null && pred.grid_position !== undefined
                              ? pred.grid_position
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              New to Formula 1?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Learn about the world's premier racing championship, its history, teams, and cutting-edge technology.
            </p>
            <Link
              href="/what-is-f1"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Learn About F1 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
