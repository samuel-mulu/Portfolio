/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const GRID_SIZE = 4;
const CELL_SIZE = 80;
const CELL_GAP = 10;

const Game2048 = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready"); // ready, playing, gameover, won
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [grid, setGrid] = useState(() => {
    // Initialize with empty grid
    return Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
  });
  const [hasWon, setHasWon] = useState(false);

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("2048-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }, []);

  // Add random tile (2 or 4)
  const addRandomTile = useCallback((gridState) => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (gridState[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      gridState[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
    }
  }, []);

  // Initialize game
  useEffect(() => {
    if (gameState === "ready") {
      const newGrid = initializeGrid();
      if (newGrid && newGrid.length > 0) {
        setGrid(newGrid);
        setScore(0);
        setHasWon(false);
      }
    }
  }, [gameState, initializeGrid]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Safety check: ensure grid is initialized
    if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const boardSize = GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * CELL_GAP;
    const startX = (canvas.width - boardSize) / 2;
    const startY = (canvas.height - boardSize) / 2 + 40;

    // Clear canvas
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (darkMode) {
      bgGradient.addColorStop(0, "#111827");
      bgGradient.addColorStop(1, "#1f2937");
    } else {
      bgGradient.addColorStop(0, "#fefdfb");
      bgGradient.addColorStop(1, "#f5e6d0");
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board background
    ctx.fillStyle = darkMode ? "#374151" : "#d1d1d1";
    ctx.fillRect(startX, startY, boardSize, boardSize);

    // Draw cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = startX + j * (CELL_SIZE + CELL_GAP) + CELL_GAP;
        const y = startY + i * (CELL_SIZE + CELL_GAP) + CELL_GAP;
        const value = grid[i] && grid[i][j] !== undefined ? grid[i][j] : 0;

        // Cell background
        ctx.fillStyle = darkMode ? "#4b5563" : "#e8e8e8";
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        // Draw number if cell has value
        if (value !== 0) {
          const color = getTileColor(value);
          ctx.fillStyle = color.bg;
          ctx.fillRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);

          // Draw number
          ctx.fillStyle = color.text;
          ctx.font = value >= 1024 ? "bold 24px Arial" : "bold 32px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            value.toString(),
            x + CELL_SIZE / 2,
            y + CELL_SIZE / 2
          );
        }
      }
    }

    // Draw score
    ctx.fillStyle = darkMode ? "#ffffff" : "#1f2937";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 20, 30);
    if (highScore > 0) {
      ctx.font = "18px Arial";
      ctx.fillText(`High: ${highScore}`, 20, 55);
    }
  }, [grid, score, highScore, darkMode]);

  // Get tile color based on value
  const getTileColor = (value) => {
    const colors = {
      2: { bg: "#eee4da", text: "#776e65" },
      4: { bg: "#ede0c8", text: "#776e65" },
      8: { bg: "#f2b179", text: "#f9f6f2" },
      16: { bg: "#f59563", text: "#f9f6f2" },
      32: { bg: "#f67c5f", text: "#f9f6f2" },
      64: { bg: "#f65e3b", text: "#f9f6f2" },
      128: { bg: "#edcf72", text: "#f9f6f2" },
      256: { bg: "#edcc61", text: "#f9f6f2" },
      512: { bg: "#edc850", text: "#f9f6f2" },
      1024: { bg: "#edc53f", text: "#f9f6f2" },
      2048: { bg: "#edc22e", text: "#f9f6f2" },
    };

    if (darkMode) {
      // Dark mode colors
      const darkColors = {
        2: { bg: "#3d3d3d", text: "#e8e8e8" },
        4: { bg: "#4a4a4a", text: "#e8e8e8" },
        8: { bg: "#10b981", text: "#ffffff" },
        16: { bg: "#059669", text: "#ffffff" },
        32: { bg: "#047857", text: "#ffffff" },
        64: { bg: "#065f46", text: "#ffffff" },
        128: { bg: "#34d399", text: "#064e3b" },
        256: { bg: "#6ee7b7", text: "#064e3b" },
        512: { bg: "#a7f3d0", text: "#064e3b" },
        1024: { bg: "#d1fae5", text: "#064e3b" },
        2048: { bg: "#fbbf24", text: "#064e3b" },
      };
      return darkColors[value] || { bg: "#10b981", text: "#ffffff" };
    }

    return colors[value] || { bg: "#10b981", text: "#ffffff" };
  };

  // Redraw on grid change
  useEffect(() => {
    draw();
  }, [draw]);

  // Move tiles in a direction
  const moveTiles = useCallback(
    (direction) => {
      if (gameState !== "playing") return false;
      if (!grid || grid.length === 0 || !grid[0]) return false;

      const newGrid = grid.map((row) => [...row]);
      let moved = false;
      let newScore = score;

      // Move and merge logic
      if (direction === "left" || direction === "right") {
        for (let i = 0; i < GRID_SIZE; i++) {
          const row = [...newGrid[i]];
          const filtered = row.filter((val) => val !== 0);
          const merged = [];
          let skipNext = false;

          const processRow = direction === "left" ? filtered : filtered.reverse();

          for (let j = 0; j < processRow.length; j++) {
            if (skipNext) {
              skipNext = false;
              continue;
            }
            if (j < processRow.length - 1 && processRow[j] === processRow[j + 1]) {
              merged.push(processRow[j] * 2);
              newScore += processRow[j] * 2;
              if (processRow[j] * 2 === 2048 && !hasWon) {
                setHasWon(true);
              }
              skipNext = true;
            } else {
              merged.push(processRow[j]);
            }
          }

          while (merged.length < GRID_SIZE) {
            merged.push(0);
          }

          newGrid[i] =
            direction === "left" ? merged : merged.reverse();
          if (JSON.stringify(newGrid[i]) !== JSON.stringify(grid[i])) {
            moved = true;
          }
        }
      } else if (direction === "up" || direction === "down") {
        for (let j = 0; j < GRID_SIZE; j++) {
          const column = [];
          for (let i = 0; i < GRID_SIZE; i++) {
            column.push(newGrid[i][j]);
          }
          const filtered = column.filter((val) => val !== 0);
          const merged = [];
          let skipNext = false;

          const processCol = direction === "up" ? filtered : filtered.reverse();

          for (let i = 0; i < processCol.length; i++) {
            if (skipNext) {
              skipNext = false;
              continue;
            }
            if (i < processCol.length - 1 && processCol[i] === processCol[i + 1]) {
              merged.push(processCol[i] * 2);
              newScore += processCol[i] * 2;
              if (processCol[i] * 2 === 2048 && !hasWon) {
                setHasWon(true);
              }
              skipNext = true;
            } else {
              merged.push(processCol[i]);
            }
          }

          while (merged.length < GRID_SIZE) {
            merged.push(0);
          }

          const finalCol = direction === "up" ? merged : merged.reverse();
          for (let i = 0; i < GRID_SIZE; i++) {
            newGrid[i][j] = finalCol[i];
          }

          if (JSON.stringify(finalCol) !== JSON.stringify(column)) {
            moved = true;
          }
        }
      }

      if (moved) {
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(newScore);

        // Check for game over
        if (isGameOver(newGrid)) {
          setGameState("gameover");
          if (newScore > highScore) {
            const newHighScore = newScore;
            setHighScore(newHighScore);
            localStorage.setItem("2048-high-score", newHighScore.toString());
          }
        }
      }

      return moved;
    },
    [grid, score, gameState, hasWon, highScore, addRandomTile]
  );

  // Check if game is over
  const isGameOver = useCallback((gridState) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (gridState[i][j] === 0) return false;
      }
    }

    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = gridState[i][j];
        if (
          (i < GRID_SIZE - 1 && gridState[i + 1][j] === current) ||
          (j < GRID_SIZE - 1 && gridState[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === "ready") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          setGameState("playing");
        }
      } else if (gameState === "playing") {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            moveTiles("up");
            break;
          case "ArrowDown":
            e.preventDefault();
            moveTiles("down");
            break;
          case "ArrowLeft":
            e.preventDefault();
            moveTiles("left");
            break;
          case "ArrowRight":
            e.preventDefault();
            moveTiles("right");
            break;
          default:
            break;
        }
      } else if (gameState === "gameover") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          restartGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, moveTiles]);

  // Touch/swipe controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;
    setTouchStart({ x: touchX, y: touchY });
  };

  const onTouchMove = (e) => {
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;
    setTouchEnd({ x: touchX, y: touchY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchEnd.x - touchStart.x;
    const distanceY = touchEnd.y - touchStart.y;
    const isLeftSwipe = distanceX < -minSwipeDistance;
    const isRightSwipe = distanceX > minSwipeDistance;
    const isUpSwipe = distanceY < -minSwipeDistance;
    const isDownSwipe = distanceY > minSwipeDistance;

    if (gameState === "playing") {
      if (isLeftSwipe) moveTiles("left");
      if (isRightSwipe) moveTiles("right");
      if (isUpSwipe) moveTiles("up");
      if (isDownSwipe) moveTiles("down");
    } else if (gameState === "ready") {
      setGameState("playing");
    } else if (gameState === "gameover") {
      restartGame();
    }
  };

  // Restart game
  const restartGame = useCallback(() => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setScore(0);
    setHasWon(false);
    setGameState("playing");
  }, [initializeGrid]);

  // Handle canvas click
  const handleCanvasClick = (e) => {
    e.preventDefault();
    if (gameState === "ready") {
      setGameState("playing");
    } else if (gameState === "gameover") {
      restartGame();
    }
  };

  // Prevent scrolling on touch
  useEffect(() => {
    const preventScroll = (e) => {
      if (gameState === "playing") {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <motion.button
          onClick={() => navigate("/game")}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Games</span>
        </motion.button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          2048 Puzzle
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Use Arrow Keys or Swipe • Combine tiles to reach 2048!
        </p>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-cyan-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="cursor-pointer rounded-xl"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "500px",
            display: "block",
          }}
        />

        {/* Ready Screen */}
        {gameState === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
          >
            <div className="text-center text-white">
              <FontAwesomeIcon icon="brain" className="text-6xl mb-4 text-cyan-400" />
              <p className="text-2xl font-bold mb-2">Ready to Challenge?</p>
              <p className="text-lg">Press SPACE or Click to Start</p>
            </div>
          </motion.div>
        )}

        {/* Win Screen */}
        {hasWon && gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl"
          >
            <div className="text-center text-white p-8">
              <FontAwesomeIcon icon="trophy" className="text-6xl mb-4 text-yellow-400" />
              <h2 className="text-3xl font-bold mb-4">You Reached 2048! 🎉</h2>
              <p className="text-lg mb-4">Keep playing to increase your score!</p>
              <motion.button
                onClick={() => setHasWon(false)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Playing
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"
          >
            <div className="text-center text-white p-8">
              <FontAwesomeIcon icon="brain" className="text-6xl mb-4 text-cyan-400" />
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
              <p className="text-2xl mb-2">Final Score: {score}</p>
              {score >= highScore && score > 0 && (
                <p className="text-xl text-yellow-400 mb-4">New High Score! 🎉</p>
              )}
              {highScore > 0 && <p className="text-lg mb-6">High Score: {highScore}</p>}
              <motion.button
                onClick={restartGame}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      {gameState === "playing" && (
        <div className="mt-6 w-full max-w-md">
          <div className="grid grid-cols-3 gap-3">
            <div></div>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                moveTiles("up");
              }}
              className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-up" className="text-2xl" />
            </motion.button>
            <div></div>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                moveTiles("left");
              }}
              className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-left" className="text-2xl" />
            </motion.button>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                moveTiles("down");
              }}
              className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-down" className="text-2xl" />
            </motion.button>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                moveTiles("right");
              }}
              className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-right" className="text-2xl" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 max-w-md text-center text-smokey-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Controls:</strong> Arrow Keys or Touch buttons to move
        </p>
        <p>Combine tiles with the same number to double them. Reach 2048 to win!</p>
      </div>
    </div>
  );
};

export default Game2048;

