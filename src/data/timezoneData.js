import moment from 'moment-timezone';


// loads moment-timezone's timezone data, which comes from the
// IANA Time Zone Database at https://www.iana.org/time-zones
moment.tz.load({ version: 'latest', zones: [], links: [] });

const tzNames = (() => {
    //  We want to subset the existing timezone data as much as possible, both for efficiency
    //  and to avoid confusing the user. Here, we focus on removing redundant timezone names
    //  and timezone names for timezones we don't necessarily care about, like Antarctica, and
    //  special timezone names that exist for convenience.
    const scrubbedPrefixes = ['Antarctica', 'Arctic', 'Chile'];
    const scrubbedSuffixes = ['ACT', 'East', 'Knox_IN', 'LHI', 'North', 'NSW', 'South', 'West'];

    const getZoneName = zone => ((typeof zone === 'string') ? zone.split('|')[0] : zone.name);
    const onlyCanonicalZones = zone => zone.indexOf('/') >= 0;
    const nonBlacklistedPrefixes = zone => !(scrubbedPrefixes.indexOf(zone.split('/')[0]) >= 0);
    const nonBlacklistedSuffixes = zone => !(scrubbedSuffixes.indexOf(zone.split('/').slice(-1)[0]) >= 0);

    // Filter using _zones in this manner in order to reduce the number of duplicated and deprecated timezone names
    // until moment-timezone provides a better way: https://github.com/moment/moment-timezone/issues/227
    return Object.values(moment.tz._zones) // eslint-disable-line no-underscore-dangle
        .map(getZoneName)
        .filter(zone =>
            onlyCanonicalZones(zone)
            && nonBlacklistedPrefixes(zone)
            && nonBlacklistedSuffixes(zone)
        );
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

export default tzMaps;
