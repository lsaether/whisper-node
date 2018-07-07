import crypto, { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';

import { TopicType } from './topic';

import { WhisperParams } from './doc';

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
  keySym: string, //todo
  topic: TopicType,
  workTime: number,
  pow: number,
  payload: string,
  padding?: string,
}

//TODO
export interface SentMessage {
  raw: string;
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
export const newSentMessage = (params: MessageParams): any => {
  const payloadSizeFieldMaxSize = 4;
  const msg = { raw: null };
  msg.raw = '1' + '1' + '4' + params.payload.length.toString() + params.padding.length.toString() + '65' + '255';
  //todo
}

