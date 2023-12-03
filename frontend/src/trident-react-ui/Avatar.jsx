import React, {useEffect, useRef, useState} from 'react';
import {addSize, checkNull, checkNullStr, divSize, getDefValue, getDefValueStr, getStrInitials, isBoolTrue, printError, subtractSize} from "./ReactUtils";
import {Button, Dialog, Flexbox, Image, Label, SimpleLoader, THEME} from "./index";
import PropTypes from "prop-types";
import {Constants, RippleVarVariant} from "./config/TridentConfigs";

const Avatar = ({
                    className = "",
                    wrapperClassName = "",
                    labelClassName = "",
                    innerWrapperClassName = "",
                    editClassName = "",
                    imgClassName = "",
                    editBg = "white",
                    labelAt = "start",
                    justifyAt = "center",
                    alignCenter = "center",
                    id,
                    width,
                    height,
                    size = "55px",
                    onWrapperClick,
                    onImageClick,
                    onImageHover,
                    onImageMouseLeave,
                    onError,
                    previewBorder = true,
                    previewBorderVariant = 'gray',
                    changeObjectFitOnHover = false,
                    hoverObjectFit = 'fill',
                    children,
                    label,
                    content,
                    hidden,
                    labelFontSize = '12px',
                    labelTextWrap = false,
                    bordered = true,
                    circular = true,
                    showEdit = false,
                    variant = THEME,
                    showInitials = false,
                    personName = '',
                    objectFit = 'cover',
                    overflow = 'hidden',

                    editTooltip = "Edit Image",
                    accept,
                    onObjectFitChange,
                    showObjectFitChangeControl = false,
                    showFullPreviewDialog = false,
                    onFullPreview,
                    onFullPreviewDialogOpen,
                    onFullPreviewDialogClose,
                    previewTitle = 'Preview',

                    //Style
                    style = {},
                    wrapperStyle = {},
                    labelStyle = {},
                    objectFitControlStyle = {},
                    editStyle = {},
                    imgStyle = {},
                    onChange,
                    defAvatarImg = Constants.userVector,
                    ...rest
                }) => {

    const TAG = "Avatar";
    const [defAvatar, setDefAvatar] = useState(Constants.userVector);

    const [showLoader, setShowLoader] = useState(false);

    const [avatarImg, setAvatarImg] = useState("");
    const [ofType, setOfType] = useState("");
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [showNameInitials, setShowNameInitials] = useState(showInitials);
    const imgChooserInputRef = useRef(null);

    useEffect(() => {
        setAvatarImg(children);
        // printLog(TAG, "children:", children);
    }, [children]);
    useEffect(() => {
        setDefAvatar(defAvatarImg);
    }, [defAvatarImg]);
    useEffect(() => {
        setOfType(objectFit);
    }, [objectFit]);
    useEffect(() => {
        setShowNameInitials(isBoolTrue(showInitials));
    }, [showInitials]);

    return (<>
        {!isBoolTrue(hidden) && <div className={`m-0 p-0 ${wrapperClassName} d-flexx 
         ${!(wrapperClassName + '').includes('d-') ? 'd-flex' : ''}
         jc-${justifyAt} al-${alignCenter}`}
                                     style={{
                                         // height: getDefValueStr(height, size),
                                         ...wrapperStyle
                                     }}
                                     onClick={onWrapperClick}>

            {/*<div className={'w-100 m-0 p-0'}>*/}
            {checkNullStr(label) && <Label className={`fw-bold w-100x m-0 p-0 px-1 
            fs-mdx text-black30 ${labelClassName} ${isBoolTrue(labelTextWrap) ? 'text-wrap' : 'text-nowrap'}`}
                                           style={{fontSize: labelFontSize, ...labelStyle}}
                                           textAt={labelAt}>{label}</Label>}
            <Flexbox
                className={`avatar-wrapper w-autox ${innerWrapperClassName}`} position={'relative'}
                id={id}>
                <div className={`w-autox p-0 m-0 h-100x bg-dangerx d-flex jc-center position-relative 
                ${className} ${(className + '').includes('w-') ? '' : 'w-auto'}
                ${canShowPreviewDialog() ? `cursor-pointer ${isBoolTrue(previewBorder) ? `rounded-3 border-1-5 border-solid border-${previewBorderVariant}` : ''} transition-sm border-${variant}-hover` : ''}
                `}
                     style={{
                         height: addSize(getDefValueStr(height, size), 2.5),
                         ...style
                     }}>
                    {(!showLoader && ((!checkNullStr(avatarImg, true)
                        && (!showNameInitials)) || checkNullStr(avatarImg)))
                        ? <img
                            // src={avatarImg}
                            src={getDefValue(avatarImg, defAvatar, "")}
                            className={`avatar object-fit-${checkNullStr(avatarImg) ? ofType : 'cover'} 
                        ${isBoolTrue(circular) ? 'circular' : 'rounded-2'}
                        ${isBoolTrue(bordered) ? ` border-1 border-${variant} border-solid` : ''} ${imgClassName}`}
                            alt={'Preview'}
                            width={getDefValueStr(width, size)}
                            height={getDefValueStr(height, size)}
                            style={{...imgStyle}}
                            onClick={(e) => {
                                if (canShowPreviewDialog()) setShowPreviewDialog(true);
                                if (onImageClick) onImageClick(e);
                            }}
                            onMouseEnter={() => {
                                if (isBoolTrue(changeObjectFitOnHover)) setOfType(hoverObjectFit);
                                if (onImageHover) onImageHover(ofType);
                            }}
                            onMouseLeave={() => {
                                if (isBoolTrue(changeObjectFitOnHover)) setOfType(objectFit);
                                if (onImageMouseLeave) onImageMouseLeave(ofType);
                            }}
                            onError={() => {
                                if (onError) onError();
                                if (checkNullStr(personName)) {
                                    setAvatarImg(null);
                                } else {
                                    setAvatarImg(defAvatarImg);
                                }
                                setShowNameInitials(true);
                            }}
                            {...rest}
                        /> : (!showLoader && checkNullStr(personName)) && <label
                        className={`text-white bg-gray-dark rounded-5 d-flex jc-center al-center select-none 
                            text-capitalize m-0 p-2 ${isBoolTrue(circular) ? 'circular' : 'rounded-3'}`}
                        style={{
                            fontSize: divSize(size, 2), width: size, height: size
                        }}>
                        {getStrInitials(personName)}
                    </label>}

                    {/*loader*/}
                    {showLoader && <SimpleLoader wrapperClassName={'position-absolutex w-100 p-2'}
                        // wrapperHeight={height}
                        // wrapperStyle={{transform: 'translate(16%) !important'}}
                        // wrapperStyle={{top: `-${divSize(size, 8.5)}`, left: '0px'}}
                        //                          wrapperStyle={{left: ".7rem", top: ".65remx"}}
                                                 size={subtractSize(size, 16)}/>}

                    {/*edit button*/}
                    {isBoolTrue(showEdit) && !showLoader && <Button
                        className={`m-0x mx-1 p-2 bg-${editBg} 
                    ${(isBoolTrue(bordered) || !isBoolTrue(bordered)) ? ` border-1 border-${variant} border-solid` : ''} 
                    position-absolute ${editClassName}`}
                        style={{top: `-${divSize(size, 8)}`, right: `-${divSize(size, 8)}`, ...editStyle}}
                        // style={{top: "-.5rem", right: "-.5rem", ...editStyle}}
                        iconClass={`bi bi-pencil text-${variant}`}
                        tooltip={editTooltip}
                        circular={true}
                        // width={editSize}
                        // height={editSize}
                        width={divSize(size, 2.5)}
                        height={divSize(size, 2.5)}
                        fontSize={divSize(size, 5)}
                        // highlightVariant={variant}
                        rippleColor={RippleVarVariant[variant]}
                        // fontSize={'12px'}
                        variant={'t'}
                        onClick={() => {
                            try {
                                imgChooserInputRef.current.click();
                            } catch (e) {
                                printError(TAG, e);
                            }
                        }}
                    />}

                    {isBoolTrue(showObjectFitChangeControl) && !showLoader && <Button
                        className={`m-0x mx-1 p-2 bg-${editBg} 
                    ${(isBoolTrue(bordered) || !isBoolTrue(bordered)) ? ` border-1 border-${variant} border-solid` : ''} 
                    position-absolute ${editClassName}`}
                        style={{
                            top: isBoolTrue(showEdit) ? `${divSize(size, 2)}` : '2px',
                            right: '-2px',
                            ...objectFitControlStyle
                        }}
                        iconClass={`bi bi-arrows-fullscreen text-${variant}`}
                        tooltip={editTooltip}
                        circular={true}
                        width={divSize(size, 2.5)}
                        height={divSize(size, 2.5)}
                        fontSize={divSize(size, 5)}
                        // highlightVariant={variant}
                        rippleColor={RippleVarVariant[variant]}
                        // fontSize={'12px'}
                        variant={'t'}
                        onClick={() => {
                            try {
                            } catch (e) {
                                printError(TAG, e);
                            }
                        }}
                    />}

                    {content}
                    {<input style={{}}
                            className={'d-none'}
                            ref={imgChooserInputRef} type="file" accept={getDefValueStr(accept, "image/*")}
                            onChange={(e) => {
                                const path = e.target.files[0];
                                const name = getDefValueStr(path, 'name');
                                if (checkNull(path)) {
                                    setShowLoader(true);
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const file = reader.result;
                                        setAvatarImg(file);
                                        if (checkNull((onChange))) onChange(e, file, path, name);
                                        setShowLoader(false);
                                    };
                                    reader.readAsDataURL(path);
                                }
                            }}
                    />}
                </div>
            </Flexbox>
            {/*</div>*/}

            {canShowPreviewDialog() && createPreviewDialog()}
        </div>}
    </>)

    function createPreviewDialog() {
        return <Dialog
            open={showPreviewDialog}
            title={previewTitle}
            contentClassName={""}
            height={"auto"}
            maxHeight={"80vh"}
            widthClass={"w-auto"}
            className={"p-0"}
            scrollVariant={"dark"}
            showHeader={false}
            showFooter={false}
            sleekControl={false}
            padded={false}
            scrolled={false}
            closeOnEscape={true}
            closeOnOutsideClick={true}
            showClose={true}
            closeClassName={`highlight-${THEME}-hover`}
            closeVariant={'dark'}
            onCancel={() => setShowPreviewDialog(false)}
            onClose={() => setShowPreviewDialog(false)}
            onConfirm={() => {
                setShowPreviewDialog(false);
            }}>
            <div className={"w-100 bg-infox m-0 p-0 d-flex jc-center al-center"}>
                <Image
                    src={children}
                    width={'100%'}
                    height={'auto'}
                    objectFit={'contain'}
                    disableDrag={false}
                />
            </div>
        </Dialog>
    }

    function canShowPreviewDialog() {
        return isBoolTrue(showFullPreviewDialog) && (!showLoader && ((!checkNullStr(avatarImg, true)
            && (!showNameInitials)) || checkNullStr(avatarImg, true)));
    }
}

Avatar.propTypes = {
    className: PropTypes.string,
    editClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    imgClassName: PropTypes.string,
    editBg: PropTypes.string,
    id: PropTypes.string,
    buttonSize: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.node,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
    editStyle: PropTypes.object,
    imgStyle: PropTypes.object,
    onChange: PropTypes.func,
    onInvalid: PropTypes.func,
    bordered: PropTypes.bool,
    showInitials: PropTypes.bool,
    circular: PropTypes.bool,
    hidden: PropTypes.bool,
    showEdit: PropTypes.bool,
    editTooltip: PropTypes.string,
    variant: PropTypes.string,
    personName: PropTypes.string,
    accept: PropTypes.any,
    content: PropTypes.any,
    height: PropTypes.string,
    width: PropTypes.string,
    objectFit: PropTypes.string,
    hoverObjectFit: PropTypes.string,
    onImageClick: PropTypes.func,
    showObjectFitChangeControl: PropTypes.bool,
    changeObjectFitOnHover: PropTypes.bool,
    onObjectFitChange: PropTypes.func,
    showFullPreviewDialog: PropTypes.bool,
    previewBorder: PropTypes.bool,
    onFullPreview: PropTypes.func,
    onFullPreviewDialogClose: PropTypes.func,
    onFullPreviewDialogOpen: PropTypes.func,
    previewTitle: PropTypes.string,
    previewBorderVariant: PropTypes.string,
}
export default Avatar;
