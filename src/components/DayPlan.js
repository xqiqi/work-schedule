import React, { Component } from 'react';
import { Button, Col, Row } from 'antd';
import TimeLine from './TimeLine';

class DayPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: []
    };

    this.slider = {
      start: this.props.workTime['day' + this.props.day].start,
      end: this.props.workTime['day' + this.props.day].end
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.deleteTimeLine = this.deleteTimeLine.bind(this);
  }

  /**
   * when the add button click, add a default time line
   */
  handleAddClick() {
    const detail = {
      employee: '1',
      workTime: {
        start: '08:00',
        end: '13:30'
      }
    };

    const details = this.state.details.slice();
    details.push(detail);

    this.setState({ details });

    /*this.props.updateWorkTimeSum([
      { employee: 'aa', time: 10}
    ]);*/
  }


  /**
   * get the selected index from the child and remove the item in this.state.details
   * @param index
   */
  deleteTimeLine(index) {
    const details = this.state.details.slice();
    details.splice(index, 1);
    this.setState({ details });
  }

  render() {
    return (
      <div style={{ borderBottom: '1px solid #eee' }}>
        <h3 style={{ margin: '8px 0' }}>DAY{this.props.day}</h3>
        <Row gutter={16}>
          <Col span={24} lg={4} style={{ marginBottom: 4 }}>
            {
              this.props.shop.plans.map(plan =>
                <Button style={{ margin: '0 4px 4px 0' }} size="small" key={plan.id}>{plan.name}</Button>
              )
            }
            <Button style={{ margin: '0 4px 4px 0' }} type="primary" size="small" shape="circle" icon="plus" onClick={this.handleAddClick} />
          </Col>
          <Col span={24} lg={20} style={{ marginBottom: 4 }}>
            {
              this.state.details.map((detail, i) =>
                <TimeLine key={i} index={i} slider={this.slider} employees={this.props.shop.employees} delete={this.deleteTimeLine} />
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default DayPlan;
