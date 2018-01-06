import React from 'react';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import {
    getAllTimezones,
    timezoneSearch,
    guessUserTimezone,
    isTimezoneMatch,
    compareTimezones
} from '../../index';


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


class HelperEnabledAutocomplete extends React.PureComponent {
    constructor(props) {
        super(props);

        const defaultTimezone = guessUserTimezone();

        this.state = {
            inputValue: formatTimezone(defaultTimezone)
        };

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    }

    handleTimezoneChange(selection) {
        const { city, zoneAbbr } = parseTimezone(selection);
        const zoneObject = timezoneSearch({ city, zoneAbbr })[0];
        if (zoneObject) {
            this.setState({ inputValue: formatTimezone(zoneObject) });
        }
    }

    render() {
        const { inputValue } = this.state;

        const menuStyle = {
            borderRadius: '2px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1rem',
            position: 'sticky',
            overflow: 'auto',
            width: '100%',
            minWidth: 'initial'
        };

        return (
            <Autocomplete
                id="timezone-picker-search-input"
                onChange={(event, value) => this.setState({ inputValue: value })}
                onSelect={value => this.handleTimezoneChange(value)}
                menuStyle={menuStyle}
                items={getAllTimezones()}
                shouldItemRender={(item, searchValue) => isTimezoneMatch(item, searchValue)}
                getItemValue={item => formatTimezone(item)}
                sortItems={(item1, item2) => compareTimezones(item1, item2)}
                renderItem={TimezoneOption}
                value={inputValue}
            />
        );
    }
}

export default HelperEnabledAutocomplete;
