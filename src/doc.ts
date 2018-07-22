/* tslint:disable */
export const WhisperParams = {
  protocolName: "shh",
  protocolVersion: 6,
  protocolVersionString: "6.0",

  // Whisper protocol message codes, according to EIP-627
  statusCode: 0,
  messagesCode: 1,
  powRequirementCode: 2,
  bloomFilterExCode: 3,
  p2pRequestCode: 126,
  p2pMessageCode: 127,
  numberOfMessagesCodes: 128,

  sizeMask: 0b11,
  signatureFlag: 0b100,

  topicLength: 4, // in bytes
  signatureLength: 65, // in bytes
  aesKeyLength: 32, // in bytes
  aesNonceLength: 12, // in bytes
  keyIDSize: 32, // in bytes
  bloomFilterSize: 64, // in bytes
  flagslength: 1,

  envelopeHeaderLength: 20,

  maxMessageSize: 10 * 1024 * 1024, // max acceptd size of message
  defaultMaxMessageSize: 1024 * 1024,
  defaultMinimumPoW: 0.2,

  padSizeLimit: 256,
  messageQueueLimit: 1024,

  expirationCycle: 1000, // second in ms
  transmissionCycle: 300, // 300 ms

  defaultTTL: 50, // seconds
  deafultSyncAllowance: 10, // seconds
};

export type unkownVersion = number;

export const unknownVersionError = (e: unkownVersion): string => {
  return `invalid envelope version ${e}`;
};

/**
 * MailServer represents a mail server, capable of
 * archiving the old messages for subsequent delivery
 * to the peers. Any implementation must ensure that both
 * functions are thread-safe. Also, they must return ASAP.
 * DeliverMail should use directMessagesCode for delivery,
 * in order to bypass the expiry checks.
 */
export interface IMailServer {
  archive: any; // TODO
  deliverMail: any; // TODO
}
