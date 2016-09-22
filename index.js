import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import Root from './src/containers/Root'
import finalCreateStore from './src/store/configureStore'
import reducer from './src/reducers'

import 'font-awesome/css/font-awesome.min.css'   
import './src/assets/css/bootstrap.min.css'   
import './src/assets/css/main.less'

const store = finalCreateStore(reducer)
const history = syncHistoryWithStore(hashHistory, store)

render(
    <Root store={store} history={history}>
    </Root>,
    document.getElementById('mount')
)