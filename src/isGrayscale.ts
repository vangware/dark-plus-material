import type { RGBA } from "./RGBA.js";

/**
 * Check if given color is grayscale.
 */
export const isGrayscale = ([red, green, blue]: RGBA) =>
	red === green && green === blue;
