export var MessageType;
(function (MessageType) {
    // for Worker examples
    MessageType[MessageType["Render"] = 0] = "Render";
    MessageType[MessageType["Step"] = 1] = "Step";
    MessageType[MessageType["Add"] = 2] = "Add";
    MessageType[MessageType["Remove"] = 3] = "Remove";
    // for Worker using SharedArrayBuffer and Atomics example
    // _signalSAB is a SharedArrayBuffer holding 2 Int32's, 1 for each the main thread and worker to watch and signal updates to each other
    MessageType[MessageType["SignalSAB"] = 4] = "SignalSAB";
})(MessageType || (MessageType = {}));
