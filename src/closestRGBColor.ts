import colorDiff from "color-diff";
import { hexToRGBA } from "./hexToRGBA.js";
import { rgbaToHex } from "./rgbaToHex.js";
import { themeColors } from "./themeColors.js";

/**
 * Returns the closest color in `themeColors` to the given color.
 * Preserves the alpha.
 */
export const closestRGBColor = (hex: string) => {
	const [red, green, blue, alpha] = hexToRGBA(hex);
	const { R, G, B } = colorDiff.closest(
		{ R: red, G: green, B: blue },
		themeColors.map(rgb => ({
			R: rgb[0],
			G: rgb[1],
			B: rgb[2],
		})),
	);

	return rgbaToHex([R, G, B, alpha]);
};
