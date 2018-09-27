import { writeFile } from "fs";
import { promisify } from "util";
import fetch from "node-fetch";
import { missingDefaultColors } from "./missingDefaultColors";
import { defaultsUrl, plusUrl, vsUrl, colorMap } from "./config";
import { replaceColors, removeDuplicatedColors } from "./helpers";
import { Theme } from "./interfaces";

/**
 * Promisified fs.writeFile.
 */
const writeFileAsync = promisify(writeFile);

Promise.all([defaultsUrl, vsUrl, plusUrl].map(url => fetch(url)))
	.then(responses =>
		Promise.all<Theme>(responses.map(response => response.json()))
	)
	.then(([defaults, vs, plus]) => ({
		defaults: { ...defaults.colors, ...missingDefaultColors },
		vs: vs.tokenColors,
		plus: plus.tokenColors
	}))
	.then(({ defaults, vs, plus }) => ({
		colors: Object.keys(defaults)
			.map(key => ({ key, value: defaults[key].toUpperCase() }))
			.reduce(
				(colors, { key, value }) => ({
					...colors,
					[key]: colorMap[value] || `MISSING [${value}]`
				}),
				{}
			),
		tokenColors: removeDuplicatedColors(
			[...vs, ...plus].map(setting => replaceColors(setting, colorMap))
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
	.catch(() => console.error("Error with dark-plus-material.json update"));
