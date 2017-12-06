import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Button from 'antd/lib/button';
import { RangePicker } from 'antd/lib/date-picker';
import Icon from 'antd/lib/icon';
import Layout, { Content, Header } from 'antd/lib/layout';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';
import TimeUtil from './utils/timeUtil';

const adapter = new LocalStorage('schedule');
const db = low(adapter);

const Option = Select.Option;
const ButtonGroup = Button.Group;

class History extends Component {
  constructor(props) {
    super(props);

    this.histories = [
      { id: 1, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/20', lastModified: '2017/11/19 22:00:00' },
      { id: 2, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/13', lastModified: '2017/11/12 22:00:00' },
      { id: 3, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/06', lastModified: '2017/11/13 22:00:00' },
      { id: 4, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/20', lastModified: '2017/11/22 22:00:00' },
      { id: 5, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/13', lastModified: '2017/11/11 22:00:00' },
      { id: 6, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/06', lastModified: '2017/11/05 22:00:00' },
      { id: 7, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/20', lastModified: '2017/11/20 22:00:00' },
      { id: 8, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/13', lastModified: '2017/11/11 22:00:00' },
      { id: 9, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/06', lastModified: '2017/11/01 22:00:00' },
      { id: 10, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/20', lastModified: '2017/11/09 22:00:00' },
      { id: 11, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/13', lastModified: '2017/11/10 22:00:00' },
      { id: 12, shop: { id: '1', name: '上海愚园路店' }, startDate: '2017/11/06', lastModified: '2017/11/03 22:00:00' },
      { id: 13, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/20', lastModified: '2017/11/21 22:00:00' },
      { id: 14, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/13', lastModified: '2017/11/15 22:00:00' },
      { id: 15, shop: { id: '2', name: '上海淮海755店' }, startDate: '2017/11/06', lastModified: '2017/11/08 22:00:00' },
      { id: 16, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/20', lastModified: '2017/11/12 22:00:00' },
      { id: 17, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/13', lastModified: '2017/11/12 22:00:00' },
      { id: 18, shop: { id: '3', name: '上海世博源店' }, startDate: '2017/11/06', lastModified: '2017/11/06 22:00:00' }
    ];
    this.histories.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    this.state = {
      filter: {
        shop: '',
        startDateRange: []
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

  /**
   * when the date range picker changes
   * @param range
   */
  handleRangePick(range) {
    const filter = this.state.filter;
    let histories = this.histories;

    if (range.length !== 0) {
      histories = histories.filter(history =>
        (TimeUtil.parseDateStrToMoment(history.startDate) > range[0])
        &&
        (TimeUtil.parseDateStrToMoment(history.startDate) < range[1])
      );
    }

    filter.startDateRange = range;
    this.setState({ filter });
    this.setState({ histories });
  }

  render() {
    const columns = [{
      title: '店铺',
      dataIndex: 'shop.name',
      width: '20%'
    }, {
      title: '班表首日日期',
      dataIndex: 'startDate',
      width: '20%'
    }, {
      title: '最新修改时间',
      dataIndex: 'lastModified',
      width: '30%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={`/history/${record.id}`}>查看</Link>
          <span className="ant-divider" />
          <a href="#">编辑</a>
          <span className="ant-divider" />
          <a href="#">删除</a>
        </span>
      )
    }];
    const List = () => (
      <Layout className="main">
        <Header className="header" style={{ background: '#fff' }}>
          <Select
            allowClear
            showSearch
            style={{ width: 200 }}
            placeholder="筛选店铺"
            optionFilterProp="children"
            onChange={this.handleShopSelect}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            {...this.state.filter.shop !== '' && {defaultValue: this.state.filter.shop }}
          >
            {db.get('shops').value().map(shop => <Option key={shop.id}>{shop.name}</Option>)}
          </Select>
          <RangePicker
            style={{ marginLeft: 16 }}
            onChange={this.handleRangePick}
            {...this.state.filter.startDateRange !== [] && {defaultValue: this.state.filter.startDateRange}}
          />
        </Header>
        <Content className="content">
          <Table rowKey="id" columns={columns} dataSource={this.state.histories} />
        </Content>
      </Layout>
    );

    const Detail = ({ match }) => (
      <Layout className="main">
        <Header className="header" style={{ background: '#fff' }}>
          <ButtonGroup>
            <Button>
              <Icon type="left" />
            </Button>
            <Button>
              <Icon type="edit" />编辑
            </Button>
            <Button>
              <Icon type="delete" />删除
            </Button>
          </ButtonGroup>
        </Header>
        <Content className="content">
          {match.params.id}
        </Content>
      </Layout>
    );

    return (
      <Switch>
        <Route exact path="/history" component={List} />
        <Route path="/history/:id" component={Detail} />
      </Switch>
    );
  }
}

export default History;
