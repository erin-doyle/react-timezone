import moment from 'moment-timezone';


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

export default tzMaps;
