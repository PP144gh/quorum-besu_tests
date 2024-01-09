//const ethAddress = '0xE20b05f2994B1e375aA78cb9f035dbA684084a85';
//const ethPrivateKeyHex = '0xd426bfec344b25420553df2558d746b238d6e79a27fb156e77d93cac36ed7fc4';
const ethCrypto = require('eth-crypto');

// Replace this with the message you want to encrypt
const message = JSON.stringify({
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential'],
    credentialSubject: {
    degree: {
      type: 'BachelorDegree',
      name: 'Baccalauréat en musiques numériques'
    }
    }
  });

// Replace this with the Ethereum private key for decryption
const ethPrivateKeyHex = '0xd426bfec344b25420553df2558d746b238d6e79a27fb156e77d93cac36ed7fc4';

// Async main function to handle asynchronous operations
async function main() {
  // Generate the public key from the private key
  const publicKey = await ethCrypto.publicKeyByPrivateKey(ethPrivateKeyHex);

  // Encrypt the message using the public key
  const encryptedMessage = await ethCrypto.encryptWithPublicKey(publicKey, message);

  console.log('Original Message:', message);
  console.log('Encrypted Message:', encryptedMessage);

  // Decrypt the message using the Ethereum private key
  const decryptedMessage = await ethCrypto.decryptWithPrivateKey(ethPrivateKeyHex,encryptedMessage);

  console.log('Decrypted Message:', decryptedMessage);
}


// Run the async main function
main().catch((error) => console.error('Error:', error));
