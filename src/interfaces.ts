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
export type PlainSettings = Record<string, Settings>;

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
export type Colors = Record<string, string>;

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

/**
 * RGB Data (returned by `hexToRGB`)
 */
export interface RGBData {
	b: number;
	g: number;
	hex: string;
	r: number;
}
