import { TokenColor } from "../interfaces";
import { closestMaterial } from "../closestMaterial";
import { colorMap } from "../config/colorMap";

/**
 * Removes unwanted properties and set the material colors with closestMaterial.
 * @returns Token color object.
 */
export const replaceColors = ({ scope, settings }: TokenColor) => {
	const { background, foreground } = settings;
	if (background) {
		settings.background =
			colorMap[background.toUpperCase()] ||
			`${background.toUpperCase()}|${closestMaterial(background)}`;
	}
	if (foreground) {
		settings.foreground =
			colorMap[foreground.toUpperCase()] ||
			`${foreground.toUpperCase()}|${closestMaterial(foreground)}`;
	}
	return { scope, settings };
};

export default replaceColors;
