import tzMaps from '../../src/data/timezoneData';
import searchHelper from '../../src/utils/search';


describe('Search utils', () => {
    describe('isMatch', () => {
        it('should return true when input is at the beginning of string', () => {
            const input = 'Here';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeTruthy();
        });

        it('should return true when input is at the end of string', () => {
            const input = 'String.';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeTruthy();
        });

        it('should return true when input is a substring of string', () => {
            const input = 'tri';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeTruthy();
        });

        it('should return true when input equals string with case insensitivity', () => {
            const input = 'HERE is a sTrInG.';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeTruthy();
        });

        it('should return false when input not found in string', () => {
            const input = 'This won\'t be found';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });

        it('should return false when input a superstring of string', () => {
            const input = 'Here is a String.  Here is more than the String to search in.';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });

        it('should return false when input is not a string', () => {
            const input = 12345;
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });

        it('should return false when string is not a string', () => {
            const input = 'Here is a String';
            const string = 12345;
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });

        it('should return false when input is empty', () => {
            const input = '';
            const string = 'Here is a String.';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });

        it('should return false when string is empty', () => {
            const input = 'Here is a String';
            const string = '';
            const result = searchHelper.isMatch(input, string);
            expect(result).toBeFalsy();
        });
    });

    describe('filterBy', () => {
        it('returns filtered results for an array of objects', () => {
            const text = 'New';
            const filterOptions = {
                fields: []
            };

            const results = tzMaps.filter(timezone => (
                searchHelper.filterBy(timezone.city, text, filterOptions)
            ));

            expect(results).toEqual([
                { city: 'New York', zoneName: 'America/New_York', zoneAbbr: 'EDT' },
                { city: 'New Salem', zoneName: 'America/North_Dakota/New_Salem', zoneAbbr: 'CDT' },
                { city: 'Canada/Newfoundland', zoneName: 'Canada/Newfoundland', zoneAbbr: 'NDT' },
                { city: 'US/Pacific-New', zoneName: 'US/Pacific-New', zoneAbbr: 'PDT' }
            ]);
        });

        it('searches a set of fields and returns results', () => {
            const text = 'New York';
            const filterOptions = {
                fields: ['city', 'zoneAbbr']
            };

            const results = tzMaps.filter(timezone => (
                searchHelper.filterBy(timezone, text, filterOptions)
            ));

            expect(results).toEqual([
                { city: 'New York', zoneName: 'America/New_York', zoneAbbr: 'EDT' }
            ]);
        });

        it('returns filtered results for an array of strings', () => {
            const text = 'New';
            const filterOptions = {
                fields: []
            };

            const cities = tzMaps.map(zone => zone.city);
            const results = cities.filter(timezone => (
                searchHelper.filterBy(timezone, text, filterOptions)
            ));

            expect(results).toEqual([
                'New York',
                'New Salem',
                'Canada/Newfoundland',
                'US/Pacific-New'
            ]);
        });

        it('returns the item if the text matches exactly', () => {
            const text = 'New York';
            const filterOptions = {
                fields: []
            };

            const results = tzMaps.filter(timezone => (
                searchHelper.filterBy(timezone.city, text, filterOptions)
            ));

            expect(results).toHaveLength(1);
            expect(results[0].city).toEqual(text);
        });

        it('returns no results if the text doesn\'t find a match', () => {
            const text = 'zzz';
            const filterOptions = {
                fields: []
            };

            const results = tzMaps.filter(timezone => (
                searchHelper.filterBy(timezone.city, text, filterOptions)
            ));

            expect(results).toHaveLength(0);
        });
    });
});
