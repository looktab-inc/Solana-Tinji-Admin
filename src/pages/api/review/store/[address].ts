import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

type Review = {
  store_address: string;
  reviewer_address: string;
  comment?: any;
}
type ReviewList = {
  list : Array<Review>,
}


const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<ReviewList>) => {
        const { address } = req.query
        const store = await db.stores.findOne({
          where: {
            address: {
              [Op.eq]: address,
            },
          },
        })
        if (!store) {
          return res.status(500).end()
        }

        const payments = await db.payments.findAll({
          where: {
            store_address: {
              [Op.eq]: address,
            },
          },
          include: [
            {
              model: db.review,
              as: "review",
              required: false,
            },
          ],
          order: [['id', 'desc']]
        })
        const paymentList = payments.map(payment => {
          return {
            reviewer_address: payment.holder_address,
            store_address: payment.store_address,
            comment: (payment.review?.comment) || ""
          }
        })
        return res.status(200).json({
          list : paymentList
        })
      })

export default handler

