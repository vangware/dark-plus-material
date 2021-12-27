import type { RGBA } from "./RGBA.js";

/**
 * Takes an RGBA quadruple and returns a hex color.
 */
export const rgbaToHex = (rgba: RGBA) =>
	`#${rgba.map(value => value.toString(16).padStart(2, "0")).join("")}`;
