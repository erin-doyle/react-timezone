/**
 * True or false as to whether the input value is contained within the string.
 * @param {string} input
 * @param {string} string
 * @return {boolean}
 */
const isMatch = (input, string) => {
    if (!input || !string || typeof input !== 'string' || typeof string !== 'string') return false;
    const valueToSearchFor = input.toLowerCase();
    const stringToSearchIn = string.toLowerCase();

    return stringToSearchIn.indexOf(valueToSearchFor) !== -1;
};

/**
 * Predicate function to pass to a filter() Array function returning
 * true or false as to whether the text matches the item.
 * @param {string|Object} item - the item to search within
 * @param {string} text - the text to search for in the item
 * @param {Object} filterOptions - options used for filtering which include:
 *      {Array} fields - the fields to use to search against on the item
 *      {number} minLength - the minimum length the text must be before filtering is allowed
 * @return {boolean}
 */
const filterBy = (item, text, filterOptions) => {
    const fields = filterOptions.fields.slice();
    const minLength = filterOptions.minLength || 1;

    if (text.length < minLength) return false;

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
