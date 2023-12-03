import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {isBoolTrue} from "./ReactUtils";
import {Paper} from "@mui/material";

const Flexbox = React.memo(({
                                className = "",
                                wrap = "nowrap",
                                direction = "row",
                                justifyAt = "",
                                alignAt = "",
                                overflow = "",
                                position = "",
                                scrollX = false,
                                scrollY = false,
                                scrollbar = true,
                                key,

                                children,

                                style = {},
                                ...rest
                            }) => {
    const TAG = "Flexbox";

    useEffect(() => {

    }, []);

    return (<>
            <Paper
                className={`flexbox border-none bg-t outline-none m-0 p-0 d-flex shadow-none flex-${wrap} fd-${direction} overflow-${overflow} justify-content-${justifyAt} align-items-${alignAt} position-${position} ${className}
                ${isBoolTrue(scrollX) || isBoolTrue(scrollY) ? `scroller scroll-dark 
                ${isBoolTrue(scrollX) ? 'scroller-x-auto' : ''} ${isBoolTrue(scrollY) ? 'scroller-y-auto' : ''}${isBoolTrue(scrollbar) ? '' : 'no-bar'}` : ''}
                `}
                key={key}
                sx={{...style}}
                {...rest}>
                {children}
            </Paper>
        </>
    )

    function fun() {

    }
})
Flexbox.propTypes = {
    className: PropTypes.string,
    key: PropTypes.string,
    wrap: PropTypes.string,
    justifyAt: PropTypes.string,
    alignAt: PropTypes.string,
    overflow: PropTypes.string,
    direction: PropTypes.string,
    position: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
    scrollX: PropTypes.bool,
    scrollY: PropTypes.bool,
    scrollbar: PropTypes.bool,
};
export default Flexbox;
