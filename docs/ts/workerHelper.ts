export enum MessageType {
  // for Worker example
  Render = 0,
  Step,
  Add,
  Remove,

  // for Worker with SharedArrayBuffer example
  SignalSAB,
  DataSAB
}

export interface Message {
  type: MessageType,
  data: any
}