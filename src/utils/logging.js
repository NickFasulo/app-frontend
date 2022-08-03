
const LOG_TYPE = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const doLog = (type, ...args) => {
  switch(type) {
    case LOG_TYPE.ERROR:
      console.error(...args);
      break;
    case LOG_TYPE.WARNING:
      console.warn(...args);
      break;
    case LOG_TYPE.INFO:
      console.log(...args);
      break;
    default:
      break;
  }
};

export const logError = (...args) => doLog(LOG_TYPE.ERROR, ...args);
export const logWarning = (...args) => doLog(LOG_TYPE.WARNING, ...args);
export const logInfo = (...args) => doLog(LOG_TYPE.INFO, ...args);
