/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const FlappyGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game state refs
  const gameStateRef = useRef({
    bird: { x: 100, y: 200, width: 30, height: 30, velocityY: 0 },
    pipes: [],
    pipeWidth: 60,
    pipeGap: 150,
    pipeSpeed: 3,
    score: 0,
    frameCount: 0,
    canvasHeight: 0,
    canvasWidth: 0,
  });

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("flappy-high-score");
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

    gameStateRef.current.canvasWidth = canvas.width;
    gameStateRef.current.canvasHeight = canvas.height;
    gameStateRef.current.bird.y = canvas.height / 2;

    // Initial render
    draw(ctx, canvas.width, canvas.height);
  }, []);

  // Draw function
  const draw = useCallback(
    (ctx, width, height) => {
      const state = gameStateRef.current;

      // Clear canvas with sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (darkMode) {
        gradient.addColorStop(0, "#1e3a5f");
        gradient.addColorStop(1, "#0f172a");
      } else {
        gradient.addColorStop(0, "#87ceeb");
        gradient.addColorStop(1, "#e0f2fe");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw clouds (background decoration)
      ctx.fillStyle = darkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)";
      for (let i = 0; i < 3; i++) {
        const cloudX = (state.frameCount * 0.5 + i * 200) % (width + 100) - 50;
        const cloudY = 50 + i * 80;
        drawCloud(ctx, cloudX, cloudY);
      }

      // Draw pipes
      ctx.fillStyle = "#10b981"; // Green pipes
      state.pipes.forEach((pipe) => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.topHeight + pipe.gap,
          pipe.width,
          height - (pipe.topHeight + pipe.gap)
        );
        // Pipe caps
        ctx.fillStyle = "#059669";
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
        ctx.fillRect(
          pipe.x - 5,
          pipe.topHeight + pipe.gap,
          pipe.width + 10,
          20
        );
        ctx.fillStyle = "#10b981";
      });

      // Draw bird
      const bird = state.bird;
      ctx.fillStyle = "#fbbf24"; // Yellow bird
      ctx.beginPath();
      ctx.arc(
        bird.x + bird.width / 2,
        bird.y + bird.height / 2,
        bird.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Bird eye
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(bird.x + bird.width / 2 + 5, bird.y + bird.height / 2 - 5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.width, bird.y + bird.height / 2);
      ctx.lineTo(bird.x + bird.width + 8, bird.y + bird.height / 2 - 3);
      ctx.lineTo(bird.x + bird.width + 8, bird.y + bird.height / 2 + 3);
      ctx.closePath();
      ctx.fill();

      // Draw ground
      ctx.fillStyle = darkMode ? "#374151" : "#8b7355";
      ctx.fillRect(0, height - 30, width, 30);
      ctx.fillStyle = darkMode ? "#4b5563" : "#a0826d";
      for (let i = 0; i < width; i += 20) {
        ctx.fillRect(i, height - 30, 10, 5);
      }

      // Draw score
      ctx.fillStyle = darkMode ? "#ffffff" : "#1f2937";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`Score: ${state.score}`, 20, 40);
      if (highScore > 0) {
        ctx.font = "18px Arial";
        ctx.fillText(`High: ${highScore}`, 20, 65);
      }
    },
    [darkMode, highScore]
  );

  // Draw cloud helper
  const drawCloud = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

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

    // Update bird physics
    const bird = state.bird;
    const gravity = 0.5;
    bird.velocityY += gravity;
    bird.y += bird.velocityY;

    // Spawn pipes
    if (state.frameCount % 100 === 0) {
      const minHeight = 50;
      const maxHeight = state.canvasHeight - state.pipeGap - minHeight - 30;
      const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      state.pipes.push({
        x: state.canvasWidth,
        topHeight: topHeight,
        gap: state.pipeGap,
        width: state.pipeWidth,
        passed: false,
      });
    }

    // Update pipes
    state.pipes = state.pipes
      .map((pipe) => ({
        ...pipe,
        x: pipe.x - state.pipeSpeed,
      }))
      .filter((pipe) => pipe.x + pipe.width > 0);

    // Check if bird passed pipe (score)
    state.pipes.forEach((pipe) => {
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        state.score += 1;
        setScore(state.score);
      }
    });

    // Collision detection
    const birdCenterX = bird.x + bird.width / 2;
    const birdCenterY = bird.y + bird.height / 2;
    const birdRadius = bird.width / 2;

    // Ground and ceiling collision
    if (
      birdCenterY + birdRadius >= state.canvasHeight - 30 ||
      birdCenterY - birdRadius <= 0
    ) {
      setGameState("gameover");
      if (state.score > highScore) {
        const newHighScore = state.score;
        setHighScore(newHighScore);
        localStorage.setItem("flappy-high-score", newHighScore.toString());
      }
      return;
    }

    // Pipe collision
    state.pipes.forEach((pipe) => {
      // Top pipe collision
      if (
        birdCenterX + birdRadius > pipe.x &&
        birdCenterX - birdRadius < pipe.x + pipe.width &&
        birdCenterY - birdRadius < pipe.topHeight
      ) {
        setGameState("gameover");
        if (state.score > highScore) {
          const newHighScore = state.score;
          setHighScore(newHighScore);
          localStorage.setItem("flappy-high-score", newHighScore.toString());
        }
        return;
      }

      // Bottom pipe collision
      if (
        birdCenterX + birdRadius > pipe.x &&
        birdCenterX - birdRadius < pipe.x + pipe.width &&
        birdCenterY + birdRadius > pipe.topHeight + pipe.gap
      ) {
        setGameState("gameover");
        if (state.score > highScore) {
          const newHighScore = state.score;
          setHighScore(newHighScore);
          localStorage.setItem("flappy-high-score", newHighScore.toString());
        }
        return;
      }
    });

    // Increase speed gradually
    state.pipeSpeed = 3 + Math.floor(state.score / 10) * 0.5;

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

  // Handle flap (jump)
  const handleFlap = useCallback(() => {
    if (gameState !== "playing") return;
    const bird = gameStateRef.current.bird;
    bird.velocityY = -8;
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        if (gameState === "ready") {
          setGameState("playing");
        } else if (gameState === "playing") {
          handleFlap();
        } else if (gameState === "gameover") {
          restartGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, handleFlap]);

  // Restart game
  const restartGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = {
      bird: {
        x: 100,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        velocityY: 0,
      },
      pipes: [],
      pipeWidth: 60,
      pipeGap: 150,
      pipeSpeed: 3,
      score: 0,
      frameCount: 0,
      canvasHeight: canvas.height,
      canvasWidth: canvas.width,
    };
    setScore(0);
    setGameState("playing");
  }, []);

  // Handle canvas click/tap for mobile
  const handleCanvasClick = () => {
    if (gameState === "ready") {
      setGameState("playing");
    } else if (gameState === "playing") {
      handleFlap();
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
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Games</span>
        </motion.button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Flappy Bird
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Press SPACE or Click to Flap • Navigate through pipes!
        </p>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-teal-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-pointer rounded-xl"
          style={{
            width: "100%",
            maxWidth: "400px",
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
              <FontAwesomeIcon icon="dove" className="text-6xl mb-4 text-yellow-400" />
              <p className="text-2xl font-bold mb-2">Ready to Fly?</p>
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
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-bold text-lg transition-colors"
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
          <strong>Controls:</strong> Spacebar or Click/Tap to flap upward
        </p>
        <p>Navigate through the green pipes and try to beat your high score!</p>
      </div>
    </div>
  );
};

export default FlappyGame;

