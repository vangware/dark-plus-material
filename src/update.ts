import { writeFile } from "fs";
import { promisify } from "util";
import fetch from "node-fetch";
import { defaultsUrl, plusUrl, vsUrl } from "./config";
import { replaceColors, removeDuplicatedColors } from "./utils";
import baseTheme from "./base/baseTheme";
import editorColorRegistry from "./base/editorColorRegistry";
import colorRegistry from "./base/colorRegistry";
import debugToolbar from "./base/debugToolbar";
import exceptionWidget from "./base/exceptionWidget";
import suggestWidget from "./base/suggestWidget";
import { closestMaterial } from "./closestMaterial";
import { colorMap } from "./config/colorMap";
import opacityMap from "./config/opacityMap";

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
			.filter(key => key.includes("."))
			.sort()
			.map(key => ({ key, value: defaults[key] }))
			.map(color => ({
				...color,
				value: color.value.substr(0, 7).toUpperCase(),
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
					[key]: `${colorMap[value] ||
						`${value}|${closestMaterial(value)}|`}${
						opacity ? opacity.padEnd(2, "0").toUpperCase() : ""
					}`
				}),
				{}
			),
		tokenColors: removeDuplicatedColors(
			[...vs, ...plus].map(setting => replaceColors(setting))
		)
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
