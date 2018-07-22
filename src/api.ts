import { WhisperParams } from "./doc";
import Whisper from "./whisper";

export interface IInfo {
  maxMessageSize: number;
  memory: number;
  messages: number;
  minPoW: number;
}

export default class PublicWhisperAPI {
  public whisper: Whisper;
  // Mapping keeps track of when an RPC request was last
  // used.
  public lastUsed: {};

  constructor(w: Whisper) {
    this.whisper = w;
  }

  public version(): string {
    return WhisperParams.protocolVersionString;
  }

  public info(): IInfo {
    const { stats } = this.whisper;
    return {
      maxMessageSize: this.whisper.maxMessageSize as number,
      memory: stats.memoryUsed,
      messages: this.whisper.messageQueue.length + this.whisper.p2pMsgQueue.length,
      minPoW: this.whisper.minPoW(),
    };
  }

  public setMaxMessageSize(size: number): boolean {
    return this.whisper.setMaxMessageSize(size);
  }

  public setMinPoW(pow: number): boolean {
    return this.whisper.setMinPoW(pow);
  }

  /* Sets the new bloom filter and notifies the peers. */
  public setBloomFilter(bloom: Buffer): boolean {
    return this.whisper.setBloomFilter(bloom);
  }

  public markTrustedPeer(enode: string): boolean {
    return true;
  }

  public newKeyPair(): Buffer {
    return this.whisper.newKeyPair();
  }
}