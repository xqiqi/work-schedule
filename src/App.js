import React, { Component } from 'react';
import { Icon, Layout, Menu } from 'antd';
import Start from './Start';
import './App.css';

const { Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuKey: 'start' // key navigation of the sider menu
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

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

          { this.state.menuKey === 'start' && <Start /> }

          { this.state.menuKey === 'chart' && <Layout className="main"><p>统计图表</p></Layout> }
          { this.state.menuKey === 'history' && <Layout className="main"><p>历史记录</p></Layout> }
        </Layout>
      </div>
    );
  }
}

export default App;
