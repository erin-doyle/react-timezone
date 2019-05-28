import moment from 'moment-timezone';

const isDaylightSaving = timezone => moment().tz(timezone).isDST();
export const EASTERN_TZ = isDaylightSaving('America/New_York') ? 'EDT' : 'EST';
export const PACIFIC_TZ = isDaylightSaving('America/Los_Angeles') ? 'PDT' : 'PST';
export const CENTRAL_TZ = isDaylightSaving('America/Chicago') ? 'CDT' : 'CST';
export const NEWFOUNDLAND_TZ = isDaylightSaving('America/St_Johns') ? 'NDT' : 'NST';
