/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game state refs
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    gridWidth: 0,
    gridHeight: 0,
    score: 0,
  });

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Initialize canvas and grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calculate grid dimensions
    const cols = Math.floor(canvas.width / CELL_SIZE);
    const rows = Math.floor(canvas.height / CELL_SIZE);
    gameStateRef.current.gridWidth = cols;
    gameStateRef.current.gridHeight = rows;

    // Initial render
    draw(ctx, canvas.width, canvas.height);
  }, []);

  // Generate random food position
  const generateFood = useCallback(() => {
    const state = gameStateRef.current;
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * state.gridWidth),
        y: Math.floor(Math.random() * state.gridHeight),
      };
    } while (
      state.snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    state.food = newFood;
  }, []);

  // Draw function
  const draw = useCallback(
    (ctx, width, height) => {
      const state = gameStateRef.current;

      // Clear canvas
      ctx.fillStyle = darkMode ? "#111827" : "#fefdfb";
      ctx.fillRect(0, 0, width, height);

      // Draw grid (optional, subtle)
      ctx.strokeStyle = darkMode ? "#1f2937" : "#e8e8e8";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= state.gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, height);
        ctx.stroke();
      }
      for (let y = 0; y <= state.gridHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(width, y * CELL_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = "#ef4444"; // Red
      ctx.fillRect(
        state.food.x * CELL_SIZE + 2,
        state.food.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );

      // Draw snake
      state.snake.forEach((segment, index) => {
        if (index === 0) {
          // Head - green
          ctx.fillStyle = "#10b981";
        } else {
          // Body - darker green
          ctx.fillStyle = "#059669";
        }
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });

      // Draw score
      ctx.fillStyle = darkMode ? "#ffffff" : "#1f2937";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${state.score}`, 10, 25);
      if (highScore > 0) {
        ctx.fillText(`High: ${highScore}`, 10, 50);
      }
    },
    [darkMode, highScore]
  );

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    if (gameState !== "playing") {
      draw(ctx, canvas.width, canvas.height);
      return;
    }

    // Update direction
    state.direction = { ...state.nextDirection };

    // Move snake head
    const head = { ...state.snake[0] };
    head.x += state.direction.x;
    head.y += state.direction.y;

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= state.gridWidth ||
      head.y < 0 ||
      head.y >= state.gridHeight
    ) {
      setGameState("gameover");
      if (state.score > highScore) {
        const newHighScore = state.score;
        setHighScore(newHighScore);
        localStorage.setItem("snake-high-score", newHighScore.toString());
      }
      return;
    }

    // Self collision
    if (
      state.snake.some(
        (segment) => segment.x === head.x && segment.y === head.y
      )
    ) {
      setGameState("gameover");
      if (state.score > highScore) {
        const newHighScore = state.score;
        setHighScore(newHighScore);
        localStorage.setItem("snake-high-score", newHighScore.toString());
      }
      return;
    }

    // Add new head
    state.snake.unshift(head);

    // Check food collision
    if (head.x === state.food.x && head.y === state.food.y) {
      state.score += 10;
      setScore(state.score);
      generateFood();
    } else {
      // Remove tail if no food eaten
      state.snake.pop();
    }

    // Draw everything
    draw(ctx, canvas.width, canvas.height);

    gameLoopRef.current = setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, 150 - Math.min(state.score / 10, 100)); // Speed increases with score
  }, [gameState, draw, generateFood, highScore]);

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        draw(ctx, canvas.width, canvas.height);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, draw]);

  // Handle direction change
  const changeDirection = useCallback(
    (newDirection) => {
      const state = gameStateRef.current;
      // Prevent reversing into itself
      if (
        newDirection.x === -state.direction.x &&
        newDirection.y === -state.direction.y
      ) {
        return;
      }
      state.nextDirection = newDirection;
    },
    []
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === "ready") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          setGameState("playing");
          generateFood();
        }
      } else if (gameState === "playing") {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            changeDirection({ x: 0, y: -1 });
            break;
          case "ArrowDown":
            e.preventDefault();
            changeDirection({ x: 0, y: 1 });
            break;
          case "ArrowLeft":
            e.preventDefault();
            changeDirection({ x: -1, y: 0 });
            break;
          case "ArrowRight":
            e.preventDefault();
            changeDirection({ x: 1, y: 0 });
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
  }, [gameState, changeDirection, generateFood]);

  // Restart game
  const restartGame = useCallback(() => {
    const state = gameStateRef.current;
    state.snake = [{ x: 10, y: 10 }];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    setScore(0);
    generateFood();
    setGameState("playing");
  }, [generateFood]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (gameState === "playing") {
      if (isLeftSwipe) {
        changeDirection({ x: -1, y: 0 }); // Left
      }
      if (isRightSwipe) {
        changeDirection({ x: 1, y: 0 }); // Right
      }
    }
  };

  // Handle canvas click for mobile start
  const handleCanvasClick = () => {
    if (gameState === "ready") {
      setGameState("playing");
      generateFood();
    } else if (gameState === "gameover") {
      restartGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <motion.button
          onClick={() => navigate("/game")}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Games</span>
        </motion.button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Snake Game
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Use Arrow Keys to control • Swipe on mobile
        </p>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-emerald-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="cursor-pointer rounded-xl"
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "600px",
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
              <FontAwesomeIcon icon="play" className="text-6xl mb-4" />
              <p className="text-2xl font-bold mb-2">Ready to Play?</p>
              <p className="text-lg">Press SPACE or Click to Start</p>
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
              <FontAwesomeIcon icon="trophy" className="text-6xl mb-4 text-yellow-400" />
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
              <p className="text-2xl mb-2">Score: {score}</p>
              {score >= highScore && score > 0 && (
                <p className="text-xl text-yellow-400 mb-4">New High Score! 🎉</p>
              )}
              {highScore > 0 && <p className="text-lg mb-6">High Score: {highScore}</p>}
              <motion.button
                onClick={restartGame}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 max-w-md text-center text-smokey-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Controls:</strong> Arrow Keys to move • Swipe left/right on mobile
        </p>
        <p>Eat the red food to grow longer and increase your score!</p>
      </div>
    </div>
  );
};

export default SnakeGame;

