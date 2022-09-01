import { createHash, scryptSync, randomBytes } from 'crypto';

////////////////////////////////////////////////////////////////////////////////////////////
// Generic use of a cryptographic hash function
function hash(input: string) {
  //   return createHash('sha256').update(input).digest(); // if wanna return Buffer type
  return createHash('sha256').update(input).digest('hex');
}

// console.log(hash('an input'));

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// Crytographic hashing with additional entropy from random salt generation and use of a more hardened hashing function (scrypt)
interface HashedPayload {
  salt: string;
  hashedPassword: string;
}

// hash password with salt
function saltedHash(password: string): HashedPayload {
  const salt = randomBytes(16).toString('hex'); // generate 16 random bytes, convert Buffer to hex string
  const hashed = scryptSync(password, salt, 64).toString('hex'); // 64 is the specified key length to generate
  // scrypt is more computationally difficult to crack

  return {
    salt,
    hashedPassword: hashed,
  };
}

// console.log(saltedHash('password123'));
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
/* HMAC (Hash-Based Message Authentication) - It is a hashing function that also requires a secret */
import { createHmac } from 'crypto';

const secret = 'secret-key';
// Hash-Based Message Authentication - This is a specific type of message authentication code (MAC) that involves a cryptographic hash function and a secret key.
// With any MAC, you may use it to verify both the data integrity and authenticity of a message
function hmac(message: string, secret: string) {
  const hmac = createHmac('sha256', secret).update(message).digest('hex');
  return hmac;
}

// console.log(hmac('hello there', secret));
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
/* Symmetric Encryption */
import { createCipheriv, createDecipheriv } from 'crypto';

function encryptMessage(input: string) {
  const key = randomBytes(32); // Generate random 32 bytes

  // This Initial Vector randomises the output when it is encrypted so that an identical sequence of text will never produce the same cipher text
  // This makes it more difficult for a hacker to break the encryption
  const iv = randomBytes(16); // generate initial vector of 16 random bytes. Initial Vector = prevents identical sequences of text

  // Create a cipher using an encryption algorithm (encryption algorithms are quite different from hashing algorithms)
  // We will use the Advanced Encryption Standard (AES)
  const cipher = createCipheriv('aes256', key, iv);

  // Encrypt the message
  const encrypted = cipher.update(input, 'utf8', 'hex') + cipher.final('hex');
  return {
    encrypted,
    key,
    iv,
  };
}

function decryptMessage(encrypted: string, key: Buffer, iv: Buffer) {
  const decipher = createDecipheriv('aes256', key, iv);
  const decrypted = decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf8');
  return decrypted;
}

// const { encrypted, key, iv } = encryptMessage('we attack at dawn!');
// console.log('encrypted:', encrypted);
// const decrypted = decryptMessage(encrypted, key, iv);
// console.log('decrypted:', decrypted);

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
/* Public Key Cryptography - Generating Public and Private Keys */
import { generateKeyPairSync } from 'crypto';

function generateKeys() {
  // We will use RSA crypto system (Rivest-Shamir-Adleman)
  // You can also define some settings
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // length of your key in bits
    publicKeyEncoding: {
      type: 'spki', // recommended to be 'spki' by Node.js docs
      format: 'pem', // privacy enhanced mail format
    },
    privateKeyEncoding: {
      type: 'pkcs8', // recommended to be 'pkcs8' by Node.js docs
      format: 'pem', // privacy enhanced mail format
      // could also add a passphrase to your key for added security,
      // cipher: 'aes-256-cbc',
      // passphrase: 'top secret',
    },
  });

  return { publicKey, privateKey };
}

const { publicKey, privateKey } = generateKeys();
console.log(publicKey);
console.log(privateKey);

///////////////////////////////////////////////////////////////////////////////////////////
/* Asymmetric Encryption */
import { publicEncrypt, privateDecrypt } from 'crypto';

const newMessage = 'this is a message payload';

const encrypted = publicEncrypt(publicKey, Buffer.from(newMessage));
const decrypted = privateDecrypt(privateKey, encrypted);

console.log('encrypted message (using public key):', encrypted);
console.log('decrypted (using private key):', decrypted.toString());

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
/* Signing (Digital Signatures) */
// Sender of a message will use their private key to sign a hash of the original message
// The private key guarantees authenticity and the hash guarantees that the message cant be tampered with because it would produce an entirely different signature
// The recipient can use the public key to validate the authenticity of the message
import { createSign, createVerify } from 'crypto';

const data = 'this data must be signed';

const signer = createSign('rsa-sha256'); // pass the algorithm that uses the RSA crypto system with sha256 hashing

signer.update(data);

// sign the message with private key
const signature = signer.sign(privateKey, 'hex');
// we now send the data along with the produced digital signature

/////////
// VERIFY (verify the data sent along with the signature)
const verifier = createVerify('rsa-sha256');
verifier.update(data);

// verify the signature with the users public key (if the signature was forgeed or the message changed then the verifier would fail)
const isVerified = verifier.verify(publicKey, signature, 'hex');
console.log('isVerified:', isVerified);

///////////////////////////////////////////////////////////////////////////////////////////

export {};
