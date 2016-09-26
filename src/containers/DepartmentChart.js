import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highcharts from 'highcharts'
import { Form, Select, Button, Card, Col, Row } from 'antd'
import { setModal } from '../actions/count'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item

// 创建对象时设置初始化信息
const headers = new Headers()

const areaData1 = ['内网', '外网']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

const data = {
    "area": {"data": [{name: '物理机', data: [3, 6, 2]}, {name: '虚拟机', data: [2, 5, 4]}, {name: '云主机', data: [1, 3, 4] }], "categories": ['航海工作室', '黑金工作室', '九阴工作室']}, 
    "type": {"data": [{name: '自有', data: [3, 6, 2]}, {name: '租赁', data: [2, 5, 4]}], "categories": ['航海工作室', '黑金工作室', '九阴工作室']}
}

class DepartmentChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areaView1: '',
            areaView12: '',
            areaLists: []
        }
    }

    componentDidMount () {
        this.randerChart('serverArea', data.area)
        this.randerChart('serverType', data.type)
    }

    // 区域变更
    areaGet = (value, data1, data2) => {
        value === '国内' ? this.setState(data1) : this.setState(data2)
    }

    areaChange1 = value => {
        this.setState({areaView1: value, areaView12: ''})
        this.areaGet(value, {areaLists: areaData1}, {areaLists: areaData2})
    }

    areaChange12 = value => {
        this.setState({areaView12: value})
    }

    // 显示弹框
    showView = () => {
        this.props.setModal(true)
    }

    // 绘图方法
    randerChart = (chartId, data) => {
        var _this = this

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chartId,
                type: 'column',
            },
            colors: colors,
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: data.categories
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                title: {
                    text: '台'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}台（可点击）</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function(event) {
                                _this.showView(event.point)
                            }
                        }
                    },
                    dataLabels: {
                        rotation: -90,
                        inside: true,
                        enabled: true,
                        color: '#fff',
                        style: {
                            fontFamily: 'Verdana, sans-serif',
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: data.data
        })
    }

    render() {
        const { getFieldProps } = this.props.form

        return(
            <div>
                <Form className="search-form" inline>
                    <FormItem
                        label="区域一"
                    >
                        <Select 
                            {...getFieldProps('area1')}
                            value={this.state.areaView1}
                            onChange={this.areaChange1}
                            allowClear
                            style={{ width: 150 }} 
                        >
                            <Option value="国内">国内</Option>
                            <Option value="海外">海外</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        label="区域二"
                    >
                        <Select 
                            {...getFieldProps('area12')}
                            value={this.state.areaView12}
                            onChange={this.areaChange12}
                            allowClear
                            style={{ width: 150 }} 
                        >
                            { 
                                this.state.areaLists.map((e, i) => 
                                    <Option value={e} key={i}>{e}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                </Form>
                <div>
                    <Row gutter="16" style={{marginTop: '16px'}}>
                        <Col span="24">
                            <Card title="服务器分布">
                                <div id="serverArea" className="chart-item"></div>
                            </Card>
                        </Col>
                        <Col span="24" style={{marginTop: '16px'}}>
                            <Card title="上下架分布">
                                <div id="serverType" className="chart-item"></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

DepartmentChart = Form.create()(DepartmentChart)

export default connect(null, { setModal })(DepartmentChart)

