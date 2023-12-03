import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const Tag = ({tag, onRemoveTag, isActive, onClick}) => {
    return (<div className={`m-1 rounded-10 text-dark bg-gray px-2 pe-0 pr-0 py-1 d-flex justify-content-center align-items-center fs-sm ${isActive ? 'active' : ''}`}
                 onClick={() => onClick(tag)}>
        <span>{tag}</span>
        <Button
            iconClass={'bi bi-x text-dark'}
            className={'p-2 m-0 highlight-dark-hover'}
            circular={true}
            width={'18px'}
            height={'18px'}
            onClick={() => onRemoveTag(tag)}
        />
    </div>);
};

export default Tag;
Tag.propTypes = {
    tag: PropTypes.string,
    onClick: PropTypes.func,
    onRemoveTag: PropTypes.func,
    isActive: PropTypes.bool,
};
