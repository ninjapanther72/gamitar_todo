import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {checkNullJson, checkNullStr, isBoolTrue} from "./ReactUtils";
import {SimpleLoader} from "./index";

/**
 * Create a loading-section that has a loader & message-label.
 *
 * @example
 * <LoadingSection
 *      success={getDefJsonValue(dataLoadingStates, 'success')}
 *      loaded={getDefJsonValue(dataLoadingStates, 'loaded')}
 *      msg={getDefJsonValue(dataLoadingStates, 'msg')}
 * />
 *
 * @param {Object} props - Props.
 * @param {string} className - container className.
 * @param {string|boolean} loaded - Whether data has been loaded or not (default: false).
 * @param {string|boolean} success - Whether data fetching process was successful or not (default: false).
 * @param {string|boolean} msgOnFailureOnly - Whether to the message only on failure (default: false).
 * @param {string|any} msg - Message to show in the label field (default: null).
 * @param {Object} style - Styles for the container.
 */
const LoadingSection = ({
                            // loadingStatus = {},
                            className = "",
                            loaded = false,
                            success = false,
                            msg = '',
                            style = {},
                            showOnFailureOnly = true,
                            msgOnFailureOnly = false,
                        }) => {
    const TAG = "LoadingSection";

    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setHasLoaded(isBoolTrue(loaded));
        // printLog(TAG, 'loaded:', loaded, 'success:', success, 'msg:', msg);
    }, [loaded, success, msg]);


    return (<>
        {((isBoolTrue(showOnFailureOnly) && !isBoolTrue(success)) || !isBoolTrue(showOnFailureOnly)) &&
            // {
            <div className={`section h-100 borderless p-0 m-0 d-flex jc-center al-center ${className}`}
                 style={{...style}}>
                {/*{!getStatusValue('loaded', loaded, true) && <SimpleLoader wrapperClassName={'m-1'}/>}*/}
                {!isBoolTrue(loaded) && <SimpleLoader wrapperClassName={'m-1'}/>}

                {(isBoolTrue(loaded) && ((isBoolTrue(msgOnFailureOnly) && !isBoolTrue(success)) || (!isBoolTrue(msgOnFailureOnly)))) && (!checkNullJson(msg) && !checkNullStr(msg)) &&
                    <label
                        className={'m-0 mt-1 text-dark fw-normal fs-md text-center-force d-flex w-100'}>
                        {/*{getStatusValue('msg', msg, false)+''}*/}
                        {msg + ''}
                    </label>}
            </div>}
    </>)

    // function getStatusValue(name, plainValue, bool = false) {
    //     let value = checkNullJson(loadingStatus, true) ? getDefJsonValue(loadingStatus, name) : plainValue;
    //     return isBoolTrue(bool) ? isBoolTrue(value) : value;
    // }
}
LoadingSection.propTypes = {
    className: PropTypes.string,
    showOnFailureOnly: PropTypes.bool,
    loaded: PropTypes.any,
    success: PropTypes.any,
    msg: PropTypes.any,
    wrapperStyle: PropTypes.object,
    msgOnFailureOnly: PropTypes.bool,
};
export default LoadingSection;
