import { baseThemeUrl } from "../config";
import { TSThemeMap, themeLoader } from "./utils";

const constantMap = (value: string, colors: TSThemeMap[]) => {
	const CONSTANT_NAME = /([A-Z]+_)+[A-Z]+/;
	const match = value.match(CONSTANT_NAME);
	const CONST = match ? match[0] : "";
	const color = colors.find(color => color.constName === CONST);
	const final = color ? value.replace(CONST, color.value) : value;
	return final.match(CONSTANT_NAME) ? constantMap(final, colors) : final;
};

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const baseTheme = themeLoader({
	colorDefs: /const [a-zA-Z_]+ = registerColor\('.+\n\sdark: .+(?=,\n)/g,
	colorGroups: /(?:const )(?<constName>[a-zA-Z_]+)(?: = registerColor\(')(?<propName>[^']+)(?:', {\n\sdark: )(?<value>.+)/,
	colorTemplate: "$1|$2|$3",
	constantMap,
	url: baseThemeUrl
});

export default baseTheme;
