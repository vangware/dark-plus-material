import { editorColorRegistryUrl } from "../config";
import { TSThemeMap, themeLoader } from "./utils";

const constantMap = (value: string, colors: TSThemeMap[]) => {
	const [trueValue] = value.split(".");
	const color = colors.find(color => color.constName === trueValue);
	return color ? constantMap(color.value, colors) : value;
};

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const editorColorRegistry = themeLoader({
	colorDefs: /const ([a-zA-Z]+) = registerColor\('[^']+', { (light|dark): .+(?= })/g,
	colorGroups: /(?:const )(?<constName>[a-zA-Z]+)(?: = registerColor\(')(?<propName>[^']+)(?:', { (?:(?:light: .+(?:, dark: )+)(?<value1>.+)(?=, hc)|dark: (?<value2>.+)(?=, light)))(?:.+)/,
	colorTemplate: "$1|$2|$3$4",
	constantMap,
	url: editorColorRegistryUrl
});

export default editorColorRegistry;
