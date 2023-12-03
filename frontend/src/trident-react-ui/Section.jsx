import React from 'react';
import {checkNull, checkNullStr, isBoolTrue} from "./ReactUtils";
import PropTypes from 'prop-types';
import {Button, Image} from "./index";
import {Paper} from "@mui/material";

const Section = React.memo(({
                                className = '',
                                style = {},
                                id = '',
                                key = 'section',
                                forwardRef,

                                titleIcon,
                                titleIconWrapperClass,
                                titleIconClass,
                                titleIconSize,
                                headerClassName = '',
                                titleWrapperClassName = '',
                                headerStyle = {},

                                title,
                                titleSize,
                                titleClassName = '',
                                titleStyle = {},
                                titleAt = 'center',

                                subtitle,
                                subtitleStyle = {},
                                subtitleClassName = '',
                                subtitleAt = 'center',

                                bgImage,
                                bgBrightness = "0",
                                bgFit = 'cover',
                                bg = 'white',

                                headerControlIcon = '',
                                onHeaderButtonClick,
                                headerControlText,
                                headerControlColor = '',
                                headerControlClassName = '',
                                headerControlStyle = {},
                                showHeaderControl = false,
                                headerControlAtEnd = true,
                                borderless = false,
                                titleIconAsImage = false,

                                titleContent,

                                headerControlHref,
                                headerControlW,
                                headerControlH = '22px',
                                headerControls,

                                overflow = "hidden",
                                position = "",

                                roundedVariant = '5',
                                shadowVariant = 'none',
                                scrollVariant = 'dark',
                                scrolled = false,
                                scrollX = false,
                                scrollY = false,
                                height = "",
                                asContainer = false,
                                asContainerFluid = false,

                                contentClassName,
                                contentStyle = {},

                                footer,
                                children,
                                ...rest
                            }) => {
    return (<Paper
        ref={forwardRef}
        itemRef={forwardRef}
        className={`section transition rounded-${roundedVariant} ${className} bg-${bg}  
            ${isBoolTrue(borderless) ? 'borderless risen-xsx shadow-nonex' : 'shadow-nonex'}
            risen-${shadowVariant} 
            ${(isBoolTrue(scrolled) || isBoolTrue(scrollX) || isBoolTrue(scrollY)) ? `scroller scroll-${scrollVariant} 
            ${isBoolTrue(scrollX) ? 'scroller-x-auto' : ''} ${isBoolTrue(scrollY) ? 'scroller-y-auto' : ''}` : ''} 
            position-${position}
            overflow-${overflow}
            ${isBoolTrue(asContainerFluid) ? 'container-fluid' : ''}
            `}
        key={title + key + className + bg}
        id={id}
        sx={{
            background: (checkNull(bgImage)) ? `linear-gradient(rgba(0, 0, 0, ${bgBrightness}), rgba(0, 0, 0, ${bgBrightness})), url(${bgImage}) no-repeat center center` : "",
            backgroundSize: bgFit,
            height: height, ...style
        }}
        {...rest}
    >
        {/*header*/}
        {(checkNullStr(title) || checkNullStr(subtitle) || checkNullStr(titleIcon) || checkNull(titleContent) || checkNull(headerControls) || checkNull(showHeaderControl)) &&
            <div className={`header p-0 d-flex position-relative ${headerClassName}`} style={{...headerStyle}}>
                <div className={`title-wrapper d-flex jc-${titleAt} bg-infox al-center flex-nowrap fd-row w-100 m-0 p-0 position-relative ${titleWrapperClassName}`}>
                    {checkNullStr(titleIcon) && <span className={`px-1 pr-2 ${isBoolTrue(titleIconAsImage) ? '' : titleIconWrapperClass}`}>{
                        isBoolTrue(titleIconAsImage) ?
                            <Image
                                wrapperClassName={titleIconWrapperClass}
                                className={titleIconClass}
                                width={titleIconSize}
                                height={titleIconSize}
                                src={titleIcon}
                            />
                            : <i className={`${titleIcon} ${titleIconClass}`} style={{fontSize: titleIconSize}}/>
                    }</span>}

                    {/*title*/}
                    {checkNullStr(title) &&
                        <h5 className={`title m-0 py-1 pb-2x pb-1 p-0 jc-${titleAt}x ${titleClassName} d-flex w-auto`}
                            style={{fontSize: titleSize, ...titleStyle}}>{title}</h5>}

                    {titleContent && titleContent}

                    {/*subtitle*/}
                    {checkNullStr(subtitle) && <p className={`subtitle justify-content-${subtitleAt} ${subtitleClassName}`} style={{...subtitleStyle}}>
                        {subtitle}
                    </p>}
                </div>

                {/*Header control*/}
                {(isBoolTrue(showHeaderControl) || checkNull(headerControls)) &&
                    <div className={`headerControl-wrapper position-relative justify-content-end w-auto d-flex p-0 m-0`}>
                        {headerControls && headerControls}
                        {/*{checkNull(headerControl)}*/}
                        {(checkNullStr(headerControlText) || checkNullStr(headerControlIcon)) && <Button
                            className={`shadow-none ${isBoolTrue(headerControlAtEnd) ? 'position-absolute' : ''} ${headerControlClassName} text-${headerControlColor}`}
                            iconClass={`${headerControlIcon}`}
                            text={headerControlText}
                            href={headerControlHref}
                            width={headerControlW}
                            height={headerControlH}
                            style={{top: "0rem", right: "0rem", ...headerControlStyle}}
                            onClick={onHeaderButtonClick}/>}
                    </div>}
            </div>}

        {/*content*/}
        <div className={`content 
            ${contentClassName} 
            ${isBoolTrue(asContainer) ? 'container' : ''}
            `}
             style={{...contentStyle}}>
            {children}
        </div>

        {/*footer*/}
    </Paper>);
});
Section.propTypes = {
    className: PropTypes.string,
    title: PropTypes.any,
    contentClassName: PropTypes.string,
    titleWrapperClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    titleClassName: PropTypes.string,
    titleStyle: PropTypes.object,
    titleAt: PropTypes.string,
    titleSize: PropTypes.string,
    headerClassName: PropTypes.string,
    headerStyle: PropTypes.object,
    subtitle: PropTypes.string,
    subtitleClassName: PropTypes.string,
    subtitleStyle: PropTypes.object,
    subtitleAt: PropTypes.string,
    onHeaderButtonClick: PropTypes.func,
    headerControlColor: PropTypes.string,
    headerControlText: PropTypes.string,
    headerControlClassName: PropTypes.string,
    headerControlStyle: PropTypes.object,
    headerControlIcon: PropTypes.string,
    showHeaderControl: PropTypes.bool,
    borderless: PropTypes.bool,
    id: PropTypes.string,
    key: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,
    footer: PropTypes.any,
    bgImage: PropTypes.string,
    bgFit: PropTypes.string,
    bgBrightness: PropTypes.string,
    overflow: PropTypes.string,
    position: PropTypes.string,
    scrollVariant: PropTypes.string,
    bg: PropTypes.string,
    headerBg: PropTypes.string,
    height: PropTypes.string,
    scrolled: PropTypes.bool,
    scrollX: PropTypes.bool,
    scrollY: PropTypes.bool,
    asContainer: PropTypes.bool,
    asContainerFluid: PropTypes.bool,
    headerControlAtEnd: PropTypes.bool,
    headerControlHref: PropTypes.string,
    headerControlW: PropTypes.string,
    headerControlH: PropTypes.string,
    headerControls: PropTypes.any,
    titleContent: PropTypes.any,
};
export default Section;
