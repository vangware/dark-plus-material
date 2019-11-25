import { EDITOR_COLOR } from "../config";
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
export const editorColorRegistry = themeLoader({
	colorDefs: /const (?<constName>[a-zA-Z]+) = registerColor\('[^']+', \{ (?<lightOrDark>light|dark): .+(?= \})/gu,
	colorGroups: /(?:const )(?<constName>[a-zA-Z]+)(?: = registerColor\(')(?<propName>[^']+)(?:', \{ (?:(?:light: .+(?:, dark: )+)(?<value1>.+)(?=, hc)|dark: (?<value2>.+)(?=, light)))(?:.+)/u,
	colorTemplate: "$1|$2|$3$4",
	constantMap,
	url: EDITOR_COLOR
});

export default editorColorRegistry;
