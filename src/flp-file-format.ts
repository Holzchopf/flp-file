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

export type FLPFileFormatName = keyof typeof FLPFileFormatRaw
export type FLPFileFormatId = typeof FLPFileFormatRaw[FLPFileFormatName]

export const FLPFileFormat = {
  ...FLPFileFormatRaw,
  name: (id: number): FLPFileFormatName | 'unknown' => {
    const names = Object.keys(FLPFileFormatRaw) as FLPFileFormatName[]
    return names.find((n) => FLPFileFormatRaw[n] === id) ?? 'unknown'
  },
  byName: (name: string): FLPFileFormatId | undefined => {
    return FLPFileFormatRaw[name as FLPFileFormatName] ?? undefined
  }
}