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
const getWorkTimeRange = (start, end) => {
  return (moment(end, timeFormat) - moment(start, timeFormat))/1000/60/30;
};

class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.index = this.props.index;
    this.start = this.props.slider.start;
    this.end = this.props.slider.end;
    this.sliderMax = getWorkTimeRange(this.start, this.end);

    const marks = {};
    marks[0] = this.start;
    marks[this.sliderMax] = this.end;
    marks[getWorkTimeRange(this.start, this.props.detail.start)] = this.props.detail.start;
    marks[getWorkTimeRange(this.start, this.props.detail.end)] = this.props.detail.end;

    this.state = {
      marks: marks,
      detail: {
        employee: this.props.detail.employee,
        start: this.props.detail.start,
        end: this.props.detail.end
      }
    };

    this.handleEmployeeSelect = this.handleEmployeeSelect.bind(this);
    this.sliderTipFormatter = this.sliderTipFormatter.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.detail) !== JSON.stringify(nextProps.detail)) {
      const marks = {};
      marks[0] = this.start;
      marks[this.sliderMax] = this.end;
      marks[getWorkTimeRange(this.start, nextProps.detail.start)] = nextProps.detail.start;
      marks[getWorkTimeRange(this.start, nextProps.detail.end)] = nextProps.detail.end;

      this.setState({
        marks: marks,
        detail: {
          employee: nextProps.detail.employee,
          start: nextProps.detail.start,
          end: nextProps.detail.end
        }
      });

      console.log(this.refs.slider);
    }
  }

  /**
   * when the employee selector changes, pass the change to the parent
   * @param employeeId
   */
  handleEmployeeSelect(employeeId) {
    const detail = this.state.detail;
    detail.employee = employeeId;
    this.setState({ detail });

    this.props.update({
      index: this.index,
      detail: detail
    });
  }

  /**
   * work time slider tip formatter
   * @param value
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
    const pStart = this.sliderTipFormatter(value[0]);
    const pEnd = this.sliderTipFormatter(value[1]);

    const detail = this.state.detail;
    detail.start = pStart;
    detail.end = pEnd;
    this.setState({ detail });

    const marks = {};
    marks[0] = this.start;
    marks[this.sliderMax] = this.end;
    marks[value[0]] = pStart;
    marks[value[1]] = pEnd;
    this.setState({ marks });

    this.props.update({
      index: this.index,
      detail: detail
    });
  }

  /**
   * when the delete button click, pass the selected index to the parent
   */
  handleDeleteClick() {
    this.props.delete(this.index);
  }

  render() {
    return (
      <Row type="flex" align="middle">
        <Col span={6}>
          <Select value={this.state.detail.employee} style={{ width: 120 }} onChange={this.handleEmployeeSelect}>
            {this.props.employees.map(employee => <Option key={employee.id}>{employee.name}</Option>)}
          </Select>
        </Col>
        <Col span={16}>
          <Slider
            ref="slider"
            range
            step={1}
            min={0}
            max={this.sliderMax}
            marks={this.state.marks}
            initialValue={[getWorkTimeRange(this.start, this.state.detail.start), getWorkTimeRange(this.start, this.state.detail.end)]}
            tipFormatter={this.sliderTipFormatter}
            onAfterChange={this.handleSliderChange}
          />
        </Col>
        <Col span={2} style={{ textAlign: 'right' }}>
          <Button ghost type="danger" size="small" shape="circle" icon="close" onClick={this.handleDeleteClick} />
        </Col>
      </Row>
    );
  }
}

export default TimeLine;
