const unitTestingTask = require('../unitTestingTask');
const uk = require('../lang/uk');

describe('Укрїнська Language', () => {
  let date, dateAM, datePM;

  beforeAll(() => {
    date = new Date(Date.UTC(2025, 10, 5, 18, 45, 30));
    dateAM = new Date(Date.UTC(2025, 10, 5, 6, 45, 30));
    datePM = new Date(Date.UTC(2025, 10, 5, 18, 45, 30));
  });

  it('should display full month name', () => {
    unitTestingTask.lang('uk', uk);
    expect(unitTestingTask('MMMM', date)).toBe('листопад');
  });

  it('should display short month name', () => {
    unitTestingTask.lang('uk', uk);
    expect(unitTestingTask('MMM', date)).toBe('лист');
  });

  it('should display AM', () => {
    unitTestingTask.lang('uk', uk);
    expect(unitTestingTask('A', dateAM)).toBe('ранку');
  });

  it('should display PM', () => {
    unitTestingTask.lang('uk', uk);
    expect(unitTestingTask('A', datePM)).toBe('вечора');
  });

  it('should display 12-hour time', () => {
    unitTestingTask.lang('uk', uk);
    expect(unitTestingTask('h', dateAM)).toBe('6');
  });
});