import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import timeHelper from '../utils/time';


export const TimezoneOption = (item, isHighlighted) => (
    <div
        key={`${item.city}-${item.zoneAbbr}`}
        className={classNames('timezone-option', {
            'timezone-option__highlighted': isHighlighted
        })}
    >
        {timeHelper.tzDisplay(item)}
    </div>
);


class TimezonePicker extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            timezone: timeHelper.guessUserTz()
        };

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    }

    handleTimezoneChange(selection) {
        const { onTimezoneChange } = this.props;
        const zoneObject = selection[0];
        if (zoneObject) {
            this.setState({ timezone: zoneObject });
            if (onTimezoneChange) onTimezoneChange(zoneObject);
        }
    }

    render() {
        const {
            phrases,
            inputProps,
            menuStyle,
            onMenuVisibilityChange,
            wrapperProps
        } = this.props;

        const { timezone } = this.state;

        const valueDisplay = `${timezone.zoneName} ${timezone.zoneAbbr}`;

        return (
            <div className="timezone_picker_container">
                <div className="timezone_picker_search">
                    <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                        {phrases.timezonePickerLabel}
                    </label>
                    <Autocomplete
                        id="timezone-picker-search-input"
                        onChange={(event, value) => this.handleTimezoneChange(value)}
                        onSelect={value => this.handleTimezoneChange(value)}
                        onMenuVisibilityChange={onMenuVisibilityChange}
                        items={timeHelper.tzMaps}
                        getItemValue={timeHelper.tzDisplay}
                        value={valueDisplay}
                        menuStyle={menuStyle}
                        inputProps={inputProps}
                        wrapperProps={wrapperProps}
                        shouldItemRender={timeHelper.isValueInCityOrZone}
                        sortItems={timeHelper.compareByCityAndZone}
                        renderItem={TimezoneOption}
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
    onTimezoneChange: () => {},
    onMenuVisibilityChange: () => {},
    inputProps: {},
    menuStyle: {
        borderRadius: '2px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1rem',
        position: 'sticky',
        overflow: 'auto',
        width: '100%',
        minWidth: 'initial'
    },
    wrapperProps: {}
};

TimezonePicker.propTypes = {
    phrases: PropTypes.object,
    onTimezoneChange: PropTypes.func,
    onMenuVisibilityChange: PropTypes.func,
    inputProps: PropTypes.object,
    menuStyle: PropTypes.object,
    wrapperProps: PropTypes.object
};

export default TimezonePicker;

