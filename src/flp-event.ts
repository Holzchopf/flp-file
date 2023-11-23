import { ArrayBufferStream } from "@holzchopf/array-buffer-stream"
import { FLPEventType, FLPEventTypeName } from "./flp-event-type"

export type FLPDataType = 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float32' | 'binary' | 'ascii' | 'utf-16le'

/**
 * Data types for event's values. Falls back to `uint8` for event ids < 64, `uint16` for event ids < 128, `uint32` for event ids < 192, `utf-16le` for event ids < 210, `binary` otherwise
 */
export let FLPEventValueDataType: Partial<Record<FLPEventTypeName, FLPDataType>> = {
  TextVersion: 'ascii',
  DataRemoteCtrlFormula: 'utf-16le',
  DataChanGroupName: 'utf-16le',
  DataPlaylistTrackName: 'utf-16le',
  DataArrangementName: 'utf-16le',
}

export class FLPEvent {
  /**
   * Numeric FLPEventType.
   */
  type: number
  /**
   * Name of FLPEventType. Readonly.
   */
  get typeName() {
    return FLPEventType.name(this.type)
  }
  /**
   * Byte size of event
   */
  // get size() {
  //   // fixed size events have their defined size
  //   const maxByteLength = this.maxByteLength
  //   if (maxByteLength) return maxByteLength
  //   // ... other events need to derive their size from bytes
  //   return this.bytes.byteLength
  // }

  /**
   * Primitive representation of event data. Data type varies by event type.
   */
  value: number | string | ArrayBuffer

  /**
   * Returns the maximum allowed byte length depending on event type.
   */
  get maxByteLength() {
    return (
      this.type < 64 ? 1 :
      this.type < 128 ? 2 :
      this.type < 192 ? 4 :
      undefined
    )
  }

  constructor(type: number) {
    this.type = type
    const datatype = FLPEvent.getValueDataType(this.type)
    // initial value
    this.value = 0
    //... as string
    if (datatype === 'ascii' || datatype === 'utf-16le') {
      this.value = ''
    }
    //... as binary data
    else if (datatype === 'binary') {
      this.value = new ArrayBuffer(0)
    }
  }

  /**
   * Creates the binary data for this event and returns it.
   */
  getBinary(): ArrayBuffer {
    // binary data is already byte data
    if (this.value instanceof ArrayBuffer) return this.value

    // primitives need to be derived
    const datatype = FLPEvent.getValueDataType(this.type)
    switch (datatype) {
      // fixed size primitives
      case 'int8': {
        const buffer = new ArrayBuffer(1)
        new DataView(buffer).setInt8(0, +this.value)
        return buffer
      }
      case 'int16': {
        const buffer = new ArrayBuffer(2)
        new DataView(buffer).setInt16(0, +this.value, true)
        return buffer
      }
      case 'int32': {
        const buffer = new ArrayBuffer(4)
        new DataView(buffer).setInt32(0, +this.value, true)
        return buffer
      }
      case 'uint8': {
        const buffer = new ArrayBuffer(1)
        new DataView(buffer).setUint8(0, +this.value)
        return buffer
      }
      case 'uint16': {
        const buffer = new ArrayBuffer(2)
        new DataView(buffer).setUint16(0, +this.value, true)
        return buffer
      }
      case 'uint32': {
        const buffer = new ArrayBuffer(4)
        new DataView(buffer).setUint32(0, +this.value, true)
        return buffer
      }
      case 'float32': {
        const buffer = new ArrayBuffer(4)
        new DataView(buffer).setFloat32(0, +this.value, true)
        return buffer
      }
      // variable sized primitives (strings)
      case 'ascii': {
        const value = `${this.value}\x00` // append zero terminator
        const stream = new ArrayBufferStream(new ArrayBuffer(value.length))
        stream.writeAsciiString(value)
        return stream.buffer
      }
      case 'utf-16le': {
        const value = `${this.value}\x00` // append zero terminator
        const stream = new ArrayBufferStream(new ArrayBuffer(value.length * 2))
        stream.writeUtf16String(value, true)
        return stream.buffer
      }
      // this should only be the case if data type says binary but value is primitive...
      default: {
        return new ArrayBuffer(0)
      }
    }
  }

  /**
   * Sets this event's values from binary data.
   * @param buffer Binary data.
   */
  setBinary(buffer: ArrayBuffer) {
    const datatype = FLPEvent.getValueDataType(this.type)
    switch (datatype) {
      // fixed size primitives
      case 'int8': {
        this.value = new DataView(buffer).getInt8(0)
        break
      }
      case 'int16': {
        this.value = new DataView(buffer).getInt16(0, true)
        break
      }
      case 'int32': {
        this.value = new DataView(buffer).getInt32(0, true)
        break
      }
      case 'uint8': {
        this.value = new DataView(buffer).getUint8(0)
        break
      }
      case 'uint16': {
        this.value = new DataView(buffer).getUint16(0, true)
        break
      }
      case 'uint32': {
        this.value = new DataView(buffer).getUint32(0, true)
        break
      }
      case 'float32': {
        this.value = new DataView(buffer).getFloat32(0, true)
        break
      }
      // variable sized primitives (strings)
      case 'ascii': {
        const value = new TextDecoder('ascii').decode(buffer)
        // remove zero terminator
        this.value = value.slice(0, -1)
        break
      }
      case 'utf-16le': {
        const value = new TextDecoder('utf-16le').decode(buffer)
        // remove zero terminator
        this.value = value.slice(0, -1)
        break
      }
      case 'binary': {
        this.value = buffer
        break
      }
    }
  }

  /**
   * Returns the expected data type for a given event type.
   * @param type Event type.
   */
  static getValueDataType(type: number | FLPEventTypeName): FLPDataType {
    let typeId: number
    let typeName: FLPEventTypeName
    if (typeof type === 'number') {
      typeId = type
      typeName = FLPEventType.name(type) as FLPEventTypeName
    } else {
      typeId = FLPEventType.byName(type) ?? 0
      typeName = type
    }
    const datatype = FLPEventValueDataType[typeName]
    if (datatype) return datatype
    // fallbacks, based on type id:
    if (typeId < 64) {
      return 'uint8'
    } else if (typeId < 128) {
      return 'uint16'
    } else if (typeId < 192) {
      return 'uint32'
    } else if (typeId < 210) {
      return 'utf-16le'
    } else {
      return 'binary'
    }
  }
}