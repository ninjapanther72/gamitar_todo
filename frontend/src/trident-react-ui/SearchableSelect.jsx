import React, {useState} from "react";
import Select from "react-select";
import {checkNull, checkNullStr, isBoolTrue} from "./ReactUtils";
import PropTypes from 'prop-types';
import {SimpleLoader, THEME} from "./index";

/**
 * Create a searchable select element.
 *
 * @example:
 *
 * const [searchableColorList, setSearchableColorList]=useState({list:[], current: {}});
 * //Items format:
 *      const colorsData=[{ value: "red", label: "Red" },
 *      { value: "green", label: "Green" },
 *      { value: "yellow", label: "Yellow" },
 *      { value: "blue", label: "Blue" },
 *      { value: "white", label: "White" } ];
 * setSearchableColorList(prevState => ({...prevState, list: colorsData}));
 *
 *  <SearchableSelect
 *            label={'Colors'}
 *            labelAsPlaceholder={true}
 *            wrapperClassName={`col-sm-12 col-md-6 fd-column pt-2 pb-3`}
 *            className={`w-100 m-0 mt-0`}
 *            style={{height: '24px !important'}}
 *            multiple={false}
 *            searchable={true}
 *            justifyAt={'start'}
 *            labelClassName={'fw-bold text-gray-dark fs-sm text-start w-100'}
 *            disabled={boolean}
 *            dropdownHeight={'100px'}
 *            options={searchableColorList.list}
 *            defOption={searchableColorList.current}
 *            onChange={(data) => {
 *            const label=data.label;
 *            const value=data.value;
 *                  console.log('Label:', label, 'Value:', value);
 *                  setSearchableColorList(prevState => ({...prevState, current: data}));
 *            }}
 *  />
 *
 * @param {object} props - Component props.
 * @param {string} props.wrapperClassName - Additional class for the component wrapper.
 * @param {string} props.className - Additional class for the component container.
 * @param {string} props.dropdownClassName - Additional class for the dropdown menu.
 * @param {string} props.labelClassName - Additional class for the label element.
 * @param {Object} props.defOption - Default option object with `value` and `label` properties.
 * @param {boolean} props.disabled - Specifies whether the dropdown is disabled.
 * @param {boolean} props.clearable - Specifies whether the selected option can be cleared.
 * @param {boolean} props.labelAsPlaceholder - Specifies whether the label text should be used as a placeholder.
 * @param {boolean} props.isLoading - Specifies whether the dropdown is in a loading state.
 * @param {boolean} props.hidden - Specifies whether the dropdown is hidden.
 * @param {boolean} props.rtl - Specifies whether the dropdown should support right-to-left text direction.
 * @param {string} props.placeholder - Placeholder text displayed in the input field.
 * @param {Object} props.style - Inline styles for the component container.
 * @param {Object} props.dropdownStyle - Inline styles for the dropdown menu.
 * @param {Object} props.labelStyle - Inline styles for the label element.
 * @param {Object} props.wrapperStyle - Inline styles for the component wrapper.
 * @param {('start'|'center'|'end')} props.justifyAt - Alignment of the dropdown menu. One of: 'start', 'center', 'end'.
 * @param {('wrap'|'nowrap')} props.wrap - CSS property for the text wrapping. One of: 'wrap', 'nowrap'.
 * @param {string} props.label - Label text for the dropdown.
 * @param {('light'|'dark')} props.scrollVariant - Scrollbar variant. One of: 'light', 'dark'.
 * @param {string} props.dropdownHeight - Height of the dropdown menu (in pixels or percentage).
 * @param {Array} props.options - An array of objects representing dropdown options. Each object must have `value` and `label` properties.
 * @param {function} props.onChange - Callback function triggered when the selected option changes.
 * @param {boolean} props.searchable - Specifies whether the dropdown should be searchable.
 * @param {boolean} props.multiple - Specifies whether multiple options can be selected.
 * @param {...any} props.rest - Additional props to be spread to the component.
 */
const SearchableSelect = React.memo(({
                                         wrapperClassName = "",
                                         className = "",
                                         dropdownClassName = "",
                                         labelClassName = "",
                                         defOption = {},
                                         disabled = false,
                                         clearable = false,
                                         labelAsPlaceholder = false,
                                         isLoading = false,
                                         hidden = false,
                                         rtl = false,
                                         placeholder = "",

                                         style = {},
                                         dropdownStyle = {},
                                         labelStyle = {},
                                         wrapperStyle = {},

                                         justifyAt = "start",
                                         wrap = "wrap",
                                         label = "Select an option",
                                         scrollVariant = "light",
                                         dropdownHeight = "250px",
                                         options = [{value: "red", label: "Red"}, {value: "green", label: "Green"}, {
                                             value: "yellow", label: "Yellow"
                                         }, {value: "white", label: "White"}],

                                         onChange = null,
                                         searchable = true,
                                         multiple = true,
                                         showLoader = false,
                                         loadingTopMargin = '.15rem',
                                         variant = THEME,
                                         ...rest
                                     }) => {
    const [selectedOptions, setSelectedOptions] = useState(defOption);
    const theme = (theme) => ({
        ...theme, spacing: {
            ...theme.spacing, controlHeight: 32, baseUnit: 0,
        }, // colors: {
        //     ...theme.colors,
        //     text: '#3599B8',
        //     font: '#3599B8',
        //     prixmary25: '#3599B8',
        //     prixmary: '#3599B8',
        //     neutral80: 'black',
        //     color: 'black',
        // },
    });

    function handleSelect(data) {
        setSelectedOptions(data);
        if (onChange) onChange(data);
    }

    return ((!isBoolTrue(hidden)) && <div className={`searchable searchable-select m-0 p-0 d-flex flex-${wrap} ${wrapperClassName}`}
                                          style={{...wrapperStyle}}{...rest}>
        {checkNull(label, "") && <label className={`label ${labelClassName} m-0 p-0 px-1`} style={{...labelStyle}}>{label}</label>}
        <div className={'d-flex w-100 jc-between al-center flex-nowrap fd-row position-relative'}>
            <div
                className={`m-0 p-0 searchable-dropdown ${isBoolTrue(disabled) ? '' : 'cursor-pointer'} ${dropdownClassName} scroll-${scrollVariant} w-100`}>
                <Select
                    className={`searchable-select w-100 m-0 p-0 select overflow-hiddenx ${className}`}
                    styles={{
                        option: (base, {data, isDisabled, isFocused, isSelected}) => {
                            return {
                                ...base,
                                backgroundColor: isFocused || isSelected ? (isSelected ? `var(--${variant}Dark)` : `var(--${variant})`) : "white",
                                color: isFocused || isSelected ? "white" : "black",
                                padding: '.2px 10px',
                                transition: 'var(--transition-sm)'
                            }
                        }
                    }}
                    options={options}
                    // defaultValue={defOption}
                    placeholder={(!checkNullStr(placeholder) && isBoolTrue(labelAsPlaceholder) && checkNullStr(label)) ? label : placeholder}
                    value={defOption}
                    // value={selectedOptions}
                    onChange={handleSelect}
                    isSearchable={searchable}
                    isMulti={multiple}

                    isDisabled={isBoolTrue(disabled) || isBoolTrue(showLoader)}
                    isLoading={isLoading}
                    isClearable={clearable}
                    isRtl={rtl}
                    theme={theme}
                />
            </div>

            {isBoolTrue(showLoader) &&
                <div className={'m-0 p-0 w-10 position-absolute'} style={{top: loadingTopMargin, 'right': '1.3rem'}}>
                    <SimpleLoader
                        variant={variant}
                        wrapperClassName={'m-0 p-0 mt-1 w-10'}
                        borderWidth={'2px'}
                        size={'14px'}/>
                </div>}
        </div>
    </div>);
});
export default SearchableSelect;


SearchableSelect.propTypes = {
    wrapperClassName: PropTypes.string,
    className: PropTypes.string,
    dropdownClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    selectClassName: PropTypes.string,
    placeholder: PropTypes.string,
    labelAsPlaceholder: PropTypes.bool,
    defOption: PropTypes.any,

    style: PropTypes.object,
    dropdownStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,

    justifyAt: PropTypes.oneOf(['start', 'center', 'end']),
    wrap: PropTypes.oneOf(['wrap', 'nowrap']),
    label: PropTypes.string,
    scrollVariant: PropTypes.oneOf(['light', 'dark']),
    dropdownHeight: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired, label: PropTypes.string.isRequired,
    })),

    onChange: PropTypes.func,
    searchable: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    isLoading: PropTypes.bool,
    clearable: PropTypes.bool,
    rtl: PropTypes.bool,
};
