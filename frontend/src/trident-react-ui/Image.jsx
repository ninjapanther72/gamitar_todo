import React from 'react';
import PropTypes from 'prop-types';
import {isBoolTrue} from "./ReactUtils";

const Image = ({
                   className = "",
                   wrapperClassName = "",
                   src,
                   objectFit = "cover",
                   id,
                   width,
                   height,
                   transition = true,
                   disableDrag = false,
                   style = {},
                   wrapperStyle = {},
                   ...rest
               }) => {
    const TAG = "Image";
    return (<>
            <div className={`m-0x p-0 d-flex jc-center al-center ${wrapperClassName} ${isBoolTrue(disableDrag) ? 'select-none' : ''}`}
                 style={{...wrapperStyle}}>
                <img
                    src={src}
                    className={`${isBoolTrue(transition ? 'transition-lg' : '')} object-fit-${objectFit} ${className}`}
                    id={id}
                    width={width}
                    height={height}
                    style={{...style}}
                    onDrag={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onClick={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onContextMenu={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDrop={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDragEnter={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDragOver={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDragCapture={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDragEnterCapture={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    onDragStart={(e) => isBoolTrue(disableDrag) && e.preventDefault()}
                    {...rest}
                />
            </div>
        </>
    )

    function fun() {

    }
}
Image.propTypes = {
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    objectFit: PropTypes.string,
    id: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    src: PropTypes.string,
    children: PropTypes.any,
    transition: PropTypes.bool,
    disableDrag: PropTypes.bool,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
};
export default Image;
