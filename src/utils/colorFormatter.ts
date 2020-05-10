export const colorFormatter = (color: string) =>
	color.length <= 4
		? `${color
				.split("")
				.map(colorPart => colorPart.repeat(2))
				.join("")}`
		: color;
