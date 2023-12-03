import React, {useEffect, useRef} from "react";
import {isBoolTrue, printError} from "./ReactUtils";
import PropTypes from 'prop-types';

const ScrollView = React.memo(({
                                   className = "",
                                   id = "",
                                   style = {},
                                   scroll = true,
                                   transition = true,
                                   scrollVert = true,
                                   scrollHor = false,
                                   scrollSpeed = 50,
                                   height = "300px",
                                   scrollVariant = "light",
                                   children,
                                   ...rest
                               }) => {
    const TAG = "ScrollView";

    const scrollViewRef = useRef(null);
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const handleKeyDown = (event) => {
        try {

            const {key, ctrlKey, metaKey} = event;
            if (key === "ArrowUp" || (key === "ArrowUp" && !ctrlKey && !metaKey)) {
                event.preventDefault();
                scrollViewRef.current.scrollTop -= scrollSpeed;
            } else if (key === "ArrowDown" || (key === "ArrowDown" && !ctrlKey && !metaKey)) {
                event.preventDefault();
                scrollViewRef.current.scrollTop += scrollSpeed;
            } else if (key === "PageUp" && ctrlKey) {
                event.preventDefault();
                scrollViewRef.current.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } else if (key === "PageDown" && ctrlKey) {
                event.preventDefault();
                scrollViewRef.current.scrollTo({
                    top: scrollViewRef.current.scrollHeight,
                    behavior: "smooth"
                });
            } else if (key === "Home" && ctrlKey) {
                event.preventDefault();
                scrollViewRef.current.scrollTop = 0;
            } else if (key === "End" && ctrlKey) {
                event.preventDefault();
                scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
            }
        } catch (e) {
            printError(TAG, e);
        }
    };

    return (
        <>
            <div ref={scrollViewRef}
                 id={id}
                 className={`scroll-view scroller scroller-y-auto p-0 m-0 ${className} scroll-${scrollVariant} 
                ${isBoolTrue(transition) ? 'transition' : ''}`}
                 style={{
                     height: height,
                     overflowX: isBoolTrue(scrollHor) ? "scroll" : "hidden",
                     overflowY: isBoolTrue(scrollVert) ? "scroll" : "hidden",
                     ...style,
                 }}
                 {...rest}
            >
                <div>{children}</div>
            </div>
        </>
    );
});

ScrollView.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    style: PropTypes.object,
    scroll: PropTypes.bool,
    transition: PropTypes.bool,
    scrollVert: PropTypes.bool,
    scrollHor: PropTypes.bool,
    height: PropTypes.string,
    scrollVariant: PropTypes.string,
    children: PropTypes.any,
    scrollSpeed: PropTypes.number,
};
export default ScrollView;
