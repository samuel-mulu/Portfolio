import { useEffect, useState } from "react";

const useTheme = () => {
  // Default to dark mode if no theme is stored
  const storedTheme = localStorage.getItem("color-theme");
  const [darkMode, setDarkMode] = useState(
    storedTheme ? storedTheme === "dark" : true // Default to dark mode
  );

  //! toggling the dark mode
  const toggleDarkMode = () => {
    if (!darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("color-theme", "dark");
      setDarkMode(true);
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      setDarkMode(false);
    }
  };

  //! when the app mounts, checking if the user has a color-theme stored in local storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("color-theme");
    
    if (storedTheme) {
      //! checking if the user has a color-theme of light
      if (storedTheme === "light") {
        if (document.body.classList.contains("dark")) {
          document.body.classList.remove("dark");
        }
        document.body.classList.add("light");
        setDarkMode(false);
      } else if (storedTheme === "dark") {
        //! checking if the user has a color-theme of dark
        if (document.body.classList.contains("light")) {
          document.body.classList.remove("light");
        }
        document.body.classList.add("dark");
        setDarkMode(true);
      }
    } else {
      //! No theme stored - default to dark mode
      if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
      }
      document.body.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("color-theme", "dark");
    }
  }, []);

  return { darkMode, toggleDarkMode };
};
export default useTheme;
