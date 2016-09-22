import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Sider, IdcChart, ProductChart, DepartmentChart, ServerChart, ServerType } from './containers'

export default (
    <Route path="/" component={Sider}>
        <IndexRoute component={IdcChart} />
        <Route path="IdcChart" component={IdcChart} />
        <Route path="ProductChart" component={ProductChart} />
        <Route path="DepartmentChart" component={DepartmentChart} />
        <Route path="ServerChart/:area1/:area2" component={ServerChart} />
        <Route path="ServerType/:area1/:area2" component={ServerType} />
    </Route>
)