import React from "react"
import ReactDOM from "react-dom"

import { enableLogging } from "mobx-logger"
import { Provider } from "mobx-react"

import store from "store"
import App from "App"

const debug = process.env.NODE_ENV === "development"

debug && enableLogging()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app"),
)
