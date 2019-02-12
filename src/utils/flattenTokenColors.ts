import { TokenColor, PlainSettings } from "../interfaces";

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

export default flattenTokenColors;
