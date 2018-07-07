import crypto, { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';

import { Buffer as SafeBuffer } from 'safe-buffer';

import { TopicType } from './topic';

import { WhisperParams } from './doc';

// const r = randomBytes(32);
// secp256k1.privateKeyVerify(r);

// crypto.createCipheriv('aes-128-ctr', )

//TMP
type PrivateKey = SafeBuffer;
type PublicKey = SafeBuffer;

// MessageParams specifies the exact way a message should be 
// wrapped into an Envelope.
export interface MessageParams {
  ttl: number,
  src: PrivateKey, //todo
  dst?: PublicKey, //todo
  keySym: SafeBuffer, //todo
  topic: TopicType,
  workTime: number,
  pow: number,
  payload: SafeBuffer,
  padding?: SafeBuffer,
}

//TODO
export class SentMessage {
  raw: SafeBuffer;

  constructor(params: MessageParams) {
    const payloadSizeFieldMaxSize = 4;
    const rawBuf = SafeBuffer.alloc(1 + payloadSizeFieldMaxSize + params.payload.length + params.padding!.length + WhisperParams.signatureLength + WhisperParams.padSizeLimit);
    this.raw = rawBuf;
    this.addPayloadSizeField(params.payload);
    this.appendPadding(params);
  }

  addPayloadSizeField(payload: SafeBuffer) {
    const fieldSize = this.getSizeOfPayloadSizeField(payload);
    const field = SafeBuffer.alloc(4);

  }

  getSizeOfPayloadSizeField(payload: SafeBuffer): number {
    let size = 1;
    for (let i = payload.length; i >= 256; i /= 256) {
      size++;
    }
    return size;
  }

  appendPadding(params: MessageParams) {

  }
}

// Sent message represents a data packet to be received through
// the Whisper protocol and successfully decrypted.
export interface ReceivedMessage {
  raw: string,

  payload: string,
  padding?: string,
  signature?: string,
  salt: string,

  pow: number,
  sent: number,
  ttl: number,
  src: PublicKey,
  dst?: PublicKey,
  topic: TopicType,

  symKeyHash: string, //todo
  envelopeHash: string, //todo
}

export const isMessageSigned = (flags: number): boolean => {
  return (flags & WhisperParams.signatureFlag) !== 0;
}

export const isSymmetricEncryption = (msg: ReceivedMessage): boolean => {
  return msg.symKeyHash != null; //todo
}

export const isAsymmetricEncryption = (msg: ReceivedMessage): boolean => {
  return msg.dst != null; //tood
}

// NewSentMessage creates and initializes a non-sgined, non-encrypted
// Whisper message.
// export const newSentMessage = (params: MessageParams): any => {
//   const payloadSizeFieldMaxSize = 4;
//   const rawBuf = SafeBuffer.alloc(1 + payloadSizeFieldMaxSize + params.payload.length + params.padding!.length + WhisperParams.signatureLength + WhisperParams.padSizeLimit);
//   const msg = new SentMessage(rawBuf);
//   msg.addPayloadSizeField(params.payload);
// }

