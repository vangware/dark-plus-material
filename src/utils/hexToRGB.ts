import { RGBData } from "../interfaces";

/**
 * Hex color to RGB object.
 * @param hex Hex value in format #RRGGBB or #RRGGBBAA
 */
export const hexToRGB = (hex: string): RGBData => {
	const [r, g, b] = hex
		.replace(/#(?<red>\w{2})(?<green>\w{2})(?<blue>\w{2})/u, "$1|$2|$3")
		.split("|")
		.map(rgb => parseInt(rgb, 16));

	return { b, g, hex, r };
};

export default hexToRGB;
