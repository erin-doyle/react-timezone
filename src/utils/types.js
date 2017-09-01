import PropTypes from 'prop-types';


const { string, func, shape, arrayOf } = PropTypes;

export const timezoneValuePropTypes = {
    city: string.isRequired,
    zoneName: string.isRequired,
    zoneAbbr: string.isRequired
};

export const timezoneHelperPropTypes = {
    allTimezones: arrayOf(timezoneValuePropTypes),
    getByCity: func.isRequired,
    getByName: func.isRequired,
    getByCityAndZoneAbbreviation: func.isRequired,
    guessCurrent: func.isRequired,
    match: func.isRequired,
    compare: func.isRequired
};

export const timezoneShape = shape({
    value: timezoneValuePropTypes,
    helper: timezoneHelperPropTypes
});
