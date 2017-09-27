import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import { head } from '../utils/func';
import timeHelper from '../utils/time';


const TIMEZONE_PARTS_DELIMITER = ' - ';

export const formatTimezone = (timezone) => {
    if (!timezone || !timezone.city || !timezone.zoneAbbr) return '';

    return `${timezone.city}${TIMEZONE_PARTS_DELIMITER}${timezone.zoneAbbr}`;
};

export const parseTimezone = (timezoneDisplay) => {
    if (!timezoneDisplay) return undefined;

    const delimiterStart = timezoneDisplay.indexOf(TIMEZONE_PARTS_DELIMITER);
    const delimiterEnd = delimiterStart + TIMEZONE_PARTS_DELIMITER.length;
    const city = timezoneDisplay.substring(0, delimiterStart);
    const zoneAbbr = timezoneDisplay.substring(delimiterEnd);

    if (!city || !zoneAbbr) return undefined;

    return {
        city,
        zoneAbbr
    };
};

export const TimezoneOption = (item, isHighlighted) => (
    <div
        key={`${item.zoneName}-${item.zoneAbbr}`}
        className={classNames('timezone-option', {
            'timezone-option__highlighted': isHighlighted
        })}
    >
        {formatTimezone(item)}
    </div>
);


class TimezoneAutocomplete extends React.PureComponent {
    constructor(props) {
        super(props);

        const { minLength } = this.props;
        const guessedTimezone = timeHelper.guessUserTz();

        this.state = {
            timezone: formatTimezone(guessedTimezone)
        };

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);

        // create partial function passing in the minLength argument
        this.shouldItemRenderAfterMinLengthEntered = (timezoneItem, searchValue) => (
            timeHelper.isValueInCityOrZone(timezoneItem, searchValue, minLength)
        );
    }

    handleTimezoneChange(selection) {
        const { onTimezoneChange } = this.props;
        const { city, zoneAbbr } = parseTimezone(selection);
        const zoneObject = head(timeHelper.tzSearch({ city, zoneAbbr }));
        if (zoneObject) {
            this.setState({ timezone: formatTimezone(zoneObject) });
            if (onTimezoneChange) onTimezoneChange(zoneObject);
        }
    }

    render() {
        const {
            inputProps,
            menuStyle,
            onMenuVisibilityChange,
            wrapperProps
        } = this.props;

        const { timezone } = this.state;

        return (
            <Autocomplete
                id="timezone-picker-search-input"
                onChange={(event, value) => this.setState({ timezone: value })}
                onSelect={value => this.handleTimezoneChange(value)}
                onMenuVisibilityChange={onMenuVisibilityChange}
                menuStyle={menuStyle}
                inputProps={inputProps}
                wrapperProps={wrapperProps}
                items={timeHelper.tzMaps}
                shouldItemRender={this.shouldItemRenderAfterMinLengthEntered}
                getItemValue={formatTimezone}
                sortItems={timeHelper.compareByCityAndZone}
                renderItem={TimezoneOption}
                value={timezone}
            />
        );
    }
}

TimezoneAutocomplete.defaultProps = {
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
    wrapperProps: {},
    minLength: 3
};

TimezoneAutocomplete.propTypes = {
    onTimezoneChange: PropTypes.func,
    onMenuVisibilityChange: PropTypes.func,
    inputProps: PropTypes.object,
    menuStyle: PropTypes.object,
    wrapperProps: PropTypes.object,
    minLength: PropTypes.number
};

export default TimezoneAutocomplete;

