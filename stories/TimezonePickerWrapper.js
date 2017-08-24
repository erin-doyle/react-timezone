import React from 'react';

import TimezonePicker from '../src/index';
import timeHelper from '../src/utils/time';


const TIME = timeHelper.time();
TIME.current = timeHelper.current();
TIME.tz = timeHelper.guessUserTz();

class TimezonePickerWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        const { timezone } = this.props;

        this.state = {
            timezone
        };
    }

    render() {
        const { timezone } = this.state;
        const { phrases, onTimezoneChange, onClearFocus } = this.props;

        return (
            <div>
                <div className="outside_container active">
                    <div className="time_picker_modal_container">
                        <TimezonePicker
                            phrases={phrases}
                            timezone={timezone}
                            onTimezoneChange={onTimezoneChange}
                            onClearFocus={onClearFocus}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TimezonePickerWrapper.defaultProps = {
    timezone: TIME.tz
};

export default TimezonePickerWrapper;

