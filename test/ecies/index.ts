import { expect } from 'chai';
import secp256k1 from 'secp256k1';

import ECIES, { pk2id, id2pk, genPrivKey } from '../../src/ecies';

describe('ECIES', () => {
  it('encrypts and decrypts data', () => {
    const privKey = genPrivKey();
    const pubKey = secp256k1.publicKeyCreate(privKey, true);
    // console.log(pubKey.length);
    // console.log(pubKey.toString('hex'));
    const id = pk2id(pubKey);
    // console.log(id.toString('hex'));
    // console.log(id2pk(id).toString('hex'));
    // console.log(secp256k1.publicKeyConvert(id2pk(id), true).toString('hex'));
 
    const remotePrivKey = genPrivKey();
    const remotePubKey = secp256k1.publicKeyCreate(privKey, true);
    const remoteId = pk2id(remotePubKey);
 
    const ecies = new ECIES(privKey, remoteId);

    const data = genPrivKey();
    // console.log(data.toString('hex'));
    // console.log('\n')

    const encrypted = ecies._encryptMessage(data);
    // console.log(encrypted.toString('hex'));
    // console.log('\n');

    const ecies2 = new ECIES(remotePrivKey, id);
    const decrypted = ecies._decryptMessage(encrypted);
    // console.log(decrypted.toString('hex'));

    expect(decrypted.toString('hex')).to.equal(data.toString('hex'));
  })
})