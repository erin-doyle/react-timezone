import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import '../styles/timezone.css';

import TimezonePicker from '../src/index';


storiesOf('Timezones', module)
    .addDecorator(withKnobs)
    .add('with timezone picker', () => (
        <TimezonePicker
            phrases={{
                timezonePickerLabel: text('timezonePickerLabel phrase', 'Closest City or Timezone')
            }}
            onTimezoneChange={action('onTimezoneChange')}
        />
    ));

