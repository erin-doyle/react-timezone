import React from 'react';
import { shallow } from 'enzyme';

import TimezoneAutocomplete from '../../src/components/TimezoneAutocomplete';


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

        it('should render a label for the search field', () => {
            expect(wrapper.find('.timezone_picker_search').find('label').text()).toBe(mockPhrases.timezonePickerLabel);
        });

        it('should render an Autocomplete', () => {
            expect(wrapper.find('Autocomplete').exists()).toBeTruthy();
        });
    });

    describe('handle timezone change func', () => {
        it('should callback when timezone change', () => {
            const onTimezoneChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezoneAutocomplete
                    phrases={mockPhrases}
                    onTimezoneChange={onTimezoneChangeStub}
                />
            );
            wrapper.instance().handleTimezoneChange(`${mockTimezone.city} - ${mockTimezone.zoneAbbr}`);
            expect(onTimezoneChangeStub.mock.calls.length).toBe(1);
            expect(onTimezoneChangeStub).toBeCalledWith(mockTimezone);
        });
    });
});
