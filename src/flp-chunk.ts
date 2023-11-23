import { ArrayBufferStream, joinArrayBuffers } from "@holzchopf/array-buffer-stream"
import { FLPEvent } from "./flp-event"
import { FLPFileFormat } from "./flp-file-format"

export type FLPChunkType = 'FLhd' | 'FLdt'

export abstract class FLPChunk {
  /**
   * FLPChunkType
   */
  type: FLPChunkType

  /**
   * Creates the binary data for this chunk and returns it.
   */
  abstract getBinary(): ArrayBuffer
  /**
   * Sets this chunk's values from binary data.
   * @param buffer Binary data.
   */
  abstract setBinary(buffer: ArrayBuffer): void

  constructor(type: FLPChunkType) {
    this.type = type
  }
}

export class FLPHeaderChunk extends FLPChunk {
  /**
   * Numeric file format identifier.
   */
  format: number = -1
  /**
   * Name of file format.
   */
  get formatName() {
    return FLPFileFormat.name(this.format)
  }
  /**
   * Number of channels.
   */
  channelCnt: number = 0
  /**
   * Project PPQ.
   */
  ppq: number = 96

  getBinary(): ArrayBuffer {
    const stream = new ArrayBufferStream(new ArrayBuffer(6))
    stream.writeUint16(this.format, true)
    stream.writeUint16(this.channelCnt, true)
    stream.writeUint16(this.ppq, true)
    return stream.buffer
  }
  setBinary(buffer: ArrayBuffer) {
    const stream = new ArrayBufferStream(buffer)
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

  getBinary(): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    this.events.forEach((event) => {
      const type = event.type
      const bytes = event.getBinary()
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
        stream.writeUleb128(bytes.byteLength)
        stream.writeBytes(bytes)
        // only push used buffer
        buffers.push(stream.buffer.slice(0, stream.cursor))
      }
    })

    // concatenate all those ArrayBuffers
    return joinArrayBuffers(buffers)
  }
  setBinary(buffer: ArrayBuffer) {
    const stream = new ArrayBufferStream(buffer)
    this.events = []
    while (!stream.eof()) {
      const type = stream.readUint8()
      const event = new FLPEvent(type)
      // size is pre-defined for primitives
      let size = event.maxByteLength
      if (size) {
        event.setBinary(stream.readBytes(size))
      } else {
        size = stream.readUleb128()
        event.setBinary(stream.readBytes(size))
      }
      this.events.push(event)
    }
  }

  constructor() {
    super('FLdt')
  }
}