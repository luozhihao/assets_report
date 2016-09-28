import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highcharts from 'highcharts'
import { Form, Select, Button, Card, Col, Row } from 'antd'
import { getProduct, getTable } from '../actions/count'
import 'fetch-polyfill'
import 'whatwg-fetch'
require('es6-promise').polyfill()

const FormItem = Form.Item
const Option = Select.Option

const areaData1 = ['内网', '外网']
const areaData2 = ['北美', '俄罗斯', '华人', '东南亚', '日本', '台湾', '韩国', '欧州']

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

class ProductChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areaView1: '',
            areaView12: '',
            areaLists: []
        }
    }

    componentDidMount () {
        this.props.getProduct()
    }

    // 获取图表数据
    getChart = () => {
        const {areaView1, areaView12} = this.state

        const {products} = this.props.form.getFieldsValue()

        fetch("/chart/product_view/", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({ 
                region: areaView1, 
                area: areaView12,
                products: products
            })
        })
        .then((res) => { return res.json() })
        .then((data) => {
            this.randerChart('serverArea', data.device_chart, '类型')
            this.randerChart('serverType', data.source_chart, '来源')
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
    showView = (event, type) => {
        const {areaView1, areaView12}  = this.state

        this.props.getTable({
            x: event.category,
            y: event.series.name,
            region: areaView1,
            area: areaView12,
            view: type
        }, 'product')
    }

    // 绘图方法
    randerChart = (chartId, data, type) => {
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
                    text: '台',
                    rotation: 0
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
                                _this.showView(event.point, type)
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

        const { productLists } = this.props

        const productProps = getFieldProps('products', {
            rules: [
                { required: true, type: 'array', message: '请选择产品' }
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
                        label="产品"
                        hasFeedback
                    >
                        <Select 
                            {...productProps}
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
                    <FormItem>
                        <Button type="primary" onClick={this.searchFn}>查询</Button>
                    </FormItem>
                </Form>
                <div>
                    <Row gutter={16} style={{marginTop: '16px'}}>
                        <Col span="24">
                            <Card title="服务器分布">
                                <div id="serverArea" className="chart-item"></div>
                            </Card>
                        </Col>
                        <Col span="24" style={{marginTop: '16px'}}>
                            <Card title="来源分布">
                                <div id="serverType" className="chart-item"></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

ProductChart = Form.create()(ProductChart)

const getData = state => {
    return {
        productLists: state.update.productLists
    }
}

export default connect(getData, { getProduct, getTable })(ProductChart)

