import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import '../styles/timezone.css';

import TimezoneAutocomplete from '../src/index';

import InjectedAutocomplete from './examples/InjectedAutocomplete';


storiesOf('Timezones', module)
    .addDecorator(withKnobs)
    .add('with TimezoneAutocomplete Component', () => (
        <TimezoneAutocomplete
            phrases={{
                timezonePickerLabel: text('timezonePickerLabel phrase', 'Closest City or Timezone')
            }}
            onTimezoneChange={action('onTimezoneChange')}
        />
    ))
    .add('with injectTimezone HOC', () => (
        <InjectedAutocomplete />
    ));

