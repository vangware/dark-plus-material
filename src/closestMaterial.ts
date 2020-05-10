import { arrayReduce } from "@vangware/micro";
import { materialColors, materialGrays } from "./config";
import { RGBData } from "./interfaces";
import { distance, hexToRGB } from "./utils";

/**
 * Already mapped colors (to improve performance).
 */
const mapped = {
	has(color: string) {
		return Object.keys(this).indexOf(color) >= 0;
	}
};

/**
 * Gets the closest Material color to the given hex color.
 * @param color Hex color.
 */
export const closestMaterial = (color: string) => {
	const { r, g, b } = hexToRGB(color);

	const closest = mapped.has(color)
		? mapped[color]
		: arrayReduce<RGBData, { color: number | string; diff: number }>(
				min => material => {
					const diff = Math.sqrt(
						distance(r, material.r) ** 2 +
							distance(g, material.g) ** 2 +
							distance(b, material.b) ** 2
					);

					return {
						color: diff <= min.diff ? material.hex : min.color,
						diff: Math.min(diff, min.diff)
					};
				}
		  )({ color: "", diff: Number.MAX_SAFE_INTEGER })([
				...materialGrays,
				...materialColors
		  ]).color;

	mapped[color] = closest;

	return closest;
};
