import { ArrayBufferStream, joinArrayBuffers } from "array-buffer-stream"
import { FLPEvent } from "./flp-event"
import { FLPFileFormat } from "./flp-file-format"

export type FLPChunkType = 'FLhd' | 'FLdt'

export abstract class FLPChunk {
  /**
   * FLPChunkType
   */
  type: FLPChunkType

  abstract get bytes(): ArrayBuffer
  abstract set bytes(bytes: ArrayBuffer)

  constructor(type: FLPChunkType) {
    this.type = type
  }
}

export class FLPHeaderChunk extends FLPChunk {
  /**
   * Numeric file format identifier.
   */
  format: number = 0
  /**
   * Name of file format.
   */
  get formatName() {
    return FLPFileFormat.name(this.format)
  }
  /**
   * Number of channels.
   */
  channelCnt: number = 1
  /**
   * Project PPQ.
   */
  ppq: number = 96

  get bytes(): ArrayBuffer {
    const stream = new ArrayBufferStream(new ArrayBuffer(6))
    stream.writeUint16(this.format, true)
    stream.writeUint16(this.channelCnt, true)
    stream.writeUint16(this.ppq, true)
    return stream.buffer
  }
  set bytes(bytes: ArrayBuffer) {
    const stream = new ArrayBufferStream(bytes)
    this.format = stream.readUint16(true)
    this.channelCnt = stream.readUint16(true)
    this.ppq = stream.readUint16(true)
  }

  constructor() {
    super('FLhd')
  }
}

export class FLPDataChunk extends FLPChunk {
  /**
   * FLPEvents in this chunk.
   */
  events: FLPEvent[] = []

  get bytes(): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    this.events.forEach((event) => {
      const type = event.type
      const bytes = event.bytes
      // size is pre-defined for primitives
      let size = event.maxByteLength
      if (size) {
        // total size is 1 (type) + event.size
        const stream = new ArrayBufferStream(new ArrayBuffer(1 + bytes.byteLength))
        stream.writeUint8(type)
        stream.writeBytes(bytes)
        buffers.push(stream.buffer)
      } else {
        // total size is 1 (type) + max 16 (LEB128) + event.size
        const stream = new ArrayBufferStream(new ArrayBuffer(1 + 16 + bytes.byteLength))
        stream.writeUint8(type)
        stream.writeLeb128(bytes.byteLength)
        stream.writeBytes(bytes)
        // only push used buffer
        buffers.push(stream.buffer.slice(0, stream.cursor))
      }
    })

    // concatenate all those ArrayBuffers
    return joinArrayBuffers(buffers)
  }
  set bytes(bytes: ArrayBuffer) {
    const stream = new ArrayBufferStream(bytes)
    this.events = []
    while (!stream.eof()) {
      const type = stream.readUint8()
      const event = new FLPEvent(type)
      // size is pre-defined for primitives
      let size = event.maxByteLength
      if (size) {
        event.bytes = stream.readBytes(size)
      } else {
        size = stream.readLeb128()
        event.bytes = stream.readBytes(size)
      }
      this.events.push(event)
    }
  }

  constructor() {
    super('FLdt')
  }
}