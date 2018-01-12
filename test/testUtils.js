import moment from 'moment';

const IS_DAYLIGHT_SAVING = moment().isDST();
export const EASTERN_TZ = IS_DAYLIGHT_SAVING ? 'EDT' : 'EST';
export const PACIFIC_TZ = IS_DAYLIGHT_SAVING ? 'PDT' : 'PST';
export const CENTRAL_TZ = IS_DAYLIGHT_SAVING ? 'CDT' : 'CST';
export const NEWFOUNDLAND_TZ = IS_DAYLIGHT_SAVING ? 'NDT' : 'NST';
