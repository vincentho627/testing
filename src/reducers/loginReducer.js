const refreshToken = localStorage.getItem("refresh_token");
let expiryDate;
let now;
if (refreshToken) {
    expiryDate = JSON.parse(atob(refreshToken.split('.')[1])).exp;
    now = Math.ceil(Date.now() / 1000);
}

let isLoggedIn = (refreshToken && (expiryDate>now) && localStorage.getItem("username") && localStorage.getItem("id") && true)

if (isLoggedIn === null) isLoggedIn = false;

console.log(isLoggedIn)

const loginReducer = (state=isLoggedIn, action) => {
    switch(action.type) {
        case "LOGIN":
            return true;
        case "LOGOUT":
            return false;
        default:
            return state;
    }
}

export default loginReducer