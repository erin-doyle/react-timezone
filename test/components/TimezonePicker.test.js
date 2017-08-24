import React from 'react';
import { shallow } from 'enzyme';

import TimezonePicker from '../../src/components/TimezonePicker';


const mockPhrases = {
    close: 'phrase for close',
    timezonePickerTitle: 'phrase for the Title',
    timezonePickerLabel: 'phrase for the label'
};
const mockTimezone = {
    zoneName: 'Some Zone',
    zoneAbbr: 'SZ'
};

describe('TimezonePicker', () => {
    describe('TimezonePicker render', () => {
        const wrapper = shallow(
            <TimezonePicker
                phrases={mockPhrases}
            />
        );

        it('should render a header with a title', () => {
            expect(wrapper.find('.timezone_picker_header_title').text()).toBe(mockPhrases.timezonePickerTitle);
        });

        it('should render a label for the search field', () => {
            expect(wrapper.find('.timezone_picker_search').find('label').text()).toBe(mockPhrases.timezonePickerLabel);
        });

        it('should render a Typeahead', () => {
            expect(wrapper.find('OnClickOutside(Typeahead)').length).toBe(1);
        });

        it('should render a close button', () => {
            expect(wrapper.find('button').text()).toBe(mockPhrases.close);
        });
    });

    describe('onClearFocus func', () => {
        it('should callback when onClick header "back" icon', () => {
            const onFocusChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezonePicker
                    phrases={mockPhrases}
                    onClearFocus={onFocusChangeStub}
                />
            );
            expect(wrapper.find('BackButton').prop('clickHandler')).toBe(onFocusChangeStub);
        });

        it('should callback when onClick Button', () => {
            const onFocusChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezonePicker
                    phrases={mockPhrases}
                    onClearFocus={onFocusChangeStub}
                />
            );
            wrapper.find('button').simulate('click');
            expect(onFocusChangeStub.mock.calls.length).toBe(1);
        });

        it('should callback when timezone change', () => {
            const onFocusChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezonePicker
                    phrases={mockPhrases}
                    onClearFocus={onFocusChangeStub}
                />
            );
            wrapper.instance().handleTimezoneChange([mockTimezone]);
            expect(onFocusChangeStub.mock.calls.length).toBe(1);
        });
    });

    describe('handle timezone change func', () => {
        it('should callback when timezone change', () => {
            const onTimezoneChangeStub = jest.fn();
            const wrapper = shallow(
                <TimezonePicker
                    phrases={mockPhrases}
                    handleTimezoneChange={onTimezoneChangeStub}
                />
            );
            wrapper.instance().handleTimezoneChange([mockTimezone]);
            expect(onTimezoneChangeStub.mock.calls.length).toBe(1);
            expect(onTimezoneChangeStub).toBeCalledWith(mockTimezone);
        });
    });
});
