"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@mui/material';

const GameBoard = () => {
  const [gridSize] = useState(3);
  const [hints, setHints] = useState({
    top: ['Hint 1', 'Hint 2', 'Hint 3'],
    left: ['Hint A', 'Hint B', 'Hint C']
  });
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tileClicked, setTileClicked] = useState(false);
  const [nflData, setNflData] = useState<any>({});

  useEffect(() => {
    fetch('/data/nfl/nfl_player_data.json')
      .then(response => response.json())
      .then(data => {
        setNflData(data);
        generateHints(data);
      });
    setIsPageLoaded(true);
  }, []);

  const generateHints = (data: any) => {
    const getRandomFact = (playerData: any) => {
      const randomSeason = playerData[Math.floor(Math.random() * playerData.length)];
      
      // Define possible hint templates based on stat types
      const hintTemplates = {
        defense: [
          (stats: any) => stats.Comb > 0 ? `${stats.Comb} combined tackles in ${stats.G} games` : null,
          (stats: any) => stats.Solo > 0 ? `${stats.Solo} solo tackles in ${stats.G} games` : null,
          (stats: any) => stats.Sk > 0 ? `${stats.Sk} sacks in ${stats.G} games` : null,
          (stats: any) => stats.TFL > 0 ? `${stats.TFL} tackles for loss` : null
        ],
        receiving: [
          (stats: any) => stats.Rec > 0 ? `${stats.Rec} receptions for ${stats.Yds} yards` : null,
          (stats: any) => stats.TD > 0 ? `${stats.TD} receiving TDs in ${stats.G} games` : null,
          (stats: any) => stats.Y_R > 0 ? `${stats.Y_R} yards per reception` : null,
          (stats: any) => stats.Ctch_pct > 0 ? `${stats.Ctch_pct}% catch rate` : null
        ],
        scoring: [
          (stats: any) => stats.Pts > 0 ? `${stats.Pts} total points scored` : null,
          (stats: any) => stats.AllTD > 0 ? `${stats.AllTD} total touchdowns` : null,
          (stats: any) => stats.Pts_G > 0 ? `${stats.Pts_G} points per game` : null
        ]
      };

      // Determine stat type and get relevant templates
      const statType = randomSeason.STAT;
      const relevantTemplates = hintTemplates[statType as keyof typeof hintTemplates] || [];

      // Filter out templates that would return null for this player's stats
      const validHints = relevantTemplates
        .map(template => template(randomSeason))
        .filter(hint => hint !== null);

      // If no valid hints found, try another season or return a basic fact
      if (validHints.length === 0) {
        return `Played ${randomSeason.G} games in ${randomSeason.YEAR}`;
      }

      // Return a random valid hint
      return validHints[Math.floor(Math.random() * validHints.length)];
    };

    // Generate random hints for the grid
    setHints({
      top: Object.keys(data).slice(0, 3).map(playerName => getRandomFact(data[playerName])),
      left: Object.keys(data).slice(3, 6).map(playerName => getRandomFact(data[playerName])),
    });
  };

  const handleCellClick = (row: number, col: number) => {
    setTileClicked(true);
    const cellId = `${row}-${col}`;
    setRevealedCells((prev) => new Set([...prev, cellId]));
  };

  const handleCloseSearchBar = () => {
    setTileClicked(false);
  };

  const startGame = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setGameStarted(true);
    }, 300);
    setTimeout(() => setButtonClicked(false), 300);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">MatchBox</h1>
        <p className="text-gray-600">Match the hints to guess the player!</p>
      </div>

      {!gameStarted && isPageLoaded ? (
        <div className="text-center mt-12">
          <Button
            variant="contained"
            onClick={startGame}
            className={buttonClicked ? 'pop-animation' : ''}
            sx={{
              fontFamily: 'inherit',
              backgroundColor: '#3D57D6',
              color: '#FBFBFB',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2a4bb6',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Start Matching!
          </Button>
        </div>
      ) : (
        gameStarted && (
          <div className="mb-8 text-center">
            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="h-24"></div>

              {hints.top.map((hint, index) => (
                <Card
                  key={`top-${index}`}
                  className="p-4 h-24 flex items-center justify-center text-center"
                  style={{
                    backgroundColor: '#121212',
                    color: 'white',
                  }}
                >
                  {hint}
                </Card>
              ))}

              {Array.from({ length: gridSize }).map((_, row) => (
                <React.Fragment key={`row-${row}`}>
                  <Card
                    className="p-4 h-24 flex items-center justify-center text-center"
                    style={{
                      backgroundColor: '#121212',
                      color: 'white',
                    }}
                  >
                    {hints.left[row]}
                  </Card>

                  {Array.from({ length: gridSize }).map((_, col) => {
                    const cellId = `${row}-${col}`;
                    const isRevealed = revealedCells.has(cellId);

                    return (
                      <Card
                        key={`cell-${cellId}`}
                        className={`h-24 cursor-pointer transition-all duration-300 ${
                          isRevealed ? 'pop-animation' : 'hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: isRevealed ? '#3D57D6' : '#121212',
                          color: isRevealed ? 'white' : 'white',
                        }}
                        onClick={() => handleCellClick(row, col)}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {isRevealed ? 'Player Name' : '?'}
                        </div>
                      </Card>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      )}

      {tileClicked && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50"
          onClick={handleCloseSearchBar}
        >
          <input
            placeholder="Search..."
            autoFocus
            className="bg-white p-4 rounded shadow-lg text-black h-10 w-2/3 mt-10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoard;