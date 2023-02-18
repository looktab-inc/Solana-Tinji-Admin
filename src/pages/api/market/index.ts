import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

type Data = {
  address: any
}

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse<void>) => {
        const { market_address, name, description, location_address, open_time, images} = req.body

        res.status(200).json()
      })
    .patch(async ( req: NextApiRequest, res: NextApiResponse<void>) => {
      const { market_address } = req.body
      res.status(200).json()
    })

export default handler
