#!/usr/bin/env node

const request = require("request");
const { writeFile } = require("fs");
const missingColors = require("./missing-colors.json");

// External files
const repoBase = "https://raw.githubusercontent.com/Microsoft/vscode/master/extensions/theme-defaults/themes";
const darkDefaults = `${repoBase}/dark_defaults.json`;
const darkVS = `${repoBase}/dark_vs.json`;
const darkPlus = `${repoBase}/dark_plus.json`;

const colorMap = (colorMap => Object.keys(colorMap).reduce(
	(map, color) => Object.assign(
		map,
		colorMap[color].reduce(
			(base, baseColor) => Object.assign(base, {
				[baseColor]: color
			}),
			Object.create(null)
		)
	),
	Object.create(null)
))({
	// Red
	"#F44336": ["#F44747", "#3C2120"], // 500
	"#B71C1C": ["#471F1D"], // 900
	// Pink
	"#E91E63": ["#C586C0"],
	// Purple
	"#9C27B0": ["#646695"],
	// Indigo
	"#3F51B5": ["#000080"],
	// Blue
	"#2196F3": ["#569CD6", "#297FC9"],
	// Green
	"#1B5E20": ["#3B3E2B"], // 900
	// Light Blue
	"#03A9F4": ["#6796E6", "#2F7AB8"],
	// Cyan
	"#00BCD4": ["#9CDCFE"],
	// Teal
	"#009688": ["#4EC9B0"],
	// Light Green
	"#8BC34A": ["#608B4E"],
	// Lime
	"#CDDC39": ["#B5CEA8"],
	// Yellow
	"#FFEB3B": ["#DCDCAA"],
	// Amber
	"#FFC107": ["#CE9178"],
	// Orange
	"#FF9800": ["#D7BA7D"],
	// Deep Orange
	"#FF5722": ["#D16969"],
	// Brown:
	"#795548": ["#4B382C", "#282E32"],
	// White
	"#FFFFFF": ["#FFFFFF", "#ADADAD", "#AEAFAD"],
	// Grey
	"#9E9E9E": ["#D4D4D4", "#585858"], // 500
	"#424242": ["#404040", "#333333", "#3C3C3C", "#535C69"], // 800
	"#212121": ["#1E1E1E"], // 900
	// Blue Grey
	"#607D8B": ["#808080"], // 500
	"#37474F": ["#2D5176"], // 800
	"#263238": ["#27394C"], // 900
	// N/A
	"#FF00FF": ["#3A3D41", "#ADD6FF26", "#3A3D41", "#383B3D"]
});

/**
 * Removes unwanted properties and set the material colors based on colorMap.
 *
 * @param {any} { scope, settings }
 * @returns {any} { scope, settings }
 */
const cleanAndSet = ({ scope, settings }) => {
	const { background, foreground } = settings;
	if (background) {
		settings.background = colorMap[background.toUpperCase()];
		if (settings.background === void 0) {
			throw new Error(`${background} is missing in colorMap.`);
		}
	}
	if (foreground) {
		settings.foreground = colorMap[foreground.toUpperCase()];
		if (settings.foreground === void 0) {
			throw new Error(`${foreground} is missing in colorMap.`);
		}
	}
	return { scope, settings };
};

/**
 * Transform settings to a plain oject (to address duplicates).
 *
 * @param {any} out
 * @param {any} setting
 * @returns {any}
 */
const settingsToObject = settings => settings.reduce((out, setting) => {
	if (setting.scope === void 0) {
		out.vscode = Object.assign(setting.settings, {
			invisibles: "#424242"
		});
	} else {
		const scopes = (Array.isArray(setting.scope) ? setting.scope : [setting.scope]);
		scopes.forEach(key => {
			out[key] = out[key] ? Object.assign(out[key], setting.settings) : setting.settings;
		});
	}
	return out;
}, Object.create(null));

/**
 * Transform object to settings file.
 *
 * @param {any} setting
 */
const objectToSettings = settings => Object.keys(settings).map(setting => setting !== "vscode" ? ({
	scope: setting,
	settings: settings[setting]
}) : ({
	settings: settings[setting]
}))

request(darkDefaults, (errorDefaults, responseDefaults, bodyDefaults) => {
	const darkDefaultColors = Object.assign(JSON.parse(bodyDefaults).colors, missingColors);
	const themeColors = Object.keys(darkDefaultColors).reduce((colors, property) => Object.assign(colors, {
		[property]: colorMap[darkDefaultColors[property].toUpperCase()],
	}), {});
	Object.keys(themeColors).forEach(property => {
		const color = themeColors[property];
		if (color === void 0) {
			throw new Error(`${property} (${darkDefaultColors[property].toUpperCase()}) is missing in colorMap.`);
		}
	});
	const theme = {
		$schema: "vscode://schemas/color-theme",
		name: "Dark+ Material",
		colors: themeColors
	};
	request(darkVS, (errorVS, responseVS, bodyVS) => {
		const darkVSSettings = JSON.parse(bodyVS).tokenColors;
		request(darkPlus, (errorPlus, responsePlus, bodyPlus) => {
			const darkPlusSettings = JSON.parse(bodyPlus).tokenColors;
			const settings = objectToSettings(settingsToObject(darkVSSettings
				.concat(darkPlusSettings).map(setting => cleanAndSet(setting))));
			writeFile(
				`${__dirname}/dark-plus-material.json`,
				JSON.stringify(Object.assign(theme, { settings }), 2, " "),
				error => {
					console.log(!error ? "dark-plus-material.json done!" : "Error with dark-plus-material.json");
				}
			);
		});
	});
});
