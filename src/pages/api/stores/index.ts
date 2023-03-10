import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models"
import {parse} from "cookie";
const logger = require('tracer').console();
const { Op } = require("sequelize");

type GetData = {
  name: string,
  address: string,
  description: string,
  location_address: string,
  open_time: any
}

const handler =
  nextConnect()
    .get(async ( req: NextApiRequest, res: NextApiResponse<GetData>) => {
      const store = await db.stores.findAll()
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
