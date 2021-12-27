import type { RGBA } from "./RGBA.js";

/**
 * RGB distance: https://en.wikipedia.org/wiki/Color_difference#sRGB
 */
export const rgbDistance =
	([red1, green1, blue1]: RGBA) =>
	([red2, green2, blue2]: RGBA) => {
		const redBar = (red1 + red2) / 2;

		return Math.sqrt(
			(2 + redBar / 256) * (red1 - red2) ** 2 +
				4 * (green1 - green2) ** 2 +
				(2 + (255 - redBar) / 256) * (blue1 - blue2) ** 2,
		);
	};
