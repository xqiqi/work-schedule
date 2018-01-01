// test file
import WorkTime from './WorkTime';

// dependencies
import React from 'react';
import TimePicker from 'antd/lib/time-picker';
import TimeUtil from '../utils/timeUtil';
import { shallow } from 'enzyme';

describe('<WorkTime />', () => {
  const props = { day: '1', start: '09:00', end: '22:00' };

  it('should render two TimePickers', () => {
    const wrapper = shallow(<WorkTime {...props} />);
    expect(wrapper.find(TimePicker).length).toEqual(2);
  });

  it('should set the right initial state values', () => {
    const wrapper = shallow(<WorkTime {...props} />);
    const { day, ...expectState } = props;
    expect(wrapper.state()).toEqual(expectState);
  });

  it('should set right start and end time to TimePicker', () => {
    const wrapper = shallow(<WorkTime {...props} />);

    expect(wrapper.find(TimePicker).at(0).props().defaultValue).toEqual(TimeUtil.parseTimeStrToMoment(props.start));
    expect(wrapper.find(TimePicker).at(1).props().defaultValue).toEqual(TimeUtil.parseTimeStrToMoment(props.end));
  });

  it('should set new state values after TimePicker changes', () => {
    const wrapper = shallow(<WorkTime {...props} />);

    wrapper.find(TimePicker).at(0).props().onChange(null, '12:00');
    expect(wrapper.state('start')).toEqual('12:00');

    wrapper.find(TimePicker).at(1).props().onChange(null, '12:00');
    expect(wrapper.state('end')).toEqual('12:00');
  });
});