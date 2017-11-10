import React, { Component } from 'react';
import TimePicker from 'antd/lib/time-picker';
import TimeUtil from '../utils/timeUtil';

/**
 * hide all minutes of TimePicker excluding 00 and 30
 * @returns {Array}
 */
function hideMinutes () {
  const res = [];
  for (let i = 1; i < 60; i++) {
    if (i !== 30) res.push(i);
  }
  return res;
}
/**
 * get TimePicker properties
 * @param time
 * @param isStart
 * @returns {Object}
 */
function getTimePickerProps (time) {
  return {
    format: TimeUtil.timeFormat,
    defaultValue: TimeUtil.parseTimeStrToMoment(time),
    disabledMinutes: hideMinutes,
    hideDisabledOptions: true
  };
}

class WorkTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.start,
      end: this.props.end
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
          开始: <TimePicker {...getTimePickerProps(this.props.start)} onChange={this.handleStartChange} />
        </p>
        <p>
          结束: <TimePicker {...getTimePickerProps(this.props.end)} onChange={this.handleEndChange} />
        </p>
      </div>
    );
  }
}

export default WorkTime;
