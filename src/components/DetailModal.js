import React, { Component, PropTypes } from 'react'
import { Modal, Button, Table, Switch, Card } from 'antd'
import Highcharts from 'highcharts'

const columns = [{
    title: '设备编号',
    dataIndex: 'device_no',
    width: '15%'
}, {
    title: '类型',
    dataIndex: 'device_type',
    width: '10%'
}, {
    title: '来源',
    dataIndex: 'source',
    width: '8%'
}, {
    title: '状态',
    dataIndex: 'status',
    width: '10%'
}, {
    title: '产品',
    dataIndex: 'product',
    width: '20%'
}, {
    title: '机房',
    dataIndex: 'idc',
    width: '20%'
}, {
    title: '区域',
    dataIndex: 'region',
    width: '7%'
}, {
    title: '部门',
    dataIndex: 'department',
    width: '10%'
}];

const colors = ['#7cb5ec', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#00BCD4', '#8d4653', '#91e8e1', '#009688']

class DetailModal extends Component {
    constructor(props) {
        super(props)
    }

    // 图表切换
    handleChange = (checked) => {
        if (checked) {
            setTimeout(() => {
                this.randerChart('onoffHistory', this.props.chartData)
            }, 0)
        }

        this.props.switchFn(checked)
    }

    // 绘图方法
    randerChart = (chartId, data) => {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: chartId
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
            series: data.data
        })
    }

    render() {
        const { visible, handleCancel, tableData, chartData, checked, tableLoading } = this.props

        return(
            <Modal ref="modal"
                width="900px"
                visible={visible}
                title="设备列表" 
                onCancel={handleCancel}
                footer={[
                <Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,
              ]}
            >   
                {
                    chartData
                    ?
                    <Card title="上下架详情" extra={
                        <Switch checked={checked} onChange={this.handleChange} />
                    }>
                        <Table className={checked ? 'hide' : ''} loading={tableLoading} columns={columns} dataSource={tableData} pagination={false} scroll={{ y: 310 }} size="small" />
                        <div className={checked ? '' : 'hide'} id="onoffHistory"></div>
                    </Card>
                    :
                    <Table loading={tableLoading} columns={columns} dataSource={tableData} pagination={false} scroll={{ y: 310 }} size="small" />
                }
            </Modal>
        )
    }
}

DetailModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    tableLoading: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    tableData: PropTypes.array.isRequired,
    chartData: PropTypes.object
}

export default DetailModal