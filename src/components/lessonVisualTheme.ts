// Self-contained editorial palette for the AI Fluency lesson's priority
// visuals — deliberately independent of the site's light/dark theme
// tokens (src/app/globals.css) so this lesson can have its own warm,
// "deep navy + cream" identity regardless of which theme the visitor has
// picked. One accent per concept, per the design direction: violet for
// the AI concept itself, blue for context/relationships, green for
// useful output, coral for "stop and verify."
export const LV = {
  bg: "#1b2030", // deep navy/charcoal panel background
  bgRaised: "#232a3d", // slightly lifted navy, for nested panels
  surface: "#f6f1e7", // cream content surface (chips, cards)
  surfaceMuted: "#e9e2d2",
  ink: "#211d17", // dark ink for text on cream surfaces
  inkOnNavy: "#f3efe4", // warm off-white for text on navy
  inkOnNavySoft: "#b9bdcc",
  border: "rgba(246, 241, 231, 0.14)",
  violet: "#9b8cf5", // AI / concept
  violetSoft: "rgba(155, 140, 245, 0.18)",
  blue: "#5fa8e8", // context / relationships
  blueSoft: "rgba(95, 168, 232, 0.18)",
  green: "#4fb787", // useful work
  greenSoft: "rgba(79, 183, 135, 0.18)",
  coral: "#ef7a5c", // verification / caution
  coralSoft: "rgba(239, 122, 92, 0.18)",
} as const;
