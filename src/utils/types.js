import PropTypes from 'prop-types';


const { string, func, shape, arrayOf } = PropTypes;

export const timezoneValuePropTypes = {
    city: string.isRequired,
    zoneName: string.isRequired,
    zoneAbbr: string.isRequired
};

export const timezoneHelperPropTypes = {
    allTimezones: arrayOf(timezoneValuePropTypes),
    change: func.isRequired,
    search: func.isRequired,
    guessCurrent: func.isRequired,
    match: func.isRequired,
    compare: func.isRequired
};

export const timezoneShape = shape({
    value: timezoneValuePropTypes,
    helper: timezoneHelperPropTypes
});
