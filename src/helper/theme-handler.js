export const handleTheme = () => {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved === "Dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("Dark");
    localStorage.setItem("theme", "Dark");
  }
  const setTheme = setTimeout(() => {
    document.documentElement.style.transition = "0.4s background-color";
    clearTimeout(setTheme);
  }, 300);
};