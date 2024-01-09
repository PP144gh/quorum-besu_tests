const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs-extra');

// Load the ABI and contract address
const contractJsonPath = path.resolve(__dirname, '../../','contracts','VCRegistry.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractAddress = '0xcd4e412ab9C6Df13323938F3dEd7CcCB69d8F01a';  // Replace with the actual contract address

const { besu } = require("../keys.js");
const host = besu.rpcnode.url;
const accountPrivateKey = besu.rpcnode.accountPrivateKey;

// Connect to the Ethereum node
const provider = new ethers.JsonRpcProvider(host);  // Replace with your Ethereum node endpoint

// Set up the signer with your private key
const privateKey = accountPrivateKey;  // Replace with your private key
const wallet = new ethers.Wallet(privateKey, provider);

// Create an instance of the contract
const vcRegistryContract = new ethers.Contract(contractAddress, contractAbi, wallet);

// VC data to be registered
const vcData = '{"@context":["https://www.w3.org/2018/credentials/v1"],"type":["VerifiableCredential"],"credentialSubject":{"degree":{"type":"BachelorDegree","name":"Baccalauréat en musiques numériques"}}}';

// Hash the VC data (you may use a suitable hash function)
const vcHash = ethers.id(vcData);

// Function to register VC
async function registerVC(vcHash, vcData) {
    try {
        // Call the registerVC function on the smart contract
        const transaction = await vcRegistryContract.registerVC(vcHash, vcData);

        // Wait for the transaction to be mined
        await transaction.wait();

        // Log the transaction result
        console.log('Transaction Hash:', transaction.hash);
        console.log('VC Registered Successfully!');

       
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to check VC status
async function getVCStatus(vcHash) {
    try {
        // Call the getVCStatus function on the smart contract
        const status = await vcRegistryContract.getVCStatus(vcHash);

        // Log the status
        console.log('VC Status:', status[0]);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Function to read VC data
async function getVCData(vcHash) {
    try {
        // Call the getVCData function on the smart contract
        const data = await vcRegistryContract.getVCData(vcHash);

        // Log the VC data
        console.log('VC Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function revokeVC(vcHash) {
    try {
        // Call the revokeVC function on the smart contract
        const transaction = await vcRegistryContract.revokeVC(vcHash);

        // Wait for the transaction to be mined
        await transaction.wait();

        // Log the transaction result
        console.log('Transaction Hash:', transaction.hash);
        console.log('VC Revoked Successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the functions
registerVC(vcHash, vcData);
 // After registration, call other functions with a delay

 setTimeout(() => {
    revokeVC(vcHash);
}, 10000); // Adjust the delay time as needed (in milliseconds)

setTimeout(() => {
    getVCStatus(vcHash);
    getVCData(vcHash);
}, 20000); // Adjust the delay time as needed (in milliseconds)
