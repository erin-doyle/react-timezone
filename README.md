# react-timezone <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![Coverage status][coveralls-svg]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

> Timezone picker widget using React.

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

Arguments: `timezone: Object` ([Timezone object](#timezone-object))

Invoked when the user selects an item from the dropdown menu.

```javascript
onTimezoneChange={(timezone) => console.log(`${timezone.city} - ${timezone.zoneName} - ${timezone.zoneAbbr}`)}
```

`onMenuVisibilityChange: Function` (optional)

Default value: function() {}

Arguments: `isOpen: Boolean`

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
    onFocus: () => console.log('onFocus'),
    onBlur: () => console.log('onBlur')
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

### Helper Functions
A number of helper functions are provided for use in dealing with timezone values, searching and matching.

`getAllTimezones`

Arguments: None

Returns an Array of all of the [Timezone objects](#timezone-object) used as the source of data
by the TimezoneAutocomplete and other helper functions.

`timezoneSearch`

Arguments: `filterFields: Object`

Returns an Array of [Timezone objects](#timezone-object) matching the search criteria provided in the filterFields
argument.  The filterFields object should have as keys any of the properties in the [Timezone object](#timezone-object)
with, as corresponding values, the string to search for in the respective field.  Any combination
of the keys (city, zoneName, or zoneAbbr) may be used.

For example:

```javascript
let matches;

matches = timezoneSearch({ city: 'New' }); 
/*
[
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" },
    { city: "New Salem", zoneName: "America/North_Dakota/New_Salem", zoneAbbr: "CST" },
    { city: "Canada/Newfoundland", zoneName: "Canada/Newfoundland", zoneAbbr: "NST" }
]
 */

matches = timezoneSearch({ city: 'New', zoneName: 'America' }); 
/*
[
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" },
    { city: "New Salem", zoneName: "America/North_Dakota/New_Salem", zoneAbbr: "CST" }
]
 */

matches = timezoneSearch({ city: 'New', zoneName: 'America', zoneAbbr: 'EST' }); 
/*
[
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" }
]
 */
```

`guessUserTimezone`

Arguments: None

Returns the [Timezone object](#timezone-object) of the timezone it deduces the user to be in.

```javascript
const timezone = guessUserTimezone();
console.log(`This user is in: ${timezone.city} - ${timezone.zoneAbbr}`);
```

`isTimezoneMatch`

Arguments: `timezone: Object` ([Timezone object](#timezone-object)) `, searchValue: String, minLength: number (optional)`

Returns true or false as to whether the searchValue is a match to the timezone.
The optional minLength argument provides a the minimum length the searchValue must be before searching is allowed.

```javascript
const timezone = { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" };
let isMatch;

isMatch = isTimezoneMatch(timezone, 'New York');
// true

isMatch = isTimezoneMatch(timezone, 'EST');
// true

isMatch = isTimezoneMatch(timezone, 'Somewhere Else');
// false

isMatch = isTimezoneMatch(timezone, 'New', 5);
// false

isMatch = isTimezoneMatch(timezone, 'New York', 5);
// true
```

`compareTimezones`

Arguments: `timezone1: Object` ([Timezone object](#timezone-object))`, timezone2: Object` ([Timezone object](#timezone-object))

Compares the city and zoneAbbr of the two provided timezones and returns:
 * 1: when timezone1 is considered less than timezone2
 *  -1: when timezone1 is considered greater than timezone2
 * 0: when timezone1 and timezone2 are equal

```javascript
let comparison;

comparison = compareTimezones(
    { city: "Chicago", zoneName: "America/Chicago", zoneAbbr: "CST" }, 
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" }
);
console.log(comparison);
// 1

comparison = compareTimezones(
    { city: "Port-au-Prince", zoneName: "America/Port-au-Prince", zoneAbbr: "EST" }, 
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" }
);
console.log(comparison);
// -1

comparison = compareTimezones(
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" }, 
    { city: "New York", zoneName: "America/New_York", zoneAbbr: "EST" }
);
console.log(comparison);
// 0
```

[package-url]: https://npmjs.org/package/@cashstar/react-timezone
[npm-version-svg]: http://versionbadg.es/erin-doyle/react-timezone.svg
[travis-svg]: https://travis-ci.org/erin-doyle/react-timezone.svg?branch=master
[travis-url]: https://travis-ci.org/erin-doyle/react-timezone
[coveralls-svg]: https://coveralls.io/repos/github/erin-doyle/react-timezone/badge.svg
[coveralls-url]: https://coveralls.io/github/erin-doyle/react-timezone
[npm-badge-png]: https://nodei.co/npm/@cashstar/react-timezone.png?downloads=true&stars=true
[downloads-image]: http://img.shields.io/npm/dm/@cashstar/react-timezone.svg
[downloads-url]: http://npm-stat.com/charts.html?package=@cashstar/react-timezone