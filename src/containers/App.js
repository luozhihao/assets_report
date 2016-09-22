import React, { Component } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Link, IndexLink} from 'react-router'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

import { Menu, Icon, Tooltip } from 'antd'
import DetailModal from '../components/DetailModal'
import { setModal } from '../actions/count'

const SubMenu = Menu.SubMenu

// 创建对象时设置初始化信息
const headers = new Headers()

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

    // 获取用户名
    getUser = () => {
        let request = new Request('/userinfo/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        return fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                this.setState({
                    username: data.username
                })
            })
    }

    // 退出
    logout = () => {
        let request = new Request('/logout/', {
            headers,
            method: 'POST',
            credentials: 'include'
        })

        fetch(request)
            .then((res) => { return res.json() })
            .then((data) => {
                location.href="/"
            })
    }

    render() {
        return (
            <div id="rightWrap">
                <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-logo">
                            资产报表系统
                        </div>
                        <Menu mode="horizontal" theme="dark">
                            <Menu.Item key="1" >
                                <IndexLink to="/" activeClassName="active">
                                    IDC视角
                                </IndexLink>
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
                        </Menu>
                    </div>
                </div>
                <div className="right-box">
                    { this.props.children }
                </div>
                <DetailModal visible={this.props.visible} handleCancel={this.handleCancel}></DetailModal>
            </div>
        )
    }
}

const getData = state => {
    return {
        visible: state.update.visible,
    }
}

export default connect(getData, { setModal })(Sider)