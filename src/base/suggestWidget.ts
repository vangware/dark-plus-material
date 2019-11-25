import { SUGGEST_WIDGET } from "../config";
import { themeLoader, TSThemeMap } from "./utils";

const constantMap = (value: string, colors: TSThemeMap[]) => {
	const [trueValue] = value.split(".");
	const color = colors.find(
		currentColor => currentColor.constName === trueValue
	);

	return color ? constantMap(color.value, colors) : value;
};

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const suggestWidget = themeLoader({
	colorDefs: /const (?<constName>[a-zA-Z]+) = registerColor\('[^']+', \{ (?<lightOrDark>light|dark): .+(?= \})/gu,
	colorGroups: /(?:const )(?<constName>[a-zA-Z]+)(?: = registerColor\(')(?<color>[^']+)(?:', \{ (?:(?:light: .+(?:, dark: )+)(?<dark>.+)(?=, hc)|dark: (?<light>.+)(?=, light)))(?:.+)/u,
	colorTemplate: "$1|$2|$3$4",
	constantMap,
	url: SUGGEST_WIDGET
});

export default suggestWidget;
