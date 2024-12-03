import { mnemonicToSeed } from "bip39";
import {HDNodeWallet, Wallet} from 'ethers';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';

const createEthWallet = async(mnemonic:string, index:number) => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${index}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed).derivePath(derivationPath);
    const privateKey = hdNode.privateKey;
    const wallet = new Wallet(privateKey);
    return wallet;
};

const createSolWallet = async(mnemonic:string, index:number) => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keyPair = Keypair.fromSecretKey(secret);
    return keyPair;
};

export { createEthWallet, createSolWallet };