export function now(): number {
  return window.performance ? performance.now() : Date.now();
}

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
export const clog = (message: string, logLevel: LogLevel, ...extra: any[]) => {
  if (logLevel > maxLogLevel) return;

  console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);

  // TODO: Fix server crash due to client throw
  if (logLevel >= throwLogLevel) throw message;
};

export function randomRange(min: number, max: number): number {
  return min === max ? min : Math.random() * (max - min) + min;
}
