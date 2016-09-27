import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highcharts from 'highcharts'
import { Form, Select, Button, Card, Col, Row, message } from 'antd'
import { getIDC, getProduct, getTable } from '../actions/count'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item

const areaData1 = ['内网', '外网']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

class ServerChart extends Component {
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
        
        this.setState({
            areaView1: state.area1,
            areaView12: state.area2
        })

        if (state.area1) {
            this.areaGet(state.area1, {areaLists: areaData1}, {areaLists: areaData2})
        }

        this.props.getIDC()
    }

    // 获取图表数据
    getChart = () => {
        const {areaView1, areaView12, view} = this.state

        const {rooms, products} = this.props.form.getFieldsValue()

        fetch("/chart/idc_detail/", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({ 
                region: areaView1, 
                area: areaView12,
                view: view,
                idcs: rooms,
                products: products
            })
        })
        .then((res) => { return res.json() })
        .then((data) => {
            this.randerChart('serverArea2', data.chart)
        })
    }

    // 查询
    searchFn = () => {
        this.props.form.validateFields((errors, values) => {

            if (!!errors) {
                return
            }

            this.getChart()
        })
    }

    // 维度变更
    viewChange = value => {
        const {productLists, getProduct} = this.props

        this.setState({
            view: value
        })

        if (value === '产品') {
            getProduct()
        } else {
            this.setState({
                products: []
            })
        }
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

    // 显示弹框
    showView = (event) => {
        const {areaView1, areaView12, view}  = this.state
        const {rooms, products} = this.props.form.getFieldsValue()

        this.props.getTable({
            x: event.category,
            y: event.series.name,
            region: areaView1,
            area: areaView12,
            view: view,
            product: products
        }, 'idc')
    }

    // 绘图方法
    randerChart = (chartId, data) => {
        var _this = this

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
                                _this.showView(event.point)
                            }
                        }
                    },
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

        const { view, areaView1, areaView12, areaLists } = this.state
        const { roomLists, productLists } = this.props

        const roomProps = getFieldProps('rooms', {
            rules: [
                { required: true, type: 'array', message: '请选择机房' }
            ]
        })

        return(
            <div>
                <Form className="search-form" form={this.props.form} inline>
                    <FormItem
                        label="区域一"
                    >
                        <Select 
                            {...getFieldProps('area1')}
                            value={areaView1}
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
                            value={areaView12}
                            onChange={this.areaChange12}
                            allowClear
                            style={{ width: 150 }} 
                        >
                            { 
                                areaLists.map((e, i) => 
                                    <Option value={e} key={i}>{e}</Option>
                                )
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="机房"
                        hasFeedback
                    >
                        <Select 
                            {...roomProps}
                            allowClear
                            style={{ width: 200 }} 
                            multiple
                        >
                            { 
                                roomLists.map((e, i) => 
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
                            value={view}
                            onChange={this.viewChange}
                            style={{ width: 150 }}
                        >
                            <Option value="类型">类型</Option>
                            <Option value="产品">产品</Option>
                            <Option value="部门">部门</Option>
                            <Option value="来源">来源</Option>
                        </Select>
                    </FormItem>
                    {
                        this.state.view === '产品'
                        ?
                        <FormItem
                            label="产品"
                            hasFeedback
                        >
                            <Select 
                                {...getFieldProps('products', {rules: [{ required: true, type: 'array', message: '请选择产品' }]})}
                                style={{ width: 200 }} 
                                allowClear
                                multiple
                            >
                                { 
                                    productLists.map((e, i) => 
                                        <Option value={e} key={i}>{e}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>
                        :
                        <span></span>
                    }
                    <FormItem>
                        <Button type="primary" onClick={this.searchFn}>查询</Button>
                        &nbsp;&nbsp;
                        <Button onClick={this.goBack}>返回</Button>
                    </FormItem>
                </Form>
                <div>
                    <Row gutter="16" style={{marginTop: '80px'}}>
                        <Col span="24">
                            <Card title="服务器分布">
                                <div id="serverArea2" style={{minHeight: '400px'}}></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

ServerChart = Form.create()(ServerChart)

const getData = state => {
    return {
        roomLists: state.update.roomLists,
        productLists: state.update.productLists
    }
}

export default connect(getData, { getIDC, getProduct, getTable })(ServerChart)

