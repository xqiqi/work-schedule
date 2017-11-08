import React, { Component } from 'react';
import { Button, Col, Row, Select, Slider } from 'antd';
import moment from 'moment';

const Option = Select.Option;

const timeFormat = 'HH:mm';

/**
 * get the range max number according to the day work time start - end
 * @param start
 * @param end
 * @returns {number}
 */
const getWorkTimeRangeMax = (start, end) => {
  return (moment(end, timeFormat) - moment(start, timeFormat))/1000/60/30;
};

class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.start = this.props.slider.start;
    this.end = this.props.slider.end;
    this.sliderMax = getWorkTimeRangeMax(this.start, this.end);
    let marks = {};
    marks[0] = this.start;
    marks[this.sliderMax] = this.end;

    this.state = {
      marks: marks
    };

    console.log(this.props.index);

    this.sliderTipFormatter = this.sliderTipFormatter.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  /**
   * work time slider tip formatter
   * @param v
   * @returns {string}
   */
  sliderTipFormatter(value) {
    const mins = moment(this.start, timeFormat).add(value*30*60*1000);
    return moment(mins, timeFormat).format(timeFormat);
  }

  /**
   * after the slider change
   * @param value
   */
  handleSliderChange(value) {
    let marks = {};
    marks[0] = this.start;
    marks[this.sliderMax] = this.end;
    marks[value[0]] = this.sliderTipFormatter(value[0]);
    marks[value[1]] = this.sliderTipFormatter(value[1]);
    this.setState({ marks });
  }

  /**
   * when the delete button click, delete the selected time line
   */
  handleDeleteClick(index) {
    this.props.delete(index);
  }

  render() {
    return (
      <Row type="flex" align="middle">
        <Col span={6}>
          <Select defaultValue={this.props.employees[0].id} style={{ width: 120 }}>
            {this.props.employees.map(employee => <Option key={employee.id}>{employee.name}</Option>)}
          </Select>
        </Col>
        <Col span={16}>
          <Slider
            range
            step={1}
            min={0}
            max={this.sliderMax}
            marks={this.state.marks}
            defaultValue={[0, this.sliderMax]}
            tipFormatter={this.sliderTipFormatter}
            onAfterChange={this.handleSliderChange}
          />
        </Col>
        <Col span={2} style={{ textAlign: 'right' }}>
          <Button ghost type="danger" size="small" shape="circle" icon="close" onClick={() => this.handleDeleteClick(this.props.index)} />
        </Col>
      </Row>
    );
  }
}

export default TimeLine;
