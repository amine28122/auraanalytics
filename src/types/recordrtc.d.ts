declare module 'recordrtc' {
  export interface RecordRTCOptions {
    type?: string;
    recorderType?: any;
    sampleRate?: number;
    desiredSampRate?: number;
    numberOfAudioChannels?: number;
    mimeType?: string;
    disableLogs?: boolean;
  }

  export default class RecordRTC {
    constructor(stream: MediaStream, options?: RecordRTCOptions);
    startRecording(): void;
    stopRecording(onStop?: () => void): void;
    getBlob(): Blob;
    getDataURL(callback: (dataURL: string) => void, type?: string): void;
    destroy(): void;
    static StereoAudioRecorder: any;
  }
}