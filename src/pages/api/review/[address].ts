import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
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
              required: true,
            }
          ],
        })
        const reviewList = payments.map(payment => {
          return {
            payment_id: payment.id,
            reviewer_address: payment.holder_address,
            store_address: payment.store_address,
            store_name: payment.stores.name,
            payment_amount: payment.amount,
            comment: payment.review?.comment || "",
            isComplete: !!(payment.review)
          }
        })
        return res.status(200).json({
          list : reviewList
        })
      }
    )


export default handler

