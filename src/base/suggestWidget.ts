import { suggestWidgetUrl } from "../config";
import { themeLoader, TSThemeMap } from "./utils";

const constantMap = (value: string, colors: TSThemeMap[]) => {
	const [trueValue] = value.split(".");
	const color = colors.find(currentColor => currentColor.constName === trueValue);

	return color ? constantMap(color.value, colors) : value;
};

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const suggestWidget = themeLoader({
	colorDefs: /const ([a-zA-Z]+) = registerColor\('[^']+', { (light|dark): .+(?= })/g,
	// tslint:disable-next-line: max-line-length
	colorGroups: /(?:const )([a-zA-Z]+)(?: = registerColor\(')([^']+)(?:', { (?:(?:light: .+(?:, dark: )+)(.+)(?=, hc)|dark: (.+)(?=, light)))(?:.+)/,
	colorTemplate: "$1|$2|$3$4",
	constantMap,
	url: suggestWidgetUrl
});

export default suggestWidget;
