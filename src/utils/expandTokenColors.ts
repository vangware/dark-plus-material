import { objectMap, when } from "@vangware/micro";
import { PlainSettings, TokenColor } from "../interfaces";

/**
 * Transform object to settings file.
 * @param plainSettings Settings object.
 * @returns Token color array.
 */
export const expandTokenColors = (
	plainSettings: PlainSettings
): readonly TokenColor[] =>
	objectMap(plainSettings, (settings, scope) =>
		when(
			scope !== "vscode",
			() => ({
				scope,
				settings
			}),
			() => ({
				settings
			})
		)
	);

export default expandTokenColors;
