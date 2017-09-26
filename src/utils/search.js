/**
 * True or false as to whether the input value is contained within the string.
 * @param {string} input
 * @param {string} string
 * @return {boolean}
 */
const isMatch = (input, string) => {
    const valueToSearchFor = input.toLowerCase();
    const stringToSearchIn = string.toLowerCase();

    return stringToSearchIn.indexOf(valueToSearchFor) !== -1;
};


const filterBy = (item, text, filterOptions) => {
    const fields = filterOptions.fields.slice();

    if (fields.length) {
        return fields.some((field) => {
            let value = item[field];

            if (typeof value !== 'string') {
                console.warn(
                    false,
                    `Fields passed to 'filterBy' should have string values. \
                    Value will be converted to a string; results may be unexpected.`
                );

                // Coerce to string since `toString` isn't null-safe.
                value += '';
            }

            return isMatch(text, value);
        });
    }

    return isMatch(text, item);
};

export default {
    isMatch,
    filterBy
};
