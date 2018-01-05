# react-timezone
Timezone picker widget using React

_TODO: add gif of TimezoneAutocomplete in action_

## Getting Started
### Local Demo
To run the demo on your own computer:
* Clone this repository
* `npm install`
* `npm run storybook`
* Visit http://localhost:9001/

### Install dependencies
Ensure packages are installed with correct version numbers by running:
  ```sh
  (
    export PKG=react-timezone;
    npm info "$PKG" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g; s/ *//g' | xargs npm install --save "$PKG"
  )
  ```

  Which produces and runs a command like:

  ```sh
  npm install --save react-timezone moment@>=#.## moment-timezone@>=#.## react@>=#.## react-dom@>=#.##
  ```

## Usage
The TimezoneAutocomplete component is an auto-complete input that shows fuzzy matches based on the text entered
into the field and refreshes matches shown with each additional character entered.

TimezoneAutocomplete without any customization:

```javascript
<div>
    <label>
        Closest City or Timezone
    </label>
    <TimezoneAutocomplete onTimezoneChange={(timezone) => console.log(`new timezone: ${timezone}`)} />
</div>
```

## Timezone Object
The Timezone object that is passed to onTimezoneChange has the following shape:

- `city` (string) - the major city in that timezone (i.e. Los Angeles)
- `zoneName` (string) - the [moment-timezone Name property](https://momentjs.com/timezone/docs/#/zone-object/name/)  
which is the uniquely identifying name of the timezone (i.e. America/Los_Angeles)
- `zoneAbbr` (string) - the [moment-timezone Abbr property](https://momentjs.com/timezone/docs/#/zone-object/abbr/)
which is the abbreviation for the timezone (i.e. PST or PDT)

The shape can be imported for use in defining PropTypes in your project by:

```javascript
import { timezoneShape } from 'react-timezone';
```

## API
### Props


`onTimezoneChange: Function` (optional)

Default value: function() {}

Arguments: timezone: [Timezone object](#timezone-object)

Invoked when the user selects an item from the dropdown menu.

```javascript
onTimezoneChange={(timezone) => console.log(`${timezone.city} - ${timezone.zoneName} - ${timezone.zoneAbbr}`)}
```

`onMenuVisibilityChange: Function` (optional)

Default value: function() {}

Arguments: isOpen: Boolean

Invoked every time the dropdown menu's visibility changes (i.e. every time it is displayed/hidden).

```javascript
onMenuVisibilityChange={(isOpen) => console.log(isOpen ? 'I\'m open!' : 'I\'m closed!')}
```

`inputProps: Object` (optional)

Default value: {}

These props will be applied to the `<input />` element rendered by TimezoneAutocomplete. 
Any properties supported by HTMLInputElement can be specified, apart from the following which are set by TimezoneAutocomplete: 
- value
- autoComplete
- role
- aria-autocomplete 

inputProps is commonly used for (but not limited to) placeholder, event handlers (onFocus, onBlur, etc.), autoFocus, etc..

```javascript
inputProps={{
    placeholder: 'Enter a city or timezone',
    onFocus: console.log('onFocus'),
    onBlur: console.log('onBlur')
}}
```

`menuStyle: Object` (optional)

Default value:
```json
{
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%'
}
```
Styles that are applied to the dropdown menu in the default renderMenu implementation.

```javascript
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
```

`wrapperProps: Object` (optional)

Default value: {}

Props that are applied to the element which wraps the `<input />` and dropdown menu 
elements rendered by TimezoneAutocomplete.

```javascript
wrapperProps={{
    id: 'timezone-picker-search-input-wrapper',
    className: 'wrapper-class-name',
    style: {
        backgroundColor: 'gray',
        width: '30%',
        margin: '15px'
    }
}}
```

`minLength: number` (optional)

Default value: 3

The number of characters the user must enter before the dropdown opens displaying any
matching timezone options.
