import { ArrayBufferStream, joinArrayBuffers } from "array-buffer-stream"
import { FLPChunk, FLPDataChunk, FLPHeaderChunk } from "./flp-chunk"

export class FLPFile {
  /**
   * Header chunk
   */
  header: FLPHeaderChunk

  /**
   * Data chunk
   */
  data: FLPDataChunk

  get bytes(): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    const write = (chunk: FLPChunk) => {
      const type = chunk.type
      const bytes = chunk.bytes
      const stream = new ArrayBufferStream(new ArrayBuffer(4 + 4 + bytes.byteLength))
      stream.writeAsciiString(type)
      stream.writeInt32(bytes.byteLength, true)
      stream.writeBytes(bytes)
      buffers.push(stream.buffer)
    }

    write(this.header)
    write(this.data)

    return joinArrayBuffers(buffers)
  }
  set bytes(bytes: ArrayBuffer) {
    const stream = new ArrayBufferStream(bytes)
    while (!stream.eof) {
      const type = stream.readAsciiString(4)
      const size = stream.readUint32(true)
      const bytes = stream.readBytes(size)
      if (type === 'FLhd') {
        this.header.bytes = bytes
      } else if (type === 'FLdt') {
        this.data.bytes = bytes
      }
    }
  }

  constructor() {
    this.header = new FLPHeaderChunk()
    this.data = new FLPDataChunk()
  }
}