import React, { Component } from 'react'
import Highcharts from 'highcharts'
import { Form, Select, Button, Card, Col, Row } from 'antd'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item

// 创建对象时设置初始化信息
const headers = new Headers()

const areaData1 = ['内网', '外网']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

class ServerType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areaView1: '',
            areaView12: '',
            areaLists: [],
            view: '类型'
        }
    }

    componentDidMount () {
        let state = this.props.location.state

        this.randerChart('serverArea3')
        
        this.setState({
            areaView1: state.area1,
            areaView12: state.area2
        })

        if (state.area1) {
            this.areaGet(state.area1, {areaLists: areaData1}, {areaLists: areaData2})
        }
    }

    // 维度变更
    viewChange = value => {
        this.setState({
            view: value
        })
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

    // 返回方法
    goBack = () => {
        this.props.history.pushState(null, '/IdcChart')
    }

    // 绘图方法
    randerChart = (chartId) => {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chartId,
                type: 'bar'
            },
            colors: colors,
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['物理机', '云主机', '虚拟机']
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
                    '<td style="padding:0"><b>{point.y} 台</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                bar: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function(event) {
                                console.log(event.point.category)
                                console.log(event.point.series.name)
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
            series: [{
                name: '上架',
                data: [6, 2, 4]
            }, {
                name: '下架',
                data: [2, 3, 5]
            }]
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
                    <FormItem
                        label="维度"
                    >
                        <Select 
                            {...getFieldProps('view')}
                            value={this.state.view}
                            onChange={this.viewChange}
                            allowClear
                            style={{ width: 150 }} 
                        >
                            <Option value="类型">类型</Option>
                            <Option value="产品">产品</Option>
                            <Option value="部门">部门</Option>
                            <Option value="来源">来源</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary">查询</Button>
                        &nbsp;&nbsp;
                        <Button onClick={this.goBack}>返回</Button>
                    </FormItem>
                </Form>
                <div>
                    <Row gutter="16" style={{marginTop: '80px'}}>
                        <Col span="24">
                            <Card title="服务器分布">
                                <div id="serverArea3"></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

ServerType = Form.create()(ServerType)

export default ServerType

