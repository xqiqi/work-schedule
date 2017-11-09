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
 * @param time
 * @param isStart
 */
const getTimePickerProps = (time, isStart) => {
  let defaultValue = isStart ? moment('08:00', timeFormat) : moment('22:00', timeFormat);
  if (time !== '') {
    defaultValue = moment(time, timeFormat);
  }
  return {
    format: timeFormat,
    defaultValue: defaultValue,
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
          开始: <TimePicker {...getTimePickerProps(this.props.start, true)} onChange={this.handleStartChange} />
        </p>
        <p>
          结束: <TimePicker {...getTimePickerProps(this.props.end, false)} onChange={this.handleEndChange} />
        </p>
      </div>
    );
  }
}

export default WorkTime;
