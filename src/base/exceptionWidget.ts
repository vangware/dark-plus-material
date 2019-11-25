import { EXCEPTION_WIDGET } from "../config";
import { themeLoader } from "./utils";

/**
 * Promise with theme colors defined in TypeScript instead of json files.
 */
export const exceptionWidget = themeLoader({
	colorDefs: /const (?<constName>[a-zA-Z]+) = registerColor\('[^']+', \{ dark: .+(?=, light)/gu,
	colorGroups: /(?:const )(?<constName>[a-zA-Z]+)(?: = registerColor\(')(?<color>[^']+)(?:', \{ dark: )(?<rest>.+)/u,
	colorTemplate: "$1|$2|$3",
	url: EXCEPTION_WIDGET
});

export default exceptionWidget;
