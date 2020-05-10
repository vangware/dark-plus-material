import { arrayMap, jsonParsePromise } from "@vangware/micro";
import { writeFile } from "fs";
import fetch from "node-fetch";
import * as stripJsonComments from "strip-json-comments";
import { promisify } from "util";
import baseTheme from "./base/baseTheme";
import colorRegistry from "./base/colorRegistry";
import editorColorRegistry from "./base/editorColorRegistry";
import exceptionWidget from "./base/exceptionWidget";
import suggestWidget from "./base/suggestWidget";
import { DARK_DEFAULTS, DARK_PLUS, DARK_VS } from "./config";
import colorMap from "./config/colorMap";
import notAllowedOrDeprecated from "./config/notAllowedOrDeprecated";
import opacityMap from "./config/opacityMap";
import { colorFormatter, removeDuplicatedColors, replaceColors } from "./utils";

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
	...[DARK_DEFAULTS, DARK_VS, DARK_PLUS].map(url =>
		fetch(url)
			.then(response => response.text())
			.then(responseText => {
				console.log(`Parsing ${url} . . .`);
				// eslint-disable-next-line
				return jsonParsePromise<any>(
					stripJsonComments(
						responseText.replace(/,(?=\s*?[\}\]])/gu, "")
					)
				);
			})
	)
])
	.then(
		([
			baseThemeResponse,
			colorRegistryResponse,
			editorColorRegistryResponse,
			exceptionWidgetResponse,
			suggestWidgetResponse,
			defaults,
			vs,
			plus
		]) => ({
			defaults: {
				...baseThemeResponse,
				...colorRegistryResponse,
				...editorColorRegistryResponse,
				...exceptionWidgetResponse,
				...suggestWidgetResponse,
				...defaults.colors
			},
			plus: plus.tokenColors,
			vs: vs.tokenColors
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
				value: `#${colorFormatter(
					color.value.includes("#")
						? color.value.substr(1)
						: color.value
				)}`
			}))
			.map(color => ({
				...color,
				opacity: color.value.substr(7) || opacityMap[color.key] || "",
				value: color.value.substr(0, 7).toUpperCase()
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
									: ""
						  }`
						: `${value}[INVALID]`
				}),
				{}
			),
		tokenColors: removeDuplicatedColors(
			arrayMap(replaceColors)([...vs, ...plus])
		)
	}))
	.then(({ colors, tokenColors }) => ({
		$schema: "vscode://schemas/color-theme",
		colors,
		name: "Dark+ Material",
		tokenColors
	}))
	.then(theme =>
		writeFileAsync(
			`${__dirname}/../dark-plus-material.json`,
			// eslint-disable-next-line no-null/no-null
			JSON.stringify(theme, null, "  ")
		)
	)
	.then(() => console.log("dark-plus-material.json done!"))
	.catch(error =>
		console.error("Error with dark-plus-material.json update", error)
	);
