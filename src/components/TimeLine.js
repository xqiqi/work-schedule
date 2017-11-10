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

/**
 * get the slider marks
 * @param start
 * @param end
 * @param pStart
 * @param pEnd
 * @returns {object}
 */
const getSliderMarks = (start, end, pStart, pEnd) => {
  const marks = {};
  marks[0] = start;
  marks[getWorkTimeRange(start, end)] = end;
  marks[getWorkTimeRange(start, pStart)] = pStart;
  marks[getWorkTimeRange(start, pEnd)] = pEnd;
  return marks;
};

class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.index = this.props.index;
    this.start = this.props.slider.start;
    this.end = this.props.slider.end;

    this.state = {
      marks: getSliderMarks(this.start, this.end, this.props.detail.start, this.props.detail.end),
      detail: {
        employee: this.props.detail.employee,
        start: this.props.detail.start,
        end: this.props.detail.end,
        rest: this.props.detail.rest
      }
    };

    this.handleRestSelect = this.handleRestSelect.bind(this);
    this.handleEmployeeSelect = this.handleEmployeeSelect.bind(this);
    this.sliderTipFormatter = this.sliderTipFormatter.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderAfterChange = this.handleSliderAfterChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  /**
   * when the props changes, change this.state to rerender the slider
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.detail) !== JSON.stringify(nextProps.detail)) {
      this.setState({
        detail: {
          employee: nextProps.detail.employee,
          start: nextProps.detail.start,
          end: nextProps.detail.end,
          rest: nextProps.detail.rest
        }
      });

      const marks = getSliderMarks(this.start, this.end, nextProps.detail.start, nextProps.detail.end);
      this.setState({ marks });
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
   * when the rest time selector changes, pass the change to the parent
   * @param rest
   */
  handleRestSelect(rest) {
    const detail = this.state.detail;
    detail.rest = parseFloat(rest);
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
   * when the slider change
   * @param value
   */
  handleSliderChange(value) {
    const detail = this.state.detail;
    detail.start = this.sliderTipFormatter(value[0]);
    detail.end = this.sliderTipFormatter(value[1]);
    this.setState({ detail });
  }

  /**
   * after the slider change
   * @param value
   */
  handleSliderAfterChange(value) {
    const pStart = this.sliderTipFormatter(value[0]);
    const pEnd = this.sliderTipFormatter(value[1]);

    const detail = this.state.detail;
    detail.start = pStart;
    detail.end = pEnd;
    this.setState({ detail });

    const marks = getSliderMarks(this.start, this.end, pStart, pEnd);
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
        <Col span={10}>
          <Select
            style={{ width: 80 }}
            value={this.state.detail.employee}
            onChange={this.handleEmployeeSelect}
          >
            {this.props.employees.map(employee => <Option key={employee.id}>{employee.name}</Option>)}
          </Select>
          <Select
            style={{ width: 60, marginLeft: 4 }}
            value={this.state.detail.rest ? this.state.detail.rest.toString() : '0.5'}
            onChange={this.handleRestSelect}
          >
            <Option value="0">0h</Option>
            <Option value="0.5">-0.5h</Option>
            <Option value="1">-1h</Option>
            <Option value="1.5">-1.5h</Option>
            <Option value="2">-2h</Option>
          </Select>
        </Col>
        <Col span={12}>
          <Slider
            range
            step={1}
            min={0}
            max={getWorkTimeRange(this.start, this.end)}
            marks={this.state.marks}
            value={[getWorkTimeRange(this.start, this.state.detail.start), getWorkTimeRange(this.start, this.state.detail.end)]}
            tipFormatter={this.sliderTipFormatter}
            onChange={this.handleSliderChange}
            onAfterChange={this.handleSliderAfterChange}
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
