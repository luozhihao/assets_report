import React, { Component } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link, IndexLink} from 'react-router'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

import { Menu, Icon, Tooltip } from 'antd'
import DetailModal from '../components/DetailModal'
import { setModal, setSwitch } from '../actions/count'

const SubMenu = Menu.SubMenu

// 配置导航
class Sider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '',
            username: ''
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    componentDidMount() {
        this.getUser()
    }

    // 关闭弹框
    handleCancel = () => {
        this.props.setModal(false)
    }

    // 切换图表
    switchFn = (checked) => {
        this.props.setSwitch(checked)
    }

    // 获取用户名
    getUser = () => {
        return fetch('/userinfo/', {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    username: data.username
                })
            })
    }

    // 退出
    logout = () => {
        fetch('/logout/', {
                method: 'POST',
                credentials: 'include'
            })
            .then((res) => { return res.json() })
            .then((data) => {
                location.href="/"
            })
    }

    render() {
        const {visible, tableData, chartData, checked, tableLoading} = this.props

        return (
            <div id="rightWrap">
                <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-logo">
                            资产报表系统
                        </div>
                        <Menu mode="horizontal" theme="dark">
                            <Menu.Item key="1" >
                                <Link to="/IdcChart" activeClassName="active">
                                    IDC视角
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/ProductChart" activeClassName="active">
                                    产品视角
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/DepartmentChart" activeClassName="active">
                                    部门视角
                                </Link>
                            </Menu.Item>
                            <SubMenu className="pull-right" title={<span><Icon type="user" />{ this.state.username }</span>}>
                                <Menu.Item key="setting:1">
                                    <div className="text-center" onClick={this.logout}>退出</div>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                </div>
                <div className="right-box">
                    { this.props.children }
                </div>
                <DetailModal 
                    visible={visible} 
                    handleCancel={this.handleCancel}
                    tableData={tableData}
                    chartData={chartData}
                    checked={checked}
                    switchFn={this.switchFn}
                    tableLoading={tableLoading}
                ></DetailModal>
            </div>
        )
    }
}

const getData = state => {
    return {
        visible: state.update.visible,
        tableData: state.update.tableData,
        chartData: state.update.chartData,
        checked: state.update.checked,
        tableLoading: state.update.tableLoading
    }
}

export default connect(getData, { setModal, setSwitch })(Sider)