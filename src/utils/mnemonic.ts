import crypto from 'crypto';
import { generateMnemonic, validateMnemonic } from 'bip39';

const genMnemonic = () => {
    return generateMnemonic();
}

const encryptMnemonic = (mnemonic: string, password: string) => {
   try {
     // Derive a 32-byte key from the password
     const key = crypto.createHash('sha256').update(password).digest();

     // Create a 16-byte initialization vector (IV)
     const iv = Buffer.alloc(16, 0); // All zeros
 
     // Create the cipher
     const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
 
     // Encrypt the mnemonic
     return cipher.update(mnemonic, 'utf8', 'hex') + cipher.final('hex');
   } catch (error) {
    return false;
   }
};

const decryptMnemonic = (encryptedMnemonic: string, password: string) => {
   try {
     // Derive a 32-byte key from the password
     const key = crypto.createHash('sha256').update(password).digest();

     // Create the same 16-byte initialization vector (IV) used for encryption
     const iv = Buffer.alloc(16, 0); // All zeros
 
     // Create the decipher
     const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
 
     // Decrypt the mnemonic
     const decrypted =  decipher.update(encryptedMnemonic, 'hex', 'utf8') + decipher.final('utf8');

     if(!validateMnemonic(decrypted)){
         return false;
     }
     return decrypted;
   } catch (error) {
    return false;
   }
};

export { encryptMnemonic, decryptMnemonic, genMnemonic };