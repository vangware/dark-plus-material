import type { RGBA } from "./RGBA.js";

/**
 * Hex color to RGBA quadruple.
 */
export const hexToRGBA = (hex: string) =>
	(hex
		.match(/#(?<red>\w{2})(?<green>\w{2})(?<blue>\w{2})(?<alpha>\w{2})/u)
		?.slice(1)
		.map(rgb => parseInt(rgb, 16)) ?? [0, 0, 0, 0]) as unknown as RGBA;
