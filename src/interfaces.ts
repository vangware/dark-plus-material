/**
 * Settings interface.
 */
export interface Settings {
	background?: string;
	fontStyle?: string;
	foreground?: string;
}

/**
 * Plain Settings interface.
 */
export interface PlainSettings {
	[key: string]: Settings;
}

/**
 * TokenColor interface.
 */
export interface TokenColor {
	settings?: Settings;
	scope?: string | string[];
	name?: string;
}

/**
 * Color interface.
 */
export interface Colors {
	[key: string]: string;
}

/**
 * Theme interface.
 */
export interface Theme {
	$schema: string;
	name: string;
	include?: string;
	tokenColors?: TokenColor[];
	colors?: Colors;
}
