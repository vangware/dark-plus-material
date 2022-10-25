import type { RGBA } from "./RGBA.js";

/**
 * Hex color to RGBA quadruple.
 *
 * @example
 * ```ts
 * hexToRGBA("#ffffff"); // [255, 255, 255, 1]
 * ```
 * @param hex A hex color string.
 * @returns An RGBA quadruple.
 */
export const hexToRGBA = (hex: string) =>
	(hex
		.match(/#(?<red>\w{2})(?<green>\w{2})(?<blue>\w{2})(?<alpha>\w{2})/u)
		?.slice(1)
		.map(rgb => parseInt(rgb, 16)) ?? [0, 0, 0, 0]) as unknown as RGBA;
