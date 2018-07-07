import { randomBytes } from 'crypto';
import createKeccakHash from 'keccak';
import { Buffer as SafeBuffer } from 'safe-buffer';

// Since crypto package uses the nodejs Buffer type which is
// incompatible with the safe-buffer implementation we need
// this wrapper.
export const randBytes = (n: number): SafeBuffer => {
  const r = randomBytes(n);
  return toSafeBuffer(r);
}

export const keccak256 = (buf: SafeBuffer): SafeBuffer => {
  return createKeccakHash('keccak256').update(buf).digest();
}

export const toUnsafeBuffer = (buf: SafeBuffer): Buffer => {
  return Buffer.from(buf.toString('hex'), 'hex');
}

export const toSafeBuffer = (buf: Buffer): SafeBuffer => {
  return SafeBuffer.from(buf.toString('hex'), 'hex');
}

console.log(keccak256(SafeBuffer.from('hello world')))
console.log(createKeccakHash('keccak256').update(Buffer.from('hello world')).digest());
