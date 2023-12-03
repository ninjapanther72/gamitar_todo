import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {checkNull, checkNullJson, checkNullStr, divSize, getDefJsonValue, getElement, isArr, isBoolTrue, printError} from "./ReactUtils";
import {Button, SimpleLoader, THEME} from "./index";

const Select = React.memo(({
                               className = "",
                               wrapperClassName = "",
                               labelClassName = "",
                               innerWrapperClassName = "",
                               refreshClassName = "",
                               variant = THEME,
                               showRefresh = false,
                               required = false,
                               showLoader = false,
                               disabled = false,
                               disableRefresh = false,
                               labelAsPlaceholder = false,
                               disabledKey = 'isDisabled',
                               idKey = "value",
                               textKey = "text",
                               id,
                               key,
                               placeholder = "",
                               options,
                               bg = "",
                               label = "",
                               onChange,
                               onRefresh,
                               refreshSize = "24px",
                               justifyAt = "center",
                               alignAt = "center",
                               wrap = "wrap",
                               defOption = "",

                               style = {},
                               labelStyle = {},
                               wrapperStyle = {},
                               refreshStyle = {},
                               ...rest
                           }) => {
    const TAG = "Select";
    // const selectId = checkNullStr(id) ? id + 'SelectId' : "SelectId";
    const selectId = checkNullStr(id) ? id : "SelectId";
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        // printLog(TAG, 'options:', options, "len:", getArrLen(options));
    }, [options]);
    useEffect(() => {
        setSelectedItem(defOption);
    }, [defOption]);

    const handleSelectChange = (e) => {
        try {
            const selectTag = getElement(selectId)
            const name = selectTag.options[selectTag.selectedIndex].text; //clientName

            const value = e.target.value;
            // printLog(TAG, 'handleSelectChange::e.target.name:', name, "value:", value);
            setSelectedItem(() => value);
            if (checkNull(onChange)) onChange(e, name, value)
        } catch (e) {
            printError(TAG, e);
        }
    };

    return (<>
        <div
            className={`m-0 p-0 select-wrapper transition 
                ${wrapperClassName} d-flex jc-${justifyAt} flex-${wrap} fd-${wrap === 'wrap' ? 'column' : 'row'} align-items-${alignAt}
                ${isBoolTrue(disabled) ? 'disable-itemx' : ''}`}
            key={key}
            style={{...wrapperStyle}}
        >

            {checkNullStr(label) && <label className={`m-0 p-1x px-1 pb-1 py-1x text-nowrap ${labelClassName}`}
                                           style={{...labelStyle}}>
                {isBoolTrue(required) ? <span className={'m-0 p-0 text-danger select-none'}>*</span> : ''}{label}
            </label>}

            <div className={`d-flex w-autox flex-nowrap fd-row jc-start al-center position-relative ${innerWrapperClassName}`}>
                <select
                    disabled={isBoolTrue(disabled) || isBoolTrue(showLoader)}
                    id={selectId}
                    // disabled={isBoolTrue(showLoader)}
                    className={`select ${variant} w-autox cursor-pointer transition bg-${bg} ${className} ${isBoolTrue(showLoader) ? 'disable-item' : ''}`}
                    value={selectedItem}
                    onChange={handleSelectChange}
                    style={{...style}}
                    {...rest}
                >
                    {checkNullStr(placeholder) && <option value="" disabled={true} className={'option'}>{placeholder}</option>}
                    {(!checkNullStr(placeholder) && isBoolTrue(labelAsPlaceholder) && checkNullStr(label)) &&
                        <option value="" disabled={true} className={'option'}>{label}</option>}
                    {isArr(options) && options.map((item, index) => (
                        <option className={`option text-dark`} key={index}
                                value={checkNullJson(item) ? item[idKey] : item + ''}
                                disabled={((checkNullJson(item)) ? isBoolTrue(getDefJsonValue(item, disabledKey, false)) : false)}>
                            {/*{item[textKey]}*/}
                            {checkNullJson(item) ? item[textKey] : item + ''}
                        </option>))}
                </select>

                {isBoolTrue(showLoader) && <div className={'p-0 m-0 position-absolutex'}
                                                style={{top: '.2rem', right: '2rem'}}>
                    <SimpleLoader variant={variant}
                                  wrapperClassName={'m-0 p-0 mt-0 ml-1'}
                                  borderWidth={'3px'} size={divSize(refreshSize, 1.4)}/>
                </div>}
                {(isBoolTrue(showRefresh) && !isBoolTrue(showLoader)) && <Button
                    className={`p-2 ml-1 mt-0 pt-0 highlight-${variant}-hover ${refreshClassName}`}
                    iconClass={`bi bi-arrow-clockwise text-${variant}`}
                    variant={'t'}
                    circular={true}
                    disabled={isBoolTrue(disabled) || isBoolTrue(disableRefresh)}
                    width={refreshSize}
                    height={refreshSize}
                    style={{...refreshStyle}}
                    onClick={(e) => {
                        if (checkNull(onRefresh)) onRefresh(e);
                    }}
                />}
            </div>

        </div>
    </>)

    function fun() {

    }
});
Select.propTypes = {
    className: PropTypes.string,
    innerWrapperClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    refreshClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    options: PropTypes.any,
    style: PropTypes.object,
    labelStyle: PropTypes.object,
    refreshStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    key: PropTypes.string,
    id: PropTypes.string,
    defOption: PropTypes.string,
    alignAt: PropTypes.string,
    refreshSize: PropTypes.string,
    textKey: PropTypes.string,
    idKey: PropTypes.string,
    disabledKey: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    labelAsPlaceholder: PropTypes.bool,
    variant: PropTypes.string,
    wrap: PropTypes.string,
    bg: PropTypes.string,
    showLoader: PropTypes.bool,
    disabled: PropTypes.bool,
    disableRefresh: PropTypes.bool,
    showRefresh: PropTypes.bool,
    required: PropTypes.bool,
    justifyAt: PropTypes.string,
    onChange: PropTypes.func,
    onRefresh: PropTypes.func,
};
export default Select;
