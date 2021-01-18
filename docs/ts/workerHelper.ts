export enum MessageType {
  Render = 0,
  Step,
  Add,
  Remove
}

export interface Message {
  type: MessageType,
  data: any
}