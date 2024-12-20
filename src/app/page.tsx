"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@mui/material';

const GameBoard = () => {
  const [gridSize] = useState(3);
  const [hints] = useState({
    top: ['Hint 1', 'Hint 2', 'Hint 3'],
    left: ['Hint A', 'Hint B', 'Hint C']
  });
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started
  const [isPageLoaded, setIsPageLoaded] = useState(false); // Track if the page has loaded
  const [buttonClicked, setButtonClicked] = useState(false); // Track if the button was clicked
  const [cellClicked, setCellClicked] = useState(false); // Track if the button was clicked

  useEffect(() => {
    // Ensure page is loaded before showing the button
    setIsPageLoaded(true);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    setCellClicked(true)
    const cellId = `${row}-${col}`;
    setRevealedCells(prev => new Set([...prev, cellId]));
  };

  const handleCloseSearchBar = () => {
    setCellClicked(false)
  };

  // Function to start the game when the button is clicked
  const startGame = () => {
    setButtonClicked(true); // Set button as clicked

    // Delay the game start to allow animation to finish
    setTimeout(() => {
      setGameStarted(true);
    }, 300); // 300ms matches the duration of the pop animation

    // Reset button animation after it finishes
    setTimeout(() => setButtonClicked(false), 300); // Duration matches the pop effect
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Game Header - Always displayed */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">MatchBox</h1>
        <p className="text-gray-600">Match the hints to guess the person!</p>
      </div>

      {/* Start Button */}
      {!gameStarted && isPageLoaded ? (
        <div className="text-center mt-12"> {/* Ensures enough space is added to the button */}
          <Button
            variant="contained"
            onClick={startGame}
            className={buttonClicked ? 'pop-animation' : ''} // Apply pop-animation when clicked
            sx={{
              fontFamily: 'inherit',
              backgroundColor: '#3D57D6',
              color: '#FBFBFB',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#2a4bb6', // A slightly darker shade for hover effect
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add shadow on hover
              },
            }}
          >
            Start Matching!
          </Button>
        </div>
      ) : (
        // Game Grid - Displayed after the game starts
        gameStarted && (
          <div className="mb-8 text-center">
            {/* Game Grid */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {/* Empty top-left corner */}
              <div className="h-24"></div>

              {/* Top hints */}
              {hints.top.map((hint, index) => (
                <Card key={`top-${index}`} className="p-4 h-24 flex items-center justify-center text-center">
                  {hint}
                </Card>
              ))}

              {/* Left hints and grid cells */}
              {Array.from({ length: gridSize }).map((_, row) => (
                <React.Fragment key={`row-${row}`}>
                  {/* Left hint */}
                  <Card className="p-4 h-24 flex items-center justify-center text-center">
                    {hints.left[row]}
                  </Card>

                  {/* Grid cells */}
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
                          backgroundColor: isRevealed ? '#3D57D6' : '',
                          color: isRevealed ? 'white' : '',
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
      {cellClicked && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50"
          onClick={handleCloseSearchBar} // Close on background click
        >
            <input
              placeholder="Search..."
              autoFocus
              className="bg-white p-4 rounded shadow-lg text-black h-10 w-2/3 mt-10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the search bar
            />
        </div>
      )}
    </div>
  );
};

export default GameBoard;