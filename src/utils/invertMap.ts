/**
 * Takes a map { key: [value1, value2] } and returns { value1: key, value2: key }
 * @param source Source map.
 * @returns Inverted map.
 */
export const invertMap = (source: object) =>
	Object.keys(source).reduce(
		(map, item) => ({
			...map,
			...source[item].reduce(
				(base, baseItem) => ({ ...base, [baseItem]: item }),
				{}
			)
		}),
		{}
	);
