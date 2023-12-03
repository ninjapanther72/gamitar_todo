import React, {createContext, useContext, useState} from 'react';
import {TOAST_HIDE_DURATION} from "../config/AppConfig";
import {checkNullStr} from "../../trident-react-ui/ReactUtils.js";
import {printLog} from "../util/AppUtils";

const TAG = 'ToastContext.js';

/**
 * Context to manage global toast messages.
 * @type {React.Context<{ showToast: (message: string) => void, toastMsg: string }>}
 */
const ToastContext = createContext();

/**
 * Provider component to manage toast messages.
 * @component
 * @param {object} props - React component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 */
export const ToastProvider = ({children}) => {
    /**
     * State to manage the current toast message.
     * @type {[string, function]}
     */
    const [toastMsg, setToastMsg] = useState('');
    const [toastHideDur, setToastDur] = useState(TOAST_HIDE_DURATION);
    const [toastVariant, setToastVariant] = useState('black');// 'success' | 'info' | 'warning' | 'error'

    /**
     * Function to show a toast message globally.
     * @function
     * @param {string} message - The message to be displayed in the toast.
     */
    const showToast = (message) => {
        if (checkNullStr(message)) printLog(TAG, 'showToast.message:', message);
        setToastMsg(message);
    };
    const setToastHideDur = (dur) => {
        if (checkNullStr(dur)) setToastDur(dur);
    };

    const changeToastVariant = (variant) => {
        if (checkNullStr(variant)) setToastVariant((variant + '').replace('danger', 'warning'));//danger not supported
    };

    return (
        <ToastContext.Provider value={{showToast, toastMsg, toastHideDur, setToastHideDur, toastVariant, changeToastVariant}}>
            {children}
        </ToastContext.Provider>
    );
};

/**
 * Custom hook to access the toast context values.
 * @function
 * @returns {{ showToast: function, toastMsg: string }} Toast context values.
 *
 * @example
 * import React from 'react';
 * import { useToast } from './ToastContext';
 *
 * const YourComponent = () => {
 *   const { showToast } = useToast();
 *
 *   const handleClick = () => {
 *     showToast('This is a toast message from another component!');
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleClick}>Set Toast</button>
 *     </div>
 *   );
 * };
 *
 * export default YourComponent;
 */
export const useToast = () => {
    return useContext(ToastContext);
};
