import type { RGBA } from "./RGBA.js";

/**
 * Takes an RGBA quadruple and returns a hex color.
 *
 * @example
 * ```ts
 * rgbaToHex([255, 255, 255, 1]); // "#ffffff"
 * ```
 * @param rgba An RGBA quadruple.
 * @returns A hex color string.
 */
export const rgbaToHex = (rgba: RGBA) =>
	`#${rgba.map(value => value.toString(16).padStart(2, "0")).join("")}`;
