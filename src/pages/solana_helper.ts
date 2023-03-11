import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
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
      bs58.decode(`${process.env.SECRET_KEY}`),
    );
    this.publickKey = new PublicKey(`${process.env.PUBLIC_KET}`);
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
}

export default SolanaHelper
