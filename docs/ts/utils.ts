// https://www.ibm.com/support/knowledgecenter/en/SSEP7J_10.2.2/com.ibm.swg.ba.cognos.ug_rtm_wb.10.2.2.doc/c_n30e74.html
export enum LogLevel {
  None = 0,
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
  All
}

const colors = ['#ffffff', '#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#ff0000', '#ffffff'];
const maxLogLevel = LogLevel.Fatal;
const throwLogLevel = LogLevel.Error;
export function clog(message: string, logLevel: LogLevel, ...extra: any[]) {
  if (logLevel > maxLogLevel) return;

  console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);

  if (logLevel >= throwLogLevel) throw message;
};

export enum LogCategory {
  Main = 0,
  Worker
}

const backgroundColors = ['#660000', '#000066'];
export function cblog(message: string, logLevel: LogLevel, logCategory: LogCategory, ...extra: any[]) {
  if (logLevel > maxLogLevel) return;

  console.log(`%c ${message}`, `color: ${colors[logLevel]}; background: ${backgroundColors[logCategory]}`, ...extra);

  if (logLevel >= throwLogLevel) throw message;
};

export function now(): number {
  return window.performance ? performance.now() : Date.now();
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
