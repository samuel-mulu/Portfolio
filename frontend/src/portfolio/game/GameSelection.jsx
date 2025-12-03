/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas);

const GameSelection = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "trex",
      title: "T-Rex Runner",
      description: "Jump over obstacles and survive as long as possible!",
      icon: "running",
      route: "/game/trex",
    },
    {
      id: "snake",
      title: "Snake Game",
      description: "Eat food and grow longer without hitting walls or yourself!",
      icon: "code",
      route: "/game/snake",
    },
    {
      id: "flappy",
      title: "Flappy Bird",
      description: "Tap to flap and navigate through pipes! Vertical scrolling fun!",
      icon: "dove",
      route: "/game/flappy",
    },
    {
      id: "2048",
      title: "2048 Puzzle",
      description: "Combine numbered tiles using strategy! Mind-challenging puzzle game!",
      icon: "brain",
      route: "/game/2048",
    },
    {
      id: "tetris",
      title: "Tetris",
      description: "Stack falling blocks and clear lines! Classic puzzle masterpiece!",
      icon: "th",
      route: "/game/tetris",
    },
    {
      id: "breakout",
      title: "Breakout",
      description: "Break all bricks with the bouncing ball! Satisfying arcade classic!",
      icon: "square",
      route: "/game/breakout",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <motion.button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon="arrow-left" />
          <span>Back to Portfolio</span>
        </motion.button>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Choose Your Game
        </h1>
        <p className="text-smokey-600 dark:text-gray-400 text-lg">
          Select a game to play and have fun!
        </p>
      </motion.div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(game.route)}
            className="cursor-pointer bg-cream-50 dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-smokey-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mb-4 shadow-lg"
              >
                <FontAwesomeIcon
                  icon={game.icon}
                  className="text-4xl text-white"
                />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-smokey-800 dark:text-white">
                {game.title}
              </h2>
              <p className="text-smokey-600 dark:text-gray-400 mb-6">
                {game.description}
              </p>
              <motion.button
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Play Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 max-w-2xl text-center text-smokey-600 dark:text-gray-400"
      >
        <p className="text-sm">
          All games support keyboard controls and work great on mobile devices too!
        </p>
      </motion.div>
    </div>
  );
};

export default GameSelection;

