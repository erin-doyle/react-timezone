import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import '../styles/timezone.css';

import TimezoneAutocomplete from '../src/index';

import InjectedAutocomplete from './examples/InjectedAutocomplete';

const LabelDecorator = storyFn => (
    <div className="timezone_picker_container">
        <div className="timezone_picker_search">
            <label id="timezone-picker-search-label" htmlFor="timezone-picker-search-input">
                Closest City or Timezone
            </label>
            { storyFn() }
        </div>
    </div>
);

storiesOf('Timezones', module)
    .addDecorator(withKnobs)
    .addDecorator(LabelDecorator)
    .add('with TimezoneAutocomplete Component', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
        />
    ))
    .add('with injectTimezone HOC', () => (
        <InjectedAutocomplete />
    ));

