export var MessageType;
(function (MessageType) {
    // for Worker example
    MessageType[MessageType["Render"] = 0] = "Render";
    MessageType[MessageType["Step"] = 1] = "Step";
    MessageType[MessageType["Add"] = 2] = "Add";
    MessageType[MessageType["Remove"] = 3] = "Remove";
    // for Worker with SharedArrayBuffer example
    MessageType[MessageType["SignalSAB"] = 4] = "SignalSAB";
    MessageType[MessageType["DataSAB"] = 5] = "DataSAB";
})(MessageType || (MessageType = {}));
