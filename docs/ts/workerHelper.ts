export enum MessageType {
  // for Worker examples
  Render = 0, // main thread sends to worker before every frame render
  Step, // worker sends to main thread after every physics step
  Add, // main thread sends to worker to add selected # of physics boxes
  Remove, // main thread sends to worker to remove all physics boxes

  // for Worker using SharedArrayBuffer and Atomics example
  // _signalSAB is a SharedArrayBuffer holding 2 Int32's, 1 for each the main thread and worker to watch and signal updates to each other
  SignalSAB
}

export interface Message {
  type: MessageType;
  data: any;
}
