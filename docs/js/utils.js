// https://www.ibm.com/support/knowledgecenter/en/SSEP7J_10.2.2/com.ibm.swg.ba.cognos.ug_rtm_wb.10.2.2.doc/c_n30e74.html
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Fatal"] = 5] = "Fatal";
    LogLevel[LogLevel["All"] = 6] = "All";
})(LogLevel || (LogLevel = {}));
const colors = ['#ffffff', '#00ff00', '#00ffff', '#ffff00', '#ff00ff', '#ff0000', '#ffffff'];
const maxLogLevel = LogLevel.Fatal;
const throwLogLevel = LogLevel.Error;
export function clog(message, logLevel, ...extra) {
    if (logLevel > maxLogLevel)
        return;
    console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);
    if (logLevel >= throwLogLevel)
        throw message;
}
;
export var LogCategory;
(function (LogCategory) {
    LogCategory[LogCategory["Main"] = 0] = "Main";
    LogCategory[LogCategory["Worker"] = 1] = "Worker";
})(LogCategory || (LogCategory = {}));
const backgroundColors = ['#660000', '#000066'];
export function cblog(message, logLevel, logCategory, ...extra) {
    if (logLevel > maxLogLevel)
        return;
    console.log(`%c ${message}`, `color: ${colors[logLevel]}; background: ${backgroundColors[logCategory]}`, ...extra);
    if (logLevel >= throwLogLevel)
        throw message;
}
;
export function now() {
    return performance !== undefined ? performance.now() : Date.now();
}
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
