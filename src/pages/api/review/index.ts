import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const { store_address, user_address, comment, payment_amount } = req.body
        if (!(store_address && user_address)) {
          return res.status(500).json({
            message: 'need parameters, user_address, store_address'
          });
        }
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
            comment: comment,
            payment_amount: payment_amount
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

