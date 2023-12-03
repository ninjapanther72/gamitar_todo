require('dotenv').config();

const DebugModeOn = true;

const DefStr = "";
const DefStrNA = "N/A";

//--------------Frontend-Backend common fields start-------------------------------
const TodoItemKeys = {
    id: 'id',
    taskName: 'taskName',
    completed: 'completed',
    priority: 'priority',
    description: 'description',
    createdDate: 'createdDate',
};
const ReqUrls = {
    login: '/login-session',
    forgotUserPw_EmailExistCheck: '/forgot-user-pw-email-exist-check',
    forgotUserPw_ResetPw: '/forgot-user-pw-reset-password',
    registerUser: '/register-user',
    checkLoginAvailable: '/check-login-available',
    fetchTodoList: '/fetch-todo-list',
    todoItem_AddTask: '/todo-item-add-task',
    todoItem_EditTask: '/todo-item-edit-task',
    todoItem_deleteTask: '/todo-item-delete-task',
    todoItem_moveTaskToCompleted: '/todo-item-move-task-to-completed',
};
//--------------Frontend-Backend common fields end-------------------------------


const Messages = {
    offlineError: "Error: Server is either offline or trying to connect to the wrong port! ",
    _413Error: "Error Code = 413, Perhaps request entity too large (See: PayloadTooLargeError)",

    formDataSaveSuccess: "You data has been saved successfully",
    fetchError: "Couldn't load your data, please try again",
    formDataSaveError: "Couldn't save your data, please try again",
    emptyField: "This field is required.", // Field cannot be empty
    alphabeticValue: "*Alphabetic characters only",
    alphaNumericValue: "*Alphanumeric characters only",
    numericValue: "*Numeric values only",
    invalidUrl: "*Invalid Url",
    invalidEmail: "*Invalid Email",
    invalidMobile: "*Invalid Mobile",
    invalidValue: "*Invalid data",
    invalidPassword:
        "Should have at least 1 uppercase, 3 lowercase, 2 digits, 1 special symbol, min-length=8",

    invalidCredsMsg: "Invalid credentials!",
    verifyErrMsg: "Verification failed, please try again",
    verifySuccessMsg: "Verification successful, welcome back",
    uploadErrMsg: "Couldn't save your data, please try again",
    uploadImgErrMsg: "Couldn't save your images, please try again",
    uploadSuccessMsg: "You data has been saved successfully",
    recordDeleteSuccessMsg: "Record deleted successfully",
    recordDeleteErrorMsg: "Couldn't delete the record deleted, please try again",
    fetchSuccessMsg: "Successfully fetched your data",
    fetchErrMsg: "Sorry! Couldn't retrieve data, please try again",
    emailExistsMsg: "Email already exists",
    serverErrorMsg: "Internal Server Error",
    similarDataExistsMsg: 'Similar data already exists',
    invalidEmailMsg: "Email has invalid domain",
    unidentifiedEmailMsg: "Unidentified email",
};

const Constants = {
    dateFormat: 'DD-MMM-YYYY',
};
module.exports = {
    DebugModeOn,
    DefStr,
    DefStrNA,
    TodoItemKeys,
    ReqUrls,
    Messages,
    Constants,
};
