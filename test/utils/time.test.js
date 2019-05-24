/* eslint-disable max-len */ // lots of long test names and that's ok
import { tz as momentTimezone } from 'moment-timezone';

import timeHelper from '../../src/utils/time';
import { EASTERN_TZ } from '../testUtils';

const mockTimezone = {
    city: 'Some City',
    zoneName: 'Some Zone',
    zoneAbbr: 'SOZ'
};
const newYorkTimezone = {
    city: 'New York',
    zoneAbbr: EASTERN_TZ,
    zoneName: 'America/New_York'
};
const greenwhichTimezone = {
    city: 'Greenwich',
    zoneAbbr: 'GMT',
    zoneName: 'Etc/Greenwich'
};
const mockMobileUserAgent = 'Mozilla/5.0 (Linux; Android 4.4.2; GT-I9515L Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36';
const mockDesktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

describe('Time utils', () => {
    describe('tzSearch', () => {
        describe('with city argument', () => {
            it('should return an array of one timezone object containing the provided city', () => {
                const cityToSearchFor = 'New York';
                const result = timeHelper.tzSearch({ city: cityToSearchFor });
                expect(result).toHaveLength(1);
                expect(result[0].city).toEqual(cityToSearchFor);
            });

            it('should return an empty array when a timezone object does not exist containing the provided city', () => {
                const cityToSearchFor = 'Some City that should not exist in the Timezone data';
                const result = timeHelper.tzSearch({ city: cityToSearchFor });
                expect(result).toHaveLength(0);
            });
        });

        describe('with name argument', () => {
            it('should return the first timezone object containing the provided name', () => {
                const nameToSearchFor = 'America/New_York';
                const result = timeHelper.tzSearch({ zoneName: nameToSearchFor });
                expect(result).toHaveLength(1);
                expect(result[0].zoneName).toEqual(nameToSearchFor);
            });

            it('should return an empty array when a timezone object does not exist containing the provided name', () => {
                const nameToSearchFor = 'Some Name that should not exist in the Timezone data';
                const result = timeHelper.tzSearch({ zoneName: nameToSearchFor });
                expect(result).toHaveLength(0);
            });
        });

        describe('with city and abbr arguments', () => {
            it('should return the matching timezone object containing the provided city and zone abbreviation', () => {
                const cityToSearchFor = 'New';
                const zoneToSearchFor = EASTERN_TZ;
                const result = timeHelper.tzSearch({ city: cityToSearchFor, zoneAbbr: zoneToSearchFor });
                expect(result).toHaveLength(1);
                expect(result[0].city).toContain(cityToSearchFor);
                expect(result[0].zoneAbbr).toContain(zoneToSearchFor);
            });

            it('should return an empty array when a timezone object does not exist containing the provided city and zone abbreviation', () => {
                const cityToSearchFor = 'Some City that should not exist in the Timezone data';
                const zoneToSearchFor = 'ABCDEFG';
                const result = timeHelper.tzSearch({ city: cityToSearchFor, zoneAbbr: zoneToSearchFor });
                expect(result).toHaveLength(0);
            });
        });

        describe('with city and name arguments', () => {
            it('should return the matching timezone object containing the provided city and zone name', () => {
                const cityToSearchFor = 'New';
                const zoneToSearchFor = 'America';
                const result = timeHelper.tzSearch({ city: cityToSearchFor, zoneName: zoneToSearchFor });
                expect(result).toHaveLength(2);
                expect(result[0].city).toContain(cityToSearchFor);
                expect(result[0].zoneName).toContain(zoneToSearchFor);
            });

            it('should return an empty array when a timezone object does not exist containing the provided city and zone name', () => {
                const cityToSearchFor = 'Some City that should not exist in the Timezone data';
                const zoneToSearchFor = 'ABCDEFG';
                const result = timeHelper.tzSearch({ city: cityToSearchFor, zoneName: zoneToSearchFor });
                expect(result).toHaveLength(0);
            });
        });

        describe('with filterFields that do not exist', () => {
            it('should return an empty array if passed only filterFields that do not exist on the timezone object', () => {
                const result = timeHelper.tzSearch({
                    fieldOneThatDoesntExist: 'someValue',
                    fieldTwoThatDoesntExist: 'someOtherValue'
                });
                expect(result).toHaveLength(0);
            });

            it('should return an empty array if passed any filterFields that do not exist on the timezone object along with any that do exist', () => {
                const cityToSearchFor = 'New York';
                const zoneToSearchFor = 'EDT';
                const result = timeHelper.tzSearch({
                    fieldOneThatDoesntExist: 'someValue',
                    city: cityToSearchFor,
                    zoneAbbr: zoneToSearchFor
                });
                expect(result).toHaveLength(0);
            });
        });
    });

    describe('guessUserTz', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        describe('when the device is mobile and Intl is supported', () => {
            const originalIntl = window.Intl;
            const mockResolvedOptions = jest.fn();

            beforeEach(() => {
                window.navigator.userAgent = mockMobileUserAgent;
                window.Intl.DateTimeFormat = jest.fn();
            });

            afterAll(() => {
                window.Intl = originalIntl;
            });

            describe('when the user timezone is found', () => {
                let guessedTimezone;

                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => newYorkTimezone.zoneName);
                    guessedTimezone = timeHelper.guessUserTz();
                });

                it('returns the user timezone', () => {
                    expect(guessedTimezone).toEqual(newYorkTimezone);
                });

                it('does not call window.Intl.DateTimeFormat().resolvedOptions()', () => {
                    expect(mockResolvedOptions).not.toHaveBeenCalled();
                });
            });

            describe('when the user timezone is not found', () => {
                let guessedTimezone;

                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => undefined);
                    guessedTimezone = timeHelper.guessUserTz();
                });

                it('returns the GMT timezone', () => {
                    expect(guessedTimezone).toEqual(greenwhichTimezone);
                });

                it('does not call window.Intl.DateTimeFormat().resolvedOptions()', () => {
                    expect(mockResolvedOptions).not.toHaveBeenCalled();
                });
            });

            describe('when the user timezone is UTC', () => {
                let guessedTimezone;

                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => 'UTC');
                    guessedTimezone = timeHelper.guessUserTz();
                });

                it('returns the GMT timezone', () => {
                    expect(guessedTimezone).toEqual(greenwhichTimezone);
                });

                it('does not call window.Intl.DateTimeFormat().resolvedOptions()', () => {
                    expect(mockResolvedOptions).not.toHaveBeenCalled();
                });
            });
        });

        describe('when the device is mobile and Intl is not supported', () => {
            const originalIntl = window.Intl;

            beforeEach(() => {
                window.navigator.userAgent = mockMobileUserAgent;
                window.Intl = undefined;
            });

            afterAll(() => {
                window.Intl = originalIntl;
            });

            describe('when the user timezone is found', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => newYorkTimezone.zoneName);
                });

                it('returns the user timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(newYorkTimezone);
                });
            });

            describe('when the user timezone is not found', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => undefined);
                });

                it('returns the GMT timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(greenwhichTimezone);
                });
            });

            describe('when the user timezone is UTC', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => 'UTC');
                });

                it('returns the GMT timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(greenwhichTimezone);
                });
            });
        });

        describe('when the device is not mobile', () => {
            beforeEach(() => {
                window.navigator.userAgent = mockDesktopUserAgent;
            });

            describe('when the user timezone is found', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => newYorkTimezone.zoneName);
                });

                it('returns the user timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(newYorkTimezone);
                });
            });

            describe('when the user timezone is not found', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => undefined);
                });

                it('returns the GMT timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(greenwhichTimezone);
                });
            });

            describe('when the user timezone is UTC', () => {
                beforeEach(() => {
                    jest.spyOn(momentTimezone, 'guess').mockImplementation(() => 'UTC');
                });

                it('returns the GMT timezone', () => {
                    expect(timeHelper.guessUserTz()).toEqual(greenwhichTimezone);
                });
            });
        });
    });

    describe('isValueInCityOrZone', () => {
        it('should return true if value is found in the City (ignore case)', () => {
            // Given: a value to search for
            const valuesToTest = [
                // value completely matches City
                'SOME CITY', // all caps
                'some city', // all lowercase
                'Some City', // mixed case
                // value at beginning of City
                'SOME', // all caps
                'some', // all lowercase
                'Some', // mixed case
                // value at end of City
                'CITY', // all caps
                'city', // all lowercase
                'City', // mixed case
                // value in the middle of City
                'OME', // all caps
                'cit', // all lowercase
                'ome Cit' // mixed case
            ];

            valuesToTest.forEach((searchValue) => {
                // When: we search for the value in the City or Zone
                const isValueFound = timeHelper.isValueInCityOrZone(mockTimezone, searchValue);

                try {
                    // Then: the result should be true
                    expect(isValueFound).toBeTruthy();
                } catch (error) {
                    throw Error(`Search Value ${searchValue} not found in ${mockTimezone.city}`);
                }
            });
        });

        it('should return true if value is found in the Zone Abbreviation (ignore case)', () => {
            // Given: a value to search for
            const valuesToTest = [
                // value completely matches Zone Abbreviation
                'SOZ', // all caps
                'soz', // all lowercase
                'Soz', // mixed case
                // value at beginning of Zone Abbreviation
                'SO', // all caps
                'so', // all lowercase
                'So', // mixed case
                // value at end of Zone Abbreviation
                'OZ', // all caps
                'oz', // all lowercase
                'oZ', // mixed case
                // value in the middle of Zone Abbreviation
                'O', // all caps
                'o' // all lowercase
            ];

            valuesToTest.forEach((searchValue) => {
                // When: we search for the value in the City or Zone
                const isValueFound = timeHelper.isValueInCityOrZone(mockTimezone, searchValue);

                try {
                    // Then: the result should be true
                    expect(isValueFound).toBeTruthy();
                } catch (error) {
                    throw Error(`Search Value ${searchValue} not found in ${mockTimezone.zoneAbbr}`);
                }
            });
        });

        it('should return false if value not found in City or Zone Abbreviation (ignore case)', () => {
            // Given: a value to search for
            const valuesToTest = [
                // value completely does not match City or Zone Abbreviation
                'Value that does not Match',
                // value that has City in it but itself is not a set or subset of City
                'This has Some City inside it',
                'Some City begins this value',
                'The value ends with Some City',
                // value that has Zone Abbreviation in it but itself is not a set or subset of Zone Abbreviation
                'This has SOZ inside it',
                'SOZ begins this value',
                'The values ends with SOZ'
            ];

            valuesToTest.forEach((searchValue) => {
                // When: we search for the value in the City or Zone
                const isValueFound = timeHelper.isValueInCityOrZone(mockTimezone, searchValue);

                try {
                    // Then: the result should be false
                    expect(isValueFound).toBeFalsy();
                } catch (error) {
                    throw Error(`Search Value ${searchValue} should not be found in ${mockTimezone.city} or ${mockTimezone.zoneAbbr}`);
                }
            });
        });
    });

    describe('compareByCityAndZone', () => {
        describe('when the City in timezone1 is less than the City in timezone2', () => {
            const lessThanCities = [
                // alphabetically before timezone2 city
                'ATLANTA', // all caps
                'atlanta', // all lowercase
                'Atlanta', // mixed case
                // subset of timezone2 city
                'SOME', // all caps
                'some', // all lowercase
                'Some', // mixed case
                // numerically before timezone2 city
                '123 CITY', // all caps
                '123 city', // all lowercase
                '123 City', // mixed case
                // character before timezone2 city
                '_ CITY', // all caps
                '_ city', // all lowercase
                '_ City' // mixed case
            ];

            it('should return -1', () => {
                lessThanCities.forEach((cityToCompare) => {
                    // Given: a timezone with a City less than the City in timezone2
                    const timezoneToCompare = Object.assign({}, mockTimezone, { city: cityToCompare });

                    // When: we compare timezone1 against timezone2
                    const comparisonResult = timeHelper.compareByCityAndZone(timezoneToCompare, mockTimezone);

                    try {
                        // Then: the result should be -1
                        expect(comparisonResult).toBe(-1);
                    } catch (error) {
                        throw Error(`timezone1 city ${timezoneToCompare.city} not less than timezone2 city ${mockTimezone.city}`);
                    }
                });
            });
        });

        describe('when the City in timezone1 is the greater than the City in timezone2', () => {
            const greaterThanCities = [
                // alphabetically after timezone2 city
                'ZALAEGERSZEG', // all caps
                'zalaegerszeg', // all lowercase
                'Zalaegerszeg', // mixed case
                // superset of timezone2 city
                'SOME CITY AND MORE', // all caps
                'some city and more', // all lowercase
                'Some City and More' // mixed case
            ];

            it('should return 1', () => {
                greaterThanCities.forEach((cityToCompare) => {
                    // Given: a timezone with a City greater than the City in timezone2
                    const timezoneToCompare = Object.assign({}, mockTimezone, { city: cityToCompare });

                    // When: we compare timezone1 against timezone2
                    const comparisonResult = timeHelper.compareByCityAndZone(timezoneToCompare, mockTimezone);

                    try {
                        // Then: the result should be 1
                        expect(comparisonResult).toBe(1);
                    } catch (error) {
                        throw Error(`timezone1 city ${timezoneToCompare.city} not greater than timezone2 city ${mockTimezone.city}`);
                    }
                });
            });
        });

        describe('when the City in timezone1 is the same as the City in timezone2', () => {
            describe('when the Zone Abbreviation in timezone1 is less than the Zone Abbreviation in timezone2', () => {
                const lessThanZones = [
                    // alphabetically before timezone2 zone
                    'ATL', // all caps
                    'atl', // all lowercase
                    'Atl', // mixed case
                    // subset of timezone2 zone
                    'SO', // all caps
                    'so', // all lowercase
                    'So', // mixed case
                    // numerically before timezone2 zone
                    '123SO', // all caps
                    '123so', // all lowercase
                    '123So', // mixed case
                    // character before timezone2 zone
                    '_SO', // all caps
                    '_so', // all lowercase
                    '_So' // mixed case
                ];

                it('should return -1', () => {
                    lessThanZones.forEach((zoneToCompare) => {
                        // Given: a timezone with the same City as timezone2 but a zoneAbbr less than timezone2
                        const timezoneToCompare = Object.assign({}, mockTimezone, { zoneAbbr: zoneToCompare });

                        // When: we compare timezone1 against timezone2
                        const comparisonResult = timeHelper.compareByCityAndZone(timezoneToCompare, mockTimezone);

                        try {
                            // Then: the result should be -1
                            expect(comparisonResult).toBe(-1);
                        } catch (error) {
                            throw Error(`timezone1 zone ${timezoneToCompare.zoneAbbr} not less than timezone2 zone ${mockTimezone.zoneAbbr}`);
                        }
                    });
                });
            });

            describe('when the Zone Abbreviation in timezone1 is greater than the Zone Abbreviation in timezone2', () => {
                const greaterThanZones = [
                    // alphabetically after timezone2 zone
                    'ZOD', // all caps
                    'zod', // all lowercase
                    'Zod', // mixed case
                    // superset of timezone2 zone
                    'SOZ AND MORE', // all caps
                    'soz and more', // all lowercase
                    'Soz and More' // mixed case
                ];

                it('should return 1', () => {
                    greaterThanZones.forEach((zoneToCompare) => {
                        // Given: a timezone with the same City as timezone2 but a zoneAbbr greater than timezone2
                        const timezoneToCompare = Object.assign({}, mockTimezone, { zoneAbbr: zoneToCompare });

                        // When: we compare timezone1 against timezone2
                        const comparisonResult = timeHelper.compareByCityAndZone(timezoneToCompare, mockTimezone);

                        try {
                            // Then: the result should be 1
                            expect(comparisonResult).toBe(1);
                        } catch (error) {
                            throw Error(`timezone1 zone ${timezoneToCompare.zoneAbbr} not greater than timezone2 zone ${mockTimezone.zoneAbbr}`);
                        }
                    });
                });
            });

            describe('when the Zone Abbreviation in timezone1 is the same as the Zone Abbreviation in timezone2', () => {
                it('should return 0', () => {
                    // Given: a timezone exactly the same as timezone2
                    const timezoneToCompare = Object.assign({}, mockTimezone);

                    // When: we compare timezone1 against timezone2
                    const comparisonResult = timeHelper.compareByCityAndZone(timezoneToCompare, mockTimezone);

                    try {
                        // Then: the result should be 0
                        expect(comparisonResult).toBe(0);
                    } catch (error) {
                        throw Error(`timezone1 ${timezoneToCompare.city} - ${timezoneToCompare.zoneAbbr} \
                            not equal to timezone2 ${mockTimezone.city} - ${mockTimezone.zoneAbbr}`);
                    }
                });
            });
        });
    });
});
