import { arrayMap, Entry, objectEntries } from "@vangware/micro";
import { PlainSettings, Settings, TokenColor } from "../interfaces";

/**
 * Transform object to settings file.
 * @param plainSettings Settings object.
 * @returns Token color array.
 */
export const expandTokenColors = (
	plainSettings: PlainSettings
): readonly TokenColor[] =>
	arrayMap<
		Entry<PlainSettings>,
		{ scope?: string; settings: Readonly<Settings> }
	>(([scope, settings]) =>
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
