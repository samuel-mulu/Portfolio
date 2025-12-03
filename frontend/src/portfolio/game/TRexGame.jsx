/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const TRexGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // Game state refs
  const gameStateRef = useRef({
    player: { x: 50, y: 0, width: 40, height: 50, velocityY: 0, isJumping: false },
    obstacles: [],
    groundY: 0,
    speed: 5,
    score: 0,
    frameCount: 0,
  });

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("trex-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set ground Y position (80% from top)
    gameStateRef.current.groundY = canvas.height * 0.8;
    gameStateRef.current.player.y = gameStateRef.current.groundY - gameStateRef.current.player.height;

    // Initial render
    draw(ctx, canvas.width, canvas.height);
  }, []);

  // Draw function
  const draw = useCallback((ctx, width, height) => {
    const state = gameStateRef.current;
    const groundY = state.groundY;

    // Clear canvas
    ctx.fillStyle = darkMode ? "#111827" : "#fefdfb";
    ctx.fillRect(0, 0, width, height);

    // Draw ground line
    ctx.strokeStyle = darkMode ? "#374151" : "#d1d1d1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw player (T-Rex)
    const player = state.player;
    ctx.fillStyle = "#10b981"; // Green color
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw T-Rex details
    ctx.fillStyle = "#059669";
    // Legs
    ctx.fillRect(player.x + 5, player.y + player.height - 10, 8, 10);
    ctx.fillRect(player.x + player.width - 13, player.y + player.height - 10, 8, 10);
    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(player.x + 25, player.y + 10, 6, 6);
    ctx.fillStyle = "#000000";
    ctx.fillRect(player.x + 27, player.y + 12, 2, 2);

    // Draw obstacles
    ctx.fillStyle = "#047857"; // Darker green for cacti
    state.obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.fillStyle = darkMode ? "#ffffff" : "#1f2937";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${state.score}`, 20, 30);
    if (highScore > 0) {
      ctx.fillText(`High: ${highScore}`, 20, 55);
    }
  }, [highScore, darkMode]);

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

    state.frameCount++;

    // Update player physics
    const player = state.player;
    const groundY = state.groundY;
    const gravity = 1.2;
    const jumpPower = -18;

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Ground collision
    const groundLevel = groundY - player.height;
    if (player.y >= groundLevel) {
      player.y = groundLevel;
      player.velocityY = 0;
      player.isJumping = false;
      setIsJumping(false);
    }

    // Spawn obstacles
    if (state.frameCount % Math.max(60 - Math.floor(state.score / 100), 30) === 0) {
      const obstacleHeight = 30 + Math.random() * 20;
      state.obstacles.push({
        x: canvas.width,
        y: groundY - obstacleHeight,
        width: 20,
        height: obstacleHeight,
      });
    }

    // Update obstacles
    state.obstacles = state.obstacles
      .map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - state.speed,
      }))
      .filter((obstacle) => obstacle.x + obstacle.width > 0);

    // Collision detection
    state.obstacles.forEach((obstacle) => {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        // Game over
        setGameState("gameover");
        if (state.score > highScore) {
          const newHighScore = state.score;
          setHighScore(newHighScore);
          localStorage.setItem("trex-high-score", newHighScore.toString());
        }
        return;
      }
    });

    // Update score
    state.score = Math.floor(state.frameCount / 5);
    setScore(state.score);

    // Increase speed gradually
    state.speed = 5 + Math.floor(state.score / 200);

    // Draw everything
    draw(ctx, canvas.width, canvas.height);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, draw, highScore]);

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

  // Handle jump
  const handleJump = useCallback(() => {
    if (gameState !== "playing") return;

    const player = gameStateRef.current.player;
    const groundY = gameStateRef.current.groundY;
    const groundLevel = groundY - player.height;

    if (player.y >= groundLevel - 1 && !player.isJumping) {
      player.velocityY = -18;
      player.isJumping = true;
      setIsJumping(true);
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        if (gameState === "ready") {
          setGameState("playing");
        } else if (gameState === "playing") {
          handleJump();
        } else if (gameState === "gameover") {
          restartGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, handleJump]);

  // Restart game
  const restartGame = useCallback(() => {
    gameStateRef.current = {
      player: {
        x: 50,
        y: 0,
        width: 40,
        height: 50,
        velocityY: 0,
        isJumping: false,
      },
      obstacles: [],
      groundY: gameStateRef.current.groundY,
      speed: 5,
      score: 0,
      frameCount: 0,
    };
    setScore(0);
    setGameState("playing");
  }, []);

  // Handle canvas click/touch for mobile
  const handleCanvasClick = (e) => {
    e.preventDefault();
    if (gameState === "ready") {
      setGameState("playing");
    } else if (gameState === "playing") {
      handleJump();
    } else if (gameState === "gameover") {
      restartGame();
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleCanvasClick(e);
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
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Games</span>
        </motion.button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          T-Rex Runner
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Press SPACE or ↑ to jump • Click to play on mobile
        </p>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-green-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          className="cursor-pointer rounded-xl touch-none"
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            display: "block",
            touchAction: "none",
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
              {highScore > 0 && (
                <p className="text-lg mb-6">High Score: {highScore}</p>
              )}
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

      {/* Mobile Touch Button */}
      {gameState === "playing" && (
        <div className="mt-6 w-full max-w-md">
          <motion.button
            onTouchStart={(e) => {
              e.preventDefault();
              handleJump();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleJump();
            }}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-xl rounded-xl shadow-lg active:scale-95 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon="hand-pointer" className="mr-2" />
            Tap to Jump
          </motion.button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 max-w-md text-center text-smokey-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Controls:</strong> Spacebar/Arrow Up or Tap button to jump
        </p>
        <p>Avoid the obstacles and try to beat your high score!</p>
      </div>
    </div>
  );
};

export default TRexGame;

