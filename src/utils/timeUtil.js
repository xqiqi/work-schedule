import moment from 'moment';

moment.locale('zh-cn');

const timeUtil = {
  dateFormat: 'YYYY/MM/DD',
  timeFormat: 'HH:mm',
  /**
   * parse date string to moment
   * @param str
   * @returns {*|moment.Moment}
   */
  parseDateStrToMoment(str) {
    if (str === '') return null;
    return moment(str, this.dateFormat);
  },
  /**
   * parse time string to moment
   * @param str
   * @returns {*|moment.Moment}
   */
  parseTimeStrToMoment(str) {
    return moment(str, this.timeFormat);
  },
  /**
   * get hour range from start to end
   * @param start
   * @param end
   * @returns {number}
   */
  getHours(start, end) {
    return (this.parseTimeStrToMoment(end)- this.parseTimeStrToMoment(start)) / 1000 / 60 / 60;
  },
  /**
   * get half hour range from start to end
   * @param start
   * @param end
   * @returns {number}
   */
  getHalfHours(start, end) {
    return this.getHours(start, end) * 2;
  },
  /**
   * is time a > b ?
   * @param a
   * @param b
   * @returns {boolean}
   */
  isTimeLater(a, b) {
    return this.parseTimeStrToMoment(a) > this.parseTimeStrToMoment(b);
  }
};

export default timeUtil;
