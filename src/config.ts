import { invertMap } from "./helpers";

/**
 * Repo base URL
 */
const repositoryBase: string = "https://raw.githubusercontent.com";

/**
 * VSCode git repository URL.
 */
const repository: string = `${repositoryBase}/Microsoft/vscode/master`;

/**
 * Repository directory with default themes.
 */
const themeDefaults: string = `${repository}/extensions/theme-defaults/themes`;

/**
 * JSON URL for defaults colors for dark scheme.
 *
 * @export
 */
export const defaultsUrl: string = `${themeDefaults}/dark_defaults.json`;

/**
 * JSON URL for Dark theme.
 *
 * @export
 */
export const vsUrl: string = `${themeDefaults}/dark_vs.json`;

/**
 * JSON URL for Dark+ theme.
 *
 * @export
 */
export const plusUrl: string = `${themeDefaults}/dark_plus.json`;

/**
 * Color map (material color = colors to be replaced).
 *
 * @export
 */
export const colorMap = invertMap({
	// Red
	"#F44336": ["#F44747", "#3C2120"], // 500
	"#D32F2F": ["#651F1C"], // 700
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
	"#388E3C": ["#4E5433"], // 700
	"#1B5E20": ["#3B3E2B"], // 900
	// Light Blue
	"#03A9F4": ["#6796E6", "#2F7AB8"],
	// Cyan
	"#00BCD4": ["#9CDCFE"],
	// Teal
	"#009688": ["#4EC9B0"],
	// Light Green
	"#8BC34A": ["#6A9955"],
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
	"#BDBDBD": ["#A6A6A6", "#CCCCCC"], // 400
	"#9E9E9E": ["#D4D4D4", "#585858", "#BBBBBB"], // 500
	"#757575": ["#707070"], // 600
	"#424242": ["#404040", "#333333", "#3C3C3C", "#535C69", "#383B3D"], // 800
	"#212121": ["#292929", "#252526", "#1E1E1E"], // 900
	// Blue Grey
	"#607D8B": ["#808080"], // 500
	"#37474F": ["#2D5176"], // 800
	"#263238": ["#27394C"] // 900
});
