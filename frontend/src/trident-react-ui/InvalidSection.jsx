import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Label, Section} from "./index";


//https://codepen.io/sarazond/pen/jOKyjZ
//https://codepen.io/rafaelavlucas/pen/NWWQNjZ
//https://gosnippets.com/snippets/custom-404-error-page-design-using-html-css-snippet
const InvalidSection = ({
                            className = "",
                            children,
                            msg = 'Invalid Page',
                            style = {}
                        }) => {
    const TAG = "InvalidSection";

    const Images = [
        'https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_1280.jpg',

    ]

    useEffect(() => {

    }, []);
    useEffect(() => {

    }, [children]);

    return (<>
            <div className={'d-flex jc-center w-100 p-0 px-2 m-0'}>
                <Section className={'p-3 height50'} borderless={true}>
                    <Label className={'w-100 m-0 p-0 text-dark fs-md fw-semi-bold'} textAt={'center'}>{msg}</Label>
                </Section>
            </div>
        </>
    )

    function fun() {

    }
}
InvalidSection.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
};
export default InvalidSection;
