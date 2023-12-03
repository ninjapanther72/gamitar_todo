import React, {useEffect} from 'react';
import {Anchor, Avatar, Flexbox, Label, Section} from "../../trident-react-ui";
import AppInterface from "../AppInterface";
import {getSessionData, printError, printLog} from "../util/AppUtils";
import {concatStrings, getDefJsonValue, getDefValueStr} from "../../trident-react-ui/ReactUtils";
import {DefStrNA, RouteUrls} from "../config/AppConfig";
import {Constants} from "../../trident-react-ui/config/TridentConfigs";

const UserAcPage = () => {
    const TAG = "UserAcPage";

    const userData = getSessionData();
    const fullName = concatStrings([getDefJsonValue(userData, 'first_name'), getDefJsonValue(userData, 'last_name')], ' ');
    const username = getUserFieldData('username');
    const email = getUserFieldData('email');
    const mobile = getUserFieldData('phone');
    const createdDate = getUserFieldData('created_date');
    const userImage = getUserFieldData('image');

    useEffect(() => {
        // log('userData:', userData);
    }, []);

    return (<>
        <AppInterface
            disableMyAcLink={true}
        >
            <Section
                className={'px-3 py-2 height50'}
                title={'My Account'}>
                <Flexbox className={'p-2 text-dark'} justifyAt={'center'}>
                    <div className={'w-100 m-0 p-0'}>
                        <Flexbox className={"w-100"} justifyAt={'center'}>
                            <Avatar
                                wrapperClassName={`circular overflow-hidden`}
                                className={'circular '}
                                imgClassName={''}
                                innerWrapperClassName={''}
                                size={'100px'}
                                showInitials={false}
                                personName={fullName}>
                                {getDefValueStr(userImage, Constants.userVector)}
                            </Avatar>
                        </Flexbox>

                        <Flexbox className={'p-2 w-auto text-dark'} justifyAt={'center'}>
                            <Flexbox className={'w-auto text-dark'} justifyAt={'center'}>
                                <div className={'w-auto m-0 p-0'}>
                                    <Label className={'m-0 p-1'} textAt={'start'}>
                                        <span className={'fw-semi-bold'}>Full Name: </span>{fullName}
                                    </Label>
                                    <Label className={'m-0 p-1'} textAt={'start'}>
                                        <span className={'fw-semi-bold'}>Username: </span>{username}
                                    </Label>
                                    <Label className={'m-0 p-1'} textAt={'start'}>
                                        <span className={'fw-semi-bold'}>Email: </span>{email}
                                    </Label>
                                    <Label className={'m-0 p-1'} textAt={'start'}>
                                        <span className={'fw-semi-bold'}>Mobile: </span>{mobile}
                                    </Label>
                                    <Label className={'m-0 p-1'} textAt={'start'}>
                                        <span className={'fw-semi-bold'}>Created Date: </span>{createdDate}
                                    </Label>
                                </div>
                            </Flexbox>
                        </Flexbox>
                    </div>
                </Flexbox>

                <Flexbox className={'w-100 mt-2'} justifyAt={'end'}>
                    <Anchor
                        className={'m-1 fs-sm'}
                        asLink={true}
                        href={RouteUrls.home}>
                        Go to Todo Page
                    </Anchor>
                </Flexbox>
            </Section>
        </AppInterface>
    </>)

    function getUserFieldData(field, defValue = DefStrNA) {
        return getDefJsonValue(userData, field, defValue);
    }

    function log(...text) {
        printLog(TAG, ...text);
    }

    function logErr(...text) {
        printError(TAG, ...text);
    }
}
export default UserAcPage;
