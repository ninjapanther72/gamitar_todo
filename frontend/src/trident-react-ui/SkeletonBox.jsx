import React, {useEffect} from 'react';
import PropTypes from 'prop-types';


const SkeletonBox = ({
                         className = "",
                         bg = "gray-md",
                         children,
                         height,
                         width,
                         rounded = '2',
                         style = {}
                     }) => {
    const TAG = "SkeletonBox";

    useEffect(() => {

    }, []);
    return (<>
            <div className={`rounded-${rounded} w-100x p-0 px-2 m-0 skeleton-box ${className} bg-${bg}`}
                 style={{height: height, width: width, ...style}}>
                {children}
            </div>
        </>
    )
}
SkeletonBox.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
};
export default SkeletonBox;
