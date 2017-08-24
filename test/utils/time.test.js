import moment from 'moment-timezone';

import { head, last } from '../../src/utils/func';
import timeHelper from '../../src/utils/time';


const tz = timeHelper.guessUserTz();
const time24 = moment().tz(tz.zoneName).format('HH:mmA').split(/:/);
const time12 = moment().tz(tz.zoneName).format('hh:mmA').split(/:/);

const modes = [24, 12];
const meridies = ['AM', 'PM']; // yes, this is the correct plural 😜

describe('Time utils', () => {
    describe('getCurrentTime()', () => {
        it('should return the current time as a string in 24h format', () => {
            const timeString = timeHelper.current();
            expect(timeString).toBe(time24.join(':').slice(0, 5));
        });
    });

    describe('given a call to getValidTimeData()', () => {
        describe('when passed no arguments', () => {
            it('then it should default to the current local time in 24h mode', () => {
                const testTimeData = timeHelper.time();

                const timeData = {
                    hour12: head(time12).replace(/^0/, ''),
                    hour24: head(time24),
                    minute: last(time24).slice(0, 2),
                    meridiem: last(time12).slice(2),
                    mode: 24,
                    timezone: tz.zoneName
                };

                expect(testTimeData).toEqual(timeData);
            });
        });

        describe('when passed only a mode', () => {
            it('then it should default to the current local time, with user-specified mode', () => {
                modes.forEach((mode) => {
                    const testTimeData = timeHelper.time(undefined, undefined, mode);
                    const timeData = {
                        hour12: head(time12).replace(/^0/, ''),
                        hour24: head(time24),
                        minute: last(time24).slice(0, 2),
                        meridiem: last(time12).slice(2),
                        mode,
                        timezone: tz.zoneName
                    };

                    expect(testTimeData).toEqual(timeData);
                });
            });
        });

        describe('when we passed only a meridiem', () => {
            it('then it should default to the current local time, in 12h mode, ignoring meridiem', () => {
                meridies.forEach((meridiem) => {
                    const testTimeData = timeHelper.time(undefined, meridiem);
                    const timeData = {
                        hour12: head(time12).replace(/^0/, ''),
                        hour24: head(time24),
                        minute: last(time24).slice(0, 2),
                        meridiem: last(time12).slice(2),
                        mode: 12,
                        timezone: tz.zoneName
                    };

                    expect(testTimeData).toEqual(timeData);
                });
            });
        });
    });

    describe('Test getValidateTime func', () => {
        it('should return 00 when get undefined', () => {
            expect(timeHelper.validate()).toBe('00');
        });

        it('should return 00 when get NaN', () => {
            expect(timeHelper.validate('abc')).toBe('00');
        });

        it('should return itself when validate', () => {
            expect(timeHelper.validate('12')).toBe('12');
        });

        it('should return a string with 0', () => {
            expect(timeHelper.validate('2')).toBe('02');
        });
    });

    describe('Test getValidateIntTime func', () => {
        it('should return 0', () => {
            expect(timeHelper.validateInt('a')).toBe(0);
        });

        it('should return int', () => {
            expect(timeHelper.validateInt('11')).toBe(11);
        });

        it('should return 0', () => {
            expect(timeHelper.validateInt(null)).toBe(0);
        });
    });
});

