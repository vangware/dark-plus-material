import { debugToolbarUrl } from "../config";
import { themeLoader } from "./utils";

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const debugToolbar = themeLoader({
	colorDefs: /const ([a-zA-Z]+) = registerColor\('.+\n\sdark: .+(?=,\n)/g,
	colorGroups: /(?:const )([a-zA-Z]+)(?: = registerColor\(')([^']+)(?:', {\n\sdark: )(.+)/,
	colorTemplate: "$1|$2|$3",
	url: debugToolbarUrl
});

export default debugToolbar;
