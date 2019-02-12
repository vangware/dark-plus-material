/**
 * Hex color to RGB object.
 * @param hex Hex value in format #RRGGBB or #RRGGBBAA
 */
export const hexToRGB = (hex: string) => {
	const [r, g, b] = hex
		.replace(/#(\w{2})(\w{2})(\w{2})/, "$1|$2|$3")
		.split("|")
		.map(rgb => parseInt(rgb, 16));
	return { hex, r, g, b };
};

export default hexToRGB;
