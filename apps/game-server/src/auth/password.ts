import * as crypto from 'node:crypto';

const HASH_VERSION = 'v1';
const ARGON2_MEMORY_KIB = 64 * 1024;
const ARGON2_PASSES = 3;
const ARGON2_PARALLELISM = 1;
const ARGON2_TAG_LENGTH = 32;
const SCRYPT_KEY_LENGTH = 32;
const SCRYPT_COST = 1 << 15;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELISM = 1;

const { randomBytes, timingSafeEqual, scrypt } = crypto;
const argon2 = (
  crypto as typeof crypto & {
    argon2?: (
      algorithm: 'argon2id',
      options: {
        message: string;
        nonce: Uint8Array;
        memory: number;
        passes: number;
        parallelism: number;
        tagLength: number;
      },
      callback: (error: Error | null, digest: Buffer) => void,
    ) => void;
  }
).argon2;

function toBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('base64');
}

function fromBase64(value: string): Buffer {
  return Buffer.from(value, 'base64');
}

async function createArgon2Digest(password: string, nonce: Uint8Array): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    if (!argon2) {
      reject(new Error('argon2 is not available on this Node.js runtime'));
      return;
    }

    argon2(
      'argon2id',
      {
        message: password,
        nonce,
        memory: ARGON2_MEMORY_KIB,
        passes: ARGON2_PASSES,
        parallelism: ARGON2_PARALLELISM,
        tagLength: ARGON2_TAG_LENGTH,
      },
      (error, digest) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(Buffer.from(digest));
      },
    );
  });
}

async function createScryptDigest(password: string, nonce: Uint8Array): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      nonce,
      SCRYPT_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELISM,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(Buffer.from(derivedKey));
      },
    );
  });
}

function getPreferredAlgorithm(): 'argon2id' | 'scrypt' {
  return argon2 ? 'argon2id' : 'scrypt';
}

async function createDigestForAlgorithm(
  algorithm: 'argon2id' | 'scrypt',
  password: string,
  nonce: Uint8Array,
): Promise<Buffer> {
  if (algorithm === 'argon2id') {
    return createArgon2Digest(password, nonce);
  }

  return createScryptDigest(password, nonce);
}

export async function hashPassword(password: string): Promise<string> {
  const algorithm = getPreferredAlgorithm();
  const nonce = randomBytes(16);
  const hashBuffer = await createDigestForAlgorithm(algorithm, password, nonce);

  return [HASH_VERSION, algorithm, toBase64(nonce), toBase64(hashBuffer)].join('$');
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const parts = encodedHash.split('$');
  if (parts.length !== 4) {
    return false;
  }

  const [version, algorithm, nonceEncoded, digestEncoded] = parts;
  if (version !== HASH_VERSION || (algorithm !== 'argon2id' && algorithm !== 'scrypt')) {
    return false;
  }

  const nonce = fromBase64(nonceEncoded);
  const expectedDigest = fromBase64(digestEncoded);
  if (nonce.length === 0 || expectedDigest.length === 0) {
    return false;
  }

  const actualDigest = await createDigestForAlgorithm(algorithm, password, nonce);
  if (actualDigest.length !== expectedDigest.length) {
    return false;
  }

  return timingSafeEqual(actualDigest, expectedDigest);
}
