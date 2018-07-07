import { expect } from 'chai';

import { MessageParams } from '../src/message';

describe('Message', () => {

  const generateMessageParams = (): MessageParams => {
    return {
      pow: 0.01,
      workTime: 1,
      ttl: 60,
      payload: Buffer.alloc(12).toString('hex'),
      keySym: Buffer.alloc(32).toString('hex'),
      topic: Buffer.alloc(4).toString('hex'),
      src: Buffer.alloc(64).toString('hex'),
    }
  }

  it('single message test', async () => {
    const params = generateMessageParams();
    
  })

})