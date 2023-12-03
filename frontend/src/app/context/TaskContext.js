import React, {createContext, useContext, useEffect, useState} from 'react';
import {printError, printLog, sendRequest} from "../util/AppUtils";
import {ReqUrls} from "../config/AppConfig";
import {TasksLists} from "../data/FakeData";
import {createTimeout, getDefJsonValue, isJsonValueTrue} from "../../trident-react-ui/ReactUtils";

const TaskContext = createContext();

const TAG = 'TaskContext';

const TaskProvider = ({children}) => {
    const [taskList, setTaskList] = useState(TasksLists);
    const [taskData, setTaskData] = useState({taskList: [], showLoader: false, success: false});
    // const [taskData, setTaskData] = useState({taskList: TasksLists, showLoader: false, success: false});

    useEffect(() => {
        fetchTasksFromDb();
    }, []);

    return (
        <TaskContext.Provider value={taskData}>
            {children}
        </TaskContext.Provider>
    );

    async function fetchTasksFromDb() {
        const fun = 'fetchTasksFromDb:';
        try {
            if (!isJsonValueTrue(taskData, 'success')) {
                setTaskData({taskList: [], success: false, showLoader: true});

                await sendRequest({
                    reqUrl: ReqUrls.fetchTodoList,
                    type: 'get',
                    onFetched: ((fetchedData) => {
                        // const res = await fetch(ReqUrls.fetchTodoList);
                        // log(fun, 'res:', res);
                        // const fetchedData = await res.json();
                        // log(fun, 'fetchedData:', fetchedData);
                        // setTaskList(fetchedData);
                        const success = isJsonValueTrue(fetchedData, 'success');
                        if (success) {
                            createTimeout(() => {
                                setTaskData({
                                    taskList: getDefJsonValue(fetchedData, 'data', []),
                                    success: success,
                                    message: getDefJsonValue(fetchedData, 'message'),
                                    showLoader: false
                                });
                            }, 1000);
                        }
                    }),
                    onError: ((e) => {
                        setTaskData({taskList: [], success: false, showLoader: false});
                    })
                });
            }
        } catch (e) {
            logErr(fun, e)
            setTaskData({taskList: [], success: false, showLoader: false});
        }
    }

    function log(...text) {
        printLog(TAG, ...text)
    }

    function logErr(...text) {
        printError(TAG, ...text)
    }
};

export {TaskContext, TaskProvider};
export const useTaskData = () => {
    return useContext(TaskContext);
};
