import { arrayMap, isNull, stringMapReplace } from "@vangware/utils";
import * as Color from "color";
import fetch from "node-fetch";

/**
 * Parse string nulls.
 * @param value Value to parse.
 */
export const stringNull = (value: string): string =>
	// eslint-disable-next-line no-null/no-null
	value.includes("null") ? null : value;

/**
 * Makes all transparent calls the same.
 * @param value
 */
export const standardTransparent = (value: string) =>
	value.replace(
		/(?<transparentFunction>transparent\()(?<untilComma>[^,]+)(?:, )(?<digits>[\d.]+)(?<closingParenthesis>\))/u,
		"$2.$1$3$4"
	);

/**
 * Makes all lighten calls the same.
 * @param value
 */
export const standardLighten = (value: string) =>
	value.replace(
		/(?<lightenFunction>lighten\()(?<untilComma>[^,]+)(?:, )(?<digits>[\d.]+)(?<closingParenthesis>\))/u,
		"$2.$1$3$4"
	);

/**
 * Replace `Color.fromHex` with actual hex.
 * @param value
 */
export const fromHex = (value: string) =>
	value.replace(/(?:Color\.fromHex\()(?<hexColor>#\w+)(?:\))/u, "$1");

/**
 * Transform standard transparent calls into hex transparency.
 * @param value
 */
export const transparentHex = (value: string) => {
	const [color, ...transparentValues] = value.split(".transparent");
	const transparency = transparentValues.length
		? arrayMap((val: string) => val.match(/[\d.]+/u)[0])(transparentValues)
				.map(parseFloat)
				.reduce((total, val) => total * val, 1)
		: false;

	return transparency
		? `${color.substr(0, 7)}${Math.round(transparency * 255)
				.toString(16)
				.padStart(2, "0")
				.toUpperCase()}`
		: value;
};

export const lightenHex = (value: string) => {
	const [color, ...lightenValues] = value.split(".lighten");
	const light = lightenValues.length
		? arrayMap((val: string) => val.match(/[\d.]+/u)[0])(lightenValues)
				.map(parseFloat)
				.reduce((total, val) => total * val, 1)
		: false;

	return light ? Color(color).lighten(light).hex() : value;
};

export const newColorHex = (value: string) => {
	const rgba = value.replace(
		/new Color\(new RGBA\((?<r>\d+), (?<g>\d+), (?<b>\d+), (?<a>\d+\.\d+)/u,
		"$1|$2|$3|$4"
	);
	const [r, g, b, a] = rgba.includes("|") ? rgba.split("|") : Array(4);

	return rgba.includes("|") ? Color.rgb({ b, g, r }).alpha(a).hex() : value;
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
 * Replace appearances of some variables and values because I'm lazy and
 * I don't want to parse them.
 * @param tsFileText TS theme file.
 */
export const missingColors = (tsFileText: string) =>
	stringMapReplace({
		"Color.black": "'#000000'",
		"Color.transparent": "'#00000000'",
		"Color.white": "'#FFFFFF'",
		contentTransparency: "0.4",
		contrastBorder: "'null'",
		"dark: commonBaseColor": "dark: '#606060'",
		"dark: currentBaseColor": "dark: '#40C8AE'",
		"dark: defaultInsertColor": "dark: '#9BB95533'",
		"dark: defaultRemoveColor": "dark: '#FF000033'",
		"dark: editorBackground": "dark: '#1E1E1E'",
		"dark: editorForeground": "dark: '#BBBBBB'",
		"dark: editorWidgetBackground": "dark: '#252526'",
		"dark: editorWidgetBorder": "dark: '#454545'",
		"dark: findMatchColorDefault": "dark: '#F6B94DB3'",
		"dark: incomingBaseColor": "dark: '#40A6FF'",
		"dark: listFocusBackground": "dark: '#062F4A'",
		"dark: listHighlightForeground": "dark: '#0097fb'",
		"dark: rulerRangeDefault": "dark: '#007ACC99'",
		"dark: textLinkForeground": "dark: '#3794FF'",
		editorErrorForeground: "'#F48771'",
		editorFindMatchHighlightBorder: "'#EA5C0055'",
		editorFindMatchHighlight: "'#EA5C0055'",
		editorInfoForeground: "'#2196F3'",
		editorWarningForeground: "'#FFEB3B'",
		editorWidgetForeground: "'#BDBDBD'",
		rulerTransparency: "1"
	})(tsFileText);

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
					isNull(matchedColorDefs) ? " Error!" : ""
				}`
			);

			return arrayMap((registeredColor: string) =>
				registeredColor.replace(colorGroups, colorTemplate)
			)(matchedColorDefs)
				.map(mapped => mapped.split("|"))
				.map(([constName, propName, value]) => ({
					constName,
					propName,
					value: value.replace(/'/gu, "")
				}))
				.map(color => ({
					...color,
					value: standardLighten(
						standardTransparent(fromHex(color.value))
					)
				}))
				.map((color, _index, colors) => ({
					...color,
					value: stringNull(constantMap(color.value, colors))
				}))
				.filter(({ value }) => !isNull(value))
				.map(color => ({
					...color,
					value: standardLength(
						lightenHex(transparentHex(newColorHex(color.value)))
					)
				}))
				.reduce(
					(output, { propName, value }) => ({
						...output,
						[propName]: value
					}),
					{}
				);
		});
