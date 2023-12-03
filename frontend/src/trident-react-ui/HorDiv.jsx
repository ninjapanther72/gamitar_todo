import React from 'react';
import PropTypes from 'prop-types';

const HorDiv = React.memo(({
                               className = "",
                               variant = 'gray-light',
                               style = {}
                           }) => {
    return (<hr className={`border-${variant} w-100 m-0 my-1 p-0 ${className}`} style={style}/>)
});
HorDiv.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.string,
    style: PropTypes.object,
};
export default HorDiv;
