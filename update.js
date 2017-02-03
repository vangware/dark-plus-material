#!/usr/bin/env node

const request = require("request");
const { writeFile } = require("fs");

// External files
const repoBase = "https://raw.githubusercontent.com/Microsoft/vscode/master/extensions/theme-defaults/themes";
const darkVS = `${repoBase}/dark_vs.json`;
const darkPlus = `${repoBase}/dark_plus.json`;

const colorMap = {
	"#D4D4D4": "#FFFFFF",
	"#1E1E1E": "#212121",
	"#000080": "#3F51B5",
	"#608B4E": "#8BC34A",
	"#569CD6": "#2196F3",
	"#B5CEA8": "#CDDC39",
	"#646695": "#9C27B0",
	"#D7BA7D": "#FF9800",
	"#9CDCFE": "#00BCD4",
	"#F44747": "#F44336",
	"#CE9178": "#FFC107",
	"#6796E6": "#2962FF",
	"#808080": "#607D8B",
	"#D16969": "#FF5722",
	"#DCDCAA": "#FFEB3B",
	"#4EC9B0": "#009688",
	"#C586C0": "#E91E63"
};

const cleanAndSet = ({ scope, settings }) => {
	if (settings.foreground) {
		settings.foreground = colorMap[settings.foreground.toUpperCase()];
	}
	if (settings.background) {
		settings.background = colorMap[settings.background.toUpperCase()];
	}
	return { scope, settings };
};

request(darkVS, (error, response, body) => {
	const settings = JSON.parse(body).settings.map(settings => cleanAndSet(settings));
	const theme = {
		name: "Dark Visual Studio Material",
		settings
	};
	theme.settings[0].settings.invisibles = "#424242"; // FIXME: This could be better.
	writeFile(`${__dirname}/dark-vs-material.json`, JSON.stringify(theme, 2, " "), error => {
		console.log(!error ? "dark-vs-material.json done!" : "Error with dark-vs-material.json");
	});
});

request(darkPlus, (error, response, body) => {
	const settings = JSON.parse(body).settings.map(settings => cleanAndSet(settings));
	const theme = {
		name: "Dark+ Material",
		include: "./dark-vs-material.json",
		settings
	};
	writeFile(`${__dirname}/dark-plus-material.json`, JSON.stringify(theme, 2, " "), error => {
		console.log(!error ? "dark-plus-material.json done!" : "Error with dark-plus-material.json");
	});
});
