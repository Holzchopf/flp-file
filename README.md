This file was auto-generated with `zdoccer.js` 2.0.3

# Index

  - [@holzchopf/flp-file](#holzchopf-flp-file)
    - [`type FLPChunkType = 'FLhd' | 'FLdt'`](#type-flpchunktype-flhd-fldt)
    - [`abstract class FLPChunk`](#abstract-class-flpchunk)
      - [`type: FLPChunkType`](#type-flpchunktype)
      - [`abstract getBinary(): ArrayBuffer`](#abstract-getbinary-arraybuffer)
      - [`abstract setBinary(buffer: ArrayBuffer): void`](#abstract-setbinary-buffer-arraybuffer-void)
    - [`class FLPHeaderChunk extends FLPChunk`](#class-flpheaderchunk-extends-flpchunk)
      - [`format: number = -1`](#format-number-1)
      - [`get formatName()`](#get-formatname)
      - [`channelCnt: number = 0`](#channelcnt-number-0)
      - [`ppq: number = 96`](#ppq-number-96)
    - [`class FLPDataChunk extends FLPChunk`](#class-flpdatachunk-extends-flpchunk)
      - [`events: FLPEvent[] = []`](#events-flpevent)
    - [`type FLPEventTypeName = keyof typeof FLPEventTypeRaw`](#type-flpeventtypename-keyof-typeof-flpeventtyperaw)
    - [`type FLPEventTypeId = typeof FLPEventTypeRaw[FLPEventTypeName]`](#type-flpeventtypeid-typeof-flpeventtyperaw-flpeventtypename)
    - [`const FLPEventType =`](#const-flpeventtype)
      - [`name: (id: number): FLPEventTypeName | 'unknown' =>`](#name-id-number-flpeventtypename-unknown)
      - [`byName: (name: string): FLPEventTypeId | undefined =>`](#byname-name-string-flpeventtypeid-undefined)
    - [`type FLPDataType = 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float32' | 'binary' | 'ascii' | 'utf-16le'`](#type-flpdatatype-int8-int16-int32-uint8-uint16-uint32-float32-binary-ascii-utf-16le)
    - [`let FLPEventValueDataType: Partial<Record<FLPEventTypeName, FLPDataType>> =`](#let-flpeventvaluedatatype-partial-record-flpeventtypename-flpdatatype)
    - [`class FLPEvent`](#class-flpevent)
      - [`type: number`](#type-number)
      - [`get typeName()`](#get-typename)
      - [`value: number | string | ArrayBuffer`](#value-number-string-arraybuffer)
      - [`get maxByteLength()`](#get-maxbytelength)
      - [`getBinary(): ArrayBuffer`](#getbinary-arraybuffer)
      - [`setBinary(buffer: ArrayBuffer)`](#setbinary-buffer-arraybuffer)
      - [`static getValueDataType(type: number | FLPEventTypeName): FLPDataType`](#static-getvaluedatatype-type-number-flpeventtypename-flpdatatype)
    - [`type FLPFileFormatName = keyof typeof FLPFileFormatRaw`](#type-flpfileformatname-keyof-typeof-flpfileformatraw)
    - [`type FLPFileFormatId = typeof FLPFileFormatRaw[FLPFileFormatName]`](#type-flpfileformatid-typeof-flpfileformatraw-flpfileformatname)
    - [`const FLPFileFormat =`](#const-flpfileformat)
      - [`name: (id: number): FLPFileFormatName | 'unknown' =>`](#name-id-number-flpfileformatname-unknown)
      - [`byName: (name: string): FLPFileFormatId | undefined =>`](#byname-name-string-flpfileformatid-undefined)
    - [`class FLPFile`](#class-flpfile)
      - [`header: FLPHeaderChunk`](#header-flpheaderchunk)
      - [`data: FLPDataChunk`](#data-flpdatachunk)
      - [`getBinary(): ArrayBuffer`](#getbinary-arraybuffer--2)
      - [`setBinary(buffer: ArrayBuffer)`](#setbinary-buffer-arraybuffer--2)


---

*original Markdown from src/_preamble.md*

<div id="holzchopf-flp-file"></div><!-- alias: holzchopf-flp-file -->

# @holzchopf/flp-file

Allows to read and write FL Studio project and state files.

---

*transformed Javadoc from src/flp-chunk.ts*

<div id="type-flpchunktype-flhd-fldt"></div><!-- alias: flpchunktype -->

## `type FLPChunkType = 'FLhd' | 'FLdt'`


The chunks in an FLPFile have a 4-byte ASCII-string indicated type. These are those types.


<div id="abstract-class-flpchunk"></div><!-- alias: flpchunk -->

## `abstract class FLPChunk`


Class representing a chunk in an FLPFile.


<div id="type-flpchunktype"></div><!-- alias: type -->

### `type: FLPChunkType`


Type of this chunk.


<div id="abstract-getbinary-arraybuffer"></div><!-- alias: getbinary -->

### `abstract getBinary(): ArrayBuffer`


Creates the binary data for this chunk and returns it.


<div id="abstract-setbinary-buffer-arraybuffer-void"></div><!-- alias: setbinary -->

### `abstract setBinary(buffer: ArrayBuffer): void`


Sets this chunk's values from binary data.
- *param* `buffer` &mdash; Binary data.


<div id="class-flpheaderchunk-extends-flpchunk"></div><!-- alias: flpheaderchunk -->

## `class FLPHeaderChunk extends FLPChunk`


Specific class for the header chunk.


<div id="format-number-1"></div><!-- alias: format -->

### `format: number = -1`


Numeric file format identifier.


<div id="get-formatname"></div><!-- alias: get-formatname -->

### `get formatName()`


Name of file format.


<div id="channelcnt-number-0"></div><!-- alias: channelcnt -->

### `channelCnt: number = 0`


Number of channels.


<div id="ppq-number-96"></div><!-- alias: ppq -->

### `ppq: number = 96`


Project PPQ.


<div id="class-flpdatachunk-extends-flpchunk"></div><!-- alias: flpdatachunk -->

## `class FLPDataChunk extends FLPChunk`


Specific class for the data chunk.


<div id="events-flpevent"></div><!-- alias: events -->

### `events: FLPEvent[] = []`


FLPEvents in this chunk.




---

*transformed Javadoc from src/flp-event-type.ts*

<div id="type-flpeventtypename-keyof-typeof-flpeventtyperaw"></div><!-- alias: flpeventtypename -->

## `type FLPEventTypeName = keyof typeof FLPEventTypeRaw`


Known event names.


<div id="type-flpeventtypeid-typeof-flpeventtyperaw-flpeventtypename"></div><!-- alias: flpeventtypeid -->

## `type FLPEventTypeId = typeof FLPEventTypeRaw[FLPEventTypeName]`


Known event IDs.


<div id="const-flpeventtype"></div><!-- alias: flpeventtype -->

## `const FLPEventType =`


Types of the events in an [FLPDataChunk **&#x1f875;**](#class-flpdatachunk-extends-flpchunk).


<div id="name-id-number-flpeventtypename-unknown"></div><!-- alias: name -->

### `name: (id: number): FLPEventTypeName | 'unknown' =>`


Returns the name of a given event ID, or `'unknown'`.
- *param* `id` &mdash; Event ID.


<div id="byname-name-string-flpeventtypeid-undefined"></div><!-- alias: byname -->

### `byName: (name: string): FLPEventTypeId | undefined =>`


Returns the ID for a given event name, or `undefined`
- *param* `name` &mdash; Event name.




---

*transformed Javadoc from src/flp-event.ts*

<div id="type-flpdatatype-int8-int16-int32-uint8-uint16-uint32-float32-binary-ascii-utf-16le"></div><!-- alias: flpdatatype -->

## `type FLPDataType = 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float32' | 'binary' | 'ascii' | 'utf-16le'`


Possible data types for event values.


<div id="let-flpeventvaluedatatype-partial-record-flpeventtypename-flpdatatype"></div><!-- alias: let-flpeventvaluedatatype -->

## `let FLPEventValueDataType: Partial<Record<FLPEventTypeName, FLPDataType>> =`


Data types for event's values. Falls back to `uint8` for event ids < 64, `uint16` for event ids < 128, `uint32` for event ids < 192, `utf-16le` for event ids < 210, `binary` otherwise.

This is *not* a `const` - you can add or overwrite types for events in your project.


<div id="class-flpevent"></div><!-- alias: flpevent -->

## `class FLPEvent`


Class for events.


<div id="type-number"></div><!-- alias: type -->

### `type: number`


Numeric [FLPEventType **&#x1f875;**](#const-flpeventtype).


<div id="get-typename"></div><!-- alias: get-typename -->

### `get typeName()`


Name of [FLPEventType **&#x1f875;**](#const-flpeventtype). Readonly.


<div id="value-number-string-arraybuffer"></div><!-- alias: value -->

### `value: number | string | ArrayBuffer`


Primitive representation of event data. Data type varies by event type.


<div id="get-maxbytelength"></div><!-- alias: get-maxbytelength -->

### `get maxByteLength()`


Returns the maximum allowed byte length depending on event type.


<div id="getbinary-arraybuffer"></div><!-- alias: getbinary -->

### `getBinary(): ArrayBuffer`


Creates the binary data for this event and returns it.


<div id="setbinary-buffer-arraybuffer"></div><!-- alias: setbinary -->

### `setBinary(buffer: ArrayBuffer)`


Sets this event's values from binary data.
- *param* `buffer` &mdash; Binary data.


<div id="static-getvaluedatatype-type-number-flpeventtypename-flpdatatype"></div><!-- alias: getvaluedatatype -->

### `static getValueDataType(type: number | FLPEventTypeName): FLPDataType`


Returns the expected data type for a given event type.
- *param* `type` &mdash; Event type.




---

*transformed Javadoc from src/flp-file-format.ts*

<div id="type-flpfileformatname-keyof-typeof-flpfileformatraw"></div><!-- alias: flpfileformatname -->

## `type FLPFileFormatName = keyof typeof FLPFileFormatRaw`


Known file format names.


<div id="type-flpfileformatid-typeof-flpfileformatraw-flpfileformatname"></div><!-- alias: flpfileformatid -->

## `type FLPFileFormatId = typeof FLPFileFormatRaw[FLPFileFormatName]`


Known file format IDs.


<div id="const-flpfileformat"></div><!-- alias: flpfileformat -->

## `const FLPFileFormat =`


Specific file formats of [FLPFile **&#x1f875;**](#class-flpfile)s.


<div id="name-id-number-flpfileformatname-unknown"></div><!-- alias: name -->

### `name: (id: number): FLPFileFormatName | 'unknown' =>`


Returns the name of a given file format ID, or `'unknown'`
- *param* `id` &mdash; File format ID.


<div id="byname-name-string-flpfileformatid-undefined"></div><!-- alias: byname -->

### `byName: (name: string): FLPFileFormatId | undefined =>`


Returns the ID for a given file format name, or `undefined`
- *param* `name` &mdash; File format name.




---

*transformed Javadoc from src/flp-file.ts*

<div id="class-flpfile"></div><!-- alias: flpfile -->

## `class FLPFile`


Class representing an FL Studio file, which might be a project file (.flp). But other FL Studio files, like state files (.fst) have the same format.

Every FLPFile consists of two chunks:
- A header chunk, containing file and global project information.
- A data chunk, containing event data.


<div id="header-flpheaderchunk"></div><!-- alias: header -->

### `header: FLPHeaderChunk`


Header chunk.


<div id="data-flpdatachunk"></div><!-- alias: data -->

### `data: FLPDataChunk`


Data chunk.


<div id="getbinary-arraybuffer--2"></div><!-- alias: getbinary -->

### `getBinary(): ArrayBuffer`


Creates the binary data for this file and returns it.


<div id="setbinary-buffer-arraybuffer--2"></div><!-- alias: setbinary -->

### `setBinary(buffer: ArrayBuffer)`


Sets this files's values from binary data.
- *param* `buffer` &mdash; Binary data.


