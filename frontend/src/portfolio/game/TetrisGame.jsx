/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

const TETROMINOES = [
  {
    shape: [[1, 1, 1, 1]],
    color: "#10b981", // Green - I piece
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#fbbf24", // Yellow - O piece
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#8b5cf6", // Purple - T piece
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#ef4444", // Red - S piece
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#3b82f6", // Blue - Z piece
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#f59e0b", // Orange - L piece
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#06b6d4", // Cyan - J piece
  },
];

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  const gameStateRef = useRef({
    board: Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null,
    currentX: 0,
    currentY: 0,
    score: 0,
    lines: 0,
    level: 1,
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0,
  });

  useEffect(() => {
    const savedHighScore = localStorage.getItem("tetris-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const createPiece = useCallback(() => {
    const type = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    return {
      shape: type.shape,
      color: type.color,
    };
  }, []);

  const isValidPosition = useCallback((piece, x, y, board) => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY] && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback(() => {
    const state = gameStateRef.current;
    const piece = state.currentPiece;

    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const y = state.currentY + row;
          const x = state.currentX + col;
          if (y >= 0) {
            state.board[y][x] = piece.color;
          }
        }
      }
    }
  }, []);

  const clearLines = useCallback(() => {
    const state = gameStateRef.current;
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (state.board[y].every((cell) => cell !== 0)) {
        state.board.splice(y, 1);
        state.board.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      const points = [0, 40, 100, 300, 1200];
      state.score += points[linesCleared] * (state.level + 1);
      state.lines += linesCleared;
      state.level = Math.floor(state.lines / 10) + 1;
      state.dropInterval = Math.max(100, 1000 - (state.level - 1) * 100);

      setScore(state.score);
      setLines(state.lines);
      setLevel(state.level);
    }
  }, []);

  const rotatePiece = useCallback((piece) => {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const rotated = Array(cols)
      .fill(null)
      .map(() => Array(rows).fill(0));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - 1 - row] = piece.shape[row][col];
      }
    }

    return { ...piece, shape: rotated };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const boardWidth = BOARD_WIDTH * CELL_SIZE;
    const boardHeight = BOARD_HEIGHT * CELL_SIZE;
    const startX = (canvas.width - boardWidth) / 2;
    const startY = 50;

    // Clear canvas
    ctx.fillStyle = darkMode ? "#111827" : "#fefdfb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board background
    ctx.fillStyle = darkMode ? "#1f2937" : "#e8e8e8";
    ctx.fillRect(startX, startY, boardWidth, boardHeight);

    // Draw grid lines
    ctx.strokeStyle = darkMode ? "#374151" : "#d1d1d1";
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(startX + i * CELL_SIZE, startY);
      ctx.lineTo(startX + i * CELL_SIZE, startY + boardHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY + i * CELL_SIZE);
      ctx.lineTo(startX + boardWidth, startY + i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw placed pieces
    const state = gameStateRef.current;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (state.board[y][x]) {
          ctx.fillStyle = state.board[y][x];
          ctx.fillRect(
            startX + x * CELL_SIZE + 1,
            startY + y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
        }
      }
    }

    // Draw current piece
    if (state.currentPiece) {
      ctx.fillStyle = state.currentPiece.color;
      for (let row = 0; row < state.currentPiece.shape.length; row++) {
        for (let col = 0; col < state.currentPiece.shape[row].length; col++) {
          if (state.currentPiece.shape[row][col]) {
            const x = startX + (state.currentX + col) * CELL_SIZE + 1;
            const y = startY + (state.currentY + row) * CELL_SIZE + 1;
            ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
          }
        }
      }
    }

    // Draw score
    ctx.fillStyle = darkMode ? "#ffffff" : "#1f2937";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${state.score}`, 20, 30);
    ctx.fillText(`Level: ${state.level}`, 20, 55);
    ctx.fillText(`Lines: ${state.lines}`, 20, 80);
    if (highScore > 0) {
      ctx.font = "16px Arial";
      ctx.fillText(`High: ${highScore}`, 20, 105);
    }
  }, [darkMode, highScore]);

  const gameLoop = useCallback(
    (time = 0) => {
      const state = gameStateRef.current;
      const deltaTime = time - state.lastTime;
      state.lastTime = time;

      if (gameState !== "playing") {
        draw();
        return;
      }

      // Drop piece
      state.dropCounter += deltaTime;
      if (state.dropCounter > state.dropInterval) {
        state.dropCounter = 0;
        if (
          isValidPosition(
            state.currentPiece,
            state.currentX,
            state.currentY + 1,
            state.board
          )
        ) {
          state.currentY++;
        } else {
          placePiece();
          clearLines();
          state.currentPiece = createPiece();
          state.currentX = Math.floor(BOARD_WIDTH / 2) - 1;
          state.currentY = 0;

          if (
            !isValidPosition(
              state.currentPiece,
              state.currentX,
              state.currentY,
              state.board
            )
          ) {
            setGameState("gameover");
            if (state.score > highScore) {
              const newHighScore = state.score;
              setHighScore(newHighScore);
              localStorage.setItem("tetris-high-score", newHighScore.toString());
            }
            return;
          }
        }
      }

      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, draw, isValidPosition, placePiece, clearLines, createPiece, highScore]
  );

  useEffect(() => {
    if (gameState === "playing") {
      gameStateRef.current.currentPiece = createPiece();
      gameStateRef.current.currentX = Math.floor(BOARD_WIDTH / 2) - 1;
      gameStateRef.current.currentY = 0;
      gameStateRef.current.lastTime = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      draw();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, draw, createPiece]);

  const movePiece = useCallback(
    (dx, dy) => {
      const state = gameStateRef.current;
      if (
        isValidPosition(
          state.currentPiece,
          state.currentX + dx,
          state.currentY + dy,
          state.board
        )
      ) {
        state.currentX += dx;
        state.currentY += dy;
        draw();
      }
    },
    [isValidPosition, draw]
  );

  const handleRotate = useCallback(() => {
    const state = gameStateRef.current;
    const rotated = rotatePiece(state.currentPiece);
    if (
      isValidPosition(rotated, state.currentX, state.currentY, state.board)
    ) {
      state.currentPiece = rotated;
      draw();
    }
  }, [rotatePiece, isValidPosition, draw]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === "ready") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          setGameState("playing");
        }
      } else if (gameState === "playing") {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            movePiece(-1, 0);
            break;
          case "ArrowRight":
            e.preventDefault();
            movePiece(1, 0);
            break;
          case "ArrowDown":
            e.preventDefault();
            movePiece(0, 1);
            break;
          case "ArrowUp":
          case " ":
            e.preventDefault();
            handleRotate();
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
  }, [gameState, movePiece, handleRotate]);

  const restartGame = useCallback(() => {
    gameStateRef.current = {
      board: Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: null,
      currentX: 0,
      currentY: 0,
      score: 0,
      lines: 0,
      level: 1,
      dropCounter: 0,
      dropInterval: 1000,
      lastTime: 0,
    };
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameState("playing");
  }, []);

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
      <div className="mb-6 text-center">
        <motion.button
          onClick={() => navigate("/game")}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Games</span>
        </motion.button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Tetris
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Arrow Keys to Move • Up/Space to Rotate
        </p>
      </div>

      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-green-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          className="rounded-xl"
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "600px",
            display: "block",
          }}
        />

        {gameState === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
          >
            <div className="text-center text-white">
              <FontAwesomeIcon icon="play" className="text-6xl mb-4" />
              <p className="text-2xl font-bold mb-2">Ready to Play?</p>
              <p className="text-lg">Press SPACE to Start</p>
            </div>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"
          >
            <div className="text-center text-white p-8">
              <FontAwesomeIcon icon="trophy" className="text-6xl mb-4 text-yellow-400" />
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
              <p className="text-2xl mb-2">Score: {score}</p>
              <p className="text-lg mb-2">Level: {level}</p>
              <p className="text-lg mb-4">Lines: {lines}</p>
              {score >= highScore && score > 0 && (
                <p className="text-xl text-yellow-400 mb-4">New High Score! 🎉</p>
              )}
              {highScore > 0 && <p className="text-lg mb-6">High Score: {highScore}</p>}
              <motion.button
                onClick={restartGame}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-lg transition-colors"
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
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div></div>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                handleRotate();
              }}
              className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="rotate" className="text-xl" />
            </motion.button>
            <div></div>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                movePiece(-1, 0);
              }}
              onTouchEnd={(e) => e.preventDefault()}
              className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-left" className="text-2xl" />
            </motion.button>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                movePiece(0, 1);
              }}
              onTouchEnd={(e) => e.preventDefault()}
              className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-down" className="text-2xl" />
            </motion.button>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                movePiece(1, 0);
              }}
              onTouchEnd={(e) => e.preventDefault()}
              className="py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-right" className="text-2xl" />
            </motion.button>
          </div>
        </div>
      )}

      <div className="mt-6 max-w-md text-center text-smokey-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Controls:</strong> Arrow Keys or Touch buttons • Rotate button to spin
        </p>
        <p>Clear lines to score points and level up!</p>
      </div>
    </div>
  );
};

export default TetrisGame;

