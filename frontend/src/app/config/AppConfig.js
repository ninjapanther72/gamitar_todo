//https://docs.google.com/document/u/0/d/1mkOK9TOjxvvZFHCsb2m8cgYuE5-PU5-r-9ajKKEkcso/mobilebasic


export const AppTitle = "Gamitar Todo App";
export const AppIcon = "../assets/images/app_icon.png";
export const DebugModeOn = true;
export const DefStrNA = "N/A";
export const TOAST_HIDE_DURATION = 3000;

export const SKLTN_VARIANT = "tbl-skltn";

export const App_THEME_VARIANT = "primary";

export const BaseReqUrl = 'http://localhost:8010';
export const AxiosConfig = {
    baseURL: BaseReqUrl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
    // timeout: 5000
};

export const GlobalKeyStore = {
    userSessionLsData: 'usersessiondata',
    userAuthToken: 'userAuthToken',
};

export const RouteUrls = {
    home: "/",
    _404: "*",
    login: "/login",
    signUp: "/signup",
    forgotUserPw: "/reset-password",
    userProfile: "/my-account",
};

//--------------Frontend-Backend common fields start-------------------------------
export const TestLoginUserData = {
    id: 1,
    username: "john_doe",
    email: "johndoe@gmail.com",
    password: "test_pw",
    mobile: "1234567890",
    first_name: "John",
    last_name: "Doe",
    active: 1,
    created_date: "2023-01-01 12:00:00",
    modified_date: "2023-11-30 21:49:08",
    deleted_date: null
};
export const TEST_LOGIN_USERNAME = TestLoginUserData.username;

export const TodoItemKeys = {
    id: 'id',
    taskName: 'taskName',
    completed: 'completed',
    priority: 'priority',
    description: 'description',
    createdDate: 'createdDate',
};

export const ReqUrls = {
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


