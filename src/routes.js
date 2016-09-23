import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import { Sider, IdcChart, ProductChart, DepartmentChart, ServerChart, ServerType } from './containers'

export default (
    <Route path="/" component={Sider}>
        <IndexRoute path="IdcChart" component={IdcChart} />
        <Route path="IdcChart" component={IdcChart} >
            <Route path="ServerChart" component={ServerChart} />
            <Route path="ServerType" component={ServerType} />
        </Route>
        <Route path="ProductChart" component={ProductChart} />
        <Route path="DepartmentChart" component={DepartmentChart} />
    </Route>
)