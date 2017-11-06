import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import React, { Component } from 'react';
import { Icon, Layout, Menu } from 'antd';
import Start from './Start';
import './App.css';

const adapter = new LocalStorage('schedule');
const db = low(adapter);

const { Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuKey: 'start' // key navigation of the sider menu
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);

    // init the database
    db.defaults({
      shops: [
        { id: '1', name: '上海愚园路店' },
        { id: '2', name: '上海淮海755店' },
        { id: '3', name: '上海世博源店' }
      ],
      preSets: [
        { id: '1', employees: [], plans: [] },
        { id: '2', employees: [], plans: [] },
        {
          id: '3',
          employees: [
            { id: '1', name: 'aa', title: 2 },
            { id: '2', name: 'bb', title: 1 },
            { id: '3', name: 'cc', title: 1 },
            { id: '4', name: 'dd', title: 0 }
          ],
          plans: [
            { id: '1', name: '早咖啡师', start: '8:00', end: '16:30' },
            { id: '2', name: '晚咖啡师', start: '13:30', end: '22:00' }
          ]
        }
      ]
    }).write();
  }

  /**
   * when the sider bar menu click
   * @param e
   */
  handleMenuClick(e) {
    this.setState({
      menuKey: e.key
    });
  }

  render() {
    return (
      <div className="App">
        <Layout>
          <Sider className="sider">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[this.state.menuKey]}
              onClick={this.handleMenuClick}
            >
              <Menu.Item key="start">
                <Icon type="edit" />
                <span className="nav-text">开始计划</span>
              </Menu.Item>
              <Menu.Item key="chart">
                <Icon type="bar-chart" />
                <span className="nav-text">统计图表</span>
              </Menu.Item>
              <Menu.Item key="history">
                <Icon type="schedule" />
                <span className="nav-text">历史记录</span>
              </Menu.Item>
            </Menu>
          </Sider>

          {this.state.menuKey === 'start' && <Start />}

          {this.state.menuKey === 'chart' && <Layout className="main"><p>统计图表</p></Layout>}
          {this.state.menuKey === 'history' && <Layout className="main"><p>历史记录</p></Layout>}
        </Layout>
      </div>
    );
  }
}

export default App;
