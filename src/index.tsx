import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";

import { IntlProvider, addLocaleData } from "react-intl";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./sass/main.scss";

import Main from "./containers/main";

var fr = require('react-intl/locale-data/fr');
addLocaleData(fr);

const store = configureStore();

render(
  <div>
    <IntlProvider locale="en-CA">
      <Provider store={store}>
        <Main />
      </Provider>
    </IntlProvider>
  </div>,
  document.getElementById("root")
)