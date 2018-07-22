import crypto, { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';
import rlp from 'rlp-encoding';


const ecdhX = (pubKey: Buffer, privKey: Buffer) => {
  return secp256k1.ecdhUnsafe(pubKey, privKey, true).slice(1);
}

// Ripped from https://github.com/ethereumjs/ethereumjs-devp2p/blob/630adf262c0c671ad7c6cf17bb0d5b4a89b76415/src/rlpx/ecies.js#L13
const concatKDF = (keyMaterial: any, keyLength: any): Buffer => {
  const SHA256BlockSize = 64;
  const reps = ((keyLength + 7) * 8) / (SHA256BlockSize * 8);

  const buffers = [];
  for (let counter = 0, tmp = Buffer.allocUnsafe(4); counter <= reps;) {
    counter += 1;
    tmp.writeInt32BE(counter, 0);
    buffers.push(crypto.createHash('sha256').update(tmp).update(keyMaterial).digest());
  }

  return Buffer.concat(buffers).slice(0, keyLength);
}

/** From Utils */

export const pk2id = (pk: Buffer): Buffer => {
  if (pk.length === 33) {
    pk = secp256k1.publicKeyConvert(pk, false);
  }
  return pk.slice(1);
}

export const id2pk= (id: Buffer): Buffer => {
  return Buffer.concat([Buffer.from([0x04]), id]);
}

export const genPrivKey = (): Buffer => {
  let privKey;
  do {
    privKey = randomBytes(32);
  } while (!secp256k1.privateKeyVerify(privKey));

  return privKey;
}

/** End from utils */

// Elliptic Curve Integrated Encryption Scheme
export default class ECIES {
  private _privateKey: Buffer;
  private _publicKey: Buffer;
  private _remotePublicKey: Buffer;

  constructor(privKey: Buffer, remoteId: Buffer) {
    this._privateKey = privKey;
    // this._publicKey = id2pk(id);
    this._remotePublicKey = id2pk(remoteId);

  }

  _encryptMessage(data: any, sharedMacData?: any): Buffer {
    const privateKey = genPrivKey();
    const x = ecdhX(this._remotePublicKey, privateKey);
    const key = concatKDF(x, 32);
    const ekey = key.slice(0, 16); // encryption key
    const mkey = crypto.createHash('sha256').update(key.slice(16, 32)).digest(); // MAC key

    // encrypt
    const IV = randomBytes(16);
    const cipher = crypto.createCipheriv('aes-128-ctr', ekey, IV);
    const encryptedData = cipher.update(data);
    const dataIV = Buffer.concat([IV, encryptedData]);

    // create tag
    if (!sharedMacData) {
      sharedMacData = Buffer.from([]);
    }
    const tag = crypto.createHmac('sha256', mkey).update(
      Buffer.concat([dataIV, sharedMacData])
    ).digest();

    const publicKey = secp256k1.publicKeyCreate(privateKey, false);
    
    return Buffer.concat([
      publicKey, dataIV, tag
    ]);
  }

  _decryptMessage(data: Buffer, sharedMacData?: any): Buffer {
    const correctHeader = data.slice(0, 1).equals(Buffer.from('04', 'hex'));
    if (!correctHeader) {
      throw `Wrong ECIES header (possible cause: EIP8 upgrade)`;
    }

    const publicKey = data.slice(0, 65);
    const dataIV = data.slice(65, -32);
    const tag = data.slice(-32);

    // derive keys
    const x = ecdhX(publicKey, this._privateKey);
    const key = concatKDF(x, 32);
    const ekey = key.slice(0, 16);
    const mkey = crypto.createHash('sha256').update(
      key.slice(16, 32)
    ).digest();

    // check the tag
    if (!sharedMacData) {
      sharedMacData = Buffer.from([]);
    }
    const _tag = crypto.createHmac('sha256', mkey).update(
      Buffer.concat([dataIV, sharedMacData])
    ).digest();

    const validTag = _tag.equals(tag);
    if (!validTag) {
      throw `Invalid tag.`;
    }

    // decrypt data
    const IV = dataIV.slice(0, 16);
    const encryptedData = dataIV.slice(16);
    const decipher = crypto.createDecipheriv(
      'aes-128-ctr', ekey, IV
    );

    return decipher.update(encryptedData);
  }
}