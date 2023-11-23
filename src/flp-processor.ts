import { ArrayBufferStream } from "array-buffer-stream"
import { FLPChunk, FLPDataChunk, FLPHeaderChunk } from "./flp-chunk"
import { FLPFile } from "./flp-file"
import { FLPEvent } from "./flp-event"

export class FLPProcessor {
  /**
   * Reads an FLPFile from an array buffer
   */
  readFile(buffer: ArrayBuffer): FLPFile {
    // const stream = new ArrayBufferStream(buffer)
    const file = new FLPFile()
    // there are two chunks: a header, and data. In this order
    const [header, data] = this.readChunks(buffer)
    file.header = header as FLPHeaderChunk
    file.data = data as FLPDataChunk
    // interpret data chunk
    if (file.data) {
      file.data.events = this.readEvents(file.data.bytes)
    }
    return file
  }

  /**
   * Reads all chunks in buffer
   */
  readChunks(buffer: ArrayBuffer): (FLPHeaderChunk | FLPDataChunk)[] {
    const stream = new ArrayBufferStream(buffer)
    const chunks: (FLPHeaderChunk | FLPDataChunk)[] = []
    for (let i = 0; !stream.eof(); i++) {
      const type = stream.readAsciiString(4)
      const size = stream.readUint32(true)
      const bytes = stream.readBytes(size)
      const chunk = i === 0 ?
        new FLPHeaderChunk(type, size, bytes) :
        new FLPDataChunk(type, size, bytes)
      chunks.push(chunk)
    }
    return chunks
  }

  /**
   * Reads all events in buffer
   */
  readEvents(buffer: ArrayBuffer): FLPEvent[] {
    const stream = new ArrayBufferStream(buffer)
    const events = []
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
      events.push(event)
    }
    return events
  }

  /**
   * Writes an FLP File to an ArrayBuffer
   * @param file The FLP File to write.
   */
  writeFile(file: FLPFile): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    // build the data chunk from events
    if (file.data) {
      file.data.bytes = this.writeEvents(file.data.events)
    }

    // write chunks
    if (file.header) buffers.push(this.writeChunk(file.header))
    if (file.data) buffers.push(this.writeChunk(file.data))

    // concatenate all those ArrayBuffers
    const byteLength = buffers.reduce((acc, buffer) => {
      acc += buffer.byteLength
      return acc
    }, 0)
    const out = new Uint8Array(byteLength)
    let offset = 0
    buffers.forEach((buffer) => {
      out.set(new Uint8Array(buffer), offset)
      offset += buffer.byteLength
    })
    return out.buffer
  }

  writeChunk(chunk: FLPChunk): ArrayBuffer {
    const stream = new ArrayBufferStream(new ArrayBuffer(chunk.type.length + 4 + chunk.bytes.byteLength))
    stream.writeAsciiString(chunk.type)
    stream.writeInt32(chunk.size, true)
    stream.writeBytes(chunk.bytes)
    return stream.buffer
  }

  writeEvents(events: FLPEvent[]): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    events.forEach((event) => {
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
    const byteLength = buffers.reduce((acc, buffer) => {
      acc += buffer.byteLength
      return acc
    }, 0)
    const out = new Uint8Array(byteLength)
    let offset = 0
    buffers.forEach((buffer) => {
      out.set(new Uint8Array(buffer), offset)
      offset += buffer.byteLength
    })
    return out.buffer
  }
}