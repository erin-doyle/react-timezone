import React from 'react';
import { shallow } from 'enzyme';

import TimezonePicker from '../../src/components/TimezonePicker';


const mockPhrases = {
    timezonePickerLabel: 'phrase for the label'
};
const mockTimezone = {
    city: 'Some City',
    zoneName: 'Some Zone',
    zoneAbbr: 'SOZ'
};

describe('TimezonePicker', () => {
    describe('TimezonePicker render', () => {
        const wrapper = shallow(
            <TimezonePicker
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
                <TimezonePicker
                    phrases={mockPhrases}
                    onTimezoneChange={onTimezoneChangeStub}
                />
            );
            wrapper.instance().handleTimezoneChange([mockTimezone]);
            expect(onTimezoneChangeStub.mock.calls.length).toBe(1);
            expect(onTimezoneChangeStub).toBeCalledWith(mockTimezone);
        });
    });
});
