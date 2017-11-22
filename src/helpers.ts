import { TokenColor, PlainSettings } from "./interfaces";

/**
 * Takes a map { key: [value1, value2] } and returns { value1: key, value2: key }
 * @param source Source map.
 * @returns Inverted map.
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
 * @param map Map to make the replacements
 * @returns Token color object.
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
 * Transform tokenColors array to a plain object.
 * @param settings Token color array.
 * @returns Plain settings.
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
 * @param settings Settings object.
 * @returns Token color array.
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
 * @param tokenColors Token color array.
 * @returns Token color array.
 */
export const removeDuplicatedColors = (
	tokenColors: TokenColor[]
): TokenColor[] => expandTokenColors(flattenTokenColors(tokenColors));
