import moment from 'moment-timezone';

import { head } from './func';
import tzMaps from '../data/timezoneData';


const tzSearch = ({ city, zoneName, zoneAbbr }) => (
    // TODO: use a faster search algorithm
    tzMaps.filter(tzMap => (
        ((city && tzMap.city === city) || !city) &&
        ((zoneName && tzMap.zoneName === zoneName) || !zoneName) &&
        ((zoneAbbr && tzMap.zoneAbbr === zoneAbbr) || !zoneAbbr)
    ))
);

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
    if (!userTz || userTz === 'UTC') return head(tzSearch({ zoneName: 'Etc/Greenwich' }));

    return head(tzSearch({ zoneName: userTz }));
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
    tzSearch,
    guessUserTz,
    tzMaps,
    isValueInCityOrZone,
    compareByCityAndZone
};

