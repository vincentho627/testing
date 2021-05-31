const isAnonymous = localStorage.getItem("isAnonymous") === "true";

const anonymousReducer = (state=isAnonymous, action) => {
    switch(action.type) {
        case "ANONYMOUS":
            return true;
        case "NOTANONYMOUS":
            return false;
        default:
            return state;
    }
}

export default anonymousReducer