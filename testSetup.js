import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// This allows us to fake the userAgent string for testing
Object.defineProperty(window.navigator, 'userAgent', (
    function userAgent(_value) {
        return {
            get: function _get() {
                return _value;
            },
            set: function _set(val) {
                _value = val; // eslint-disable-line no-param-reassign
            }
        };
    }(window.navigator.userAgent)));
