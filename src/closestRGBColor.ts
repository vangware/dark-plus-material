import { hexToRGBA } from "./hexToRGBA.js";
import { isGrayscale } from "./isGrayscale.js";
import { rgbaToHex } from "./rgbaToHex.js";
import { rgbDistance } from "./rgbDistance.js";
import { themeColors, themeGrayscale } from "./themeColors.js";

/**
 * Returns the closest color in `themeColors` to the given color.
 * Preserves the alpha.
 */
export const closestRGBColor = (hex: string) => {
	const color = hexToRGBA(hex);
	const colorDistance = rgbDistance(color);
	const [red, green, blue] = [
		...(isGrayscale(color) ? themeGrayscale : themeColors),
	].sort(
		(current, next) => colorDistance(current) - colorDistance(next),
	)[0] as typeof themeColors[number];

	return rgbaToHex([red, green, blue, color[3]]);
};
