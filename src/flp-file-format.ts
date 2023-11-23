/*

https://github.com/demberto/PyFLP/blob/master/pyflp/project.py

*/

const FLPFileFormatRaw = {
  Project: 0,
  Score: 16,
  Automation: 24,
  ChannelState: 32,
  PluginState: 48,
  GeneratorState: 49,
  EffectState: 50,
  InsertState: 64,
} as const

/**
 * Known file format names.
 */
export type FLPFileFormatName = keyof typeof FLPFileFormatRaw
/**
 * Known file format IDs.
 */
export type FLPFileFormatId = typeof FLPFileFormatRaw[FLPFileFormatName]

/**
 * Specific file formats of [[FLPFile]]s.
 */
export const FLPFileFormat = {
  ...FLPFileFormatRaw,
  /**
   * Returns the name of a given file format ID, or `'unknown'`
   * @param id File format ID.
   */
  name: (id: number): FLPFileFormatName | 'unknown' => {
    const names = Object.keys(FLPFileFormatRaw) as FLPFileFormatName[]
    return names.find((n) => FLPFileFormatRaw[n] === id) ?? 'unknown'
  },
  /**
   * Returns the ID for a given file format name, or `undefined`
   * @param name File format name.
   */
  byName: (name: string): FLPFileFormatId | undefined => {
    return FLPFileFormatRaw[name as FLPFileFormatName] ?? undefined
  }
}