import { writeFile } from "fs";
import fetch from "node-fetch";
import { promisify } from "util";
import baseTheme from "./base/baseTheme";
import colorRegistry from "./base/colorRegistry";
import debugToolbar from "./base/debugToolbar";
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
	debugToolbar,
	exceptionWidget,
	suggestWidget,
	...[defaultsUrl, vsUrl, plusUrl].map(url =>
		fetch(url).then(response => response.json())
	)
])
	.then(
		([
			baseTheme,
			colorRegistry,
			editorColorRegistry,
			debugToolbar,
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
				...debugToolbar,
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
				opacity: color.value.substr(7) || opacityMap[color.key] || ""
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
