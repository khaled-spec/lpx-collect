// This script prevents theme flash on page load
(function () {
  const storageKey = "lpx-theme";

  function getThemeConfig() {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return { mode: "system", accent: "blue" };
  }

  function getPreferredTheme(mode) {
    if (mode === "dark") return "dark";
    if (mode === "light") return "light";

    // If system, check the system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyAccentColor(accent) {
    const accentColors = {
      blue: { primary: "232 64% 52%", primaryForeground: "0 0% 100%" },
      purple: { primary: "271 91% 65%", primaryForeground: "0 0% 100%" },
      green: { primary: "142 71% 45%", primaryForeground: "0 0% 100%" },
      red: { primary: "0 84% 60%", primaryForeground: "0 0% 100%" },
      orange: { primary: "38 92% 50%", primaryForeground: "0 0% 100%" },
      teal: { primary: "172 66% 50%", primaryForeground: "0 0% 100%" },
    };

    const colors = accentColors[accent] || accentColors.blue;
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty(
      "--primary-foreground",
      colors.primaryForeground,
    );
  }

  const config = getThemeConfig();
  const theme = getPreferredTheme(config.mode || "system");

  // Apply theme class
  document.documentElement.classList.add(theme);

  // Apply accent color immediately
  applyAccentColor(config.accent || "blue");

  // Also set color scheme
  document.documentElement.style.colorScheme = theme;
})();
