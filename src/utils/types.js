import PropTypes from 'prop-types';


const { string } = PropTypes;

export const timezoneShape = {
    city: string.isRequired,
    zoneName: string.isRequired,
    zoneAbbr: string.isRequired
};
