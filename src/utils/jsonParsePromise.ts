import { parse } from "json5";

export const jsonParsePromise = (string: string) =>
	Promise.resolve(parse<any>(string));
