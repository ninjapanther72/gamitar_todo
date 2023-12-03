import React, {useContext} from 'react';
import {Flexbox, Section} from "../../trident-react-ui";
import {SessionContext} from "../context/SessionContext";
import {RouteUrls} from "../config/AppConfig";

const Page404 = () => {
    const TAG = "Page404";

    const {currUserSessionData, isSessionCreated} = useContext(SessionContext);

    return (<>
            <Flexbox className={`p-4`} justifyAt={'center'}>
                <Section
                    className={'px-5 py-3 w-100 height90'}
                    shadowVariant={'sm'}>
                    <Flexbox className={`p-4 section borderless height80`} justifyAt={'center'} alignAt={'center'}>
                        <div className="error-404 h-100">
                            <div className="error-code m-b-10 m-t-20">404 <i className="fa fa-warning"></i></div>
                            <h2 className="font-bold">Oops 404! That page can’t be found.</h2>

                            <div className="error-desc">
                                Sorry, but the page you are looking for was either not found or does not exist. <br/>
                                Try refreshing the page or click the button below to go back to the Homepage.
                                <div><br/>
                                    <a href={isSessionCreated ? RouteUrls.home : RouteUrls.login}
                                       className="btn btn-primary">
                                        <span className="glyphicon glyphicon-home">
                                        </span> Go back to Homepage</a>
                                </div>
                            </div>
                        </div>
                    </Flexbox>
                </Section>
            </Flexbox>
        </>
    )

    function fun() {

    }
}
export default Page404;
