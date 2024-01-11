import { createContext, useReducer, useContext } from "react";

const loggedUserReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.content;
    case "RESET":
      return null;
    default:
      return state;
  }
};

const LoggedUserContext = createContext();

export const LoggedUserContextProvider = (props) => {
  const [userInfo, userInfoDispatch] = useReducer(loggedUserReducer, null);
  return (
    <LoggedUserContext.Provider value={[userInfo, userInfoDispatch]}>
      {props.children}
    </LoggedUserContext.Provider>
  );
};

export const useLoggedUserInfo = () => useContext(LoggedUserContext)[0];

export const setLoggedUserInfo = () => useContext(LoggedUserContext)[1];
