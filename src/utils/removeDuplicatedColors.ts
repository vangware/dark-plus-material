import { TokenColor } from "../interfaces";
import { expandTokenColors } from "./expandTokenColors";
import { flattenTokenColors } from "./flattenTokenColors";

/**
 * Removes duplicated colors by flatting and then expanding tokenColors.
 * @param tokenColors Token color array.
 * @returns Token color array.
 */
export const removeDuplicatedColors = (
	tokenColors: readonly TokenColor[]
): readonly TokenColor[] => expandTokenColors(flattenTokenColors(tokenColors));

export default removeDuplicatedColors;
