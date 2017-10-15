import { TokenColor, PlainSettings } from "./interfaces";

/**
 * Takes a map { key: [value1, value2] } and returns { value1: key, value2: key }
 *
 * @export
 * @param {object} source Source map.
 * @returns {object} Inverted map.
 */
export const invertMap = (source: object) =>
	Object.keys(source).reduce(
		(map, item) => ({
			...map,
			...source[item].reduce(
				(base, baseItem) => ({ ...base, [baseItem]: item }),
				{}
			)
		}),
		{}
	);

/**
 * Removes unwanted properties and set the material colors based on colorMap.
 *
 * @export
 * @param {TokenColor} { scope, settings }
 * @param {object} map Map to make the replacements
 * @returns {TokenColor} { scope, settings }
 */
export const replaceColors = ({ scope, settings }: TokenColor, map: object) => {
	const { background, foreground } = settings;
	if (background) {
		settings.background = map[background.toUpperCase()] || "MISSING";
	}
	if (foreground) {
		settings.foreground = map[foreground.toUpperCase()] || "MISSING";
	}
	return { scope, settings };
};

/**
 * Transform tokenColors array to a plain oject.
 *
 * @export
 * @param {TokenColor[]} settings
 * @returns {PlainSettings}
 */
export const flattenTokenColors = (tokenColors: TokenColor[]): PlainSettings =>
	<PlainSettings>tokenColors.reduce(
		(out, setting) => ({
			...out,
			...(Array.isArray(setting.scope)
				? setting.scope
				: [setting.scope]
			).reduce(
				(out, key) => ({
					...out,
					[key || "vscode"]: out[key]
						? { ...out[key], ...setting.settings }
						: setting.settings
				}),
				{}
			)
		}),
		{}
	);

/**
 * Transform object to settings file.
 *
 * @export
 * @param {Settings} settings
 * @returns {TokenColor[]}
 */
export const expandTokenColors = (settings: PlainSettings): TokenColor[] =>
	Object.keys(settings).map(
		setting =>
			setting !== "vscode"
				? {
						scope: setting,
						settings: settings[setting]
					}
				: {
						settings: settings[setting]
					}
	);

/**
 * Removes duplicated colors by flatting and then expanding tokenColors.
 *
 * @export
 * @param {tokenColor[]} tokenColors
 * @returns {TokenColor[]}
 */
export const removeDuplicatedColors = (
	tokenColors: TokenColor[]
): TokenColor[] => expandTokenColors(flattenTokenColors(tokenColors));
