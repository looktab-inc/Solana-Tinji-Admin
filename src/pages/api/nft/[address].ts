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
        const {address} = req.query
        const { lat, lng } = req.body
        // 위치 기반 발급 및 리스트 전달

        res.status(200).json({

        });
      })


export default handler

