import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  NftWithToken,
  MetaplexFile,
} from '@metaplex-foundation/js';
import bs58 from "bs58";

const symbol = 'SYMBOL';
const sellerFeeBasisPoints = 0;

class SolanaHelper{
  private user: Keypair;
  private publickKey: PublicKey;
  private connection: Connection
  private metaplex: Metaplex;

  constructor() {
    this.user = Keypair.fromSecretKey(
      bs58.decode(`${process.env.SECRET_KEY || process.env.NEXT_PUBLIC_SECRET_KEY}`),
    );
    this.publickKey = new PublicKey(`${process.env.PUBLIC_KEY || process.env.NEXT_PUBLIC_PUBLIC_KEY}`);
    this.connection = new Connection(clusterApiUrl('devnet'));
    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(this.user))
      .use(
        bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.devnet.solana.com',
          timeout: 60000,
        }),
      );
  }

  async createNft(tokenName: string, description: string, uri: string): Promise<NftWithToken> {
    const { nft } = await this.metaplex.nfts().create(
      {
        // @ts-ignore
        uri: uri,
        name: tokenName, //각 토큰 이름은 이걸로 형성됨
        sellerFeeBasisPoints: sellerFeeBasisPoints,
        symbol: symbol,
      },
      { commitment: 'finalized' },
    );

    console.log(`Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
    return nft;
  }

  async updateNft(tokenName: string, uri: string, nft: any) {
    // omit any fields to keep unchanged
    return await this.metaplex.nfts().update({
      nftOrSft: nft,
      name: tokenName, //각 토큰 이름은 이걸로 형성됨
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
    }).then(_ => {
      console.log(`Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);
      return true
    }).then(_ => {
      return false
    })
  }

  async findNft (mintAddress) {
    const mintAddressPublicKey = new PublicKey(mintAddress)
    const nft = await this.metaplex.nfts().findByMint({ mintAddress: mintAddressPublicKey});
    return nft
  }

  async getOriginalUri(description: string,  imageUri: string, attributes: any) {
    const { uri } = await this.metaplex.nfts().uploadMetadata({
      name: "Tinji coupons", //콜렉션 이름은 이걸로 형성됨
      description: description,
      image: imageUri, //변경가능
      symbol: 'SBL', //변경가능
      attributes: attributes,
    });
    return uri;
  }

  async transfer(mintAddress: string, transferAddress: string): Promise<boolean>{
    return new Promise<boolean>(async (resolve, reject) => {
      const mintAddressPublicKey = new PublicKey(mintAddress)
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: mintAddressPublicKey });
      return await this.metaplex.nfts().transfer({
        nftOrSft: nft,
        fromOwner: this.publickKey,
        toOwner: new PublicKey(transferAddress),
      }).then(_ => {
        return resolve(true)
      }).catch(_ => {
        return reject(false)
      })
    })
  }

  async makeVersionedTransaction(provider: any, payerAddress: string, amount: number) {
    const payerPublicKey = new PublicKey(payerAddress)
    let blockhash = await this.connection.getLatestBlockhash().then((res) => res.blockhash);
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: payerPublicKey,
        toPubkey: this.publickKey,
        lamports: LAMPORTS_PER_SOL * amount,
      }),
    ];

    const messageV0 = new TransactionMessage({
      payerKey: payerPublicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction =  new VersionedTransaction(messageV0);
    const { signature } = await provider.signAndSendTransaction(transaction);
    const { value } = await this.connection.getSignatureStatus(signature);
    return value?.confirmationStatus;
  }

  async getSignatureStatus (signature) {
    try {
      const { value } = await this.connection.getSignatureStatus(signature);
      return value?.confirmationStatus;
    } catch (error) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

}

export default SolanaHelper
