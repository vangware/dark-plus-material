import { arrayMap, Entry, objectEntries } from "@vangware/utils";
import { PlainSettings, TokenColor } from "../interfaces";

/**
 * Transform object to settings file.
 * @param plainSettings Settings object.
 * @returns Token color array.
 */
export const expandTokenColors = (
	plainSettings: PlainSettings
): readonly TokenColor[] =>
	arrayMap(([scope, settings]: Entry<PlainSettings>) =>
		scope !== "vscode"
			? {
					scope,
					settings
			  }
			: {
					settings
			  }
	)(objectEntries(plainSettings));

export default expandTokenColors;
