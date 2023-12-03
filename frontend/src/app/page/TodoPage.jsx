import React, {useEffect, useState} from 'react';
import {checkNullArr, checkNullStr, getDefJsonValue, isArr, isBoolTrue, isJsonValueTrue, moveJsonListItems} from "../../trident-react-ui/ReactUtils";
import {App_THEME_VARIANT, ReqUrls, TodoItemKeys} from "../config/AppConfig";
import {useToast} from "../context/ToastContext";
import {printError, printLog, sendRequest} from "../util/AppUtils";
import {Button, SearchableCheckboxList, Section, SimpleLoader} from "../../trident-react-ui";
import AppInterface from "../AppInterface";
import {CssVariant, FormInputCls} from "../../trident-react-ui/config/TridentConfigs";
import {useTaskData} from "../context/TaskContext";

//https://docs.google.com/document/u/0/d/1mkOK9TOjxvvZFHCsb2m8cgYuE5-PU5-r-9ajKKEkcso/mobilebasic
//https://github.com/topics/react-todo-list
//https://github.com/drehimself/todo-react
//https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react-typescript-nodejs-and-mongodb/
//https://dribbble.com/shots/14100356-ToDo-App-UI
//https://dribbble.com/shots/6454935-Your-Next-Task-Manager-App-UI
const TodoPage = () => {
    const TAG = 'TodoPage.jsx';

    const {taskList, showLoader, success} = useTaskData();

    const TodoKeys = TodoItemKeys;

    const {showToast, changeToastVariant} = useToast();

    const Fields = {
        todoList: 'todoList',
        todoList_SelectedOnly: 'todoList_SelectedOnly',
        todoList_ShowLoader: 'todoList_ShowLoader',
    };
    const [fieldsData, setFieldsData] = useState({});

    useEffect(() => {
    }, []);
    useEffect(() => {
        const fun = 'useEffect.taskData:';
        try {
            const fetchedList = taskList;
            // log(fun, 'fetchedList:', fetchedList);
            if (checkNullArr(fetchedList) && (!checkNullArr(getFieldValue(Fields.todoList)))) {
                let modifiedList = fetchedList.map((item) => {
                    return {
                        ...item,
                        selected: isJsonValueTrue(item, 'completed'),
                        endSubtitle: isJsonValueTrue(item, 'completed') ? '(Completed)' : '',
                    }
                });

                // modifiedList = sortJsonList(modifiedList, TodoKeys.taskName);
                modifiedList = moveJsonListItems(modifiedList, 'selected', true, false);

                // log(fun, 'modifiedList:', modifiedList);

                updateTodoList(modifiedList);
            }
        } catch (e) {
            logErr(fun, e);
        }
    }, [taskList]);


    return (<AppInterface>
        <div className={`row m-0 p-0 mt-2 jc-center`}>
            <div className={`m-0 p-0 jc-center ${FormInputCls._6_12}`}>
                <Section
                    className={`w-100 m-0 p-3 height80`}
                    title={'Todo App'}
                    borderless={true}
                    shadowVariant={'sm'}
                    headerControls={<Button
                        className={`px-2 py-1 fs-sm text-nowrap position-absolute rounded-3 shadow-none`}
                        style={{top: '-.3rem', right: '-.3rem'}}
                        variant={CssVariant.info}
                        text={'Add New Task'}
                        onClick={handleAddTask}
                    />}>
                    {showLoader && <SimpleLoader wrapperClassName={'m-2'}/>}

                    {!showLoader && <Section className={`w-100 m-0 p-2 mt-2 h-auto`}
                        // title={'Ongoing Todo'}
                                             titleClassName={'fs-md fw-bold px-2'}
                                             titleAt={'start'}
                                             contentClassName={'position-relative'}>
                        {createPanel()}
                    </Section>}
                </Section>
            </div>
        </div>
    </AppInterface>);

    //-----------------------UI Functions start---------------------------------


    function createPanel() {
        return createTodoListComponent({
            checkListKey: Fields.todoList,
            checkListSelectedKey: Fields.todoList_SelectedOnly,
            checkListLoaderKey: Fields.todoList_ShowLoader,
            isListOngoing: true,
        });
    }

    function createTodoListComponent({
                                         checkListKey,
                                         checkListSelectedKey,
                                         checkListLoaderKey,
                                         label,
                                         // isListOngoing,
                                     }) {
        return <SearchableCheckboxList
            wrapperClassName={''}
            borderBoxClassName={''}
            labelClassName={'fs-sm'}
            borderless={true}
            borderlessList={true}
            variantx={App_THEME_VARIANT}
            variant={CssVariant.danger}

            //generic
            padded={true}
            pad={1}
            label={label}
            showTotalCount={true}
            showSearchCount={true}
            showSelectedCount={true}
            checkListColumnCount={1}
            inlineHeader={false}
            scrollLargeCheckItem={true}
            showCheckItemTooltip={true}
            showCheckItemEditButton={true}
            showCheckItemRemoveButton={true}
            showCheckItemTooltipLimit={86}
            listHeight={'65vh'}
            showSelectedCountText={'Completed'}

            //select
            showSelect={false}

            //cb-list
            showDataList={true}
            showSelectAll={false}
            showDisplaySelectedOnly={true}
            showDisplaySelectedOnlyText={'Show Completed'}
            minifyUpdatedList={false}
            checkBinarySelection={true}
            isCheckItemJson={true}
            originalCheckItemOutlined={false}
            checkItemJsonIdKey={TodoKeys.id}
            checkItemJsonTextKey={TodoKeys.taskName}
            checkDataList={getFieldValue(checkListKey, [])}
            // checkDataList={checkNullArr(getFieldValue(checkListKey, []))
            //     ? (isListOngoing
            //             ? getFieldValue(checkListKey, []).filter(item => !isJsonValueTrue(item, 'completed'))
            //             : getFieldValue(checkListKey, []).filter(item => isJsonValueTrue(item, 'completed'))
            //     )
            //     : []}
            // checkDataList={getFieldValue(checkListKey, [])}
            showDataListLoader={isFieldValueTrue(checkListLoaderKey)}
            onItemCheck={(e, value, updatedList, newCheckedList, updatedItem) => {
                // log('onItemCheck.value:', value, 'updatedItem:', updatedItem);
                // log('onItemCheck.value:', value, 'updatedList:', sliceArr(updatedList, 0, 10), 'len:', getArrLen(updatedList));
                // log('onItemCheck.value:', value, 'newCheckedList:', sliceArr(newCheckedList, 0, 10), 'len:', getArrLen(newCheckedList));
                handleTaskItem_SelectDeselect(updatedList, checkListSelectedKey, updatedItem);
            }}
            onCheckAll={(e, value, updatedList, newCheckedList) => {
                // log('onCheckAll.value:', value, 'updatedList:', sliceArr(updatedList, 0, 10), 'len:', getArrLen(updatedList));
                // log('onCheckAll.value:', value, 'newCheckedList:', sliceArr(newCheckedList, 0, 10), 'len:', getArrLen(newCheckedList));
                // handleTaskItem_SelectDeselect(updatedList, checkListSelectedKey);
            }}
            onCheckListUpdate={(updatedList, newCheckedList) => {
                // log('onCheckListUpdate.value:', value, 'updatedList:', sliceArr(updatedList, 0, 10), 'len:', getArrLen(updatedList));
                // log('onCheckListUpdate.value:', value, 'newCheckedList:', sliceArr(newCheckedList, 0, 10), 'len:', getArrLen(newCheckedList));
                // updateFieldValue(checkListSelectedKey, updatedList);
                // handleTaskItem_SelectDeselect(updatedList, checkListSelectedKey);
            }}
            onCheckItemEdit={(updatedItem, index) => {
                // log('onCheckItemEdit.updatedItem:', updatedItem, 'index:', index);
                handleEditTask(updatedItem, index);
            }}
            onCheckItemDelete={(deletedItem, index) => {
                // log('onCheckItemDelete.deletedItem:', deletedItem, 'index:', index);
                handleDeleteTask(deletedItem, index);
            }}

            //search
            searchable={true}
            onSearch={(value) => {
                // log('onSearch.value:', value,);
            }}
        />
    }


    //-----------------------UI Functions end---------------------------------

    //-----------------------Util Functions start---------------------------------
    function updateFieldValue(field, value) {
        // log(`updateFieldValue.field: ${field}, value: `, value);
        setFieldsData(prevState => ({...prevState, [field]: value}));
    }

    function getFieldValue(field, defValue) {
        return getDefJsonValue(fieldsData, field, defValue);
    }

    function isFieldValueTrue(field) {
        return isBoolTrue(getFieldValue(field));
    }

    //-----------------------Util Functions end---------------------------------


    //-----------------------Request Functions start---------------------------------
    async function handleAddTask() {
        const fun = 'handleAddTask:';
        try {
            const newTask = window.prompt('Add new task');
            if (checkNullStr(newTask)) {
                let todoList = getFieldValue(Fields.todoList, []);
                if (isArr(todoList)) {
                    const newItem = {
                        [TodoKeys[TodoKeys.id]]: todoList.length + 1,
                        [TodoKeys[TodoKeys.taskName]]: newTask,
                        [TodoKeys[TodoKeys.description]]: '',
                        [TodoKeys[TodoKeys.completed]]: false,
                        selected: false,
                        [TodoKeys[TodoKeys.priority]]: 'None',
                        [TodoKeys[TodoKeys.createdDate]]: new Date().toLocaleDateString(),
                    };

                    const REQUEST_OPTIONS = {
                        taskItem: newItem
                    };
                    // log(fun, `Sending add-task request via: ${ReqUrls.todoItem_AddTask}...`);

                    //send add-request
                    await sendRequest({
                        reqUrl: ReqUrls.todoItem_AddTask,
                        reqOptions: REQUEST_OPTIONS,
                        type: 'post',
                        onFetched: ((fetchedData) => {
                            // log(fun, 'fetchedData:', fetchedData);
                            const message = getDefJsonValue(fetchedData, 'message');
                            const success = isJsonValueTrue(fetchedData, 'success');
                            toast('New task added')
                            if (success) {
                                todoList = [newItem, ...todoList];
                                updateTodoList(todoList);
                                // log(message);
                            } else {
                                logErr(message);
                            }
                        })
                    });
                }
            }
        } catch (e) {
            logErr(fun, e);
        }
    }

    function handleToggleCompleted(taskId) {
    }

    async function handleEditTask(updatedItem) {
        const fun = 'handleEditTask:';
        try {
            const REQUEST_OPTIONS = {
                id: getDefJsonValue(updatedItem, TodoKeys.id),
                name: getDefJsonValue(updatedItem, TodoKeys.taskName),
                updatedItem: updatedItem,
            };

            //send add-request
            await sendRequest({
                reqUrl: ReqUrls.todoItem_EditTask,
                reqOptions: REQUEST_OPTIONS,
                onFetched: ((fetchedData) => {
                    // log(fun, 'fetchedData:', fetchedData);
                    const message = getDefJsonValue(fetchedData, 'message');
                    const success = isJsonValueTrue(fetchedData, 'success');
                    if (success) {
                        // log(message);
                    } else {
                        logErr(message);
                    }
                })
            });
        } catch (e) {
            logErr(e);
        }
    }

    async function handleDeleteTask(deletedItem, index) {
        const fun = 'handleDeleteTask:';
        try {
            const REQUEST_OPTIONS = {
                id: getDefJsonValue(deletedItem, TodoKeys.id),
                deletedItem: deletedItem,
            };

            //send add-request
            await sendRequest({
                reqUrl: ReqUrls.todoItem_deleteTask,
                reqOptions: REQUEST_OPTIONS,
                onFetched: ((fetchedData) => {
                    // log(fun, 'fetchedData:', fetchedData);
                    const message = getDefJsonValue(fetchedData, 'message');
                    const success = isJsonValueTrue(fetchedData, 'success');
                    if (success) {
                        // log(message);
                    } else {
                        logErr(message);
                    }
                })
            });
        } catch (e) {
            logErr(e);
        }
    }

    async function handleTaskItem_SelectDeselect(updatedList, checkListSelectedKey, updatedItem) {
        const fun = 'handleTaskItem_SelectDeselect:';
        try {
            // log(fun, 'updatedItem:', updatedItem);
            // log(fun, 'checkListSelectedKey:', checkListSelectedKey, 'updatedList:', sliceArr(updatedList, 0, 2), 'len:', getArrLen(updatedList));
            if (isArr(updatedList)) {
                const REQUEST_OPTIONS = {
                    id: getDefJsonValue(updatedItem, TodoKeys.id),
                    completed: isJsonValueTrue(updatedItem, 'selected'),
                    updatedItem: updatedItem,
                };

                //send add-request
                await sendRequest({
                    reqUrl: ReqUrls.todoItem_moveTaskToCompleted,
                    reqOptions: REQUEST_OPTIONS,
                    onFetched: ((fetchedData) => {
                        // log(fun, 'fetchedData:', fetchedData);
                        const message = getDefJsonValue(fetchedData, 'message');
                        const success = isJsonValueTrue(fetchedData, 'success');
                        if (success) {
                            // log(message);


                            //Update list
                            updateFieldValue(checkListSelectedKey, updatedList);

                            //task-list
                            let modifiedList = updatedList.map(item => {
                                return {
                                    ...item,
                                    completed: isJsonValueTrue(item, 'selected'),
                                    endSubtitle: isJsonValueTrue(item, 'selected') ? '(Completed)' : '',
                                }
                            });
                            modifiedList = moveJsonListItems(modifiedList, 'selected', true, false);

                            // log(fun, 'modifiedList:', modifiedList, 'len:', getArrLen(modifiedList));
                            updateTodoList(modifiedList);
                        } else {
                            logErr(message);
                        }
                    })
                });
            }
        } catch (e) {
            logErr(fun, e);
        }
    }

    function updateTodoList(newList) {
        if (checkNullArr(newList)) {
            updateFieldValue(Fields.todoList, newList);
        }
    }

    //-----------------------Request Functions end---------------------------------

    function toast(text, variant = 'black') {
        showToast(text + '');
        changeToastVariant(variant);
    }

    function log(...text) {
        printLog(TAG, ...text);
    }

    function logErr(...text) {
        printError(TAG, ...text);
    }
};

export default TodoPage;
