import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
import {Op} from "sequelize";

type Data = {
  name?: any
}

type GetDetail = {
  name: string;
  address: string;
  description: string;
  location_address: string;
  cover_url: string;
  open_time: any;
  location: any;
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
          return res.status(200).json({
            name: store.name,
            address: store.address,
            description: store.description,
            location_address: store.location_address,
            cover_url: store.cover_url,
            open_time: (store.open_time),
            location: store.location ? store.location : {lat : 0, lng: 0}
          });
        } else {
          return res.status(500).end()
        }
      })

export default handler

