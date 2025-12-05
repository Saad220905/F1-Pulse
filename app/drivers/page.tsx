'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Trophy, Users } from 'lucide-react';
import { getDriverPortrait, getTeamLogo, formatDriverName } from '../utils/images';

interface Driver {
  driverRef: string;
  driver_name: string;
  total_races: number;
  predicted_wins: number;
  current_team: string | null;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'wins' | 'races' | 'name'>('wins');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data.drivers || []);
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSorted = drivers
    .filter(driver =>
      driver.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driverRef.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'wins') return b.predicted_wins - a.predicted_wins;
      if (sortBy === 'races') return b.total_races - a.total_races;
      return a.driver_name.localeCompare(b.driver_name);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🏎️ Driver Profiles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive driver statistics and performance analysis
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'wins' | 'races' | 'name')}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="wins">Sort by Wins</option>
              <option value="races">Sort by Races</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map((driver, index) => (
            <Link
              key={driver.driverRef}
              href={`/drivers/${driver.driverRef}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-red-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                {driver.predicted_wins > 0 && (
                  <Trophy className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              
              {/* Driver Photo */}
              <div className="mb-4 flex justify-center">
                {getDriverPortrait(driver.driverRef) ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-red-500">
                    <Image
                      src={`/drivers/driver_portraits/${getDriverPortrait(driver.driverRef)}`}
                      alt={formatDriverName(driver.driverRef)}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {formatDriverName(driver.driverRef)}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Predicted Wins</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {driver.predicted_wins}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Races</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {driver.total_races}
                  </span>
                </div>
                {driver.current_team && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Team</span>
                    <div className="flex items-center gap-2">
                      {getTeamLogo(driver.current_team) && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={`/teams/${getTeamLogo(driver.current_team)}`}
                            alt={driver.current_team}
                            fill
                            className="object-contain"
                            sizes="24px"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {driver.current_team}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No drivers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

