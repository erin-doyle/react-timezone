import { Component, createElement } from 'react';
import invariant from 'invariant';

import { timezoneShape } from './utils/types';
import timeHelper from './utils/time';
import timezoneData from './data/timezoneData';


function getDisplayName(ComponentToDisplay) {
    return ComponentToDisplay.displayName || ComponentToDisplay.name || 'Component';
}

function isClassComponent(ComponentToCheck) {
    return Boolean(
        ComponentToCheck &&
        ComponentToCheck.prototype &&
        typeof ComponentToCheck.prototype.isReactComponent === 'object'
    );
}

export default function injectTimezone(WrappedComponent, options = {}) {
    const {
        timezonePropName = 'timezone',
        withRef = false
    } = options;

    class InjectTimezone extends Component {
        constructor(props) {
            super(props);

            this.state = {
                timezoneValue: timeHelper.guessUserTz()
            };

            this.change = this.change.bind(this);
        }

        getWrappedInstance() {
            invariant(withRef,
                '[React Timezone] To access the wrapped instance, ' +
                'the `{withRef: true}` option must be set when calling: ' +
                '`injectTimezone()`'
            );

            return this.wrapped;
        }

        change(newValue) {
            if (newValue) {
                this.setState({
                    timezoneValue: newValue
                });
            }
        }

        render() {
            const { timezoneValue } = this.state;
            const timezoneProps = {
                value: timezoneValue,
                helper: {
                    allTimezones: timezoneData,
                    change: this.change,
                    search: timeHelper.tzSearch,
                    guessCurrent: timeHelper.guessUserTz,
                    match: timeHelper.isValueInCityOrZone,
                    compare: timeHelper.compareByCityAndZone
                }
            };
            const propsToPass = {
                ...(timezonePropName
                    ? { [timezonePropName]: timezoneProps }
                    : timezoneProps),
                ...this.props
            };
            if (isClassComponent(WrappedComponent)) {
                propsToPass.ref = 'wrapped';
            }
            return createElement(WrappedComponent, propsToPass);
        }
    }

    InjectTimezone.displayName = `InjectTimezone(${getDisplayName(WrappedComponent)})`;
    InjectTimezone.WrappedComponent = WrappedComponent;
    InjectTimezone.childContextTypes = {
        timezone: timezoneShape
    };

    return InjectTimezone;
}
