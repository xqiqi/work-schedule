// test file
import TimeUtil from './timeUtil';

// dependencies
import moment from 'moment';
moment.locale('zh-cn');

// tests
describe('parseDateStrToMoment', () => {
  test('should parse a legal date string to a right moment value', () => {
    expect(TimeUtil.parseDateStrToMoment('2017/10/10')).toEqual(moment('2017/10/10', 'YYYY/MM/DD'));
  });

  test('should not parse a illegal date string to a right moment value', () => {
    expect(TimeUtil.parseDateStrToMoment('2017-10-10')).not.toEqual(moment('2017/10/10', 'YYYY/MM/DD'));
  });

  test('should parse an empty string to null', () => {
    expect(TimeUtil.parseDateStrToMoment('')).toBeNull();
  });
});
