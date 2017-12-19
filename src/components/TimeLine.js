import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';
import Switch from 'antd/lib/switch';
import Slider from 'antd/lib/slider';
import TimeUtil from '../utils/timeUtil';
import './TimeLine.css';

const Option = Select.Option;

/**
 * get the slider marks
 * @param start
 * @param tag array contains all the mark tags excluding start
 * @returns {object}
 */
function getSliderMarks (start, ...tags) {
  const marks = {};
  marks[0] = start;
  tags.forEach(tag => marks[TimeUtil.getHalfHours(start, tag)] = tag);
  return marks;
}

class TimeLine extends Component {
  constructor(props) {
    super(props);

    this.index = this.props.index;
    this.start = this.props.slider.start;
    this.end = this.props.slider.end;

    this.state = {
      marks: getSliderMarks(this.start, this.end, this.props.detail.start, this.props.detail.end),
      detail: {...this.props.detail}
    };

    this.handleEmployeeSelect = this.handleEmployeeSelect.bind(this);
    this.handleRestSelect = this.handleRestSelect.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
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
        marks: getSliderMarks(this.start, this.end, nextProps.detail.start, nextProps.detail.end),
        detail: {...nextProps.detail}
      });
    }
  }

  /**
   * update the detail change to the parent
   * @param detail
   * @private
   */
  _updateDetail(detail) {
    this.props.update({
      index: this.index,
      detail: detail
    });
  }

  /**
   * when the employee selector changes
   * @param employeeId
   */
  handleEmployeeSelect(employeeId) {
    const detail = this.state.detail;
    detail.employee = employeeId;
    this.setState({ detail });
    this._updateDetail(detail);
  }

  /**
   * when the rest time selector changes
   * @param rest
   */
  handleRestSelect(rest) {
    const detail = this.state.detail;
    detail.rest = parseFloat(rest);
    this.setState({ detail });
    this._updateDetail(detail);
  }

  /**
   * when the switch changes
   * @param value
   */
  handleSwitchChange(value) {
    const detail = this.state.detail;
    detail.isSupport = value;
    this.setState({ detail });
    this._updateDetail(detail);
  }

  /**
   * work time slider tip formatter
   * @param value
   * @returns {string}
   */
  sliderTipFormatter(value) {
    const m = TimeUtil.parseTimeStrToMoment(this.start).add(value * 30 * 60 * 1000);
    return m.format(TimeUtil.timeFormat);
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

    this._updateDetail(detail);
  }

  /**
   * when the delete button click, pass the selected index to the parent
   */
  handleDeleteClick() {
    this.props.delete(this.index);
  }

  render() {
    return (
      <Row>
        <Col span={8}>
          <Select
            style={{ width: 80 }}
            value={this.state.detail.employee}
            onChange={this.handleEmployeeSelect}
          >
            {this.props.employees.map(employee => <Option key={employee.id}>{employee.name}</Option>)}
          </Select>
          <Select
            style={{ width: 80, marginLeft: 4 }}
            value={this.state.detail.rest !== undefined ? this.state.detail.rest.toString() : '0.5'}
            onChange={this.handleRestSelect}
          >
            <Option value="0">0h</Option>
            <Option value="0.5">-0.5h</Option>
            <Option value="1">-1h</Option>
            <Option value="1.5">-1.5h</Option>
            <Option value="2">-2h</Option>
          </Select>
          <Switch
            style={{ marginLeft: 4 }}
            checked={this.state.detail.isSupport}
            checkedChildren="支援"
            unCheckedChildren="本店"
            onChange={this.handleSwitchChange}
          />
        </Col>
        <Col span={14}>
          <Slider
            range
            step={1}
            min={0}
            max={TimeUtil.getHalfHours(this.start, this.end)}
            marks={this.state.marks}
            value={[TimeUtil.getHalfHours(this.start, this.state.detail.start), TimeUtil.getHalfHours(this.start, this.state.detail.end)]}
            tipFormatter={this.sliderTipFormatter}
            onChange={this.handleSliderChange}
            onAfterChange={this.handleSliderAfterChange}
            {...this.state.detail.isSupport && {className: 'switch-support'}}
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
