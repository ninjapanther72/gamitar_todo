import React from 'react';
import PropTypes from 'prop-types';
import {checkNullStr, isBoolTrue, subtractSize} from "./ReactUtils";

const Label = React.memo(({
                              className = "", variant = "",

                              bgColor = "",
                              color = "black",
                              overflow = "",
                              fontSize = "14px",
                              bordered = false, textAt = "center", width, height,
                              iconStyle = {},

                              id,
                              key,
                              asTag = false,

                              children, iconClass = "", icon, startControls, endControls,

                              style = {}, ...rest
                          }) => {
    const TAG = "Label";

    return (<>
        <label
            className={`d-flex w-auto text-${textAt} 
            align-items-center justify-content-${textAt} m-1px-2py-1 rounded-2 ${className} bg-${variant} 
                ${isBoolTrue(bordered) ? `border-2 border-solid border-${variant}` : ''}
                `}
            id={id}
            key={key}
            style={{
                width: width, height: height,
                fontSize: fontSize,
                color: color,
                backgroundColor: bgColor,
                padding: isBoolTrue(asTag) ? '.1rem .8rem' : '',
                ...style
            }}
            {...rest}
        >
            {(checkNullStr(icon) || checkNullStr(iconClass)) &&
                <span>
                   {checkNullStr(iconClass) ? <i className={`${iconClass}`}
                                                 style={{
                                                     color: color,
                                                     fontSize: checkNullStr(fontSize) ? subtractSize(fontSize, 2) : '',
                                                     ...iconStyle
                                                 }}/>
                       : <img src={icon}
                              className={`object-fit-cover p-0 m-0`}
                              style={{
                                  width: checkNullStr(fontSize) ? subtractSize(fontSize, 2) : '',
                                  height: checkNullStr(fontSize) ? subtractSize(fontSize, 2) : '',
                                  ...iconStyle
                              }}
                       />
                   }
                </span>
            }
            <span>{children}</span>
        </label>
    </>)

    function fun() {

    }
});
Label.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.string,
    id: PropTypes.string,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    fontSize: PropTypes.string,
    key: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    icon: PropTypes.any,
    iconClass: PropTypes.string,
    textAt: PropTypes.string,
    overflow: PropTypes.string,
    bordered: PropTypes.bool,
    children: PropTypes.any,
    startControls: PropTypes.any,
    endControls: PropTypes.any,
    style: PropTypes.object,
    iconStyle: PropTypes.object,

};
export default Label;
