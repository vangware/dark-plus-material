import { EMPTY_OBJECT, EMPTY_STRING, jsonParsePromise } from "@vangware/micro";
import { writeFile } from "fs";
import fetch from "node-fetch";
import { promisify } from "util";
import baseTheme from "./base/baseTheme";
import colorRegistry from "./base/colorRegistry";
import editorColorRegistry from "./base/editorColorRegistry";
import exceptionWidget from "./base/exceptionWidget";
import suggestWidget from "./base/suggestWidget";
import { defaultsUrl, plusUrl, vsUrl } from "./config";
import { colorMap } from "./config/colorMap";
import notAllowedOrDeprecated from "./config/notAllowedOrDeprecated";
import opacityMap from "./config/opacityMap";
import { removeDuplicatedColors, replaceColors } from "./utils";

/**
 * Promisified fs.writeFile.
 */
const writeFileAsync = promisify(writeFile);

Promise.all([
	baseTheme,
	editorColorRegistry,
	colorRegistry,
	exceptionWidget,
	suggestWidget,
	...[defaultsUrl, vsUrl, plusUrl].map(url =>
		fetch(url)
			.then(response => response.text())
			/* TEMPORARY FIX BECAUSE dark_vs.json IS BROKEN */
			.then(responseText =>
				responseText.replace(
					`"entity.name.operator.custom-literal.string",`,
					`"entity.name.operator.custom-literal.string"`
				)
			)
			// tslint:disable-next-line: no-unnecessary-callback-wrapper no-any
			.then(json => jsonParsePromise<any>(json))
	)
])
	.then(
		([
			baseTheme,
			colorRegistry,
			editorColorRegistry,
			exceptionWidget,
			suggestWidget,
			defaults,
			vs,
			plus
		]) => ({
			defaults: {
				...baseTheme,
				...colorRegistry,
				...editorColorRegistry,
				...exceptionWidget,
				...suggestWidget,
				...defaults.colors
			},
			vs: vs.tokenColors,
			plus: plus.tokenColors
		})
	)
	.then(({ defaults, vs, plus }) => ({
		colors: Object.keys(defaults)
			.filter(
				key =>
					key.includes(".") && !notAllowedOrDeprecated.includes(key)
			)
			.sort()
			.map(key => ({ key, value: defaults[key] }))
			.map(color => ({
				...color,
				value: color.value.includes("#")
					? color.value.substr(0, 7).toUpperCase()
					: color.value,
				opacity:
					color.value.substr(7) ||
					opacityMap[color.key] ||
					EMPTY_STRING
			}))
			.reduce(
				(
					colors,
					{
						key,
						opacity,
						value
					}: { key: string; opacity: string; value: string }
				) => ({
					...colors,
					[key]: colorMap[value]
						? `${colorMap[value]}${
								opacity
									? opacity.padEnd(2, "0").toUpperCase()
									: EMPTY_STRING
						  }`
						: `${value}[INVALID]`
				}),
				EMPTY_OBJECT
			),
		tokenColors: removeDuplicatedColors([...vs, ...plus].map(replaceColors))
	}))
	.then(({ colors, tokenColors }) => ({
		$schema: "vscode://schemas/color-theme",
		name: "Dark+ Material",
		colors,
		tokenColors
	}))
	.then(theme =>
		writeFileAsync(
			`${__dirname}/../dark-plus-material.json`,
			JSON.stringify(theme, null, "  ")
		)
	)
	.then(() => console.log("dark-plus-material.json done!"))
	.catch(e => console.error("Error with dark-plus-material.json update", e));
