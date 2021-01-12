export function now() {
    return window.performance ? performance.now() : Date.now();
}
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
export const clog = (message, logLevel, ...extra) => {
    if (logLevel > maxLogLevel)
        return;
    console.log(`%c ${message}`, `color: ${colors[logLevel]}`, ...extra);
    // TODO: Fix server crash due to client throw
    if (logLevel >= throwLogLevel)
        throw message;
};
export function randomRange(min, max) {
    return min === max ? min : Math.random() * (max - min) + min;
}
//# sourceMappingURL=utils.js.map