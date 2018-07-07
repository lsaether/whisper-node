import { Buffer as SafeBuffer } from 'safe-buffer'; 

import { TopicType } from "./topic";
import { WhisperParams } from './doc';
import { SentMessage, MessageParams } from './message';
import { keccak256 } from './util';


/**
 * Envelope represents a clear-text data packet to transmit through the
 * Whisper network. Its contents may or may not be encrypted and signed.
 */
export default class Envelope {
  expiry: number;
  ttl: number;
  topic: TopicType;
  data: SafeBuffer;
  nonce: number;

  pow: number; // Message specific PoW as described in Whisper spec.

  hash: SafeBuffer;
  bloom: SafeBuffer;


  size(): number {
    return WhisperParams.envelopeHeaderLength + this.data.length;
  }

  rlpWithoutNonce(): SafeBuffer {
    //todo
    return SafeBuffer.alloc(0);
  }

  // Creates an Envelope which wraps a Whisper message with expiration
  // and destination data included for network forwading.
  constructor(ttl: number, topic: TopicType, msg: SentMessage) {
    this.expiry = Date.now() + ttl;
    this.ttl = ttl;
    this.topic = topic;
    this.data = msg.raw;
    this.nonce = 0;
  }

  // Seal closes the envelope by spending the requested amount of time
  // as a proof of work on hashing the data.
  seal(options: MessageParams) {
    if (options.pow === 0) {
      return;
    }

    //todo
  }

  getPoW(): number {
    if (this.pow === 0) {
      this.calculatePoW(0);
    }
    return this.pow;
  }

  calculatePoW(diff: number) {
    let buf = SafeBuffer.alloc(64);
    let hash = keccak256(this.rlpWithoutNonce());
    
  }

  getHash(): SafeBuffer {
    if (this.hash === SafeBuffer.alloc(0)) {
      const encoded = rlp.encodeToBytes(this);
      this.hash = keccak256(encoded);
    }
    return this.hash;
  }

}