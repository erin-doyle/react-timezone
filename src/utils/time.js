import moment from 'moment-timezone';

import tzMaps from '../data/timezoneData';

import { head } from './func';
import searchHelper from './search';


const getMatchChecker = (timezoneToSearch, fieldsToFilterBy) => (
    filterField => (
        searchHelper.isMatch(fieldsToFilterBy[filterField], timezoneToSearch[filterField])
    )
);

/**
 * Performs a search for any timezone objects that match the filter criteria
 * provided in the filterFields argument
 * @param {Object} filterFields
 * @returns {Array} of matching timezone objects
 */
const tzSearch = filterFields => (
    // TODO: use Observable
    tzMaps.filter((timezone) => {
        const isFieldMatchToTimezone = getMatchChecker(timezone, filterFields);
        return Object.keys(filterFields).every(isFieldMatchToTimezone);
    })
);

const guessUserTz = () => {
    // User-Agent sniffing is not always reliable, but is the recommended technique
    // for determining whether or not we're on a mobile device according to MDN
    // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Mobile_Tablet_or_Desktop
    const isMobile = typeof window.navigator !== 'undefined'
        ? !!window.navigator.userAgent.match(/Mobi/)
        : false;

    const supportsIntl = window.Intl && typeof window.Intl === 'object';

    let userTz;

    if (isMobile && supportsIntl) {
        // moment-timezone gives preference to the Intl API regardless of device type,
        // so unset window.Intl.DateTimeFormat().resolvedOptions() to trick moment-timezone into using its fallback
        // see https://github.com/moment/moment-timezone/issues/441 and
        // see https://github.com/moment/moment-timezone/issues/517
        // TODO: Clean this up when that issue is resolved
        const originalDateTimeFormat = window.Intl.DateTimeFormat;

        window.Intl.DateTimeFormat = function newDateTimeFormat() {
            return {
                resolvedOptions() { return {}; }
            };
        };

        userTz = moment.tz.guess();

        window.Intl.DateTimeFormat = originalDateTimeFormat;
    } else {
        userTz = moment.tz.guess();
    }

    // return UTC if we're unable to guess or the system is using UTC
    if (!userTz || userTz === 'UTC') return head(tzSearch({ zoneName: 'Etc/UTC' }));

    return head(tzSearch({ zoneName: userTz }));
};

/**
 * Returns true or false as to whether the searchValue is contained in
 * the city or zone abbreviation of the timezone
 * @param {Object} timezone
 * @param {string} searchValue
 * @param {number} [minLength] - the minimum length the text must be before filtering is allowed
 * @return {boolean}
 */
const isValueInCityOrZone = (timezone, searchValue, minLength = 1) => {
    if (!timezone || !searchValue) return false;

    return searchHelper.filterBy(
        timezone,
        searchValue,
        { fields: ['city', 'zoneAbbr'], minLength }
    );
};

/**
 * Compares the city and zoneAbbr of the two provided timezones and returns:
 *      1: when timezone1 has a city or zoneAbbr less than timezone2
 *      -1: when timezone1 has a city or zoneAbbr greater than timezone2
 *      0: when timezone1 and timezone2 are equal
 * @param {object} timezone1
 * @param {object} timezone2
 * @return {number}
 */
const compareByCityAndZone = (timezone1, timezone2) => {
    const city1 = timezone1.city.toLowerCase();
    const zone1 = timezone1.zoneAbbr.toLowerCase();
    const city2 = timezone2.city.toLowerCase();
    const zone2 = timezone2.zoneAbbr.toLowerCase();

    // first compare city
    if (city1 < city2) return -1;
    if (city1 > city2) return 1;

    // city must be equal

    // next compare zoneAbbr
    if (zone1 < zone2) return -1;
    if (zone1 > zone2) return 1;

    // zoneAbbr must be equal

    // treat both timezones as "equivalent"
    return 0;
};

export default {
    tzSearch,
    guessUserTz,
    tzMaps,
    isValueInCityOrZone,
    compareByCityAndZone
};

