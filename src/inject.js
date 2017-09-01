import { Component, createElement } from 'react';
import invariant from 'invariant';

import { timezoneShape } from './utils/types';
import timeHelper from './utils/time';
import timezoneData from './data/timezoneData';


function getDisplayName(ComponentToDisplay) {
    return ComponentToDisplay.displayName || ComponentToDisplay.name || 'Component';
}

function invariantTimezoneContext({ timezone } = {}) {
    invariant(timezone,
        '[React Timezone] Could not find required `timezone` object. '
    );
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
        /*
        constructor(props, context) {
            super(props, context);
            invariantTimezoneContext(context);
        }
        */

        getWrappedInstance() {
            invariant(withRef,
                '[React Timezone] To access the wrapped instance, ' +
                'the `{withRef: true}` option must be set when calling: ' +
                '`injectTimezone()`'
            );

            return this.wrapped;
        }

        render() {
            const timezoneProps = {
                value: timeHelper.guessUserTz(),
                helper: {
                    allTimezones: timezoneData,
                    getByCity: timeHelper.tzForCity,
                    getByName: timeHelper.tzForName,
                    getByCityAndZoneAbbreviation: timeHelper.tzForCityAndZoneAbbr,
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

            /*
            return (
                <WrappedComponent
                    {...this.props}
                    {...{ [timezonePropName]: {
                        value: timeHelper.guessUserTz(),
                        helper: {
                            allTimezones: timezoneData,
                            getByCity: timeHelper.tzForCity,
                            getByName: timeHelper.tzForName,
                            getByCityAndZoneAbbreviation: timeHelper.tzForCityAndZoneAbbr,
                            guessCurrent: timeHelper.guessUserTz,
                            match: timeHelper.isValueInCityOrZone,
                            compare: timeHelper.compareByCityAndZone
                        }
                    } }}
                    ref={withRef ? (comp) => { this.wrappedInstance = comp; } : null}
                />
            );
            */
        }
    }

    InjectTimezone.displayName = `InjectTimezone(${getDisplayName(WrappedComponent)})`;
    InjectTimezone.WrappedComponent = WrappedComponent;
    InjectTimezone.childContextTypes = {
        timezone: timezoneShape
    };

    return InjectTimezone;
}
