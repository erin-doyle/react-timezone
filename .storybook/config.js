import { addDecorator, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';


addDecorator(withA11y);

function loadStories() {
    require('../stories/index.js');
    // You can require as many stories as you need.
}

configure(loadStories, module);
