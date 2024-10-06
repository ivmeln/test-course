const unitTestingTask = require('../unitTestingTask');


const mockedLanguage = {
  months: jest.fn(() => 'MockedMonth'),
  monthsShort: jest.fn(() => 'MockedShortMonth'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  meridiem: jest.fn((hours, isLower) => (isLower ? (hours > 11 ? 'pm' : 'am') : (hours > 11 ? 'PM' : 'AM')))
};

function mockCreateDateWithOffset(offsetMinutes) {
  const date = new Date();
  date.getTimezoneOffset = () => offsetMinutes;
  return date;
}

beforeEach(() => {
  unitTestingTask.lang('en', mockedLanguage);
});

describe('leadingZeroes', () => {
  it('pads single digit number to two digits', () => {
    expect(unitTestingTask.leadingZeroes(7)).toBe('07');
  });

  it('does not pad double digit number', () => {
    expect(unitTestingTask.leadingZeroes(23)).toBe('23');
  });

  it('returns string as is if its length exceeds specified length', () => {
    expect(unitTestingTask.leadingZeroes('example', 5)).toBe('example');
  });

  it('pads number to specified length', () => {
    expect(unitTestingTask.leadingZeroes(9, 3)).toBe('009');
  });

  it('does not pad number if length is less than number length', () => {
    expect(unitTestingTask.leadingZeroes(456, 2)).toBe('456');
  });
});

describe('formats date and time', () => {
  let date, dateAM, datePM;

  beforeAll(() => {
    date = new Date(Date.UTC(2025, 10, 5, 18, 45, 30));
    dateAM = new Date(Date.UTC(2025, 10, 5, 6, 45, 30));
    datePM = new Date(Date.UTC(2025, 10, 5, 18, 45, 30));
  });

  it('formats time-zone in basic format', () => {
    const timeZoneZZ = unitTestingTask('ZZ', date);
    expect(timeZoneZZ).toBe('+0000');
  });

  it('formats time-zone in extended format', () => {
    const timeZoneZ = unitTestingTask('Z', date);
    expect(timeZoneZ).toBe('+00:00');
  });

  it('formats time-zone with offset', () => {
    const date = mockCreateDateWithOffset(-480);
    const formattedDate = unitTestingTask('ZZ', date);
    expect(formattedDate).toBe('+0800');
  });

  it('returns AM using meridiem function', () => {
    expect(unitTestingTask('A', dateAM)).toBe('AM');
    expect(mockedLanguage.meridiem).toHaveBeenCalledWith(6, false);
  });

  it('returns pm using meridiem function', () => {
    expect(unitTestingTask('a', datePM)).toBe('pm');
    expect(mockedLanguage.meridiem).toHaveBeenCalledWith(18, true);
  });

  it('throws error for invalid date', () => {
    const invalidDate = null;
    expect(() => {
      unitTestingTask('YYYY', invalidDate);
    }).toThrow('Argument `date` must be instance of Date or Unix Timestamp or ISODate String');
  });

  it('throws error if format is not a string', () => {
    const format = {};
    expect(() => {
      unitTestingTask(format, date);
    }).toThrow('Argument `format` must be a string');
  });
});

describe('formats tokens', () => {
  const date = new Date('2025-11-05T18:45:30.123Z');
  const dateAM = new Date('2025-11-05T06:45:30.000Z');
  const datePM = new Date('2025-11-05T18:45:30.000Z');
  const millisecondsDate = new Date('2025-11-05T18:45:30.045Z');
  const midnight = new Date('2025-11-05T00:00:00.000Z');

  test.each([
    ['YYYY', date, '2025'],
    ['YY', date, '25'],
    ['MMMM', date, 'MockedMonth'],
    ['MMM', date, 'MockedShortMonth'],
    ['MM', date, '11'],
    ['M', date, '11'],
    ['DDD', date, 'Wednesday'],
    ['DD', date, 'Wed'],
    ['D', date, 'We'],
    ['dd', date, '05'],
    ['d', date, '5'],
    ['HH', dateAM, '06'],
    ['H', date, '18'],
    ['hh', dateAM, '06'],
    ['hh', datePM, '06'],
    ['hh', midnight, '12'],
    ['h', dateAM, '6'],
    ['h', datePM, '6'],
    ['h', midnight, '12'],
    ['mm', date, '45'],
    ['m', date, '45'],
    ['ss', date, '30'],
    ['s', date, '30'],
    ['ff', millisecondsDate, '045'],
    ['f', millisecondsDate, '45'],
    ['A', dateAM, 'AM'],
    ['A', datePM, 'PM'],
    ['a', dateAM, 'am'],
    ['a', datePM, 'pm']
  ])('formats %s according to token\'s description', (format, date, expected) => {
    expect(unitTestingTask(format, date)).toBe(expected);
  });
});

describe('Reads formatting function with one argument — date', () => {
  beforeAll(() => {
    unitTestingTask.register('customDate', 'dd/MM/YYYY');
  });

  it('uses register to create custom format', () => {
    const date = new Date('2025-11-05T18:45:30.123Z');
    expect(unitTestingTask('customDate', date)).toBe('05/11/2025');
  });

  it('handles when date is not provided', () => {
    const date = new Date();
    expect(unitTestingTask('YYYY')).toBe(date.getFullYear().toString());
  });

  it('handles when date is not instanceof Date', () => {
    const dateString = '2025-11-05T18:45:30.123Z';
    const formattedDate = unitTestingTask('customDate', dateString);
    expect(formattedDate).toBe('05/11/2025');
  });
});

describe('lang function', () => {
  it('returns the current language', () => {
    expect(unitTestingTask.lang()).toBe('en');
  });

  it('changes and returns new language', () => {
    unitTestingTask.lang('es', mockedLanguage);
    expect(unitTestingTask.lang()).toBe('es');
  });

  it('returns new language', () => {
    expect(unitTestingTask.lang('es')).toBe('es');
  });

  it('falls back to default language if language not found', () => {
    expect(unitTestingTask.lang('unknownLang')).toBe('en');
    expect(unitTestingTask.lang('han')).toBe('en');
  });
});