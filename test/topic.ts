import { expect } from 'chai';
import { Buffer } from 'safe-buffer';

import { TopicType } from '../src/topic';

describe('Topic', () => {

  it('tests the topic strings', () => {
    const topicStringTests = [
      { topic: Buffer.from([0x00, 0x00, 0x00, 0x00]), str: '0x00000000' },
      { topic: Buffer.from([0x00, 0x7f, 0x80, 0xff]), str: '0x007f80ff' },
      { topic: Buffer.from([0xff, 0x80, 0x7f, 0x00]), str: '0xff807f00' },
      { topic: Buffer.from([0xf2, 0x6e, 0x77, 0x79]), str: '0xf26e7779' },
    ];

    topicStringTests.forEach((test) => {
      let string = test.topic.toString('hex');
      string = '0x' + string; 
      expect(string).to.equal(test.str);
    })
  })
})