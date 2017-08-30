import moment from 'moment-timezone';

import { head, last } from './func';


const TIMEZONE_PARTS_DELIMITER = ' - ';

// loads moment-timezone's timezone data, which comes from the
// IANA Time Zone Database at https://www.iana.org/time-zones
moment.tz.load({ version: 'latest', zones: [], links: [] });

const tzNames = (() => {
    //  We want to subset the existing timezone data as much as possible, both for efficiency
    //  and to avoid confusing the user. Here, we focus on removing reduntant timezone names
    //  and timezone names for timezones we don't necessarily care about, like Antarctica, and
    //  special timezone names that exist for convenience.
    const scrubbedPrefixes = ['Antarctica', 'Arctic', 'Chile'];
    const scrubbedSuffixes = ['ACT', 'East', 'Knox_IN', 'LHI', 'North', 'NSW', 'South', 'West'];

    return moment.tz.names()
        .filter(name => name.indexOf('/') >= 0)
        .filter(name => !scrubbedPrefixes.indexOf(name.split('/')[0]) >= 0)
        .filter(name => !scrubbedSuffixes.indexOf(name.split('/').slice(-1)[0]) >= 0);
})();

// We need a human-friendly city name for each timezone identifier
// counting Canada/*, Mexico/*, and US/* allows users to search for
// things like 'Eastern' or 'Mountain' and get matches back
const tzCities = tzNames
    .map(name => ((['Canada', 'Mexico', 'US'].indexOf(name.split('/')[0]) >= 0)
        ? name : name.split('/').slice(-1)[0]))
    .map(name => name.replace(/_/g, ' '));

// Provide a mapping between a human-friendly city name and its corresponding
// timezone identifier and timezone abbreviation as a named export.
// We can fuzzy match on any of these.
const interimTzSet = new Set();
tzCities.forEach((city, index) => {
    const tzMap = {};
    const tzName = tzNames[index];

    tzMap.city = city;
    tzMap.zoneName = tzName;
    tzMap.zoneAbbr = moment().tz(tzName).zoneAbbr();

    interimTzSet.add(tzMap);
});
// the interimTzSet is just used for the purpose of eliminating duplicates
const tzMaps = [...interimTzSet];

const getTzForCity = (city) => {
    const maps = tzMaps.filter(tzMap => tzMap.city === city);
    return head(maps);
};

const getTzForName = (name) => {
    const maps = tzMaps.filter(tzMap => tzMap.zoneName === name);
    return head(maps);
};

const getTzForCityAndZoneAbbr = (city, zoneAbbr) => {
    const maps = tzMaps.filter(tzMap => tzMap.city === city && tzMap.zoneAbbr === zoneAbbr);
    return head(maps);
};

const guessUserTz = () => {
    // User-Agent sniffing is not always reliable, but is the recommended technique
    // for determining whether or not we're on a mobile device according to MDN
    // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Mobile_Tablet_or_Desktop
    const isMobile = global.navigator !== undefined
        ? global.navigator.userAgent.match(/Mobi/)
        : false;

    const supportsIntl = global.Intl !== undefined;

    let userTz;

    if (isMobile && supportsIntl) {
        // moment-timezone gives preference to the Intl API regardless of device type,
        // so unset global.Intl to trick moment-timezone into using its fallback
        // see https://github.com/moment/moment-timezone/issues/441
        // TODO: Clean this up when that issue is resolved
        const globalIntl = global.Intl;
        global.Intl = undefined;
        userTz = moment.tz.guess();
        global.Intl = globalIntl;
    } else {
        userTz = moment.tz.guess();
    }

    // return GMT if we're unable to guess or the system is using UTC
    if (!userTz || userTz === 'UTC') return getTzForName('Etc/Greenwich');

    return getTzForName(userTz);
};

const getTimezoneDisplay = (timezone) => {
    if (!timezone || !timezone.city || !timezone.zoneAbbr) return '';

    return `${timezone.city}${TIMEZONE_PARTS_DELIMITER}${timezone.zoneAbbr}`;
};

const deconstructTimezoneDisplay = (timezoneDisplay) => {
    if (!timezoneDisplay) return undefined;

    const delimiterStart = timezoneDisplay.indexOf(TIMEZONE_PARTS_DELIMITER);
    const delimiterEnd = delimiterStart + TIMEZONE_PARTS_DELIMITER.length;
    const city = timezoneDisplay.substring(0, delimiterStart);
    const zoneAbbr = timezoneDisplay.substring(delimiterEnd);

    if (!city || !zoneAbbr) return undefined;

    return {
        city,
        zoneAbbr
    };
};

const isValueInCityOrZone = (timezone, searchValue) => {
    if (!timezone || !searchValue) return false;

    // the search should ignore case
    const regexSearchValue = new RegExp(searchValue, 'i');

    // TODO: is this sufficient for matching?
    return (
        timezone.city.search(regexSearchValue) !== -1 ||
        timezone.zoneAbbr.search(regexSearchValue) !== -1
    );
};

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
    tzForCity: getTzForCity,
    tzForName: getTzForName,
    tzForCityAndZoneAbbr: getTzForCityAndZoneAbbr,
    guessUserTz,
    tzMaps,
    tzDisplay: getTimezoneDisplay,
    deconstructTzDisplay: deconstructTimezoneDisplay,
    isValueInCityOrZone,
    compareByCityAndZone
};

