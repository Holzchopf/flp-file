import { FLPDataChunk, FLPHeaderChunk } from "./flp-chunk"

export class FLPFile {
  /**
   * Header chunk
   */
  header?: FLPHeaderChunk

  /**
   * Data chunk
   */
  data?: FLPDataChunk
}