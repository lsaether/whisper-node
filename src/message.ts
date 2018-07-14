import crypto, { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';

import ECIES, { id2pk, pk2id } from './ecies';

// import { Buffer as SafeBuffer } from 'safe-buffer';

import { TopicType } from './topic';

import { WhisperParams } from './doc';
import Envelope from './envelope';

// const r = randomBytes(32);
// secp256k1.privateKeyVerify(r);

// crypto.createCipheriv('aes-128-ctr', )

//TMP
type PrivateKey = Buffer;
type PublicKey = Buffer;

// MessageParams specifies the exact way a message should be 
// wrapped into an Envelope.
export interface MessageParams {
  ttl: number,
  src: PrivateKey, //todo
  dst?: PublicKey, //todo
  keySym: Buffer, //todo
  topic: TopicType,
  workTime: number,
  pow: number,
  payload: Buffer,
  padding?: Buffer,
}

//TODO
export class SentMessage {
  raw: Buffer;

  constructor(params: MessageParams) {
    const payloadSizeFieldMaxSize = 4;
    const rawBuf = Buffer.alloc(1 + payloadSizeFieldMaxSize + params.payload.length + params.padding!.length + WhisperParams.signatureLength + WhisperParams.padSizeLimit);
    this.raw = rawBuf;
    this.addPayloadSizeField(params.payload);
    this.appendPadding(params);
  }

  addPayloadSizeField(payload: Buffer) {
    const fieldSize = this.getSizeOfPayloadSizeField(payload);
    const field = Buffer.alloc(4);

  }

  getSizeOfPayloadSizeField(payload: Buffer): number {
    let size = 1;
    for (let i = payload.length; i >= 256; i /= 256) {
      size++;
    }
    return size;
  }

  appendPadding(params: MessageParams) {}

  sign(key: Buffer) {}

  encryptAsymmetric(key: PublicKey) {
    if (!secp256k1.publicKeyVerify(key)) {
      throw `Invalid public provided.`;
    }


    // secp256k1.ecdh()
  }

  encryptSymmetric(key: Buffer) {}

  wrap(options: MessageParams): Envelope {
    if (options.ttl === 0) {
      options.ttl = WhisperParams.defaultTTL;
    }
    if (options.src) {
      this.sign(options.src);
    }
    if (options.dst) {
      this.encryptAsymmetric(options.dst);
    } else if (options.keySym) {
      this.encryptSymmetric(options.keySym);
    } else {
      throw `Unable to encrypt message. Neither an asymmetric key nor a symmetric key was provided.`;
    }

    const envelope = new Envelope(options.ttl, options.topic, this);
    envelope.seal(options);
    
    return envelope;
  }
}

// Sent message represents a data packet to be received through
// the Whisper protocol and successfully decrypted.
export class  ReceivedMessage {
  raw: Buffer;

  payload: string;
  padding?: string;
  signature?: string;
  salt: Buffer;

  pow: number;
  sent: number;
  ttl: number;
  src: PublicKey;
  dst?: PublicKey;
  topic: TopicType;

  symKeyHash: string; //todo
  envelopeHash: string; //todo

  decryptSymmetric(key: Buffer) {
    // symmetric messages are expected to contain the 12-byte
    // nonce at the end
    if (this.raw.length < WhisperParams.aesNonceLength) {
      throw `Missing salt or invalid payload in symmetric message.`;
    }

    let salt: Buffer;
    this.raw.copy(salt, 0, this.raw.length - WhisperParams.aesNonceLength);

    // const iv = '';
    const decipher = crypto.createDecipher('aes-256-gcm', key);
    const decrypted = decipher.update(Buffer.concat([salt, this.raw.slice(0, this.raw.length - WhisperParams.aesNonceLength)]));
    this.raw = decrypted;
    this.salt = salt;
  }
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
//   const rawBuf = Buffer.alloc(1 + payloadSizeFieldMaxSize + params.payload.length + params.padding!.length + WhisperParams.signatureLength + WhisperParams.padSizeLimit);
//   const msg = new SentMessage(rawBuf);
//   msg.addPayloadSizeField(params.payload);
// }

