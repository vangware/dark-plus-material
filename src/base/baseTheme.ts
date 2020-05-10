import { BASE_THEME } from "../config";
import { themeLoader, TSThemeMap } from "./utils";

const constantMap = (value: string, colors: TSThemeMap[]) => {
	const CONSTANT_NAME = /(?<letterWithUnderscore>[A-Z]+_)+[A-Z]+/u;
	const match = value.match(CONSTANT_NAME);
	const CONST = match?.[0] ?? "";
	const color = colors.find(currentColor => currentColor.constName === CONST);
	const final = color ? value.replace(CONST, color.value) : value;

	return final.match(CONSTANT_NAME) ? constantMap(final, colors) : final;
};

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const baseTheme = themeLoader({
	colorDefs: /const [a-zA-Z_]+ = registerColor\('.+\n\sdark: .+(?=,\n)/gu,
	colorGroups: /(?:const )(?<constName>[a-zA-Z_]+)(?: = registerColor\(')(?<propName>[^']+)(?:', \{\n\sdark: )(?<value>.+)/u,
	colorTemplate: "$1|$2|$3",
	constantMap,
	url: BASE_THEME
});

export default baseTheme;
