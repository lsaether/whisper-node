import { expect } from 'chai';
import crypto, { randomBytes } from 'crypto';
import { Buffer as SafeBuffer } from 'safe-buffer';
import secp256k1 from 'secp256k1';

import { MessageParams, SentMessage } from '../src/message';
import { randBytes, toSafeBuffer, toUnsafeBuffer } from '../src/util';

const generateKey = (): SafeBuffer => {
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey))

  return toSafeBuffer(privKey);
}

const toPubKey = (privKey: SafeBuffer): SafeBuffer => {
  return toSafeBuffer(secp256k1.publicKeyCreate(toUnsafeBuffer(privKey)));
}

describe('Message', () => {

  const generateMessageParams = (): MessageParams => {
    return {
      pow: 0.01,
      workTime: 1,
      ttl: 60,
      payload: randBytes(12),
      keySym: randBytes(32),
      topic: randBytes(4),
      src: generateKey(),
    }
  }

  const singleMessageTest = (symmetric: boolean) => {
    const params = generateMessageParams();
    const key = generateKey();

    if (!symmetric) {
      params.keySym = SafeBuffer.alloc(0);
      params.dst = toPubKey(key);
    }

    const msg = new SentMessage(params);
    // const envelope = msg.wrap(params);
  }

  it('single message test', async () => {


  })

})