import { Raf } from "./subscribable";

/** ------------ Damp/Lerp **/

/**
 * Framerate independent dampening using power-based smoothing
 * @param {number} current - The current value
 * @param {number} target - The target value to transition towards
 * @param {number} smoothing - Smoothing factor (larger = smoother/slower, recommended: 0.001 to 1)
 * @param {number} dt - Delta time in seconds
 * @returns {number} Interpolated value between current and target
 */
export function dampPow(current, target, smoothing, dt = Raf.deltaTime) {
  return lerp(current, target, 1 - Math.pow(smoothing, dt));
}

/**
 * Framerate independent dampening using exponential decay
 * @param {number} current - The current value
 * @param {number} target - The target value to transition towards
 * @param {number} lambda - Decay rate (larger = faster decay)
 * @param {number} dt - Delta time in seconds
 * @returns {number} Interpolated value between current and target
 */
export function damp(current, target, lambda, dt = Raf.deltaTime) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

/** ------------ Map/Clamp **/
export function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export function clamp(min, max, num) {
  return Math.min(Math.max(num, min), max);
}

/** ------------ Angles **/
export function radToDeg(r) {
  return (r * 180) / Math.PI;
}

export function degToRad(d) {
  return (d * Math.PI) / 180;
}

/** ------------ Bitwise **/
export const isPowerOfTwo = (n) => !!n && (n & (n - 1)) === 0;

export function symmetricMod(value, base) {
  let m = value % base;
  if (Math.abs(m) > base / 2) {
    m = m > 0 ? m - base : m + base;
  }
  return m;
}

