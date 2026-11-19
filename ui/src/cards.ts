// The face of a gallery card for a language (or a pair of them): shared by
// the dashboard's gallery and the language card that flips in when a quick
// key picks a language (language-card.ts).

import { WARP_CAROUSEL_CARDS, type WarpCard } from "./warp-carousel";

export interface Preset {
  speak: string;
  write: string; // "" = plain dictation
  speakName: string;
  writeName: string;
  speakNative: string;
  writeNative: string;
}

// The light a card casts above and below it, taken from the card itself:
// the mean of its most vivid mesh colours. (The carousel's own glow colours
// were picked for its demo and do not always match the card.)
const glows = new Map<string[], string>();
export function glowOf(mesh: string[] | undefined): string {
  if (!mesh || !mesh.length) return "#7fd0f0";
  let glow = glows.get(mesh);
  if (!glow) {
    const scored = mesh.map((hex) => {
      const n = parseInt(hex.slice(1), 16);
      const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      const max = Math.max(...rgb);
      return { rgb, score: max ? ((max - Math.min(...rgb)) / max) * max : 0 };
    }).sort((a, b) => b.score - a.score).slice(0, 8);
    const mean = [0, 1, 2].map((i) => Math.round(scored.reduce((sum, c) => sum + c.rgb[i], 0) / scored.length));
    glow = "#" + mean.map((v) => v.toString(16).padStart(2, "0")).join("");
    glows.set(mesh, glow);
  }
  return glow;
}

// The four hand-tuned palettes of the Warp Carousel, one per card in turn.
export function cardFor(preset: Preset & { unsaved?: boolean }, i: number): WarpCard {
  const look = WARP_CAROUSEL_CARDS[i % WARP_CAROUSEL_CARDS.length];
  const translating = preset.write !== "";
  return {
    mesh: look.mesh,
    numeral: look.numeral,
    accent: look.accent,
    glow: glowOf(look.mesh),
    title: translating ? `${preset.speakName}\nto ${preset.writeName}` : `${preset.speakName}\ndictation`,
    value: preset.speak.toUpperCase(),
    unit: translating ? `→ ${preset.write.toUpperCase()}` : undefined,
    footer: (translating ? `${preset.speakNative} → ${preset.writeNative}` : preset.speakNative) + (preset.unsaved ? "  ·  not saved" : ""),
    detail: translating ? "ring" : "wave",
  };
}

