import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../server/models";
import process from "process";
const logger = require('tracer').console();
const { Op } = require("sequelize");

type Data = {
  name: any
}

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 디비에서 정보 가져오기
        try {
          console.log(process.env.DB_USERNAME)
          const { market_address } = req.body
          const store = await db.stores.findOne({
            where: {
              address: {
                [Op.eq]: market_address,
              },
            },
          })

          if (!store) {
            await db.stores.create({
              address: market_address
            })
          }
          res.setHeader('Set-Cookie', [`address=${market_address}; path=/;`])
          res.status(200).json({});
        } catch (e) {
          res.status(500).json({})
        }
      })

export default handler

