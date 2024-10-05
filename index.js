const unitTestingTask = require('./unitTestingTask');

const currentLang = unitTestingTask.lang();
unitTestingTask.leadingZeroes(5)
console.log(currentLang); // Output: 'en' (or the current language)