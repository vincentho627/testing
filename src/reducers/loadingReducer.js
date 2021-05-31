const loadingReducer = (state=false, action) => {
    switch(action.type) {
        case "LOADING":
            return true;
        case "NOTLOADING":
            return false;
        default:
            return state;
    }
}

export default loadingReducer