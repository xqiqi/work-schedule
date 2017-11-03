import React, { Component } from 'react';
import { Button, Col, Layout, Row, Select, Steps } from 'antd';

const { Content, Header } = Layout;
const Step = Steps.Step;

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,                    // current step when planning
      shop: { id: '', name: '' }, // current edit shop
      startDate: ''               // schedule start date
    };

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleShopSelect = this.handleShopSelect.bind(this);
  }

  save() {}
  reset() {}

  next() {}
  prev() {}

  handleShopSelect() {}

  render() {
    const sContentShop = (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="请选择店铺"
          optionFilterProp="children"
          onChange={this.handleShopSelect}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
        </Select>
        <p><b>店铺基本情况</b> [更改]</p>
      </div>
    );
    const sContentDate = <h1>2</h1>;
    const sContentTime = <h1>3</h1>;
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
          <Button type="default" onClick={this.reset} style={{ marginLeft: 16 }}>重置</Button>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          <Row>
            <Col span={18}>
              <Steps current={this.state.step}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <div>{steps[this.state.step].content}</div>
              <div>
                {
                  this.state.step < steps.length - 1
                  &&
                  <Button type="primary" onClick={this.next}>下一步</Button>
                }
                {
                  this.state.step === steps.length - 1
                  &&
                  <Button type="primary">生成班表</Button>
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
                <p><b>已选店铺：</b>{this.state.shop.name}</p>
                <p><b>开始日期：</b>{this.state.startDate}</p>
                <p><b>人员周工作时间汇总：</b></p>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

export default Start;
