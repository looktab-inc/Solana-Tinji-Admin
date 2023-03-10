import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
import {Op} from "sequelize";

type Data = {
  name?: any
}

type GetDetail = {
  name: string,
  address: string,
  description: string,
  location_address: string,
  open_time: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<GetDetail>) => {
        const { address } = req.query
        const store = await db.stores.findOne({
          where: {
            address: {
              [Op.eq]: address,
            },
          },
        })
        if (store) {
          res.status(200).json({
            name: store.name,
            address: store.address,
            description: store.description,
            location_address: store.location_address,
            open_time: JSON.parse(store.open_time)
          });
        } else {
          res.status(500).end()
        }
      })

export default handler

