#!/usr/bin/env node

const request = require("request");
const { writeFile } = require("fs");

// External files
const repoBase = "https://raw.githubusercontent.com/Microsoft/vscode/master/extensions/theme-defaults/themes";
const darkDefaults = `${repoBase}/dark_defaults.json`;
const darkVS = `${repoBase}/dark_vs.json`;
const darkPlus = `${repoBase}/dark_plus.json`;

const colorMap = {
	"#000080": "#3F51B5",
	"#1E1E1E": "#212121",
	"#4EC9B0": "#009688",
	"#569CD6": "#2196F3",
	"#608B4E": "#8BC34A",
	"#646695": "#9C27B0",
	"#6796E6": "#03A9F4",
	"#808080": "#607D8B",
	"#9CDCFE": "#00BCD4",
	"#B5CEA8": "#CDDC39",
	"#C586C0": "#E91E63",
	"#CE9178": "#FFC107",
	"#D16969": "#FF5722",
	"#D4D4D4": "#9E9E9E",
	"#D7BA7D": "#FF9800",
	"#DCDCAA": "#FFEB3B",
	"#F44747": "#F44336"
};

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
	}
	if (foreground) {
		settings.foreground = colorMap[foreground.toUpperCase()];
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
	const darkDefaultsSettings = JSON.parse(bodyDefaults).colors;
	const theme = {
		$schema: "vscode://schemas/color-theme",
		name: "Dark+ Material",
		colors: {
			editorBackground: colorMap[darkDefaultsSettings.editorBackground.toUpperCase()],
			editorForeground: colorMap[darkDefaultsSettings.editorForeground.toUpperCase()],
		}
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
