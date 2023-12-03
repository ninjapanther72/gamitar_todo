import React, {useEffect} from 'react';
import {isBoolTrue} from "./ReactUtils";

const GridBox = React.memo(({
                                className = "",
                                wrap = "wrap",
                                direction = "row",
                                justifyAt = "",
                                alignAt = "",
                                overflow = "",
                                itemWrapperClassName = "",
                                children,
                                gap = 2,
                                sm = 12,
                                md = 6,
                                lg,
                                columnCount = -1,
                                vertical = false, // verticalItemCount = [] | 0,//[2, 2] or 2
                                verticalItemCount = 3,//[2, 2] or 2
                                style = {},
                                itemWrapperStyle = {},
                            }) => {
    const TAG = "GridBox";
    useEffect(() => {

    }, []);

    // const columns = [];
    // for (let i = 0; i < children.length; i += verticalItemCount) {
    //     const columnItems = children.slice(i, i + verticalItemCount);
    //     columns.push(
    //         <div key={`column-${i / verticalItemCount}`}
    //              className={"grid-column"}
    //              style={{
    //                  display: 'flex',
    //              }}>
    //             {columnItems}
    //         </div>
    //     );
    // }
    //
    // return <div className="vertical-grid">{columns}</div>;

    return (<>
        <div
            className={`row 
                flex-${isBoolTrue(vertical) ? 'wrap' : wrap} 
                fd-${isBoolTrue(vertical) ? 'column' : direction} 
                justify-content-${justifyAt} 
                align-items-${alignAt} 
                overflow-${overflow} 
                ${className}
                `}
            style={{
                ...style
            }}>
            {/*{checkNullArr(children) && children.map((item, index) => {*/}
            {React.Children.map(children, (child, index) => {
                return <div key={index + wrap + direction + className}
                            className={`col-sm-${sm} col-md-${md} col-lg-${lg} p-${gap} ${itemWrapperClassName}`}
                            style={{
                                ...itemWrapperStyle
                            }}>
                    {/*<div className={`col-sm-${sm} col-md-${md} col-lg-${lg} p-${gap} ${itemWrapperClassName}`}*/}
                    {/*     style={{*/}
                    {/*         ...itemWrapperStyle*/}
                    {/*     }}>*/}
                    {child}
                    {/*</div>*/}
                </div>
            })}
        </div>
    </>)
});
export default GridBox;
