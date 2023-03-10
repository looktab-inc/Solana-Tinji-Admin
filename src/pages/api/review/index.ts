import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const { store_address, user_address, comment } = req.body
        // 위치 기반 발급 및 리스트 전달

        await db.review.create({
          store_address: store_address,
          user_address: user_address,
          comment: comment
        }).then(_ => {
          res.status(200).json({})
        }).catch(_ => {
          res.status(500).json({})
        })
      })


export default handler

