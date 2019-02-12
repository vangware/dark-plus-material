import { hexToRGB, distance } from "./utils";
import { materialGrays, materialColors } from "./config/materialColors";

/**
 * Already mapped colors (to improve performance).
 */
let mapped = {
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
		: ([...materialGrays, ...materialColors]).reduce(
			(min, material) => {
				const diff = Math.sqrt(
					(distance(r, material.r) ** 2) +
					(distance(g, material.g) ** 2) +
					(distance(b, material.b) ** 2)
				);
				return ({
					diff: Math.min(diff, min.diff),
					color: diff <= min.diff ? material.hex : min.color
				});
			},
			{ diff: Number.MAX_SAFE_INTEGER, color: "" }
		).color;

	mapped[color] = closest;

	return closest;
};
