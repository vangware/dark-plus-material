import { readFile, writeFile } from "node:fs/promises";
import type baseJson from "./base.json";
import { closestRGBColor } from "./closestRGBColor.js";

export default readFile(new URL("./base.json", import.meta.url), "utf-8")
	.then(JSON.parse as (content: string) => typeof baseJson)
	.then(({ colors, name, tokenColors, semanticTokenColors, ...data }) => ({
		...data,
		colors: Object.fromEntries(
			Object.entries(colors).map(([key, value]) => [
				key,
				closestRGBColor(value),
			]),
		),
		name: "Dark+ Material",
		tokenColors: tokenColors.map(({ scope, settings }) => ({
			scope,
			settings: {
				...settings,
				foreground:
					typeof settings.foreground === "string"
						? closestRGBColor(settings.foreground)
						: undefined,
			},
		})),
		semanticHighlighting: true,
		semanticTokenColors: Object.fromEntries(
			Object.entries(semanticTokenColors).map(([key, value]) => [
				key,
				closestRGBColor(value),
			]),
		),
	}))
	.then(theme => JSON.stringify(theme, undefined, "\t"))
	.then(content =>
		writeFile(
			new URL("../dark-plus-material.json", import.meta.url),
			content,
			"utf-8",
		),
	);
