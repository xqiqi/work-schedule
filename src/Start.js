import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import React, { Component } from 'react';
import { Button, Col, DatePicker, Layout, Row, Select, Steps, message } from 'antd';
import moment from 'moment';
import WorkTime from './components/WorkTime';
import './Start.css';

const adapter = new LocalStorage('schedule');
const db = low(adapter);

const { Content, Header } = Layout;
const Step = Steps.Step;
const Option = Select.Option;

message.config({ top: 130, duration: 2 });
moment.locale('zh-cn');
const dateFormat = 'YYYY/MM/DD';
const aWeek = [1,2,3,4,5,6,7];

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,                                              // current step when planning
      shop: { id: '', name: '', employees: [], plans: [] }, // current edit shop
      startDate: '',                                        // schedule start date
      workTime: {}                                          // day work time
    };

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleShopSelect = this.handleShopSelect.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
  }

  save() {}
  reset() {}

  /**
   * when the next button click
   */
  next() {
    const step = this.state.step + 1;

    // check if it can trun to the next step
    switch (step - 1) {
      case 0:
        if (this.state.shop.id === '') {
          message.error('请选择店铺！');
          return;
        }
        break;
      case 1:
        if (this.state.startDate === '') {
          message.error('请选择计划开始日期！');
          return;
        }
        break;
      case 2:
        let workTime = {};
        aWeek.forEach(i => {
          workTime[i] = {
            start: this.refs['workTime' + i].state.start,
            end: this.refs['workTime' + i].state.end
          };
        });
        this.setState({ workTime });
        break;
      default:
        break;
    }

    this.setState({ step });
  }

  /**
   * when the previous button click
   */
  prev() {
    const step = this.state.step - 1;
    this.setState({ step });
  }

  /**
   * when the shop selector changes
   * @param shopId
   */
  handleShopSelect(shopId) {
    const shop = db.get('shops').find({id: shopId}).value();
    const preSet = db.get('preSets').find({id: shopId}).value();
    this.setState({
      shop: {
        id: shop.id,
        name: shop.name,
        employees: preSet.employees,
        plans: preSet.plans
      }
    });
  }

  /**
   * when the week start date picker changes
   * @param moment
   */
  handleDatePick(date, dateStr) {
    const startDate = dateStr;
    this.setState({ startDate });
  }

  render() {
    const sContentShop = (
      <div className="stepContent">
        <Select
          showSearch
          style={{ width: 200, marginBottom: 16 }}
          placeholder="请选择店铺"
          optionFilterProp="children"
          onChange={this.handleShopSelect}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          {...this.state.shop.id !== '' && {defaultValue: this.state.shop.id}}
        >
          {db.get('shops').value().map(shop => <Option key={shop.id}>{shop.name}</Option>)}
        </Select>
        <p><b>店铺基本情况</b> [更改]</p>
        <p>可配置人员: {this.state.shop.employees.map(employee => <label key={employee.id}>{employee.name} </label>)}</p>
        <p>预排班次: {this.state.shop.plans.map(plan => <label key={plan.id}>{plan.name}({plan.start}-{plan.end}) </label>)}</p>
      </div>
    );
    const sContentDate = (
      <div className="stepContent">
        <DatePicker
          style={{ width: 200 }}
          format={dateFormat}
          onChange={this.handleDatePick}
          {...this.state.startDate !== '' && {defaultValue: moment(this.state.startDate, dateFormat)}}
        />
      </div>
    );
    const sContentTime = (
      <div className="stepContent">
        <Row gutter={16}>
          {aWeek.map(i => <Col style={{ marginBottom: 16 }} key={i} span={8} md={6} xl={3}><WorkTime ref={'workTime' + i} day={i} /></Col>)}
        </Row>
      </div>
    );;
    const sContentWork = <h1>4</h1>;

    const steps = [{
      title: '选择店铺',
      content: sContentShop
    }, {
      title: '选择开始日期',
      content: sContentDate
    }, {
      title: '确认工作时间',
      content: sContentTime
    }, {
      title: '每日排班',
      content: sContentWork
    }];

    return (
      <Layout className="main">
        <Header style={{ background: '#fff', textAlign: 'right', padding: '0 16px', borderBottom: '1px solid #eee' }}>
          <Button type="primary" onClick={this.save}>保存</Button>
          <Button style={{ marginLeft: 16 }} onClick={this.reset}>重置</Button>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          <Row>
            <Col span={18}>
              <Steps current={this.state.step}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <div>{steps[this.state.step].content}</div>
              <div style={{ marginTop: 24 }}>
                {
                  this.state.step < steps.length - 1
                  &&
                  <Button type="primary" onClick={this.next}>下一步</Button>
                }
                {
                  this.state.step === steps.length - 1
                  &&
                  <Button type="primary">保存并预览</Button>
                }
                {
                  this.state.step > 0
                  &&
                  <Button style={{ marginLeft: 8 }} onClick={this.prev}>上一步</Button>
                }
              </div>
            </Col>

            <Col span={6} style={{ paddingLeft: 50 }}>
              <div style={{ background: '#efefef', borderRadius: 4, padding: 16 }}>
                <h3 align="center" style={{ marginBottom: 8 }}>排班情况概览</h3>
                <p><b>已选店铺: </b>{this.state.shop.name}</p>
                <p><b>开始日期: </b>{this.state.startDate}</p>
                <p><b>人员周工作时间汇总: </b></p>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

export default Start;
