import React from 'react';
import {getDefValueStr} from "./ReactUtils";
import PropTypes from 'prop-types';

const MsgBox = (props, ...rest) => (
    <>
        <div
            className={`w-100 success-msg border-none text-${getDefValueStr(props.textAt, 'center')} 
            d-flex text-wrap flex-wrap justify-content-${getDefValueStr(props.textAt, 'center')} 
            align-items-${getDefValueStr(props.textAt, 'center')} 
            outline-none px-2 py-1 m-0 overflow-hiddenx scroller scroller-y-auto transition ${props.className}`}
            id={"success-msg"}
            style={{
                // color: props.msgColor,
                color: getDefValueStr(props.color, "black", ""),
                fontSize: getDefValueStr(props.fontSize, "13px", ""),
                height: getDefValueStr(props.height, "auto", ""),
                opacity: getDefValueStr(props.opacity, 1, ""),
                ...props.style
            }}
            {...rest}
        >
            {props.children}
        </div>
    </>
);

MsgBox.propTypes = {
    className: PropTypes.string,
    textAt: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['center', 'start', 'end', 'around', 'between'])]),
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['black'])]),
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['13px'])]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['auto'])]),
    opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([1, 0])]),
    children: PropTypes.any,
    style: PropTypes.object
};
export default MsgBox;
