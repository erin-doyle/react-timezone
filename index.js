var TimezoneAutocomplete = require('./lib/components/TimezoneAutocomplete').default;
var timezoneShape = require('./lib/utils/types').timezoneShape;
var timezoneData = require('./lib/data/timezoneData');
var timeHelper = require('./lib/utils/time');

module.exports = {
    TimezoneAutocomplete: TimezoneAutocomplete,
    timezoneShape: timezoneShape,
    getAllTimezones: () => timezoneData,
    timezoneSearch: timeHelper.tzSearch,
    guessUserTimezone: timeHelper.guessUserTz,
    isTimezoneMatch: timeHelper.isValueInCityOrZone,
    compareTimezones: timeHelper.compareByCityAndZone
};
