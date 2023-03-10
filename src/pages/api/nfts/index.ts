import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

type NFT = {
  storeAddress: string,
  address: string,
}
type NFTList = {
  list : Array<NFT>,
}

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 다이나믹 nft 업데이트 처리


        res.status(200).json({

        });
      })


export default handler

