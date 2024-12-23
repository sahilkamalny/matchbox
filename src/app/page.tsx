"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "@mui/material";

const GameBoard = () => {
  const [gridSize] = useState(3);
  const [hints, setHints] = useState({
    top: ["", "", ""],
    left: ["", "", ""],
  });
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );
  const [revealedTiles, setRevealedTiles] = useState(new Set<string>());
  const [gameStarted, setGameStarted] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tileClicked, setTileClicked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  // Check if all tiles are revealed
  const checkBoardCompletion = () => {
    const totalTiles = gridSize * gridSize;
    return revealedTiles.size === totalTiles;
  };

  // Simulated API fetch function
  const fetchArtists = async () => {
    try {
      const mainArtist = await getRandomArtist();
      const collaboratorsMain = await getCollaborators(mainArtist.id);

      const newGrid = Array(3)
        .fill(null)
        .map(() => Array(3).fill(null));
      newGrid[1][1] = mainArtist.name || "";
      newGrid[1][0] = collaboratorsMain[0]?.name || "";
      newGrid[1][2] = collaboratorsMain[1]?.name || "";

      setHints((prevHints) => ({
        ...prevHints,
        left: [
          prevHints.left[0],
          collaboratorsMain[2]?.name || "",
          prevHints.left[2],
        ],
      }));

      await populateColumns(newGrid, collaboratorsMain);
    } catch (error) {
      console.error("Error fetching artist data:", error);
    }
  };

  const populateColumns = async (
    grid: (string | null)[][],
    collaboratorsMain: { id: string; name: string }[]
  ) => {
    try {
      // Column 1
      const collaboratorsCol1 = await getCollaborators(
        collaboratorsMain[0]?.id || ""
      );
      grid[0][0] = collaboratorsCol1[0]?.name || "";
      grid[2][0] = collaboratorsCol1[1]?.name || "";
      setHints((prevHints) => ({
        ...prevHints,
        top: [
          collaboratorsCol1[2]?.name || "",
          prevHints.top[1],
          prevHints.top[2],
        ],
      }));

      // Column 2
      const collaboratorsCol2 = await getCollaborators(grid[1][1] || "");
      grid[0][1] = collaboratorsCol2[0]?.name || "";
      grid[2][1] = collaboratorsCol2[1]?.name || "";
      setHints((prevHints) => ({
        ...prevHints,
        top: [
          prevHints.top[0],
          collaboratorsCol2[2]?.name || "",
          prevHints.top[2],
        ],
      }));

      // Column 3
      const collaboratorsCol3 = await getCollaborators(
        collaboratorsMain[1]?.id || ""
      );
      grid[0][2] = collaboratorsCol3[0]?.name || "";
      grid[2][2] = collaboratorsCol3[1]?.name || "";
      setHints((prevHints) => ({
        ...prevHints,
        top: [
          prevHints.top[0],
          prevHints.top[1],
          collaboratorsCol3[2]?.name || "",
        ],
      }));

      setGrid([...grid]);
    } catch (error) {
      console.error("Error populating columns:", error);
    }
  };

  const getRandomArtist = async () => {
    return { id: "123", name: "Main Artist" };
  };

  const getCollaborators = async (artistId: string) => {
    return [
      { id: "1", name: "Collaborator" + " (of " + artistId + ")" },
      { id: "2", name: "Collaborator" + " (of " + artistId + ")" },
      { id: "3", name: "Collaborator" + " (of " + artistId + ")" },
    ];
  };

  useEffect(() => {
    setIsPageLoaded(true);
    if (gameStarted) fetchArtists();
  }, [gameStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !isWinner) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setIsTimeUp(true);
      const allTiles = Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => `${row}-${col}`)
      ).flat();
      setRevealedTiles(new Set(allTiles));
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isWinner]);

  const handleTileClick = (row: number, col: number) => {
    const cellId = `${row}-${col}`;
    if (!revealedTiles.has(cellId)) {
      playTileSound();
      const newRevealedTiles = new Set([...revealedTiles, cellId]);
      setRevealedTiles(newRevealedTiles);
      setTileClicked(true);

      // Check if this was the last tile
      if (newRevealedTiles.size === gridSize * gridSize) {
        setIsWinner(true);
        setTimerActive(false);
      }
    }
  };

  const handleCloseSearchBar = () => {
    setTileClicked(false);
  };

  const playStartSound = () => {
    const audio = new Audio("/sounds/start-matching.mp3");
    audio.play();
  };

  const playTileSound = () => {
    const audio = new Audio("/sounds/tile-clicked.mp3");
    audio.play();
  };

  const startGame = () => {
    playStartSound();
    setTimeout(() => {
      setGameStarted(true);
      setTimerActive(true);
      setTimeLeft(60);
      setIsWinner(false);
    }, 300);
    setTimeout(() => setButtonClicked(false), 300);
  };

  const resetGame = () => {
    playStartSound();
    setIsTimeUp(false);
    setIsWinner(false);
    setRevealedTiles(new Set());
    setTimeLeft(60);
    setTimerActive(true);
    setGrid(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null))
    );
    setHints({ top: ["", "", ""], left: ["", "", ""] });
    fetchArtists();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">MatchBox</h1>
        <p className="text-gray-600">Match the hints to guess the person!</p>
      </div>

      {gameStarted && (
        <div className="absolute top-4 right-6 flex items-center justify-center">
          <img
            src="/images/stopwatch.png"
            alt="Stopwatch"
            className="h-12 w-12 mr-2 my-auto"
          />
          <span
            className="text-3xl font-semibold flex items-center"
            style={
              isTimeUp
                ? { color: "#FF0000" }
                : isWinner
                ? { color: "#08CE39" }
                : {}
            }
          >
            {isTimeUp
              ? "TIME'S UP!!"
              : isWinner
              ? "OUT-MATCHED!!"
              : timeLeft < 600
              ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, "0")}`
              : `10:00`}
          </span>
        </div>
      )}

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
                backgroundColor: "#1f3c87",
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

                  {Array.from({ length: gridSize }).map((_, col) => {
                    const tileId = `${row}-${col}`;
                    const isRevealed = revealedTiles.has(tileId);

                    return (
                      <Card
                        key={`cell-${tileId}`}
                        className={`h-24 cursor-pointer transition-all duration-300 ${
                          isRevealed ? "pop-animation" : ""
                        }`}
                        sx={{
                          backgroundColor: isTimeUp
                            ? "#FF0000"
                            : isWinner && isRevealed
                            ? "#08CE39"
                            : isRevealed
                            ? "#3D57D6"
                            : "#121212",
                          color: "white",
                          transition: "all 0.3s ease",
                          ...(!isRevealed && {
                            "&:hover": {
                              backgroundColor: "#0a0a0a",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                              transform: "scale(1.05)",
                            },
                          }),
                        }}
                        onClick={() => handleTileClick(row, col)}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {isRevealed ? grid[row][col] : "?"}
                        </div>
                      </Card>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            {(isTimeUp || isWinner) && (
              <div className="mt-8 text-center">
                <Button
                  variant="contained"
                  onClick={resetGame}
                  sx={{
                    fontFamily: "inherit",
                    backgroundColor: "#3D57D6",
                    color: "#FBFBFB",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#1f3c87",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  ReMatch!
                </Button>
              </div>
            )}
          </div>
        )
      )}

      {tileClicked && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseSearchBar}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "8px",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full p-2 border border-gray-300 rounded"
              style={{
                fontSize: "16px",
                outline: "none",
                color: "black",
                backgroundColor: "white",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
