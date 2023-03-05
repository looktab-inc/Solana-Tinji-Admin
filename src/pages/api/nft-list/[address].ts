import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

type Data = {
  name?: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { lng, lat, address } = req.query

        res.status(200).json({});
      })

export default handler

