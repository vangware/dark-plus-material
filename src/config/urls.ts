/**
 * Repository base URL.
 */
const repositoryBase = "https://raw.githubusercontent.com";

/**
 * VSCode git repository URL.
 */
const repository = `${repositoryBase}/Microsoft/vscode/master`;

/**
 * Repository directory with default themes.
 */
const themeDefaults = `${repository}/extensions/theme-defaults/themes`;

/**
 * Base directory for ts files.
 */
const tsFiles = `${repository}/src/vs`;

/**
 * Base directory for ts files workbench.
 */
const tsWorkbench = `${tsFiles}/workbench`;

/**
 * Base theme configuration (ts file).
 */
export const baseThemeUrl = `${tsWorkbench}/common/theme.ts`;

/**
 * Color registry configuration (ts file).
 */
export const colorRegistryUrl = `${tsFiles}/platform/theme/common/colorRegistry.ts`;

/**
 * Editor color registry (ts file).
 */
export const editorColorRegistryUrl = `${tsFiles}/editor/common/view/editorColorRegistry.ts`;

/**
 * Exceptions Widget theme configuration (ts file).
 */
export const exceptionWidgetUrl = `${tsWorkbench}/contrib/debug/browser/exceptionWidget.ts`;

/**
 * Debug toolbar theme configuration (ts file).
 */
export const debugToolbarUrl = `${tsWorkbench}/contrib/debug/browser/debugToolbar.ts`;

/**
 * Suggests widget theme configuration (ts file).
 */
export const suggestWidgetUrl = `${tsFiles}/editor/contrib/suggest/suggestWidget.ts`;

/**
 * JSON URL for defaults colors for dark scheme.
 */
export const defaultsUrl = `${themeDefaults}/dark_defaults.json`;

/**
 * JSON URL for Dark theme.
 */
export const vsUrl = `${themeDefaults}/dark_vs.json`;

/**
 * JSON URL for Dark+ theme.
 */
export const plusUrl = `${themeDefaults}/dark_plus.json`;
