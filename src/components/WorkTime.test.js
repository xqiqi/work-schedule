// test file
import WorkTime from './WorkTime';

// dependencies
import React from 'react';
import TimePicker from 'antd/lib/time-picker';
import TimeUtil from '../utils/timeUtil';
import { shallow, mount } from 'enzyme';

describe('<WorkTime />', () => {
  const props = { day: '1', start: '09:00', end: '22:00' };

  it('should render two TimePickers', () => {
    const wrapper = shallow(<WorkTime {...props} />);
    expect(wrapper.find(TimePicker).length).toEqual(2);
  });

  it('should set the right initial state values', () => {
    const wrapper = shallow(<WorkTime {...props} />);
    const { day, ...expectState } = props;
    expect(wrapper.instance().state).toEqual(expectState);
  });

  it('should set right start and end time to TimePicker', () => {
    const wrapper = mount(<WorkTime {...props} />);

    const startTimePicker = wrapper.find(TimePicker).at(0).instance();
    expect(startTimePicker.props.defaultValue).toEqual(TimeUtil.parseTimeStrToMoment(props.start));

    const endTimePicker = wrapper.find(TimePicker).at(1).instance();
    expect(endTimePicker.props.defaultValue).toEqual(TimeUtil.parseTimeStrToMoment(props.end));
  });

  it('should set new state values after TimePicker changes', () => {
    const wrapper = mount(<WorkTime {...props} />);

    const startTimePicker = wrapper.find(TimePicker).at(0).instance();
    startTimePicker.props.onChange(null, '12:00');
    expect(wrapper.instance().state.start).toEqual('12:00');

    const endTimePicker = wrapper.find(TimePicker).at(1).instance();
    endTimePicker.props.onChange(null, '12:00');
    expect(wrapper.instance().state.end).toEqual('12:00');
  });
});