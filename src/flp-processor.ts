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
    loop: while (!stream.eof()) {
      const type = stream.readUint8()
      const event = new FLPEvent(type)
      // chunks are categorized by size
      if (event.type < 64) {
        event.size = 1
        event.bytes = stream.readBytes(1)
        event.value = new DataView(event.bytes).getInt8(0)
      } else if (event.type < 128) {
        event.size = 2
        event.bytes = stream.readBytes(2)
        event.value = new DataView(event.bytes).getInt16(0, true)
      } else if (event.type < 192) {
        event.size = 4
        event.bytes = stream.readBytes(4)
        event.value = new DataView(event.bytes).getInt32(0, true)
      } else {
        event.size = stream.readLeb128()
        event.bytes = stream.readBytes(event.size)
        // interpret texts
        // for some reason, TextVersion seems to be ascii
        if (event.typeName === 'TextVersion') {
          event.value = new TextDecoder('ascii').decode(event.bytes)
        }
        // all other text fields (192 ... 209) seem to be utf-16le
        else if (event.type < 210) {
          event.value = new TextDecoder('utf-16le').decode(event.bytes)
        }
        //... and some of the data fields (>= 210) are too
        else if (
          event.typeName === 'DataRemoteCtrlFormula' ||
          event.typeName === 'DataChanGroupName' ||
          event.typeName === 'DataPlaylistTrackName' ||
          event.typeName === 'DataArrangementName'
        ) {
          event.value = new TextDecoder('utf-16le').decode(event.bytes)
        }
        // remove null termination
        if (event.value && typeof(event.value) === 'string' && event.value.endsWith('\x00')) {
          event.value = event.value.slice(0, -1)
        }
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

    let stream: ArrayBufferStream

    events.forEach((event) => {
      // TODO (?) allow bytes to be derived from value

      if (!event.bytes) return

      // event byte size depends on event type
      if (event.type < 192) {
        const byteLength = event.bytes.byteLength
        stream = new ArrayBufferStream(new ArrayBuffer(1 + byteLength))
        stream.writeUint8(event.type)
        stream.writeBytes(event.bytes)
        buffers.push(stream.buffer)
      } else {
        // for these events, the size is stored in a variable length number (max 128 bit, shorten correctly afterwards)
        const byteLength = event.bytes.byteLength
        stream = new ArrayBufferStream(new ArrayBuffer(1 + byteLength + 16))
        stream.writeUint8(event.type)
        stream.writeLeb128(byteLength)
        stream.writeBytes(event.bytes)
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