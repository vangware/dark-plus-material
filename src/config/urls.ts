/**
 * Repository base URL.
 */
const REPOSITORY_BASE = "https://raw.githubusercontent.com";

/**
 * VSCode git repository URL.
 */
const REPOSITORY = `${REPOSITORY_BASE}/Microsoft/vscode/master`;

/**
 * Repository directory with default themes.
 */
const THEME_DEFAULTS = `${REPOSITORY}/extensions/theme-defaults/themes`;

/**
 * Base directory for ts files.
 */
const TS = `${REPOSITORY}/src/vs`;

/**
 * Base directory for ts files workbench.
 */
const TS_WORKBENCH = `${TS}/workbench`;

/**
 * Base directory for ts files editor.
 */
const TS_EDITOR = `${TS}/editor`;

/**
 * Base theme configuration (ts file).
 */
export const BASE_THEME = `${TS_WORKBENCH}/common/theme.ts`;

/**
 * Color registry configuration (ts file).
 */
export const COLOR_REGISTRY = `${TS}/platform/theme/common/colorRegistry.ts`;

/**
 * Editor color registry (ts file).
 */
export const EDITOR_COLOR = `${TS_EDITOR}/common/view/editorColorRegistry.ts`;

/**
 * Exceptions Widget theme configuration (ts file).
 */
// eslint-disable-next-line max-len
export const EXCEPTION_WIDGET = `${TS_WORKBENCH}/contrib/debug/browser/exceptionWidget.ts`;

/**
 * Suggests widget theme configuration (ts file).
 */
export const SUGGEST_WIDGET = `${TS_EDITOR}/contrib/suggest/suggestWidget.ts`;

/**
 * JSON URL for defaults colors for dark scheme.
 */
export const DARK_DEFAULTS = `${THEME_DEFAULTS}/dark_defaults.json`;

/**
 * JSON URL for Dark theme.
 */
export const DARK_VS = `${THEME_DEFAULTS}/dark_vs.json`;

/**
 * JSON URL for Dark+ theme.
 */
export const DARK_PLUS = `${THEME_DEFAULTS}/dark_plus.json`;
