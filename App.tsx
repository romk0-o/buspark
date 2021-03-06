import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import NavAppContainer from "./src/Navigation";
import reducer from "./src/reducers";

const store = createStore(reducer, applyMiddleware(thunk));

const App = () => (
  <Provider store={store}>
    <NavAppContainer />
  </Provider>
);

export default App;
