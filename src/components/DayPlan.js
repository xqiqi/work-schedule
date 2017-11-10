import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import TimeLine from './TimeLine';
import TimeUtil from '../utils/timeUtil';

class DayPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: this.props.details
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
      end: this.slider.end,
      rest: 0.5
    };

    if (planId) {
      const plan = this.props.shop.plans.find(plan => plan.id === planId);
      const pStart = plan.start;
      const pEnd = plan.end;

      if (TimeUtil.isTimeLater(pStart, detail.start)) detail.start = pStart;
      if (!TimeUtil.isTimeLater(pEnd, detail.end)) detail.end = pEnd;
    }

    const details = this.state.details.slice();
    details.push(detail);
    this.setState({ details });
    this._updateDayDetails(details);
  }

  /**
   * get the selected index from the child and remove the item in this.state.details
   * @param index
   */
  deleteTimeLine(index) {
    const details = this.state.details.slice();
    details.splice(index, 1);
    this.setState({ details });
    this._updateDayDetails(details);
  }

  /**
   * get the changed time line from child and pass the changes to the parent
   * @param value
   */
  updateTimeLine(value) {
    const details = this.state.details.slice();
    details[value.index] = value.detail;
    this.setState({ details });
    this._updateDayDetails(details);
  }

  /**
   * pass the day details to the parent
   * @param details
   * @private
   */
  _updateDayDetails(details) {
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
                <Button
                  style={{ margin: '0 4px 4px 0' }}
                  size="small"
                  key={plan.id}
                  onClick={() => this.handleAddClick(plan.id)}
                >
                  {plan.name}
                </Button>
              )
            }
            <Button
              style={{ margin: '0 4px 4px 0' }}
              type="primary"
              size="small"
              shape="circle"
              icon="plus"
              onClick={() => this.handleAddClick()}
            />
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
