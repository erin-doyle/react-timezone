import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import '../styles/timezone.css';

import { TimezoneAutocomplete } from '../index';

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

storiesOf('TimezoneAutocomplete Component', module)
    .addDecorator(withKnobs)
    .addDecorator(LabelDecorator)
    .add('default', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
        />
    ))
    .add('with minLength of 3', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            minLength={number('minLength', 3)}
        />
    ));

storiesOf('injectTimezone HOC', module)
    .addDecorator(withKnobs)
    .addDecorator(LabelDecorator)
    .add('default', () => (
        <InjectedAutocomplete />
    ));
