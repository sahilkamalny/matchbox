"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "@mui/material";

// Contains 3 x 3 grid of tiles with 3 hints on top + left
const GameBoard = () => {
  const [gridSize] = useState(3);
  const [hints, setHints] = useState({
    top: ["Hint 1", "Hint 2", "Hint 3"],
    left: ["Hint A", "Hint B", "Hint C"],
  });
  const [revealedTiles, setRevealedTiles] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tileClicked, setTileClicked] = useState(false);

  // Entry point for page generation
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Reveals a tile when clicked
  const handleTileClick = (row: number, col: number) => {
    setTileClicked(true);
    const cellId = `${row}-${col}`;
    setRevealedTiles((prev) => new Set([...prev, cellId]));
  };

  // Closes the search bar
  const handleCloseSearchBar = () => {
    setTileClicked(false);
  };

  // Starts the game
  const startGame = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setGameStarted(true);
    }, 300);
    setTimeout(() => setButtonClicked(false), 300);
  };

  // Page header with "MatchBox", slogan, and start button
  return (
    // Header
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">MatchBox</h1>
        <p className="text-gray-600">Match the hints to guess the person!</p>
      </div>

      {/*Only shows button when the page has loaded*/}
      {!gameStarted && isPageLoaded ? (
        <div className="text-center mt-12">
          <Button
            variant="contained"
            onClick={startGame}
            className={buttonClicked ? "pop-animation" : ""}
            sx={{
              fontFamily: "inherit",
              backgroundColor: "#3D57D6",
              color: "#FBFBFB",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#2a4bb6",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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

              {/*Places 3 hints along the top of the grid*/}
              {hints.top.map((hint, index) => (
                <Card
                  key={`top-${index}`}
                  className="p-4 h-24 flex items-center justify-center text-center"
                  style={{
                    backgroundColor: "#121212",
                    color: "white",
                  }}
                >
                  {hint}
                </Card>
              ))}

              {/*Places 3 hints along the left of the grid*/}
              {Array.from({ length: gridSize }).map((_, row) => (
                <React.Fragment key={`row-${row}`}>
                  <Card
                    className="p-4 h-24 flex items-center justify-center text-center"
                    style={{
                      backgroundColor: "#121212",
                      color: "white",
                    }}
                  >
                    {hints.left[row]}
                  </Card>

                  {/*Tile reveal logic*/}
                  {Array.from({ length: gridSize }).map((_, col) => {
                    const tileId = `${row}-${col}`;
                    const isRevealed = revealedTiles.has(tileId);

                    // Creates tiles and sets their revealed appearance
                    return (
                      <Card
                        key={`cell-${tileId}`}
                        className={`h-24 cursor-pointer transition-all duration-300 ${
                          isRevealed ? "pop-animation" : "hover:bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: isRevealed ? "#3D57D6" : "#121212",
                          color: isRevealed ? "white" : "white",
                        }}
                        onClick={() => handleTileClick(row, col)}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {isRevealed ? "Person Name" : "?"}
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

      {/*Displays a search bar until clicked away*/}
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
