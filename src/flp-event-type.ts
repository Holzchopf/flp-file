/*

started from https://github.com/monadgroup/FLParser/blob/master/Enums.cs
extended with https://github.com/Kermalis/KFLP/blob/main/KFLP/FLEvent.cs

*/

const FLPEventTypeRaw = {
  ByteEnabled: 0,
  ByteNoteOn: 1,
  ByteVol: 2,
  BytePan: 3,
  ByteMidiChan: 4,
  ByteMidiNote: 5,
  ByteMidiPatch: 6,
  ByteMidiBank: 7,
  ByteLoopActive: 9,
  ByteShowInfo: 10,
  ByteShuffle: 11,
  ByteMainVol: 12,
  ByteStretch: 13,
  BytePitchable: 14,
  ByteZipped: 15,
  ByteDelayFlags: 16,
  ByteProjectTimeSigNumerator: 17,
  ByteProjectTimeSigDenominator: 18,
  ByteUseLoopPoints: 19,
  ByteChannelLoopType: 20,
  ByteChannelType: 21,
  ByteTargetFXTrack: 22,
  BytePanningLaw: 23,
  ByteNStepsShown: 24,
  ByteSSLength: 25,
  ByteSSLoop: 26,
  ByteEffectChannelMuted: 27,
  ByteIsRegistered: 28,
  ByteAPDC: 29,
  BytePlayTruncatedNotes: 30,
  ByteEEAutoMode: 31,
  ByteTimeSigMarkerNumerator: 33,
  ByteTimeSigMarkerDenominator: 34,
  ByteProjectShouldUseTimeSignatures: 35,
  ByteShouldCutNotesFast: 40,
  BytePluginIgnoresTheme: 41,
  ByteInsertIgnoresTheme: 42,
  ByteTrackIgnoresTheme: 43,
  BytePlaylistShouldUseAutoCrossfades: 44,

  WordNewChan: 64,
  WordNewPat: 65,
  WordTempo: 66,
  WordCurrentPatNum: 67,
  WordPatData: 68,
  WordFx: 69,
  WordFadeStereo: 70,
  WordCutOff: 71,
  WordDotVol: 72,
  WordDotPan: 73,
  WordPreAmp: 74,
  WordDecay: 75,
  WordAttack: 76,
  WordDotNote: 77,
  WordDotPitch: 78,
  WordDotMix: 79,
  WordMainPitch: 80,
  WordRandChan: 81,
  WordMixChan: 82,
  WordResonance: 83,
  WordLoopBar: 84,
  WordStDel: 85,
  WordFx3: 86,
  WordDotReso: 87,
  WordDotCutOff: 88,
  WordShiftDelay: 89,
  WordLoopEndBar: 90,
  WordDot: 91,
  WordDotShift: 92,
  WordTempoFine: 93,
  WordLayerChans: 94,
  WordInsertIcon: 95,
  WordDotRel: 96,
  WordSwingMix: 97,
  WordCurrentSlotNum: 98,
  WordNewArrangement: 99,
  WordCurrentArrangementNum: 100,

  DWordColor: 128,
  DWordPlayListItem: 129,
  DWordEcho: 130,
  DWordFxSine: 131,
  DWordCutCutBy: 132,
  DWordWindowH: 133,
  DWordMiddleNote: 135,
  DWordReserved: 136,
  DWordMainResoCutOff: 137,
  DWordDelayReso: 138,
  DWordReverb: 139,
  DWordIntStretch: 140,
  DWordSsNote: 141,
  DWordFineTune: 142,
  DWordChannelSampleFlags: 143,
  DWordChannelLayerFlags: 144,
  DWordChanFilterNum: 145,
  DWordCurFilterNum: 146,
  DWordInsertOutChanNum: 147,
  DWordNewTimeMarker: 148,
  DWordInsertColor: 149,
  DWordPatternColor: 150,
  DWordPatternAutoMode: 151,
  DwordSongLoopPos: 152,
  DWordAUSmpRate: 153,
  DwordInsertInChanNum: 154,
  DWordPluginIcon: 155,
  DWordFineTempo: 156,
  DWordVersionBuilNumber: 159,

  TextChanName: 192,
  TextPatName: 193,
  TextTitle: 194,
  TextComment: 195,
  TextSampleFileName: 196,
  TextUrl: 197,
  TextCommentRtf: 198,
  TextVersion: 199,
  TextRegName: 200,
  TextDefPluginName: 201,
  TextProjectDataPath: 202,
  TextPluginName: 203,
  TextInsertName: 204,
  TextTimeMarkerName: 205,
  TextGenre: 206,
  TextProjectAuthor: 207,
  TextMidiControls: 208,
  TextDelay: 209,

  DataTs404Params: 210,
  DataDelayLine: 211,
  DataNewPlugin: 212,
  DataPluginParams: 213,
  DataChanParams: 215,
  DataCtrlRecChan: 216,
  DataPlaylistSelection: 217,
  DataEnvLfoParams: 218,
  DataBasicChanParams: 219,
  DataOldFilterParams: 220,
  DataChanPoly: 221,
  DataNoteEvents: 222,
  DataOldAutomationData: 223,
  DataPatternNotes: 224,
  DataInsertParams: 225,
  DataMIDIInfo: 226,
  DataAutomationChannels: 227,
  DataChannelTracking: 228,
  DataChanOfsLevels: 229,
  DataRemoteCtrlFormula: 230,
  DataChanGroupName: 231,
  DataRegBlackList: 232,
  DataPlayListItems: 233,
  DataAutomationData: 234,
  DataInsertRoutes: 235,
  DataInsertFlags: 236,
  DataSaveTimestamp: 237,
  DataNewPlaylistTrack: 238,
  DataPlaylistTrackName: 239,
  DataArrangementName: 241,
} as const

/**
 * Known event names.
 */
export type FLPEventTypeName = keyof typeof FLPEventTypeRaw
/**
 * Known event IDs.
 */
export type FLPEventTypeId = typeof FLPEventTypeRaw[FLPEventTypeName]

/**
 * Types of the events in an [[FLPDataChunk]].
 */
export const FLPEventType = {
  ...FLPEventTypeRaw,
  /**
   * Returns the name of a given event ID, or `'unknown'`.
   * @param id Event ID.
   */
  name: (id: number): FLPEventTypeName | 'unknown' => {
    const names = Object.keys(FLPEventTypeRaw) as FLPEventTypeName[]
    return names.find((n) => FLPEventTypeRaw[n] === id) ?? 'unknown'
  },
  /**
   * Returns the ID for a given event name, or `undefined`
   * @param name Event name.
   */
  byName: (name: string): FLPEventTypeId | undefined => {
    return FLPEventTypeRaw[name as FLPEventTypeName] ?? undefined
  }
}