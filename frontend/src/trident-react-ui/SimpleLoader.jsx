import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {checkNullStr, getParentHeight2, isBoolTrue, printError, pxToVh} from "./ReactUtils";
import {Label, THEME} from "./index";

/**Create a simple loader with single border*/
const SimpleLoader = React.memo(({
                                     wrapperClassName = "",
                                     className = "",
                                     labelClassName = "",
                                     sizeVariant = "",
                                     variant = THEME,
                                     size = "34px",
                                     borderWidth = "5px",
                                     labelFontSize = "13px",
                                     wrapperHeight = "100%",
                                     justifyAt = "center",
                                     alignAt = "center",
                                     loadingText,
                                     center = true,
                                     showLabel = true,
                                     show = false,
                                     style = {},
                                     wrapperStyle = {},
                                     labelStyle = {},
                                 }) => {
    const TAG = "SimpleLoader";

    const loaderRef = useRef(null);
    const wrapperRef = useRef(null);

    const [wrapperH, setWrapperH] = useState('100%');
    const [wrapperOpacity, setWrapperOpacity] = useState(0);

    const [loaderSize, setLoaderSize] = useState(size);
    const [loaderBorderWidth, setLoaderBorderWidth] = useState('0px');
    useEffect(() => {
        try {
            const loaderH = pxToVh(getParentHeight2(loaderRef.current));
            const parentH = getParentHeight2(wrapperRef.current);
            // printLog(TAG, "getParentHeight2.parentH:", parentH);
            // setWrapperH(parentH);
            setWrapperH((loaderH + parentH) + 'vh');
            setWrapperOpacity(1);
            // setLoaderSize(size);
            // setLoaderBorderWidth("5px");
        } catch (e) {
            printError(TAG, e);
        }
    }, []);
    useEffect(() => {
        setLoaderSize(size);
    }, [size]);
    return (<>
            <div
                ref={wrapperRef}
                className={`p-0 m-1x d-flex 
                ${isBoolTrue(center) ? `w-100 jc-${justifyAt} al-${alignAt} transition` : ''} 
                ${wrapperClassName}`}
                style={{
                    height: wrapperHeight,
                    ...wrapperStyle
                }}
            >
                <div className={'m-0 p-0'} style={{height: wrapperHeight}}>
                    <div className={`simple-loader-wrapper p-1 m-0 ${className}`}
                         style={{height: wrapperHeight, ...style}}>
                        <div className={`simple-loader transition ${sizeVariant} ${variant} `}
                             ref={loaderRef}
                             style={{
                                 width: loaderSize,
                                 height: loaderSize,
                                 borderWidth: borderWidth,
                                 ...style
                             }}
                        />
                    </div>

                    {isBoolTrue(showLabel) && checkNullStr(loadingText) && <div className={'m-0 p-0 mt-2'}>
                        <Label className={`w-100 text-dark px-2 py-1 m-0 ${labelClassName}`} fontSize={labelFontSize} style={{...labelStyle}}>
                            {loadingText}
                        </Label>
                    </div>}
                </div>
            </div>
        </>
    )
});
SimpleLoader.propTypes = {
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    borderWidth: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['60px'])]),
    variant: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['theme'])]),
    sizeVariant: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['xs', 'sm', '', 'lg', 'xl', 'xxl'])]),
    style: PropTypes.object,
    wrapperStyle: PropTypes.object,
    show: PropTypes.bool,
    wrapperHeight: PropTypes.string,
    justifyAt: PropTypes.string,
    alignAt: PropTypes.string,
    loadingText: PropTypes.string,
    labelStyle: PropTypes.object,
    labelFontSize: PropTypes.string,
    center: PropTypes.bool,
    showLabel: PropTypes.bool,
};
export default SimpleLoader;
