import { FLPEventType, FLPEventTypeName } from "./flp-event-type"

export class FLPEvent {
  /**
   * FLPEventType
   */
  type: number
  /**
   * Name of FLPEventType
   */
  typeName: FLPEventTypeName
  /**
   * Byte size of event
   */
  size?: number
  /**
   * Byte data of event
   */
  bytes?: ArrayBuffer
  /**
   * Primitive representation of event data. Only if applicable.
   */
  value?: number | string

  constructor(type: number) {
    this.type = type
    this.typeName = FLPEventType.byId(type)
  }
}