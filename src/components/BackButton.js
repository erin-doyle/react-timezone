import React from 'react';
import PropTypes from 'prop-types';

import ICONS from '../utils/icons';


const BackButton = ({ clickHandler }) => {
    const keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            clickHandler(e);
        }
    };

    return (
        <span
            role="button"
            tabIndex="0"
            onClick={clickHandler}
            onKeyDown={keyDownHandler}
        >
            {ICONS.chevronLeft}
        </span>
    );
};

BackButton.defaultProps = {
    clickHandler: () => {}
};

BackButton.propTypes = {
    clickHandler: PropTypes.func
};

export default BackButton;
