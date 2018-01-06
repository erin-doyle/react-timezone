import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import '../styles/timezone.css';

import { TimezoneAutocomplete } from '../index';

import HelperEnabledAutocomplete from './examples/HelperEnabledAutocomplete';


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
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
        />
    ))
    .add('with minLength of 5', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
            minLength={number('minLength', 5)}
        />
    ))
    .add('with minLength of 1', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
            minLength={number('minLength', 1)}
        />
    ))
    .add('with inputProps', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
            inputProps={{
                placeholder: 'Enter a city or timezone',
                onFocus: action('onFocus'),
                onBlur: action('onBlur')
            }}
        />
    ))
    .add('with menuStyle', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
            menuStyle={{
                borderRadius: '3px',
                border: '1px solid',
                backgroundColor: 'pink',
                boxSizing: 'border-box',
                marginBottom: '1%',
                padding: '10px 10px',
                width: '100%',
                height: '100%',
                color: 'purple',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                lineHeight: '2',
            }}
        />
    ))
    .add('with wrapperProps', () => (
        <TimezoneAutocomplete
            onTimezoneChange={action('onTimezoneChange')}
            onMenuVisibilityChange={action('onMenuVisibilityChange')}
            wrapperProps={{
                id: 'timezone-picker-search-input-wrapper',
                className: 'wrapper-class-name',
                style: {
                    backgroundColor: 'gray',
                    width: '30%',
                    margin: '15px'
                }
            }}
        />
    ));


storiesOf('Autocomplete using helper functions', module)
    .addDecorator(withKnobs)
    .addDecorator(LabelDecorator)
    .add('default', () => (
        <HelperEnabledAutocomplete />
    ));
