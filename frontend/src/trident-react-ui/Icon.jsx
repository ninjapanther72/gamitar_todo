import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@mui/material/Tooltip";
import {checkNull} from "./ReactUtils";
import {THEME} from "./index";

//fa fa or bi bi icons
const Icon = ({
                  className = "",
                  icon = "",
                  size = "13px",
                  style = {},
                  color = "black",
                  highlightVariant = THEME,
                  tooltip,
                  onClick,
              }) => {
    return (<>
            <Tooltip title={tooltip}>
                <i
                    className={`${icon} ${className} bibi-pie-chartx highlight-text-${checkNull(onClick) ? `${highlightVariant} cursor-pointer` : ''}`}
                    onClick={onClick}
                    style={{
                        fontSize: size,
                        color: color, ...style
                    }}
                />
            </Tooltip>
        </>
    )
}
Icon.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(['13px'])]),
    style: PropTypes.object
};
export default Icon;
