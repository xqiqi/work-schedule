import React, { Component } from 'react';
import { Button, Col, Row } from 'antd';
import moment from 'moment';
import TimeLine from './TimeLine';

const timeFormat = 'HH:mm';

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
    this.updateTimeLine = this.updateTimeLine.bind(this);
  }

  /**
   * when the add/pre-plan button click, add a default time line
   * @param planId undefined when add button click
   */
  handleAddClick(planId) {
    const detail = {
      employee: this.props.shop.employees[0].id,
      start: this.slider.start,
      end: this.slider.end
    };

    if (planId) {
      const plan = this.props.shop.plans.find(plan => plan.id === planId);
      const pStart = plan.start;
      const pEnd = plan.end;

      if (moment(pStart, timeFormat) > moment(detail.start, timeFormat)) detail.start = pStart;
      if (moment(pEnd, timeFormat) < moment(detail.end, timeFormat)) detail.end = pEnd;
    }

    const details = this.state.details.slice();
    details.push(detail);
    this.setState({ details });

    // pass the details to the parent
    this.props.updateDayDetails({
      day: this.props.day,
      details: details
    });
  }

  /**
   * get the selected index from the child and remove the item in this.state.details
   * @param index
   */
  deleteTimeLine(index) {
    const details = this.state.details.slice();
    details.splice(index, 1);
    this.setState({ details });

    this.props.updateDayDetails({
      day: this.props.day,
      details: details
    });
  }

  /**
   * get the changed time line from child and pass the changes to the parent
   * @param value
   */
  updateTimeLine(value) {
    const details = this.state.details.slice();
    details[value.index] = value.detail;
    this.setState({ details });

    this.props.updateDayDetails({
      day: this.props.day,
      details: details
    });
  }

  render() {
    return (
      <div style={{ borderBottom: '1px solid #eee' }}>
        <h3 style={{ margin: '8px 0' }}>DAY{this.props.day}</h3>
        <Row gutter={16}>
          <Col span={24} lg={4} style={{ marginBottom: 4 }}>
            {
              this.props.shop.plans.map(plan =>
                <Button style={{ margin: '0 4px 4px 0' }} size="small" key={plan.id} onClick={() => this.handleAddClick(plan.id)}>{plan.name}</Button>
              )
            }
            <Button style={{ margin: '0 4px 4px 0' }} type="primary" size="small" shape="circle" icon="plus" onClick={() => this.handleAddClick()} />
          </Col>
          <Col span={24} lg={20} style={{ marginBottom: 4 }}>
            {
              this.state.details.map((detail, i) =>
                <TimeLine
                  key={i}
                  index={i}
                  detail={detail}
                  slider={this.slider}
                  employees={this.props.shop.employees}
                  delete={this.deleteTimeLine}
                  update={this.updateTimeLine}
                />
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default DayPlan;