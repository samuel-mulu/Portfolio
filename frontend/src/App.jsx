import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./common/ErrorBoundary.jsx";
import Portfolio from "./portfolio/Portfolio.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import ForgotPassword from "./auth/forgotPassword.jsx";
import GameSelection from "./portfolio/game/GameSelection.jsx";
import TRexGame from "./portfolio/game/TRexGame.jsx";
import SnakeGame from "./portfolio/game/SnakeGame.jsx";
import FlappyGame from "./portfolio/game/FlappyGame.jsx";
import Game2048 from "./portfolio/game/Game2048.jsx";
import TetrisGame from "./portfolio/game/TetrisGame.jsx";
import BreakoutGame from "./portfolio/game/BreakoutGame.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Portfolio />,
  },
  {
    path: "/game",
    element: <GameSelection />,
  },
  {
    path: "/game/trex",
    element: <TRexGame />,
  },
  {
    path: "/game/snake",
    element: <SnakeGame />,
  },
  {
    path: "/game/flappy",
    element: <FlappyGame />,
  },
  {
    path: "/game/2048",
    element: <Game2048 />,
  },
  {
    path: "/game/tetris",
    element: <TetrisGame />,
  },
  {
    path: "/game/breakout",
    element: <BreakoutGame />,
  },
  {
    path: "/dashboard",
    element: (
      // <ProtectedRoute>
      <Dashboard />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute>
        <Register />,
      </ProtectedRoute>
    ),
  },
  {
    path: "reset-password",
    element: <ForgotPassword />,
  },
]);

const App = () => {
  console.log("🚀 App component rendering...");
  
  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: 1,
              staleTime: 1000 * 60 * 5,
              cacheTime: 1000 * 60 * 60,
              onError: (error) => {
                console.error("[React Query] Query error:", error);
              },
            },
            mutations: {
              retry: 1,
              staleTime: 1000 * 60 * 5,
              cacheTime: 1000 * 60 * 60,
              onError: (error) => {
                console.error("[React Query] Mutation error:", error);
              },
            },
          },
        })
      }
    >
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
export default App;
