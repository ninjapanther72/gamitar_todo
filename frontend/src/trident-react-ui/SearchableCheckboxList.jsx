import React, {useEffect, useState, useTransition} from 'react';
// import {useTransition as useTransition_Spring} from 'react-spring';
import PropTypes from 'prop-types';
import {Button, Checkbox, Flexbox, Input, Label, ScrollView, Section, Select, SimpleLoader, THEME} from "./index";
import {
    checkNullArr,
    checkNullStr,
    dropJsonListDuplicates,
    getArrLen,
    getDefJsonValue,
    getDefValueStr,
    isArr,
    isBoolTrue,
    isJsonValueTrue,
    jsonToStr,
    parseInteger,
    printError,
    printLog
} from "./ReactUtils";
import {CssVariant, IconClass, RippleVarVariant} from "./config/TridentConfigs";

/**
 * A searchable check-list component.
 *
 * @param {string} wrapperClassName -
 *
 * @example
 * // Usage example:
 * const Fields = {
 *     currSelectId='currSelectId',
 *     currSelectName='currSelectName',
 *     defSelectItem='defSelectItem',
 *     selectOptions='selectOptions',
 *     showSelectListLoader='showSelectListLoader',
 *     checkList='checkList',
 *     checkList_SelectedOnly='checkList_SelectedOnly',
 *     showCheckListLoader='showCheckListLoader',
 * };
 * const [fieldsData, setFieldsData] = useState({});
 *
 * <SearchableCheckboxList
 *                 wrapperClassName={''}
 *                 borderBoxClassName={''}
 *                 borderless={true}
 *                 variant={THEME}
 *
 *                 //generic
 *                 label={''}
 *
 *                 //select
 *                 showSelect={true}
 *                 selectLabel={'Choose an item'}
 *                 selectDefOption={getFieldValue(Fields.defSelectItem)}
 *                 selectOptions={getFieldValue(Fields.selectOptions, [])}
 *                 selectIdKey={'id'}
 *                 selectTextKey={'name'}
 *                 disableSelect={isFieldValueTrue(Fields.showCheckListLoader)}
 *                 showSelectLoader={isFieldValueTrue(Fields.showCheckListLoader)}
 *                 onSelectChange={(e, value, text) => {
 *                     log('onSelectChange.value:', value, 'text:', text);
 *
 *                     updateFieldValue(Fields.currSelectName, text);
 *                     updateFieldValue(Fields.currSelectId, value);
 *                 }}
 *
 *                 //cb-list
 *                 showDataList={true}
 *                 showSelectAll={true}
 *                 showDisplaySelectedOnly={true}
 *                 showSelectedCount={true}
 *                 checkBinarySelection={false}
 *                 isCheckItemJson={true}
 *                 checkItemJsonIdKey={'id'}
 *                 checkItemJsonTextKey={'name'}
 *                 checkDataList={getFieldValue(Fields.checkList, [])}
 *                 showDataListLoader={isFieldValueTrue(Fields.showCheckListLoader)}
 *                 onItemCheck={(e, value, updatedList, newCheckedList) => {
 *                     log('onItemCheck.value:', value, 'updatedList:', updatedList, 'len:', updatedList.length);
 *                     log('onItemCheck.value:', value, 'newCheckedList:', newCheckedList, 'len:', newCheckedList.length);
 *                     updateFieldValue(Fields.checkList_SelectedOnly, updatedList);
 *                 }}
 *                 onCheckAll={(e, value, updatedList, newCheckedList) => {
 *                     log('onItemCheck.value:', value, 'updatedList:', updatedList, 'len:', updatedList.length);
 *                     log('onItemCheck.value:', value, 'newCheckedList:', newCheckedList, 'len:', newCheckedList.length);
 *                     updateFieldValue(Fields.checkList_SelectedOnly, updatedList);
 *                 }}
 *
 *                 //search
 *                 searchable={true}
 *                 onSearch={(value) => {
 *                     log('onSearch.value:', value,);
 *                 }}
 *  />
 *
 *      function updateFieldValue(field, value) {
 *         setFieldsData(prevState => ({...prevState, [field]: value}));
 *     }
 *
 *     function getFieldValue(field, defValue) {
 *         return getDefJsonValue(fieldsData, field, defValue);
 *     }
 *
 *     function isFieldValueTrue(field) {
 *         return isBoolTrue(getFieldValue(field));
 *     }
 */
const SearchableCheckboxList = React.memo(({
                                               wrapperClassName = "",
                                               borderBoxClassName = "",
                                               searchClassName = "",
                                               cbClassName = "",
                                               selectClassName = "",
                                               selectLabelClassName = "",
                                               scrollerClassName = "",
                                               scrollWrapperClassName = "",
                                               listWrapperClassName = "",
                                               labelClassName = "",
                                               headerClassName = "",
                                               countLabelClassName = "",
                                               msgClassName = "",
                                               roundedVariant = 3,

                                               padded = true,
                                               pad = '3',
                                               selectBelowPad = '3',
                                               borderless = true,
                                               borderlessList = false,
                                               selectable = true,
                                               selectType = 'checkbox',//radio, highlight, bordered, highlightBorder

                                               scrollVariant = "dark",
                                               listHeight = "35vh",
                                               variant = THEME,
                                               noSearchFoundMsg = 'No search found!',

                                               required = false,
                                               showHeader = true,
                                               inlineHeader = false,
                                               label,

                                               checkDataList = [],//{name, id, selected:true, original:true}
                                               isCheckItemJson = false,
                                               originalCheckItemOutlined = false,
                                               minifyUpdatedList = false,
                                               checkItemJsonIdKey,
                                               checkItemJsonTextKey,
                                               showCheckItemEditButton = false,
                                               showCheckItemRemoveButton = false,
                                               msg,

                                               selectPlaceholder = 'Choose an option',
                                               selectDefOption,
                                               selectOptions = [],
                                               selectLabel,
                                               selectId,
                                               selectTextKey = 'text',
                                               selectIdKey = 'id',
                                               onSelectChange,
                                               showSelectLoader = false,
                                               selectRequired = false,

                                               showSelectAll = true,
                                               showDisplaySelectedOnly = false,
                                               showDisplaySelectedOnlyText = 'Show Selected',
                                               searchable = true,
                                               showSelectedCount = true,
                                               showSearchCount = true,
                                               showTotalCount = true,
                                               showSelect = true,
                                               disableSelect = false,
                                               showSelectedCountText = 'Selected',
                                               // checkBinarySelection = false,
                                               onItemCheck,
                                               onCheckListUpdate,
                                               onCheckItemEdit,
                                               onCheckItemDelete,
                                               onCheckAll,
                                               showDataListLoader = false,
                                               showCheckItemTooltip = false,
                                               showCheckItemTooltipLimit = 40,
                                               scrollLargeCheckItem = true,
                                               showDataList = true,
                                               checkListColumnCount = 1,

                                               onSearch,

                                               style = {},
                                               searchInputStyle = {},
                                               cbStyle = {},
                                               labelStyle = {},
                                               countLabelStyle = {},
                                               headerStyle = {},
                                               msgStyle = {},

                                               selectBelowComponent,
                                           }) => {
    const TAG = "SearchableCheckboxList";

    const Fields = {
        showSelectLoader: 'showSelectLoader',
        selectId: 'selectId',
        selectText: 'selectText',
        totalCount: 'totalCount',
        selectedCount: 'selectedCount',
        msgText: 'msgText',
        searchValue: 'searchValue',
        allSelected: 'allSelected',
        itemList: 'itemList',
        filteredList: 'filteredList',
        displaySelectedListOnly: 'displaySelectedListOnly',
        selectedList: 'selectedList',
    };

    const [searchListPending, startSearchListTransition] = useTransition();
    const [listSelectPending, startListSelectTransition] = useTransition();
    const [selectViewPending, startSelectViewTransition] = useTransition();

    const [fieldsData, setFieldsData] = useState({});


    useEffect(() => {
        // log('checkDataList:', sliceArr(checkDataList, 0, 2), 'len:', getArrLen(checkDataList));
        // log('isCheckItemJson:', isCheckItemJson, 'checkItemJsonIdKey:', checkItemJsonIdKey, 'checkItemJsonTextKey:', checkItemJsonTextKey);
        // if (checkNullArr(checkDataList)) {
        // log('useEffect.checkDataList:', sliceArr(checkDataList, 0, 5));
        if (isArr(checkDataList)) {
            if (checkNullArr(checkDataList)) {
                if (isBoolTrue(isCheckItemJson)) {
                    if (!checkNullStr(checkItemJsonIdKey)) throw new Error(`Check-data list items have been specified as objects/json, so it's id-key cannot be null`);
                    if (!checkNullStr(checkItemJsonTextKey)) throw new Error(`Check-data list items have been specified as objects/json, so it's text/name-key cannot be null!`);
                }
            }

            const list = checkDataList.map((item) => {
                return {
                    // id: item, name: item, searched: false, selected: false,
                    ...isBoolTrue(isCheckItemJson) ? item : {},
                    id: isBoolTrue(isCheckItemJson) ? getDefJsonValue(item, checkItemJsonIdKey) : jsonToStr(item),
                    name: isBoolTrue(isCheckItemJson) ? getDefJsonValue(item, checkItemJsonTextKey) : jsonToStr(item),
                    subtitle: isBoolTrue(isCheckItemJson) ? getDefJsonValue(item, 'subtitle') : '',
                    endSubtitle: isBoolTrue(isCheckItemJson) ? getDefJsonValue(item, 'endSubtitle') : '',
                    selected: isBoolTrue(isCheckItemJson) ? isJsonValueTrue(item, 'selected') : false,
                    original: isBoolTrue(isCheckItemJson) ? (isJsonValueTrue(item, 'original') ? isJsonValueTrue(item, 'original') : isJsonValueTrue(item, 'selected')) : false,
                    // original: isBoolTrue(isCheckItemJson) ? isJsonValueTrue(item, 'original') : false,//org
                    searched: false,
                }
            });
            updateFieldValue(Fields.itemList, list);
            // log('useEffect.checkDataList triggered');
        }
        // }, [checkDataList, isCheckItemJson, checkItemJsonIdKey, checkItemJsonTextKey,checkDataListSelectedModal]);
    }, [checkDataList, isCheckItemJson, checkItemJsonIdKey, checkItemJsonTextKey]);

    useEffect(() => {
        const itemList = getFieldValue(Fields.itemList, []);
        if (checkNullArr(itemList)) {
            startSearchListTransition(() => {
                const searchText = getFieldValue(Fields.searchValue) + '';
                const list = itemList.map((item) => ({
                    ...item,
                    // searched: (item.name + '').toLowerCase().includes(searchText.toLowerCase()),
                    searched: isBoolTrue(showDisplaySelectedOnly)
                        ? !isBoolTrue(getDefJsonValue(item, 'hide', false)) && (item.name + '').toLowerCase().includes(searchText.toLowerCase())
                        : (item.name + '').toLowerCase().includes(searchText.toLowerCase()),
                }));
                updateFieldValue(Fields.filteredList, list);
            });
            // log('useEffect.itemList | searchValue triggered');
        }
    }, [getFieldValue(Fields.itemList, []), getFieldValue(Fields.searchValue)]);

    return (<>{createPanel()}</>)

    //-----------------------------UI Functions start-----------------------------------
    function createPanel() {
        return <div className={`m-0 p-0 w-100 ${wrapperClassName} bg-dangerx`}>
            {/*header*/}
            {isBoolTrue(showHeader) && <div className={`m-0 p-0 w-100 bg-dangerx ${headerClassName}`}>
                {checkNullStr(label) && <Label className={`p-1 px-${isBoolTrue(padded) ? pad : 0} m-0 ${labelClassName}
                ${!(labelClassName + '').includes('fs-') ? 'fs-md' : ''}`}
                                               textAt={'start'} style={labelStyle}>
                    {isBoolTrue(required) && <span className={'text-danger'}>*</span>}{label}
                </Label>}
            </div>}

            {/*content*/}
            <Section
                className={`m-0 p-0 px-0 w-100 py-${!checkIfCheckListFound() ? parseInteger(pad) - 1 : (isBoolTrue(padded) ? parseInteger(pad) - 1 : '0')} ${borderBoxClassName} bg-infox`}
                bg={''}
                borderless={(!isBoolTrue(showDataList)) || borderless}
                overflow={'visible'}>
                {isBoolTrue(showSelect) && createSelect()}
                {selectBelowComponent && selectBelowComponent}

                {isBoolTrue(showDataList) && <div className={'w-100 m-0 m-0 bg-infox'}>

                    {/*select-all & cb-list*/}
                    {(!isBoolTrue(showDataListLoader)) &&
                        <div
                            className={`w-100 m-0 p-0 px-${isBoolTrue(padded) ? (isBoolTrue(inlineHeader) ? 0 : pad) : 0} mt-${!checkIfCheckListFound() ? '0' : '0'}`}>
                            <Section
                                className={`p-0 px-3x m-0 w-100 pt-0 ${scrollWrapperClassName}`}
                                borderless={borderlessList} roundedVariant={roundedVariant}
                                contentClassName={'position-relative bg-infox'}
                                overflow={'visible'}>
                                <div className={`w-100 m-0 p-0`}>
                                    {/*search-box & count-bar*/}
                                    {!isBoolTrue(inlineHeader) && createSearchBoxAndCountBar()}

                                    {/*select-all & show-selected-only cbs*/}
                                    {!isBoolTrue(inlineHeader) && createSelectAllAndShowSelectOnlyCbs()}

                                    {isBoolTrue(inlineHeader) &&
                                        <div
                                            className={`w-100 m-0 p-0 px-${isBoolTrue(padded) ? pad : 0} row bg-infox al-center jc-center border-bottom border-bottom-1 border-gray`}>
                                            <div className={`m-0 p-1 col-sm-12 col-md-6 bg-dangerx`}>
                                                {createSearchBoxAndCountBar(0)}
                                            </div>
                                            <div className={`m-0 p-1 col-sm-12 col-md-6 bg-warningx`}>
                                                {createSelectAllAndShowSelectOnlyCbs()}
                                            </div>
                                        </div>}

                                    {/*cb-list-scroller*/}
                                    {createCbListScrollView()}
                                </div>
                            </Section>
                        </div>}

                    {isBoolTrue(showDataListLoader) &&
                        <div className={`w-100 m-0 p-0 px-${isBoolTrue(padded) ? pad : '0'} mt-2 bg-warningx`}>
                            <Section className={'w-100 p-0 m-0'} roundedVariant={roundedVariant} style={{minHeight: listHeight}}
                                     overflow={'visible'}>
                                <SimpleLoader
                                    variant={variant}
                                    wrapperClassName={'m-0 p-2 mt-0 bg-infox h-100'}
                                    wrapperHeight={listHeight}/>
                            </Section>
                        </div>
                    }
                </div>}
            </Section>
        </div>
    }

    function createSelect() {
        return <div className={`w-100 m-0 p-0 px-${isBoolTrue(padded) ? pad : '0'}`}>
            <Select
                id={getSelectId()}
                wrapperClassName={`m-0 p-0 pb-${selectBelowPad} ${selectClassName}`}
                innerWrapperClassName={'w-100 m-0 p-0'}
                style={{minWidth: '90%'}}
                variant={variant}
                className={`w-100 py-2 mb-0 m-0 rounded-${roundedVariant}`}
                wrap={`wrap`}
                justifyAt={'start'}
                labelClassName={`px-1 pb-0 text-input-label text-start w-100 ${selectLabelClassName}`}
                required={selectRequired}
                label={selectLabel}
                textKey={selectTextKey}
                idKey={selectIdKey}
                placeholder={selectPlaceholder}
                disabled={disableSelect}
                options={selectOptions}
                defOption={selectDefOption}
                // defOption={getDefValueStr(getFieldValue(Fields.selectId),selectDefOption)}
                showLoader={selectViewPending || showSelectLoader}
                onChange={(e, text, value) => {
                    // log('Select::text:', text, "value:", value);
                    startSelectViewTransition(() => {
                        updateFieldValue(Fields.selectId, value);
                        updateFieldValue(Fields.selectText, text);
                        if (onSelectChange) onSelectChange(e, value, text);
                    });
                }}
            />
        </div>
    }

    function createSearchBoxAndCountBar(padValue = pad) {
        return (isBoolTrue(searchable) || canShowCountBar()) &&
            <Flexbox
                className={`w-100 pt-${isBoolTrue(padded) ? padValue : '0'} mb-2x bg-dangerx 
                            px-${isBoolTrue(padded) ? padValue : 0} 
                            pt-${isBoolTrue(padded) ? parseInteger(padValue) - 2 : '0'}`}
                justifyAt={canShowCountBar() ? 'between' : 'center'}
                alignAt={'center'}
                position={'relativex'}
                wrap={'nowrap'}>
                {/*input*/}
                {isBoolTrue(searchable) &&
                    <div
                        className={`w-${(canShowCountBar() && checkIfCheckListFound()) ? '75' : '100'} m-0 p-0 position-relative`}>
                        <Input
                            wrapperClassName={`w-100 pt-2x px-0`}
                            className={`perms-mgmt-mlist-form-control rounded-${roundedVariant} ${searchClassName}`}
                            type={"text"}
                            placeholder={"Search..."}
                            disabled={!checkIfCheckListFound()}
                            floatingLabel={false}
                            placeholderAsLabel={false}
                            showMsgOverride={false}
                            showLabel={false}
                            style={searchInputStyle}
                            // showMsg={false}
                            value={getFieldValue(Fields.searchValue)}
                            onChange={(e) => {
                                // startSearchTypeTransition(() => {
                                updateFieldValue(Fields.searchValue, e.target.value);
                                if (onSearch) onSearch(e.target.value);
                                // });
                            }}
                        />
                        {/*{(searchListPending || searchTypePending)*/}
                        {(searchListPending) && <div className={'p-0 m-0 pl-2 w-10x position-absolute'}
                                                     style={{top: '22%', right: '2%'}}>
                            <SimpleLoader
                                variant={variant}
                                wrapperClassName={'m-0 p-0 mt-0'}
                                borderWidth={'2px'}
                                size={'14px'}/>
                        </div>}
                    </div>}

                {/*count-bar*/}
                {((checkIfCheckListFound()) || canShowCountBar()) &&
                    <div className={`position-absolutex w-24 p-0 m-0 mb-5x bg-dangerx`}
                         style={{top: '-.5rem', right: '.4rem'}}>
                        <div className={'p-0 px-2 m-0 w-100 d-flex fd-row flex-nowrap jc-end al-center bg-successx'}>
                            {/*count*/}
                            <Label className={'m-0 p-1 fs-sm text-dark text-nowrap'} textAt={'start'}>
                                {/*total-count*/}
                                {isBoolTrue(showTotalCount) && <span className={'px-1'}>Total: {getArrLen(getCheckList()) + ' '}</span>}

                                {/*{(isBoolTrue(showTotalCount)&&isBoolTrue(showTotalCount))&&<span>|</span>}*/}

                                {/*selected-count*/}
                                {isBoolTrue(showSelectedCount) &&
                                    <span
                                        className={'px-1'}>{showSelectedCountText}: {getArrLen(getCheckList().filter(item => isBoolTrue(item.selected))) + ' '}</span>}

                                {/*<span>|</span>*/}

                                {/*selected-count*/}
                                {isBoolTrue(showSearchCount) &&
                                    <span
                                        className={'px-1'}>Searched: {(checkNullStr(getFieldValue(Fields.searchValue)) && checkNullArr(getFieldValue(Fields.filteredList))) ? getArrLen(getFieldValue(Fields.filteredList, []).filter(item => isBoolTrue(item.searched))) : 0}</span>}
                            </Label>
                        </div>
                    </div>}
            </Flexbox>
    }

    function createSelectAllAndShowSelectOnlyCbs() {
        return (!isBoolTrue(showDataListLoader) && ((isBoolTrue(showSelectAll) || isBoolTrue(showDisplaySelectedOnly))))
            && <Flexbox
                className={`w-100 m-0 p-0 
                pl-${isBoolTrue(padded) ? pad : pad} pr-4 mb-1 
                ${isBoolTrue(canShowCountBar()) ? 'mt-1' : 'mt-1'}`}
                justifyAt={'start'}
                wrap={'nowrap'}>

                {/*select-all*/}
                {isBoolTrue(showSelectAll) && <Checkbox
                    wrapperClassName={`w-${isBoolTrue(showDisplaySelectedOnly) ? '45' : '100'} bg-infox`}
                    className={``}
                    labelClassName={`d-flex fd-row flex-nowrap jc-between al-center w-100 bg-dangerx position-relative`}
                    highlightHoverVariant={'dark'}
                    tooltip={false}
                    defaultChecked={getCheckList().every(item => isJsonValueTrue(item, 'selected'))}
                    checked={!checkIfCheckListFound() || (getCheckList().every(item => isJsonValueTrue(item, 'selected')) && isFieldValueTrue(Fields.allSelected))}
                    // checked={isFieldValueTrue(Fields.allSelected) ? !checkIfCheckListFound() || (getCheckList().every(item => isJsonValueTrue(item, 'selected')) && isFieldValueTrue(Fields.allSelected)) : null}
                    disabled={checkIfNoSearchResultsFound() || !checkIfCheckListFound() || isFieldValueTrue(Fields.displaySelectedListOnly)}
                    onChange={(e, value) => {
                        startListSelectTransition(() => {
                            const updatedList = getCheckList().map((item) => ({
                                ...item, selected: !isFieldValueTrue(Fields.allSelected),
                            }));
                            updateFieldValue(Fields.allSelected, !isFieldValueTrue(Fields.allSelected));
                            updateFieldValue(Fields.itemList, updatedList);

                            const selectedList = [];
                            updatedList.map((item) => {
                                // if (isJsonValueTrue(item, 'selected')) {
                                if (isBoolTrue(isCheckItemJson)) {
                                    if (isBoolTrue(minifyUpdatedList)) {
                                        selectedList.push({
                                            [checkItemJsonIdKey]: getDefJsonValue(item, checkItemJsonIdKey),
                                            [checkItemJsonTextKey]: getDefJsonValue(item, checkItemJsonTextKey),
                                            selected: isJsonValueTrue(item, 'selected'),
                                        });
                                    } else {
                                        selectedList.push({
                                            ...item,
                                            selected: isJsonValueTrue(item, 'selected'),
                                        });
                                    }
                                } else {
                                    selectedList.push(getDefJsonValue(item, 'name'));
                                }
                                // }
                            });
                            if (onCheckListUpdate) onCheckListUpdate(selectedList, getNewSelectedCheckListItems(updatedList));
                            if (onCheckAll) onCheckAll(e, value, selectedList, getNewSelectedCheckListItems(updatedList));
                        });
                    }}>
                    <span className={`text-start ${listSelectPending ? 'w-100x' : 'w-100x'}`}>Select All</span>
                    {(listSelectPending) && <div
                        className={'p-0 m-0 pl-2 w-10x position-absolute'} style={{top: '0px', right: '2px'}}>
                        <SimpleLoader
                            variant={variant}
                            wrapperClassName={'m-0 p-0 mt-0 bg-infox'}
                            borderWidth={'2px'}
                            size={'14px'}/>
                    </div>}
                </Checkbox>}

                {/*display-selected-only*/}
                {isBoolTrue(showDisplaySelectedOnly) && <Checkbox
                    wrapperClassName={`w-${isBoolTrue(showDisplaySelectedOnly) ? '45' : '100'} bg-infox`}
                    className={``}
                    labelClassName={`d-flex fd-row flex-nowrap jc-between al-center w-100 bg-dangerx position-relative`}
                    highlightHoverVariant={'dark'}
                    tooltip={false}
                    defaultChecked={false}
                    hidden={!isBoolTrue(showDisplaySelectedOnly)}
                    checked={!checkIfCheckListFound() || (isFieldValueTrue(Fields.displaySelectedListOnly))}
                    disabled={checkIfNoSearchResultsFound() || !checkIfCheckListFound()}
                    onChange={(e, value) => {
                        // log('displaySelectedListOnly.value:', value);
                        startListSelectTransition(() => {
                            const updatedList = getCheckList().map((item) => ({
                                ...item,
                                hide: value ? !isBoolTrue(getDefJsonValue(item, 'selected')) : false,
                            }));
                            updateFieldValue(Fields.displaySelectedListOnly, !isFieldValueTrue(Fields.displaySelectedListOnly));
                            updateFieldValue(Fields.itemList, updatedList);
                        });
                    }}>
                    <span className={`text-start ${listSelectPending ? 'w-100x' : 'w-100x'}`}>{showDisplaySelectedOnlyText}</span>
                    {(listSelectPending) && <div
                        className={'p-0 m-0 pl-2 w-10x position-absolute'} style={{top: '0px', right: '2px'}}>
                        <SimpleLoader
                            variant={variant}
                            wrapperClassName={'m-0 p-0 mt-0 bg-infox'}
                            borderWidth={'2px'}
                            size={'14px'}/>
                    </div>}
                </Checkbox>}
            </Flexbox>
    }

    function createCbListScrollView() {
        return (!isBoolTrue(showDataListLoader)) &&
            <ScrollView
                className={`bg-gray-lightx px-0 p-0 px-${pad} pb-${parseInteger(pad) - 1} ${isBoolTrue(inlineHeader) ? 'mt-1' : ''} ${scrollerClassName}`}
                height={'auto'}
                // height={listHeight}
                style={{
                    height: 'auto',
                    maxHeight: listHeight
                }}
                scrollVariant={scrollVariant}>
                <div className={`w-100 m-0 p-0 bg-dangerx row ${listWrapperClassName}`}>
                    {(checkIfFilteredListFound()) && getFieldValue(Fields.filteredList, []).map((cbItem, cbIndex) => (isJsonValueTrue(cbItem, 'searched') &&
                        <Flexbox
                            key={cbIndex + getDefJsonValue(cbItem, checkItemJsonIdKey) + getDefJsonValue(cbItem, checkItemJsonTextKey) + getDefJsonValue(cbItem, 'subtitle')}
                            className={`m-0 p-0 pb-1 rounded-0 bg-infox col-sm-12 col-md-${checkListCheckItemGridWidthValue()}
                            ${parseInteger(checkListColumnCount) === 1 ? 'px-0' : 'pr-1'}
                            ${isJsonValueTrue(cbItem, 'selected') ? `border-top-1border-solidborder-${variant} ` : 'border-none'}`}
                            alignAt={'center'} justifyAt={'start'}>
                            <Checkbox
                                wrapperClassName={`w-100 ${(isBoolTrue(originalCheckItemOutlined) && isJsonValueTrue(cbItem, 'original')) ? `` : 'border-nonex'}`}
                                className={``}
                                tooltip={showCheckItemTooltip}
                                tooltipWordLimit={showCheckItemTooltipLimit}
                                scrolled={scrollLargeCheckItem}
                                hidden={isBoolTrue(getDefJsonValue(cbItem, 'hide', false))}
                                subtitle={getDefJsonValue(cbItem, 'subtitle')}
                                endSubtitle={getDefJsonValue(cbItem, 'endSubtitle')}
                                highlightHoverVariant={'dark'}
                                selectedHighlightVariant={variant}
                                defaultChecked={isJsonValueTrue(cbItem, 'selected')}
                                // checked={isFieldValueTrue(Fields.allSelected) ? isJsonValueTrue(cbItem, 'selected') : null}
                                checked={isJsonValueTrue(cbItem, 'selected')}
                                outlined={isBoolTrue(originalCheckItemOutlined) && isJsonValueTrue(cbItem, 'original')}
                                wrapperStyle={{
                                    // border: (isBoolTrue(originalCheckItemOutlined) && isJsonValueTrue(cbItem, 'original')) ? `1.3px solid var(--${variant}Dark)` : 'none'
                                }}
                                onChange={(e, value) => {
                                    // const value=e.target.checked;
                                    const name = getDefJsonValue(cbItem, checkItemJsonIdKey) + '';
                                    const id = getDefJsonValue(cbItem, checkItemJsonIdKey) + '';
                                    // startListSelectTransition(() => {
                                    const updatedList = getCheckList().map(item => {
                                        // log('getCheckList().item-id:', getDefJsonValue(item, 'id'), 'id:', id, 'value:', value, 'cb-id===getCheckList().item.id:', getDefJsonValue(item, 'id') === id);

                                        if (isBoolTrue(isCheckItemJson)) {
                                            if (getDefJsonValue(item, 'id') + '' === id) {
                                                // log('getCheckList().item-id:', getDefJsonValue(item, 'id'), 'id:', id, 'value:', value, 'cb-id===getCheckList().item.id:', getDefJsonValue(item, 'id') === id);

                                                return {...item, selected: !isJsonValueTrue(item, 'selected')};
                                            }
                                            return item;
                                        } else if (getDefJsonValue(item, 'name') + '' === name) {
                                            // return {...item, selected: !isJsonValueTrue(item, 'selected')};
                                        }
                                        return item;
                                    });
                                    // log('updatedList:', sliceArr(updatedList, 0, 5), 'len:', getArrLen(updatedList));
                                    startListSelectTransition(() => {
                                        updateFieldValue(Fields.itemList, updatedList);
                                    });

                                    const selectedList = [];
                                    updatedList.map((item) => {
                                        // if (isJsonValueTrue(item, 'selected')) {
                                        if (isBoolTrue(isCheckItemJson)) {
                                            if (isBoolTrue(minifyUpdatedList)) {
                                                selectedList.push({
                                                    [checkItemJsonIdKey]: getDefJsonValue(item, checkItemJsonIdKey),
                                                    [checkItemJsonTextKey]: getDefJsonValue(item, checkItemJsonTextKey),
                                                    selected: isJsonValueTrue(item, 'selected'),
                                                });
                                            } else {
                                                selectedList.push({
                                                    ...item,
                                                    selected: isJsonValueTrue(item, 'selected'),
                                                });
                                            }
                                        } else {
                                            selectedList.push(getDefJsonValue(item, 'name'));
                                        }
                                        // }
                                    });
                                    const currUpdatedItem = {
                                        ...cbItem,
                                        selected: value
                                    };
                                    if (onItemCheck) onItemCheck(e, value, selectedList, getNewSelectedCheckListItems(updatedList), currUpdatedItem);
                                    if (onCheckListUpdate) onCheckListUpdate(selectedList, getNewSelectedCheckListItems(updatedList));
                                    // });
                                }}>{getDefJsonValue(cbItem, 'name')}
                            </Checkbox>

                            {(isBoolTrue(showCheckItemEditButton) && !isJsonValueTrue(cbItem, 'selected')) &&
                                <Button
                                    className={`p-2 ${isBoolTrue(showCheckItemRemoveButton) ? 'ml-2' : 'mx-2'} text-primary fs-md-sm shadow-none`}
                                    variant={''}
                                    highlightVariant={CssVariant.primary}
                                    rippleColor={RippleVarVariant.light}
                                    circular={true}
                                    color={''}
                                    width={'22px'}
                                    height={'22px'}
                                    iconClass={`${IconClass.edit}`}
                                    onClick={() => {
                                        try {
                                            const newName = window.prompt('Rename item', getDefJsonValue(cbItem, checkItemJsonTextKey));
                                            if (checkNullStr(newName)) {
                                                const updatedList = getFieldValue(Fields.itemList, []).map(updateItem =>
                                                    updateItem[checkItemJsonIdKey] == getDefJsonValue(cbItem, checkItemJsonIdKey)
                                                        ? {...updateItem, name: newName, [checkItemJsonTextKey]: newName}
                                                        : updateItem
                                                );
                                                startListSelectTransition(() => {
                                                    updateFieldValue(Fields.itemList, updatedList);
                                                });
                                                if (onCheckListUpdate) onCheckListUpdate(updatedList, getNewSelectedCheckListItems(updatedList));
                                                if (onCheckItemEdit) onCheckItemEdit({
                                                    ...cbItem, name: newName, [checkItemJsonTextKey]: newName
                                                }, cbIndex);
                                            }
                                        } catch (e) {
                                            logErr(e);
                                        }
                                    }}
                                />}

                            {(isBoolTrue(showCheckItemRemoveButton)) &&
                                <Button
                                    className={'p-2 mx-2 text-danger fs-md-sm shadow-none'}
                                    variant={''}
                                    highlightVariant={CssVariant.danger}
                                    rippleColor={RippleVarVariant.light}
                                    circular={true}
                                    color={''}
                                    width={'22px'}
                                    height={'22px'}
                                    iconClass={`${IconClass.delete}`}
                                    onClick={() => {
                                        const canDelete = window.confirm("Are you sure you want to delete this item?");
                                        if (isBoolTrue(canDelete)) {
                                            try {
                                                const updatedList = getFieldValue(Fields.itemList, []).filter(updateItem => updateItem[checkItemJsonIdKey] != getDefJsonValue(cbItem, checkItemJsonIdKey));
                                                startListSelectTransition(() => {
                                                    updateFieldValue(Fields.itemList, updatedList);
                                                });
                                                if (onCheckListUpdate) onCheckListUpdate(updatedList, getNewSelectedCheckListItems(updatedList));
                                                if (onCheckItemDelete) onCheckItemDelete(cbItem, cbIndex);
                                            } catch (e) {
                                                logErr(e);
                                            }
                                        }
                                    }}
                                />}
                        </Flexbox>))}
                </div>

                {(checkIfNoSearchResultsFound() || !checkIfCheckListFound())
                    && <Label className={`m-0 p-1 text-dark fs-md ${msgClassName}`} textAt={'start'}>
                        {!checkIfCheckListFound() ? 'No data found!' : noSearchFoundMsg}
                    </Label>}
            </ScrollView>
    }

    //-----------------------------UI Functions end-----------------------------------


    function updateFieldValue(field, value) {
        // log(`updateFieldValue.field: ${field}, value: ${value}`);
        setFieldsData(prevState => ({...prevState, [field]: value}));
    }

    function getFieldValue(field, defValue) {
        return getDefJsonValue(fieldsData, field, defValue);
    }

    function isFieldValueTrue(field) {
        return isBoolTrue(getFieldValue(field));
    }

    function getCheckList() {
        return getFieldValue(Fields.itemList, []);
    }

    function checkIfCheckListFound() {
        return (checkNullArr(getCheckList()));
    }

    function checkIfNoSearchResultsFound() {
        return (checkIfCheckListFound() && (getCheckList().every(item => !(getDefJsonValue(item, 'name') + '').toLowerCase().includes((getFieldValue(Fields.searchValue) + '').toLowerCase()))));
    }

    function checkIfFilteredListFound() {
        return getFieldValue(Fields.filteredList, []);
    }

    function canShowCountBar() {
        return isBoolTrue(showSelectedCount) || isBoolTrue(showSearchCount) || isBoolTrue(showTotalCount);
    }

    function getSelectId() {
        return getDefValueStr(selectId, (TAG + selectIdKey + selectTextKey + 'id'));
    }

    function checkListCheckItemGridWidthValue() {
        const columnWidths = {
            1: 12,
            2: 6,
            3: 4,
            4: 3,
            6: 2,
        };
        return getDefValueStr(columnWidths[parseInteger(checkListColumnCount)], 12);
    }

    function getNewSelectedCheckListItems(checkList_Optional = []) {
        const fun = 'getNewSelectedCheckListItems:';
        let filteredList = [];
        try {
            const checkList_Org = checkNullArr(checkList_Optional) ? checkList_Optional : getCheckList();
            // log(fun, 'checkList_Optional:', sliceArr(checkList_Optional, 0, 2), 'len:', getArrLen(checkList_Optional));
            // log(fun, 'checkList_Org:', sliceArr(checkList_Org, 0, 2), 'len:', getArrLen(checkList_Org));
            if (checkNullArr(checkList_Org)) {
                let newCheckList = checkList_Org;
                // log(fun, 'newCheckList:', sliceArr(newCheckList, 0, 2), 'len:', getArrLen(newCheckList));
                if (checkNullArr(newCheckList)) {
                    checkList_Org.map((orgItem) => {
                        newCheckList.map((newItem) => {
                            const orgItemId = getDefJsonValue(orgItem, checkItemJsonIdKey) + '';
                            const newItemId = getDefJsonValue(newItem, checkItemJsonIdKey) + '';
                            const isNewItemOriginal = isJsonValueTrue(newItem, 'original');
                            const isNewItemSelected = isJsonValueTrue(newItem, 'selected');
                            if (orgItemId === newItemId) {
                            } else {
                                if (isNewItemSelected && !isNewItemOriginal) {
                                    if (isBoolTrue(minifyUpdatedList)) {
                                        filteredList.push({
                                            [checkItemJsonIdKey]: getDefJsonValue(newItem, checkItemJsonIdKey),
                                            [checkItemJsonTextKey]: getDefJsonValue(newItem, checkItemJsonTextKey),
                                        });
                                    } else {
                                        filteredList.push(newItem);
                                    }
                                }
                            }
                        });
                    });
                    filteredList = dropJsonListDuplicates(filteredList, checkItemJsonIdKey);
                    // log('checkListKey:',checkListKey,'filteredList:', sliceArr(checkList_Org, 0, 2), 'len:', getArrLen(checkList_Org));
                    // log(fun, 'filteredList:', sliceArr(filteredList, 0, 2), 'len:', getArrLen(filteredList));
                    return filteredList;
                }
            }
            return filteredList;
        } catch (e) {
            logErr(fun, e);
            return [];
        }
    }


    function log(...text) {
        printLog(TAG, ...text);
    }

    function logErr(...text) {
        printError(TAG, ...text);
    }
});
SearchableCheckboxList.propTypes = {
    className: PropTypes.string, style: PropTypes.object,
};
export default SearchableCheckboxList;
