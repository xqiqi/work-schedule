import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Icon from 'antd/lib/icon';
import Layout, { Sider } from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Chart from './Chart';
import History from './History';
import Start from './Start';
import './App.css';

const adapter = new LocalStorage('schedule');
const db = low(adapter);

class App extends Component {
  constructor(props) {
    super(props);

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
      ],
      current: {
        step: 0,                                              // current step when planning
        shop: { id: '', name: '', employees: [], plans: [] }, // current edit shop
        startDate: '',                                        // schedule start date
        workTime: {                                           // day work time
          day1: {start: '08:00', end: '22:00'},
          day2: {start: '08:00', end: '22:00'},
          day3: {start: '08:00', end: '22:00'},
          day4: {start: '08:00', end: '22:00'},
          day5: {start: '08:00', end: '22:00'},
          day6: {start: '08:00', end: '22:00'},
          day7: {start: '08:00', end: '22:00'}
        },
        details: {                                            // day schedule detail
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: [],
          day6: [],
          day7: []
        },
        sums: []                                              // total working time
      }
    }).write();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Layout>
            <Sider className="sider">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[window.location.pathname.split('/')[1] !== '' ? window.location.pathname.split('/')[1] : 'start']}
              >
                <Menu.Item key="start">
                  <Link to="/">
                    <Icon type="edit" />
                    <span className="nav-text">开始计划</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="chart">
                  <Link to="/chart">
                    <Icon type="bar-chart" />
                    <span className="nav-text">统计图表</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="history">
                  <Link to="/history">
                    <Icon type="schedule" />
                    <span className="nav-text">历史记录</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>

            <Route exact path="/" component={Start} />
            <Route path="/chart" component={Chart} />
            <Route path="/history" component={History} />

          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
