import { FLPEvent } from "./flp-event"

export class FLPChunk {
  type: string

  size: number

  bytes: ArrayBuffer

  constructor(type: string, size: number, bytes: ArrayBuffer) {
    this.type = type
    this.size = size
    this.bytes = bytes
  }
}


export class FLPHeaderChunk extends FLPChunk {

}

export class FLPDataChunk extends FLPChunk {
  events: FLPEvent[] = []
}