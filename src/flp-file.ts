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

  /**
   * Creates the binary data for this file and returns it.
   */
  getBinary(): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    const write = (chunk: FLPChunk) => {
      const type = chunk.type
      const bytes = chunk.getBinary()
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
  /**
   * Sets this files's values from binary data.
   * @param buffer Binary data.
   */
  setBinary(buffer: ArrayBuffer) {
    const stream = new ArrayBufferStream(buffer)
    while (!stream.eof()) {
      const type = stream.readAsciiString(4)
      const size = stream.readUint32(true)
      const bytes = stream.readBytes(size)
      if (type === 'FLhd') {
        this.header.setBinary(bytes)
      } else if (type === 'FLdt') {
        this.data.setBinary(bytes)
      }
    }
  }

  constructor() {
    this.header = new FLPHeaderChunk()
    this.data = new FLPDataChunk()
  }
}