import { Buffer as SafeBuffer } from "safe-buffer";

import { WhisperParams } from "./doc";
import { MessageParams, ReceivedMessage, SentMessage } from "./message";
import { TopicType } from "./topic";
import { keccak256 } from "./util";

/**
 * Envelope represents a clear-text data packet to transmit through the
 * Whisper network. Its contents may or may not be encrypted and signed.
 */
export default class Envelope {
  public expiry: number;
  public ttl: number;
  public topic: TopicType;
  public data: SafeBuffer;
  public nonce: number;

  public pow: number; // Message specific PoW as described in Whisper spec.

  public hash: SafeBuffer;
  public bloom: SafeBuffer;

  // Creates an Envelope which wraps a Whisper message with expiration
  // and destination data included for network forwading.
  constructor(ttl: number, topic: TopicType, msg: SentMessage) {
    this.expiry = Date.now() + ttl;
    this.ttl = ttl;
    this.topic = topic;
    this.data = msg.raw;
    this.nonce = 0;
  }

  public size(): number {
    return WhisperParams.envelopeHeaderLength + this.data.length;
  }

  public rlpWithoutNonce(): SafeBuffer {
    // todo
    return SafeBuffer.alloc(0);
  }

  // Seal closes the envelope by spending the requested amount of time
  // as a proof of work on hashing the data.
  public seal(options: MessageParams) {
    if (options.pow === 0) {
      return;
    }

    // todo
  }

  public getPoW(): number {
    if (this.pow === 0) {
      this.calculatePoW(0);
    }
    return this.pow;
  }

  public calculatePoW(diff: number) {
    const buf = SafeBuffer.alloc(64);
    const hash = keccak256(this.rlpWithoutNonce());

  }

  public getHash(): SafeBuffer {
    if (this.hash === SafeBuffer.alloc(0)) {
      const encoded = rlp.encodeToBytes(this);
      this.hash = keccak256(encoded);
    }
    return this.hash;
  }

  // todo
  public decodeRLP(s: any) {
    const raw = s.raw;

  }

  public openAsymmetric(privKey: SafeBuffer): ReceivedMessage {
    const message = { raw: this.data };
    message.decryptAsymmetric(privKey);
    return message;
  }

  public openSymmetric(key: SafeBuffer): ReceivedMessage {
    const message = { raw: this.data };
    message.decryptSymmetric(key);
    return message;
  }

}
