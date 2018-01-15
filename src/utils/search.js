/**
 * True or false as to whether the search value is contained within the string.
 * @param {string} searchValue
 * @param {string} string
 * @return {boolean}
 */
const isMatch = (searchValue, string) => {
    if (!searchValue || !string || typeof searchValue !== 'string' || typeof string !== 'string') return false;
    const valueToSearchFor = searchValue.toLowerCase();
    const stringToSearchIn = string.toLowerCase();

    return stringToSearchIn.indexOf(valueToSearchFor) !== -1;
};

/**
 * Predicate function to pass to a filter() Array function returning
 * true or false as to whether the text matches the item.
 * @param {string|Object} item - the item to search within
 * @param {string} searchValue - the text to search for in the item
 * @param {Object} filterOptions - options used for filtering which include:
 *      {Array} fields - the fields to use to search against on the item
 *      {number} minLength - the minimum length the text must be before filtering is allowed
 * @return {boolean}
 */
const filterBy = (item, searchValue, filterOptions) => {
    const fields = filterOptions.fields.slice();
    const minLength = filterOptions.minLength || 1;

    if (searchValue.length < minLength) return false;

    if (fields.length) {
        return fields.some((field) => {
            let sectionToSearch = item[field];

            if (typeof sectionToSearch !== 'string') {
                console.warn( // eslint-disable-line
                    false,
                    `Fields passed to 'filterBy' should have string values. \
                    Value will be converted to a string; results may be unexpected.`
                );

                // Coerce to string since `toString` isn't null-safe.
                sectionToSearch += '';
            }

            return isMatch(searchValue, sectionToSearch);
        });
    }

    return isMatch(searchValue, item);
};

export default {
    isMatch,
    filterBy
};
