/*

started from https://github.com/monadgroup/FLParser/blob/master/Enums.cs
extended with https://github.com/Kermalis/KFLP/blob/main/KFLP/FLEvent.cs

*/

const FLPEventTypeRaw = {
  0: 'ByteEnabled',
  1: 'ByteNoteOn',
  2: 'ByteVol',
  3: 'BytePan',
  4: 'ByteMidiChan',
  5: 'ByteMidiNote',
  6: 'ByteMidiPatch',
  7: 'ByteMidiBank',
  9: 'ByteLoopActive',
  10: 'ByteShowInfo',
  11: 'ByteShuffle',
  12: 'ByteMainVol',
  13: 'ByteStretch',
  14: 'BytePitchable',
  15: 'ByteZipped',
  16: 'ByteDelayFlags',
  17: 'ByteProjectTimeSigNumerator', // BytePatLength
  18: 'ByteProjectTimeSigDenominator', // ByteBlockLength
  19: 'ByteUseLoopPoints',
  20: 'ByteChannelLoopType', // ByteLoopType
  21: 'ByteChannelType', // ByteChanType
  22: 'ByteTargetFXTrack', // ByteMixSliceNum
  23: 'BytePanningLaw',
  24: 'ByteNStepsShown',
  25: 'ByteSSLength',
  26: 'ByteSSLoop',
  27: 'ByteEffectChannelMuted',
  28: 'ByteIsRegistered',
  29: 'ByteAPDC',
  30: 'BytePlayTruncatedNotes',
  31: 'ByteEEAutoMode',
  33: 'ByteTimeSigMarkerNumerator',
  34: 'ByteTimeSigMarkerDenominator',
  35: 'ByteProjectShouldUseTimeSignatures',
  40: 'ByteShouldCutNotesFast',
  41: 'BytePluginIgnoresTheme',
  42: 'ByteInsertIgnoresTheme',
  43: 'ByteTrackIgnoresTheme',
  44: 'BytePlaylistShouldUseAutoCrossfades',

  64: 'WordNewChan',
  65: 'WordNewPat',
  66: 'WordTempo',
  67: 'WordCurrentPatNum',
  68: 'WordPatData',
  69: 'WordFx',
  70: 'WordFadeStereo',
  71: 'WordCutOff',
  72: 'WordDotVol',
  73: 'WordDotPan',
  74: 'WordPreAmp',
  75: 'WordDecay',
  76: 'WordAttack',
  77: 'WordDotNote',
  78: 'WordDotPitch',
  79: 'WordDotMix',
  80: 'WordMainPitch',
  81: 'WordRandChan',
  82: 'WordMixChan',
  83: 'WordResonance',
  84: 'WordLoopBar',
  85: 'WordStDel',
  86: 'WordFx3',
  87: 'WordDotReso',
  88: 'WordDotCutOff',
  89: 'WordShiftDelay',
  90: 'WordLoopEndBar',
  91: 'WordDot',
  92: 'WordDotShift',
  93: 'WordTempoFine',
  94: 'WordLayerChans',
  95: 'WordInsertIcon',
  96: 'WordDotRel', // WordInsertIcon
  97: 'WordSwingMix',
  98: 'WordCurrentSlotNum',
  99: 'WordNewArrangement',
  100: 'WordCurrentArrangementNum',

  128: 'DWordColor',
  129: 'DWordPlayListItem',
  130: 'DWordEcho',
  131: 'DWordFxSine',
  132: 'DWordCutCutBy',
  133: 'DWordWindowH',
  135: 'DWordMiddleNote',
  136: 'DWordReserved',
  137: 'DWordMainResoCutOff',
  138: 'DWordDelayReso',
  139: 'DWordReverb',
  140: 'DWordIntStretch',
  141: 'DWordSsNote',
  142: 'DWordFineTune',
  143: 'DWordChannelSampleFlags',
  144: 'DWordChannelLayerFlags',
  145: 'DWordChanFilterNum',
  146: 'DWordCurFilterNum',
  147: 'DWordInsertOutChanNum',
  148: 'DWordNewTimeMarker',
  149: 'DWordInsertColor',
  150: 'DWordPatternColor',
  151: 'DWordPatternAutoMode',
  152: 'DwordSongLoopPos',
  153: 'DWordAUSmpRate',
  154: 'DwordInsertInChanNum',
  155: 'DWordPluginIcon',
  156: 'DWordFineTempo',
  159: 'DWordVersionBuilNumber',

  192: 'TextChanName',
  193: 'TextPatName',
  194: 'TextTitle',
  195: 'TextComment',
  196: 'TextSampleFileName',
  197: 'TextUrl',
  198: 'TextCommentRtf',
  199: 'TextVersion',
  200: 'TextRegName',
  201: 'TextDefPluginName', // GeneratorName
  202: 'TextProjectDataPath',
  203: 'TextPluginName',
  204: 'TextInsertName',
  205: 'TextTimeMarkerName',
  206: 'TextGenre',
  207: 'TextProjectAuthor',
  208: 'TextMidiControls',
  209: 'TextDelay',

  210: 'DataTs404Params',
  211: 'DataDelayLine',
  212: 'DataNewPlugin',
  213: 'DataPluginParams',
  215: 'DataChanParams',
  216: 'DataCtrlRecChan',
  217: 'DataPlaylistSelection',
  218: 'DataEnvLfoParams',
  219: 'DataBasicChanParams',
  220: 'DataOldFilterParams',
  221: 'DataChanPoly',
  222: 'DataNoteEvents',
  223: 'DataOldAutomationData',
  224: 'DataPatternNotes',
  225: 'DataInsertParams',
  226: 'DataMIDIInfo',
  227: 'DataAutomationChannels',
  228: 'DataChannelTracking',
  229: 'DataChanOfsLevels',
  230: 'DataRemoteCtrlFormula',
  231: 'DataChanGroupName',
  232: 'DataRegBlackList',
  233: 'DataPlayListItems',
  234: 'DataAutomationData',
  235: 'DataInsertRoutes',
  236: 'DataInsertFlags',
  237: 'DataSaveTimestamp',
  238: 'DataNewPlaylistTrack',
  239: 'DataPlaylistTrackName',
  241: 'DataArrangementName',
} as const

export type FLPEventTypeId = keyof typeof FLPEventTypeRaw
export type FLPEventTypeName = typeof FLPEventTypeRaw[keyof typeof FLPEventTypeRaw] | 'unknown'

export const FLPEventType = {
  ...FLPEventTypeRaw,
  byId: (id: number) => (FLPEventTypeRaw as Record<number, FLPEventTypeName>)[id] ?? 'unknown',
  byName: (name: string): number => {
    const ids = Object.keys(FLPEventTypeRaw) as unknown as FLPEventTypeId[]
    return ids.find((id) => FLPEventTypeRaw[id] === name) ?? -1
  }
}