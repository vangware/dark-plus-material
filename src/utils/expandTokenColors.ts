import { PlainSettings, TokenColor } from "../interfaces";

/**
 * Transform object to settings file.
 * @param settings Settings object.
 * @returns Token color array.
 */
export const expandTokenColors = (settings: PlainSettings): TokenColor[] =>
	Object.keys(settings).map(setting =>
		setting !== "vscode"
			? {
					scope: setting,
					settings: settings[setting]
			  }
			: {
					settings: settings[setting]
			  }
	);

export default expandTokenColors;
