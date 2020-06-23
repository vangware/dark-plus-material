import { arrayReduce, isArray, isUndefined } from "@vangware/utils";
import { PlainSettings, TokenColor } from "../interfaces";

/**
 * Transform tokenColors array to a plain object.
 * @param settings Token color array.
 * @returns Plain settings.
 */
export const flattenTokenColors = (
	tokenColors: readonly TokenColor[]
): PlainSettings =>
	arrayReduce((plainSettings: PlainSettings) => (setting: TokenColor) => ({
		...plainSettings,
		...arrayReduce((plainSetting: PlainSettings) => (key: string) => ({
			...plainSetting,
			[key || "vscode"]: !isUndefined(plainSetting[key])
				? {
						...plainSetting[key],
						...setting.settings
				  }
				: setting.settings
		}))({})(isArray(setting.scope) ? setting.scope : [setting.scope])
	}))({})(tokenColors) as PlainSettings;

export default flattenTokenColors;
