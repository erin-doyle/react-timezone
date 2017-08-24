import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';

import timeHelper from '../utils/time';

import BackButton from './BackButton';


class TimezonePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    }

    handleTimezoneChange(selection) {
        const { handleTimezoneChange, onClearFocus } = this.props;
        const zoneObject = selection[0];
        if (zoneObject) {
            if (handleTimezoneChange) handleTimezoneChange(zoneObject);
            onClearFocus();
        }
    }

    render() {
        const { phrases, onClearFocus } = this.props;
        return (
            <div className="timezone_picker_modal_container">
                <div className="timezone_picker_modal_header">
                    <BackButton clickHandler={onClearFocus} />
                    <span className="timezone_picker_header_title">
                        {phrases.timezonePickerTitle}
                    </span>
                </div>
                <div className="timezone_picker_container">
                    <div className="timezone_picker_search">
                        <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                            {phrases.timezonePickerLabel}
                        </label>
                        <Typeahead
                            onChange={this.handleTimezoneChange}
                            labelKey={option => `${option.city} - ${option.zoneAbbr}`}
                            options={timeHelper.tzMaps}
                            maxResults={5}
                            minLength={3}
                        />
                    </div>
                </div>
                <div className="buttons_wrapper">
                    <button onClick={onClearFocus}>
                        {phrases.close}
                    </button>
                </div>
            </div>
        );
    }
}

TimezonePicker.defaultProps = {
    phrases: {
        close: 'close',
        timezonePickerTitle: 'Pick a Timezone',
        timezonePickerLabel: 'Closest City or Timezone'
    },
    onClearFocus: () => {},
    handleTimezoneChange: () => {}
};

TimezonePicker.propTypes = {
    phrases: PropTypes.object,
    onClearFocus: PropTypes.func,
    handleTimezoneChange: PropTypes.func
};

export default TimezonePicker;

