import type { NextApiRequest, NextApiResponse } from 'next'
import db  from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 다이나믹 nft 업데이트 처리
        const { store_address, user_address, payment_amount } = req.body
        if (!(store_address && user_address && payment_amount)) {
          return res.status(500).json({
            message: 'need parameters, user_address, store_address, payment_amount'
          });
        }
        const store = await db.stores.findOne({
          where: {
            address: {
              [Op.eq]: store_address,
            },
          },
        })

        if (!store) {
          return res.status(500).end()
        }

        await db.payments.create({
          store_address: store_address,
          holder_address: user_address,
          amount: payment_amount
        });


        res.status(200).json({
          store_address: store_address,
          holder_address: user_address,
          payment_amount: payment_amount,
          store_name: store.name
        });
      })


export default handler

