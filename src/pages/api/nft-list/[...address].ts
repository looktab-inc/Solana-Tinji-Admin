import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

type Data = {
  name: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { address } = req.query
        console.log(address)
        res.status(200).json({ name: address });
      })

export default handler

