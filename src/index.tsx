import * as React from "react";
import { render } from "react-dom";
import { IntlProvider, addLocaleData } from "react-intl";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

import Main from "./components/main";

var fr = require('react-intl/locale-data/fr');
addLocaleData(fr);

render(
  <div>
    <IntlProvider locale="en-CA">
      <Main />
    </IntlProvider>
  </div>,
  document.getElementById("root")
)