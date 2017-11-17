import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import React, { Component } from 'react';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import Layout from 'antd/lib/layout';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';

const adapter = new LocalStorage('schedule');
const db = low(adapter);

const { Content, Header } = Layout;
const { RangePicker } = DatePicker;
const Option = Select.Option;

class History extends Component {
  constructor(props) {
    super(props);

    this.histories = [
      { id: 1, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/20' },
      { id: 2, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/13' },
      { id: 3, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/06' },
      { id: 4, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/20' },
      { id: 5, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/13' },
      { id: 6, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/06' },
      { id: 7, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/20' },
      { id: 8, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/13' },
      { id: 9, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/06' }
    ];

    this.state = {
      filter: {
        shop: '',
        startDate: ''
      },
      histories: Array.from(this.histories)
    };

    this.handleShopSelect = this.handleShopSelect.bind(this);
    this.handleRangePick = this.handleRangePick.bind(this);
  }

  /**
   * when the shop selector changes
   * @param shopId
   */
  handleShopSelect(shopId) {
    const filter = this.state.filter;
    let histories = this.histories;

    if (shopId) {
      filter.shop = shopId;
      histories = histories.filter(history => history.shop.id === shopId);
    } else {
      filter.shop = '';
    }

    this.setState({ filter });
    this.setState({ histories });
  }
  
  handleRangePick() {}

  render() {
    const columns = [{
      title: '店铺',
      dataIndex: 'shop.name',
      key: 'shop.id'
    }, {
      title: '首日日期',
      dataIndex: 'startDate',
      key: 'startDate'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#">查看</a>
          <span className="ant-divider" />
          <a href="#">修改</a>
          <span className="ant-divider" />
          <a href="#">删除</a>
        </span>
      ),
    }];

    return (
      <Layout className="main">
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #eee' }}>
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            placeholder="筛选店铺"
            optionFilterProp="children"
            onChange={this.handleShopSelect}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {db.get('shops').value().map(shop => <Option key={shop.id}>{shop.name}</Option>)}
          </Select>
          <RangePicker style={{ marginLeft: 16 }} onChange={this.handleRangePick} />
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <Table rowKey="id" columns={columns} dataSource={this.state.histories} />
        </Content>
      </Layout>
    );
  }
}

export default History;
