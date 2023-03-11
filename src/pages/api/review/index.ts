import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const { store_address, user_address, comment } = req.body
        const store = await db.stores.findOne({
          where: {
            address: {
              [Op.eq]: store_address,
            },
          },
        })

        if (store) {
          await db.review.create({
            store_address: store_address,
            reviewer_address: user_address,
            comment: comment
          }).then(_ => {
            res.status(200).json({})
          }).catch(_ => {
            res.status(500).json({})
          })
        } else {
          res.status(500).json({error: 'not found store address'})
        }
      })


export default handler

