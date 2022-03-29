import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  id: null,
};

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        id: action.id,
      };

    case "RES":
      return {
        ...state,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };

    case "ERR":
      return { loading: false, error: action.error };

    case "CLEAR":
      return initialState;

    default:
      throw new Error("should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    httpDispatch({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback((url, method, body, extra, id) => {
    httpDispatch({ type: "SEND", id: id });
    fetch(url, {
      method: method,
      body: body,
      headers: { "Conect-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        httpDispatch({ type: "RES", responseData: responseData, extra: extra });
      })
      .catch((error) => {
        httpDispatch({ type: "ERR", error: "Something went wrong!" });
      });
  }, []);

  return {
    isLoading: httpState.isLoading,
    data: httpState.data,
    error: httpState.error,
    extra: httpState.extra,
    reqId: httpState.id,
    sendRequest: sendRequest,
    clear: clear,
  };
};

export default useHttp;
