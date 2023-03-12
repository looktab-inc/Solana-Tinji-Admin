import type { NextApiRequest, NextApiResponse } from 'next'
import db from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

type Review = {
  store_address: string,
  reviewer_address: string,
  comment: string,
  payment_amount: number,
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

        const reviews = await db.review.findAll({
          where: {
            store_address: {
              [Op.eq]: address,
            },
          },
        })
        const reviewList = reviews.map(review => {
          return {
            reviewer_address: review.reviewer_address,
            store_address: review.store_address,
            comment: review.comment,
            payment_amount: review.payment_amount
          }
        })
        return res.status(200).json({
          list : reviewList
        })
      })

export default handler

