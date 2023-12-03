import React, {useEffect, useState} from 'react';
import './App.css';
import {TaskProvider} from "./app/context/TaskContext";
import {Route, Routes, useNavigate} from "react-router-dom";
import {BaseReqUrl, ReqUrls, RouteUrls} from "./app/config/AppConfig";
import TodoPage from "./app/page/TodoPage";
import {ToastProvider} from "./app/context/ToastContext";
import LoginPage from "./app/user/LoginPage";
import SignUpPage from "./app/user/SignUpPage";
import {getSessionAuthToken, printError, printLog} from "./app/util/AppUtils";
import ForgotPwPage from "./app/user/ForgotPwPage";
import {isJsonValueTrue} from "./trident-react-ui/ReactUtils";
import axios from "axios";
import UserAcPage from "./app/page/UserAcPage";

const loginRoutes = [
    {
        key: 'TodoPage',
        routeUrl: RouteUrls.home,
        component: <TodoPage/>
    },
    {
        key: 'UserAcPage',
        routeUrl: RouteUrls.userProfile,
        component: <UserAcPage/>
    },
];
const withoutLoginRoutes = [
    {
        key: 'LoginPage',
        routeUrl: RouteUrls.login,
        component: <LoginPage/>
    },
    {
        key: 'SignUpPage',
        routeUrl: RouteUrls.signUp,
        component: <SignUpPage/>
    },
    {
        key: 'ForgotPwPage',
        routeUrl: RouteUrls.forgotUserPw,
        component: <ForgotPwPage/>
    },
];

function App() {
    const TAG = 'App.tsx';

    const navigate = useNavigate();

    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
    const [alreadyCheckLogin, setAlreadyCheckLogin] = useState(false);
    const [pageRoutes, setPageRoutes] = useState(withoutLoginRoutes);

    useEffect(() => {
        checkIfLoginSuccessful()
    }, [isLoginSuccessful]);


    return (
        <ToastProvider>
            <TaskProvider>
                <Routes>
                    {pageRoutes?.map((route, index) => (
                        <Route key={route.key} path={route.routeUrl} element={route.component}/>
                    ))}
                    {/*default-route*/}
                    {/*<Route path={RouteUrls._404} element={checkIfLoginSuccessful() ? <TodoPage/> : <LoginPage/>}/>*/}
                    {/*<Route path={RouteUrls._404} element={<LoginPage/>}/>*/}
                </Routes>

            </TaskProvider>
        </ToastProvider>
    );

    async function checkIfLoginSuccessful() {
        const fun = 'checkIfLoginSuccessful:';
        try {
            if (!alreadyCheckLogin) {
                const userAuthToken = getSessionAuthToken();
                // log(fun, 'userAuthToken:', userAuthToken);

                //send request
                axios.defaults.headers.common['Authorization'] = `${userAuthToken}`;
                axios.post(BaseReqUrl + ReqUrls.checkLoginAvailable)
                    .then(async (res) => {
                        const fetchedData = await res.data;
                        // log(fun, "fetchedData:", fetchedData);
                        const browserUrl = window.location.href + '';

                        const success = isJsonValueTrue(fetchedData, 'success');
                        // log(fun, "fetchedData.success:", success);
                        setAlreadyCheckLogin(success);
                        setIsLoginSuccessful(success);
                        if (success) {
                            setPageRoutes(loginRoutes);
                            if (browserUrl.endsWith(RouteUrls.userProfile)) {
                                navigate(RouteUrls.userProfile);
                            } else {
                                navigate(RouteUrls.home);
                            }
                        } else {
                            setPageRoutes(withoutLoginRoutes);
                            localStorage.clear();

                            // log(fun, 'browserUrl:', browserUrl);
                            if (browserUrl.endsWith(RouteUrls.signUp)) {
                                navigate(RouteUrls.signUp);
                            } else if (browserUrl.endsWith(RouteUrls.forgotUserPw)) {
                                navigate(RouteUrls.forgotUserPw);
                            } else {
                                navigate(RouteUrls.login);
                            }
                        }
                    })
                    .catch((err) => {
                        logErr(fun, err);
                        setPageRoutes(withoutLoginRoutes);
                        localStorage.clear();
                        navigate(RouteUrls.login);
                        setAlreadyCheckLogin(false);
                    })
            }
        } catch (e) {
            logErr(fun, e);
            setAlreadyCheckLogin(false);
            setPageRoutes(withoutLoginRoutes);
            localStorage.clear();
            navigate(RouteUrls.login);
        }
    }

    function storeCurrLoginUserDataInLocalStorage() {
        const fun = 'storeCurrLoginUserDataInLocalStorage:';
        try {
        } catch (e) {
            logErr(fun, e);
        }
    }

    function log(...text) {
        printLog(TAG, ...text);
    }

    function logErr(...text) {
        printError(TAG, ...text);
    }
}

export default App;
