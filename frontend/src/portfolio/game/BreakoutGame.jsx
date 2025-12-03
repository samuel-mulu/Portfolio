/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import useTheme from "../../hooks/useTheme";

library.add(fas);

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 100, height: 15 },
    ball: { x: 0, y: 0, radius: 8, velocityX: 4, velocityY: -4 },
    bricks: [],
    score: 0,
    lives: 3,
    canvasWidth: 0,
    canvasHeight: 0,
  });

  useEffect(() => {
    const savedHighScore = localStorage.getItem("breakout-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const initBricks = useCallback((canvasWidth) => {
    const brickRows = 5;
    const brickCols = 8;
    const brickWidth = (canvasWidth - 40) / brickCols - 10;
    const brickHeight = 25;
    const brickPadding = 5;
    const offsetTop = 60;
    const offsetLeft = 20;

    const colors = [
      "#ef4444", // Red
      "#f59e0b", // Orange
      "#fbbf24", // Yellow
      "#10b981", // Green
      "#3b82f6", // Blue
    ];

    const bricks = [];
    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        bricks.push({
          x: offsetLeft + col * (brickWidth + brickPadding),
          y: offsetTop + row * (brickHeight + brickPadding),
          width: brickWidth,
          height: brickHeight,
          color: colors[row],
          destroyed: false,
        });
      }
    }
    return bricks;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const state = gameStateRef.current;
    state.canvasWidth = canvas.width;
    state.canvasHeight = canvas.height;
    state.paddle.x = canvas.width / 2 - state.paddle.width / 2;
    state.paddle.y = canvas.height - 40;
    state.ball.x = canvas.width / 2;
    state.ball.y = canvas.height - 60;
    state.bricks = initBricks(canvas.width);

    draw(ctx, canvas.width, canvas.height);
  }, [initBricks]);

  const draw = useCallback(
    (ctx, width, height) => {
      const state = gameStateRef.current;

      // Clear canvas
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      if (darkMode) {
        gradient.addColorStop(0, "#0f172a");
        gradient.addColorStop(1, "#1e293b");
      } else {
        gradient.addColorStop(0, "#1e40af");
        gradient.addColorStop(1, "#3b82f6");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw bricks
      state.bricks.forEach((brick) => {
        if (!brick.destroyed) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeStyle = darkMode ? "#ffffff" : "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw paddle
      const paddle = state.paddle;
      ctx.fillStyle = "#10b981";
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 2;
      ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Draw ball
      const ball = state.ball;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw score
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${state.score}`, 20, 30);
      ctx.fillText(`Lives: ${state.lives}`, width - 120, 30);
      if (highScore > 0) {
        ctx.font = "18px Arial";
        ctx.fillText(`High: ${highScore}`, 20, 55);
      }
    },
    [darkMode, highScore]
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    if (gameState !== "playing") {
      draw(ctx, canvas.width, canvas.height);
      return;
    }

    // Move ball
    state.ball.x += state.ball.velocityX;
    state.ball.y += state.ball.velocityY;

    // Ball collision with walls
    if (
      state.ball.x - state.ball.radius <= 0 ||
      state.ball.x + state.ball.radius >= state.canvasWidth
    ) {
      state.ball.velocityX = -state.ball.velocityX;
    }
    if (state.ball.y - state.ball.radius <= 0) {
      state.ball.velocityY = -state.ball.velocityY;
    }

    // Ball collision with paddle
    const paddle = state.paddle;
    if (
      state.ball.y + state.ball.radius >= paddle.y &&
      state.ball.y - state.ball.radius <= paddle.y + paddle.height &&
      state.ball.x >= paddle.x &&
      state.ball.x <= paddle.x + paddle.width
    ) {
      const hitPos = (state.ball.x - paddle.x) / paddle.width;
      state.ball.velocityX = (hitPos - 0.5) * 8;
      state.ball.velocityY = -Math.abs(state.ball.velocityY);
      state.ball.y = paddle.y - state.ball.radius;
    }

    // Ball collision with bricks
    state.bricks.forEach((brick) => {
      if (!brick.destroyed) {
        if (
          state.ball.x + state.ball.radius >= brick.x &&
          state.ball.x - state.ball.radius <= brick.x + brick.width &&
          state.ball.y + state.ball.radius >= brick.y &&
          state.ball.y - state.ball.radius <= brick.y + brick.height
        ) {
          brick.destroyed = true;
          state.score += 10;
          setScore(state.score);

          // Determine bounce direction
          const ballCenterX = state.ball.x;
          const ballCenterY = state.ball.y;
          const brickCenterX = brick.x + brick.width / 2;
          const brickCenterY = brick.y + brick.height / 2;

          const dx = ballCenterX - brickCenterX;
          const dy = ballCenterY - brickCenterY;

          if (Math.abs(dx) > Math.abs(dy)) {
            state.ball.velocityX = dx > 0 ? Math.abs(state.ball.velocityX) : -Math.abs(state.ball.velocityX);
          } else {
            state.ball.velocityY = dy > 0 ? Math.abs(state.ball.velocityY) : -Math.abs(state.ball.velocityY);
          }
        }
      }
    });

    // Check if ball fell below paddle
    if (state.ball.y > state.canvasHeight) {
      state.lives--;
      setLives(state.lives);

      if (state.lives <= 0) {
        setGameState("gameover");
        if (state.score > highScore) {
          const newHighScore = state.score;
          setHighScore(newHighScore);
          localStorage.setItem("breakout-high-score", newHighScore.toString());
        }
        return;
      } else {
        // Reset ball
        state.ball.x = state.canvasWidth / 2;
        state.ball.y = state.canvasHeight - 60;
        state.ball.velocityX = 4;
        state.ball.velocityY = -4;
      }
    }

    // Check if all bricks destroyed
    if (state.bricks.every((brick) => brick.destroyed)) {
      // Level complete - reset with more bricks
      state.bricks = initBricks(state.canvasWidth);
      state.ball.x = state.canvasWidth / 2;
      state.ball.y = state.canvasHeight - 60;
      state.ball.velocityX = 4 + Math.floor(state.score / 500);
      state.ball.velocityY = -4 - Math.floor(state.score / 500);
    }

    draw(ctx, canvas.width, canvas.height);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, draw, initBricks, highScore]);

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

  const movePaddle = useCallback(
    (direction) => {
      const state = gameStateRef.current;
      const paddleSpeed = 8;
      if (direction === "left" && state.paddle.x > 0) {
        state.paddle.x = Math.max(0, state.paddle.x - paddleSpeed);
      } else if (
        direction === "right" &&
        state.paddle.x < state.canvasWidth - state.paddle.width
      ) {
        state.paddle.x = Math.min(
          state.canvasWidth - state.paddle.width,
          state.paddle.x + paddleSpeed
        );
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === "ready") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          setGameState("playing");
        }
      } else if (gameState === "playing") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          e.preventDefault();
          movePaddle("left");
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          e.preventDefault();
          movePaddle("right");
        }
      } else if (gameState === "gameover") {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          restartGame();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (gameState === "playing") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          e.preventDefault();
          const interval = setInterval(() => movePaddle("left"), 16);
          const stopMoving = () => {
            clearInterval(interval);
            window.removeEventListener("keyup", stopMoving);
          };
          window.addEventListener("keyup", stopMoving);
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          e.preventDefault();
          const interval = setInterval(() => movePaddle("right"), 16);
          const stopMoving = () => {
            clearInterval(interval);
            window.removeEventListener("keyup", stopMoving);
          };
          window.addEventListener("keyup", stopMoving);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState, movePaddle]);

  // Mouse/touch controls
  const handleMouseMove = useCallback(
    (e) => {
      if (gameState === "playing") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const state = gameStateRef.current;
        state.paddle.x = Math.max(
          0,
          Math.min(mouseX - state.paddle.width / 2, state.canvasWidth - state.paddle.width)
        );
      }
    },
    [gameState]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (gameState === "playing") {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const state = gameStateRef.current;
        state.paddle.x = Math.max(
          0,
          Math.min(touchX - state.paddle.width / 2, state.canvasWidth - state.paddle.width)
        );
      }
    },
    [gameState]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [handleMouseMove, handleTouchMove]);

  const restartGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = {
      paddle: {
        x: canvas.width / 2 - 50,
        y: canvas.height - 40,
        width: 100,
        height: 15,
      },
      ball: {
        x: canvas.width / 2,
        y: canvas.height - 60,
        radius: 8,
        velocityX: 4,
        velocityY: -4,
      },
      bricks: initBricks(canvas.width),
      score: 0,
      lives: 3,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    };
    setScore(0);
    setLives(3);
    setGameState("playing");
  }, [initBricks]);

  // Prevent scrolling on touch (except for paddle movement)
  useEffect(() => {
    const preventScroll = (e) => {
      const target = e.target;
      // Allow touch on canvas for paddle movement, prevent elsewhere
      if (gameState === "playing" && !target.closest("canvas")) {
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
          Breakout
        </h1>
        <p className="text-smokey-600 dark:text-gray-400">
          Move Mouse or Arrow Keys • Break All Bricks!
        </p>
      </div>

      <div className="relative bg-cream-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-green-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          className="rounded-xl cursor-none"
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "500px",
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
              <p className="text-2xl font-bold mb-2">Ready to Break?</p>
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
              <p className="text-2xl mb-2">Final Score: {score}</p>
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
          <div className="flex gap-3">
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                const interval = setInterval(() => movePaddle("left"), 16);
                const stopMoving = () => {
                  clearInterval(interval);
                  document.removeEventListener("touchend", stopMoving);
                };
                document.addEventListener("touchend", stopMoving, { once: true });
              }}
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-left" className="text-2xl" />
            </motion.button>
            <motion.button
              onTouchStart={(e) => {
                e.preventDefault();
                const interval = setInterval(() => movePaddle("right"), 16);
                const stopMoving = () => {
                  clearInterval(interval);
                  document.removeEventListener("touchend", stopMoving);
                };
                document.addEventListener("touchend", stopMoving, { once: true });
              }}
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon="arrow-right" className="text-2xl" />
            </motion.button>
          </div>
          <p className="text-center text-sm text-smokey-600 dark:text-gray-400 mt-2">
            Or drag on canvas to move paddle
          </p>
        </div>
      )}

      <div className="mt-6 max-w-md text-center text-smokey-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Controls:</strong> Mouse/Touch drag or Arrow Keys/Buttons to move paddle
        </p>
        <p>Break all the bricks to win! You have 3 lives.</p>
      </div>
    </div>
  );
};

export default BreakoutGame;

