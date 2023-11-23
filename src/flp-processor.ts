import { ArrayBufferStream } from "array-buffer-stream"
import { FLPDataChunk, FLPHeaderChunk } from "./flp-chunk"
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
      const size = stream.readUint32LE()
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
        event.size = stream.readLEB128()
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
}