import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highcharts from 'highcharts'
import { Form, Select, Button, Card, Col, Row } from 'antd'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

const areaData1 = ['内网', '外网']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

class IdcChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areaView1: '',
            areaView12: '',
            areaLists: [],
            showLevel: false
        }
    }

    componentDidMount () {
        this.getChart()
    }

    componentWillReceiveProps () {
        if (this.props.children) {
            this.getChart()
        }
    }

    // 获取图表数据
    getChart = () => {
        fetch("/overview/", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({region: this.state.areaView1, area: this.state.areaView12})
        })
        .then((res) => { return res.json() })
        .then((data) => {
            this.randerChart('serverArea', data.server)
            this.randerChart('serverType', data.onoff)
            this.randerChart('netDevice', data.netdevice)
            this.randerChart('inventory', data.status)
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

    // 二级图表
    details = type => {
        let area1 = this.state.areaView1,
            area2 = this.state.areaView12,
            url;
        
        type === '1' ? url = '/IdcChart/ServerChart' : url = '/IdcChart/ServerType'

        this.props.history.pushState({area1: area1, area2: area2}, url)
    }

    // 绘图方法
    randerChart = (chartId, data) => {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chartId,
                type: 'column'
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
                    text: '台',
                    rotation: 0
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
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    dataLabels: {
                        rotation: 0,
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
                {
                    !this.props.children
                    ?
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
                            <FormItem>
                                <Button type="primary" onClick={this.getChart}>查询</Button>
                            </FormItem>
                        </Form>
                        <div>
                            <Row gutter={16} style={{marginTop: '16px'}}>
                                <Col span="12">
                                    <Card title="服务器分布" extra={<Button type="dashed" onClick={this.details.bind(this, '1')}>详细</Button>}>
                                        <div id="serverArea" className="chart-item"></div>
                                    </Card>
                                </Col>
                                <Col span="12">
                                    <Card title="服务器上下架" extra={<Button type="dashed" onClick={this.details.bind(this, '2')}>详细</Button>}>
                                        <div id="serverType" className="chart-item"></div>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{marginTop: '16px'}}>
                                <Col span="12">
                                    <Card title="网络设备">
                                        <div id="netDevice" className="chart-item"></div>
                                    </Card>
                                </Col>
                                <Col span="12">
                                    <Card title="库存">
                                        <div id="inventory" className="chart-item"></div>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    :
                    <div>
                        {this.props.children}
                    </div>
                }
            </div>
        )
    }
}

IdcChart = Form.create()(IdcChart)

export default connect(null, {})(IdcChart)

