import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// ============================================================
// BOS ENCRYPTION MODULE — [RW-01] B.L.A.S.T. Protocol
// ============================================================
// AES-256-GCM application-level encryption for PII fields.
//
// Mandate: T.C.A. § 1340-03-07 — Tennessee Driver Education
// Compliance requires that `legal_name` and `permit_number`
// are encrypted at the application layer before any INSERT
// into `students_driver_ed`.
//
// Algorithm: AES-256-GCM
//   - 256-bit key (32-byte hex) from ENCRYPTION_KEY env var
//   - 96-bit random IV (12 bytes) generated per encryption call
//   - 128-bit authentication tag validates ciphertext integrity
//   - Output format: <iv_hex>:<tag_hex>:<ciphertext_hex>
//
// Reference: gemini.md § Architectural Invariants #5
// ============================================================

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;    // 96-bit IV — GCM standard
const TAG_LENGTH = 16;   // 128-bit auth tag

/**
 * Returns the 32-byte Buffer key from the ENCRYPTION_KEY environment variable.
 * Throws a clear architectural error if the key is missing or malformed.
 */
function getKey(): Buffer {
    const keyHex = process.env.ENCRYPTION_KEY;

    if (!keyHex) {
        throw new Error(
            '[BOS CRYPTO ERROR] ENCRYPTION_KEY is not defined in the environment. ' +
            'Generate a 32-byte hex key and add it to .env.local:\n' +
            '  ENCRYPTION_KEY=$(node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")\n' +
            'See gemini.md § Architectural Invariants #5.'
        );
    }

    const keyBuffer = Buffer.from(keyHex, 'hex');

    if (keyBuffer.length !== 32) {
        throw new Error(
            `[BOS CRYPTO ERROR] ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ` +
            `Got ${keyBuffer.length} bytes. Regenerate the key.`
        );
    }

    return keyBuffer;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * @param plaintext - The raw string to encrypt (e.g. legal name, permit number)
 * @returns A colon-delimited string: `<iv_hex>:<tag_hex>:<ciphertext_hex>`
 *
 * @example
 * const sealed = await encrypt('John Robert Smith');
 * // → "a3f2...b1:9e4c...d0:7b8a...e5"  (deterministically unique per call)
 */
export async function encrypt(plaintext: string): Promise<string> {
    const key = getKey();
    const iv = randomBytes(IV_LENGTH);

    const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // Format: iv:tag:ciphertext — all components needed for decryption
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a ciphertext string produced by `encrypt()`.
 * Verifies the GCM authentication tag — any tampering throws.
 *
 * @param sealed - The `<iv_hex>:<tag_hex>:<ciphertext_hex>` string from the DB
 * @returns The original plaintext string
 *
 * @throws If the authentication tag fails (tampered or corrupted data)
 */
export async function decrypt(sealed: string): Promise<string> {
    const key = getKey();
    const parts = sealed.split(':');

    if (parts.length !== 3) {
        throw new Error(
            '[BOS CRYPTO ERROR] Malformed ciphertext. Expected format: <iv>:<tag>:<ciphertext>. ' +
            'The record may be corrupted or was stored as plaintext (pre-encryption era).'
        );
    }

    const [ivHex, tagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return decrypted.toString('utf8');
}

/**
 * Returns true if a string looks like an encrypted BOS ciphertext.
 * Used to gracefully handle records that pre-date encryption rollout.
 *
 * @param value - The field value from the database
 */
export function isEncrypted(value: string): boolean {
    const parts = value.split(':');
    return parts.length === 3 && parts.every(p => /^[0-9a-f]+$/i.test(p));
}
