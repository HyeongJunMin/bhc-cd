import { argon2, randomBytes } from 'node:crypto';

const HASH_VERSION = 'v1';
const ARGON2_MEMORY_KIB = 64 * 1024;
const ARGON2_PASSES = 3;
const ARGON2_PARALLELISM = 1;
const ARGON2_TAG_LENGTH = 32;

function toBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('base64');
}

export async function hashPassword(password: string): Promise<string> {
  const nonce = randomBytes(16);

  const hashBuffer = await new Promise<Buffer>((resolve, reject) => {
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
        resolve(digest);
      },
    );
  });

  return [HASH_VERSION, 'argon2id', toBase64(nonce), toBase64(hashBuffer)].join('$');
}
