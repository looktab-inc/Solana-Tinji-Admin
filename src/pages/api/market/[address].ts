import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

type Data = {
  address: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { address } = req.query
        console.log('/api/market/{address}')
        res.status(200).json({ address: address });
      })

export default handler

