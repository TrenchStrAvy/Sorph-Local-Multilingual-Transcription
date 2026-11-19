// The language card: when a quick key picks a language, the gallery card for
// it turns in, in the middle of the screen, over nothing (the page is clear).
// Shown by sorph/toast.py in a web view; it calls window.card.show(preset)
// and window.card.hide().

import { cardFor, type Preset } from "./cards";
import { paintedCard, DEFAULT_FONT } from "./warp-carousel";

const W = 220;                       // css px; the card is 256 × 320 stage units
const SCALE = 2;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const pose = (deg: number, s: number) => `rotateY(${deg}deg) scale(${s})`;

const stage = document.getElementById("stage")!;
let front: HTMLElement | null = null;

function face(preset: Preset, index: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "card";
  const cv = paintedCard(cardFor(preset, index), W * SCALE, DEFAULT_FONT);
  const copy = document.createElement("canvas");   // the painted card is cached and shared
  copy.width = cv.width; copy.height = cv.height;
  copy.getContext("2d")!.drawImage(cv, 0, 0);
  el.appendChild(copy);
  stage.appendChild(el);
  return el;
}

function leave(el: HTMLElement, deg: number, ms: number) {
  const a = el.animate(
    [{ transform: pose(0, 1), opacity: 1 }, { transform: pose(deg, 0.97), opacity: 0 }],
    { duration: ms, easing: EASE_IN, fill: "forwards" });
  a.onfinish = () => el.remove();
}

function show(preset: Preset, index = 0) {
  const turning = front !== null;
  if (front) leave(front, 70, 350);          // a new pick: the old card turns on as the new one comes in
  const el = face(preset, index);
  el.animate(
    [{ transform: pose(-70, 0.96), opacity: 0 }, { transform: pose(0, 1), opacity: 1 }],
    { duration: turning ? 350 : 450, easing: EASE_OUT, fill: "forwards" });
  front = el;
}

function hide() {
  if (!front) return;
  leave(front, 60, 250);
  front = null;
}

(window as unknown as { card: unknown }).card = { show, hide };
