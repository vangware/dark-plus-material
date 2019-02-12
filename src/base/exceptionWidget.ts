import { exceptionWidgetUrl } from "../config";
import { themeLoader } from "./utils";

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const exceptionWidget = themeLoader({
	colorDefs: /const ([a-zA-Z]+) = registerColor\('[^']+', { dark: .+(?=, light)/g,
	colorGroups: /(?:const )([a-zA-Z]+)(?: = registerColor\(')([^']+)(?:', { dark: )(.+)/,
	colorTemplate: "$1|$2|$3",
	url: exceptionWidgetUrl
})

export default exceptionWidget;
