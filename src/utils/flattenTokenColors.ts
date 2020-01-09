import { arrayReduce, EMPTY_OBJECT, isArray, when } from "@vangware/micro";
import { PlainSettings, TokenColor } from "../interfaces";

/**
 * Transform tokenColors array to a plain object.
 * @param settings Token color array.
 * @returns Plain settings.
 */
export const flattenTokenColors = (
	tokenColors: readonly TokenColor[]
): PlainSettings => <PlainSettings>arrayReduce(
		tokenColors,
		(plainSettings, setting) => ({
			...plainSettings,
			...arrayReduce(
				isArray(setting.scope) ? setting.scope : [setting.scope],
				(plainSetting, key) => ({
					...plainSetting,
					[key || "vscode"]: when(
						plainSetting[key],
						settingProp => ({
							...settingProp,
							...setting.settings
						}),
						() => setting.settings
					)
				}),
				EMPTY_OBJECT
			)
		}),
		EMPTY_OBJECT
	);

export default flattenTokenColors;
