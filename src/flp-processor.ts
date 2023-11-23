import { FLPFile } from "./flp-file"

export class FLPProcessor {
  /**
   * Reads an FLPFile from an array buffer
   */
  readFile(buffer: ArrayBuffer): FLPFile {
    const file = new FLPFile()
    file.bytes = buffer
    return file
  }

  /**
   * Writes an FLP File to an ArrayBuffer
   * @param file The FLP File to write.
   */
  writeFile(file: FLPFile): ArrayBuffer {
    return file.bytes
  }
}