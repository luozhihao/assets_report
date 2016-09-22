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
        this.randerChart('serverArea')
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

    // 绘图方法
    randerChart = (chartId) => {
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
                categories: ['物理机', '虚拟机', '云主机']
            },
            yAxis: {
                min: 0,
                title: {
                    text: '台'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: [{
                name: '自有',
                data: [5, 3, 4]
            }, {
                name: '租赁',
                data: [2, 2, 3]
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
                </Form>
                <div>
                    <Row gutter="16" style={{marginTop: '80px'}}>
                        <Col span="24">
                            <Card title="服务器分布">
                                <div id="serverArea"></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

DepartmentChart = Form.create()(DepartmentChart)

export default DepartmentChart

