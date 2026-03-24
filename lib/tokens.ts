// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Brand: Care Teal #46c4d9 · Trust Blue #1275ad · Deep Blue #13527a · Slate #7a8fa0 · Amber #e29926
const C = {
  teal: "#46c4d9", tealDk: "#13527a", tealLt: "#E5F7FB", tealBg: "#F0FBFD",
  white: "#FFFFFF", offWhite: "#F6F9FA", gray: "#F0F3F5", grayMd: "#D8E0E8",
  text: "#0E1C26", textMd: "#3A4A5C", textSm: "#7a8fa0",
  border: "#D6E4EA", borderLt: "#EAF1F4",
  red: "#E04C4C", redLt: "#FFF4F4", redBd: "#F9BFBF",
  green: "#1AA37A", greenLt: "#E5F7F1",
  amber: "#e29926", amberLt: "#FEF6E0",
  blue: "#1275ad", blueLt: "#E3F2FA",
  purple: "#6B31D4", purpleLt: "#F0EAFF",
} as const;

export type Tokens = typeof C;
export default C;
