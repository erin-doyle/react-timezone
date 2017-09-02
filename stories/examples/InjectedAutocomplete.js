import React from 'react';
import classNames from 'classnames/dedupe';
import Autocomplete from 'react-autocomplete';

import { injectTimezone } from '../../src/index';


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


class InjectedAutocomplete extends React.PureComponent {
    constructor(props) {
        super(props);

        const { timezone } = this.props;

        this.state = {
            inputValue: formatTimezone(timezone.value)
        };

        this.handleTimezoneChange = this.handleTimezoneChange.bind(this);
    }

    handleTimezoneChange(selection) {
        const { timezone } = this.props;
        const { city, zoneAbbr } = parseTimezone(selection);
        const zoneObject = timezone.helper.search({ city, zoneAbbr })[0];
        if (zoneObject) {
            timezone.helper.change(zoneObject);
            this.setState({ inputValue: formatTimezone(zoneObject) });
        }
    }

    render() {
        const { timezone } = this.props;
        const { inputValue } = this.state;

        const phrases = {
            timezonePickerLabel: 'Closest City or Timezone'
        };
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
            <div className="timezone_picker_container">
                <div className="timezone_picker_search">
                    <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                        {phrases.timezonePickerLabel}
                    </label>
                    <Autocomplete
                        id="timezone-picker-search-input"
                        onChange={(event, value) => this.setState({ inputValue: value })}
                        onSelect={value => this.handleTimezoneChange(value)}
                        menuStyle={menuStyle}
                        items={timezone.helper.allTimezones}
                        shouldItemRender={(item, searchValue) => timezone.helper.match(item, searchValue)}
                        getItemValue={item => formatTimezone(item)}
                        sortItems={(item1, item2) => timezone.helper.compare(item1, item2)}
                        renderItem={TimezoneOption}
                        value={inputValue}
                    />
                </div>
            </div>
        );
    }
}

export default injectTimezone(InjectedAutocomplete);
