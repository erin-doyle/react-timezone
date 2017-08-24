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
        const { onTimezoneChange, onClearFocus } = this.props;
        const zoneObject = selection[0];
        if (zoneObject) {
            if (onTimezoneChange) onTimezoneChange(zoneObject);
            onClearFocus();
        }
    }

    render() {
        const { phrases } = this.props;
        return (
            <div className="timezone_picker_container">
                <div className="timezone_picker_search">
                    <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                        {phrases.timezonePickerLabel}
                    </label>
                    <Typeahead
                        id="timezone-picker-search-input"
                        onChange={this.handleTimezoneChange}
                        labelKey={option => `${option.city} - ${option.zoneAbbr}`}
                        options={timeHelper.tzMaps}
                        maxResults={5}
                        minLength={3}
                    />
                </div>
            </div>
        );
    }
}

TimezonePicker.defaultProps = {
    phrases: {
        timezonePickerLabel: 'Closest City or Timezone'
    },
    onClearFocus: () => {},
    onTimezoneChange: () => {}
};

TimezonePicker.propTypes = {
    phrases: PropTypes.object,
    onClearFocus: PropTypes.func, // TODO: can we remove this?
    onTimezoneChange: PropTypes.func
};

export default TimezonePicker;

