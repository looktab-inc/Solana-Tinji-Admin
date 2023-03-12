import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const { store_address, user_address, comment, payment_id } = req.body
        if (!(store_address && user_address && payment_id)) {
          return res.status(500).json({
            message: 'need parameters, user_address, store_address, payment_id'
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
            payment_id: payment_id
          }).then(_ => {
            res.status(200).json({})
          }).catch(_ => {
            res.status(500).json({})
          })
        } else {
          res.status(500).json({error: 'not found store address'})
        }
      })
    .get(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const { address } = req.query
        const payments = await db.payments.findAll({
          where: {
            holder_address : {
              [Op.eq]: address,
            },
          },
          include: [
            {
              model: db.review,
              as: "review",
              required: false,
            },
            {
              model: db.stores,
              as: "stores",
            }
          ],
        })
        const reviewList = payments.map(payment => {
          return {
            reviewer_address: payment.reviewer_address,
            store_address: payment.store_address,
            store_name: payment.stores.name,
            comment: payment?.review.comment,
            payment_amount: payment.amount,
            is_complete: payment?.review.id ? true: false,
          }
        })
        return res.status(200).json({
          list : reviewList
        })
      }
    )


export default handler

