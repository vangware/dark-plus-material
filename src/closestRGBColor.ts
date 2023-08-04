import * as colorDiff from "color-diff";
import { hexToRGBA } from "./hexToRGBA.js";
import { rgbaToHex } from "./rgbaToHex.js";
import { themeColors } from "./themeColors.js";

/**
 * Returns the closest color in `themeColors` to the given color.
 * Preserves the alpha.
 *
 * @example
 * ```ts
 * closestRGBColor("#fefefeff"); // "#ffffffff"
 * ```
 * @param color A hex color string.
 * @returns A hex color string.
 */
export const closestRGBColor = (hex: string) => {
	const [red, green, blue, alpha] = hexToRGBA(hex);
	// eslint-disable-next-line id-length
	const { R, G, B } = colorDiff.closest(
		// eslint-disable-next-line id-length
		{ B: blue, G: green, R: red },
		themeColors.map(rgb => ({
			// eslint-disable-next-line id-length
			B: rgb[2],
			// eslint-disable-next-line id-length
			G: rgb[1],
			// eslint-disable-next-line id-length
			R: rgb[0],
		})),
	);

	return rgbaToHex([R, G, B, alpha]);
};
