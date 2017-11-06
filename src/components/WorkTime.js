import React, { Component } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';

const timeFormat = 'HH:mm';

/**
 * hide all minutes of TimePicker excluding 00 and 30
 * @returns {Array}
 */
const hideMinutes = () => {
  const res = [];
  for (let i = 1; i < 60; i++) {
    if (i !== 30) {
      res.push(i);
    }
  }
  return res;
};
/**
 * get TimePicker properties
 * @param day
 * @param isStart
 */
const getTimePickerProps = (day, isStart) => {
  return {
    format: timeFormat,
    defaultValue: isStart ? moment('08:00', timeFormat) : moment('22:00', timeFormat),
    disabledMinutes: hideMinutes,
    hideDisabledOptions: true
  };
};

class WorkTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: '08:00',
      end: '22:00'
    };

    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
  }

  handleStartChange(time, timeStr) {
    const start = timeStr;
    this.setState({ start });
  }

  handleEndChange(time, timeStr) {
    const end = timeStr;
    this.setState({ end });
  }

  render() {
    return (
      <div>
        <h3 style={{ margin: '8px 0' }}>DAY{this.props.day}</h3>
        <p style={{ marginBottom: 8 }}>
          开始: <TimePicker {...getTimePickerProps(this.props.day, true)} onChange={this.handleStartChange} />
        </p>
        <p>
          结束: <TimePicker {...getTimePickerProps(this.props.day, false)} onChange={this.handleEndChange} />
        </p>
      </div>
    );
  }
}

export default WorkTime;
