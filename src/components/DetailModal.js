import React, { Component } from 'react'
import { Modal, Button, Table } from 'antd'

const columns = [{
    title: '服务器编号',
    dataIndex: 'id'
}, {
    title: 'SN',
    dataIndex: 'sn',
}, {
    title: '类型',
    dataIndex: 'type',
}, {
    title: '来源',
    dataIndex: 'origin',
}, {
    title: '状态',
    dataIndex: 'status',
}, {
    title: '产品',
    dataIndex: 'product',
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    id: `SGPS0000000247${i}`,
    sn: '2W1HW2X',
    type: '物理机',
    origin: '苏州蜗牛',
    status: '运营中',
    product: '帝国文明'
  });
}

const pagination = {
    total: data.length,
    showSizeChanger: false,
    onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
    },
    onChange(current) {
        console.log('Current: ', current);
    },
};

class DetailModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { visible, handleCancel } = this.props

        return(
            <Modal ref="modal"
                width="800px"
                visible={visible}
                title="服务器列表" 
                onCancel={handleCancel}
                footer={[
                <Button key="back" type="ghost" size="large" onClick={handleCancel}>关闭</Button>,
              ]}
            >
                <Table columns={columns} dataSource={data} pagination={pagination} size="small" />
            </Modal>
        )
    }
}

export default DetailModal