import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import timeHelper from '../utils/time';


export const TimezoneOption = (item, isHighlighted) => (
    <div
        key={`${item.zoneName}-${item.zoneAbbr}`}
        className={classNames('timezone-option', {
            'timezone-option__highlighted': isHighlighted
        })}
    >
        {timeHelper.tzDisplay(item)}
    </div>
);


class TimezoneAutocomplete extends React.PureComponent {
    constructor(props) {
        super(props);

        const guessedTimezone = timeHelper.guessUserTz();

        this.state = {
            timezone: timeHelper.tzDisplay(guessedTimezone)
        };

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    }

    handleTimezoneChange(selection) {
        const { onTimezoneChange } = this.props;
        const { city, zoneAbbr } = timeHelper.deconstructTzDisplay(selection);
        const zoneObject = timeHelper.tzForCityAndZoneAbbr(city, zoneAbbr);
        if (zoneObject) {
            this.setState({ timezone: timeHelper.tzDisplay(zoneObject) });
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

        return (
            <div className="timezone_picker_container">
                <div className="timezone_picker_search">
                    <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                        {phrases.timezonePickerLabel}
                    </label>
                    <Autocomplete
                        id="timezone-picker-search-input"
                        onChange={(event, value) => this.setState({ timezone: value })}
                        onSelect={value => this.handleTimezoneChange(value)}
                        onMenuVisibilityChange={onMenuVisibilityChange}
                        menuStyle={menuStyle}
                        inputProps={inputProps}
                        wrapperProps={wrapperProps}
                        items={timeHelper.tzMaps}
                        shouldItemRender={timeHelper.isValueInCityOrZone}
                        getItemValue={timeHelper.tzDisplay}
                        sortItems={timeHelper.compareByCityAndZone}
                        renderItem={TimezoneOption}
                        value={timezone}
                    />
                </div>
            </div>
        );
    }
}

TimezoneAutocomplete.defaultProps = {
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

TimezoneAutocomplete.propTypes = {
    phrases: PropTypes.object,
    onTimezoneChange: PropTypes.func,
    onMenuVisibilityChange: PropTypes.func,
    inputProps: PropTypes.object,
    menuStyle: PropTypes.object,
    wrapperProps: PropTypes.object
};

export default TimezoneAutocomplete;

