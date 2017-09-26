import React from 'react';
import { shallow } from 'enzyme';

import TimezoneAutocomplete, { formatTimezone, parseTimezone } from '../../src/components/TimezoneAutocomplete';


const mockPhrases = {
    timezonePickerLabel: 'phrase for the label'
};
const mockTimezone = {
    city: 'New York',
    zoneName: 'America/New_York',
    zoneAbbr: 'EDT'
};

describe('TimezoneAutocomplete', () => {
    describe('TimezoneAutocomplete render', () => {
        const wrapper = shallow(
            <TimezoneAutocomplete
                phrases={mockPhrases}
            />
        );

        it('should render an Autocomplete', () => {
            expect(wrapper.find('Autocomplete').exists()).toBeTruthy();
        });
    });

    describe('handle timezone change function', () => {
        it('should callback when timezone changes', () => {
            const onTimezoneChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezoneAutocomplete
                    phrases={mockPhrases}
                    onTimezoneChange={onTimezoneChangeStub}
                />
            );
            wrapper.instance().handleTimezoneChange(`${mockTimezone.city} - ${mockTimezone.zoneAbbr}`);
            expect(onTimezoneChangeStub.mock.calls).toHaveLength(1);
            expect(onTimezoneChangeStub).toBeCalledWith(mockTimezone);
        });
    });
});

describe('formatTimezone', () => {
    describe('when the timezone object is valid', () => {
        it('should return a string representation of the timezone object', () => {
            const displayResult = formatTimezone(mockTimezone);
            expect(displayResult).toBe('New York - EDT');
        });
    });

    describe('when the timezone object is not valid', () => {
        it('should return an empty string', () => {
            const invalidTimezones = [
                null,
                undefined,
                {},
                { city: 'Some City' },
                { zoneAbbr: 'SOZ' },
                { someField: 'Neither city nor zoneAbbr' }
            ];

            invalidTimezones.forEach((timezone) => {
                const displayResult = formatTimezone(timezone);
                expect(displayResult).toBe('');
            });
        });
    });
});

describe('deconstructTzDisplay', () => {
    describe('when the timezone display object is valid', () => {
        it('should return a city and zone abbreviation', () => {
            const deconstructedResult = parseTimezone('Some City - SOZ');
            expect(deconstructedResult.city).toBe('Some City');
            expect(deconstructedResult.zoneAbbr).toBe('SOZ');
        });
    });

    describe('when the timezone display object is not valid', () => {
        it('should return undefined', () => {
            const invalidTimezones = [
                null,
                undefined,
                '',
                'Some City',
                '- SOZ',
                '-'
            ];

            invalidTimezones.forEach((timezone) => {
                const deconstructedResult = parseTimezone(timezone);
                expect(deconstructedResult).toBe(undefined);
            });
        });
    });
});
