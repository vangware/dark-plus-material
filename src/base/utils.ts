import fetch from "node-fetch";
import * as Color from "color";

/**
 * Parse string nulls.
 * @param value Value to parse.
 */
export const stringNull = (value: string): string =>
	value.includes("null") ? null : value;

/**
 * Makes all transparent calls the same.
 * @param value
 */
export const standardTransparent = (value: string) =>
	value.replace(/(transparent\()([^,]+)(?:, )([\d\.]+)(\))/, "$2.$1$3$4");

/**
 * Makes all lighten calls the same.
 * @param value
 */
export const standardLighten = (value: string) =>
	value.replace(/(lighten\()([^,]+)(?:, )([\d\.]+)(\))/, "$2.$1$3$4");

/**
 * Replace `Color.fromHex` with actual hex.
 * @param value
 */
export const fromHex = (value: string) =>
	value.replace(/(?:Color\.fromHex\()(#\w+)(?:\))/, "$1");

/**
 * Transform standard transparent calls into hex transparency.
 * @param value
 */
export const transparentHex = (value: string) => {
	const [color, ...transparentValues] = value.split(".transparent");
	const transparency = transparentValues.length
		? transparentValues
				.map(val => val.match(/[\d\.]+/)[0])
				.map(val => parseFloat(val))
				.reduce((total, val) => total * val, 1)
		: false;

	return transparency
		? `${color}${Math.round(transparency * 255)
				.toString(16)
				.padStart(2, "0")
				.toUpperCase()}`
		: value;
};

export const lightenHex = (value: string) => {
	const [color, ...lightenValues] = value.split(".lighten");
	const light = lightenValues.length
		? lightenValues
				.map(val => val.match(/[\d\.]+/)[0])
				.map(val => parseFloat(val))
				.reduce((total, val) => total * val, 1)
		: false;

	return light
		? Color(color)
				.lighten(light)
				.hex()
		: value;
};

export const newColorHex = (value: string) => {
	const rgba = value.replace(
		/new Color\(new RGBA\((?<r>\d+), (?<g>\d+), (?<b>\d+), (?<a>\d+\.\d+)/,
		"$1|$2|$3|$4"
	);
	const [r, g, b, a] = rgba.includes("|") ? rgba.split("|") : Array(4);

	return rgba.includes("|")
		? Color.rgb({ r, g, b })
				.alpha(a)
				.hex()
		: value;
};

export const standardLength = (value: string) =>
	value.length < 7 ? `#${value.substr(1, 3)}${value.substr(1)}` : value;

/**
 * Map of TS theme.
 */
export interface TSThemeMap {
	constName: string;
	propName: string;
	value: string;
}

/**
 * Replace apperances of some variables and values because I'm lazy and I don't want to parse them.
 * @param tsFileText TS theme file.
 */
export const missingColors = (tsFileText: string) =>
	tsFileText
		.replace(/Color.transparent/g, "'#00000000'")
		.replace(/Color.white/g, "'#FFFFFF'")
		.replace(/Color.black/g, "'#000000'")
		.replace(/contentTransparency/g, "0.4")
		.replace(/contrastBorder/g, "'null'")
		.replace(/dark: commonBaseColor/g, "dark: '#606060'")
		.replace(/dark: currentBaseColor/g, "dark: '#40C8AE'")
		.replace(/dark: defaultInsertColor/g, "dark: '#9BB95533'")
		.replace(/dark: defaultRemoveColor/g, "dark: '#FF000033'")
		.replace(/dark: editorBackground/g, "dark: '#1E1E1E'")
		.replace(/dark: editorForeground/g, "dark: '#BBBBBB'")
		.replace(/dark: editorWidgetBackground/g, "dark: '#252526'")
		.replace(/dark: editorWidgetBorder/g, "dark: '#454545'")
		.replace(/dark: findMatchColorDefault/g, "dark: '#F6B94DB3'")
		.replace(/dark: incomingBaseColor/g, "dark: '#40A6FF'")
		.replace(/dark: listFocusBackground/g, "dark: '#062F4A'")
		.replace(/dark: listHighlightForeground/g, "dark: '#0097fb'")
		.replace(/dark: rulerRangeDefault/g, "dark: '#007ACC99'")
		.replace(/dark: textLinkForeground/g, "dark: '#3794FF'")
		.replace(/rulerTransparency/g, "1");

/**
 * Options for theme loader.
 */
export interface ThemeLoaderOptions {
	/**
	 * URL to load.
	 */
	url?: string;

	/**
	 * RegExp to search for color definitions.
	 */
	colorDefs?: RegExp;

	/**
	 * RegExp to make color definition groups.
	 */
	colorGroups?: RegExp;

	/**
	 * Template (constantName|propName|value).
	 */
	colorTemplate?: string;

	/**
	 * Maps constants when self referencing.
	 * @param value Current color value.
	 * @param colors Array of colors.
	 */
	constantMap?(value: string, colors?: TSThemeMap[]): string;
}

/**
 * Theme promise generator.
 */
export const themeLoader = ({
	url,
	colorDefs,
	colorGroups,
	colorTemplate,
	constantMap = (value: string) => value
}: ThemeLoaderOptions) =>
	fetch(url)
		.then(response => response.text())
		.then(themeTS => {
			const matchedColorDefs = missingColors(themeTS).match(colorDefs);

			console.log(
				`Parsing ${url} . . .${
					matchedColorDefs === null ? " Error!" : ""
				}`
			);

			return matchedColorDefs
				? matchedColorDefs
						.map(registeredColor =>
							registeredColor.replace(colorGroups, colorTemplate)
						)
						.map(mapped => mapped.split("|"))
						.map(([constName, propName, value]) => ({
							constName,
							propName,
							value: value.replace(/'/g, "")
						}))
						.map(color => ({
							...color,
							value: standardLighten(
								standardTransparent(fromHex(color.value))
							)
						}))
						.map((color, index, colors) => ({
							...color,
							value: stringNull(constantMap(color.value, colors))
						}))
						.filter(({ value }) => value !== null)
						.map(color => ({
							...color,
							value: standardLength(
								lightenHex(
									transparentHex(newColorHex(color.value))
								)
							)
						}))
						.reduce(
							(output, { propName, value }) => ({
								...output,
								[propName]: value
							}),
							{}
						)
				: {};
		});
