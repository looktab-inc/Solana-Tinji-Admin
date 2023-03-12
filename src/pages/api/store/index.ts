import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
import {parse} from "cookie";
const logger = require('tracer').console();
const { Op } = require("sequelize");

type Data = {
  address: any
}

type GetData = {
  name: string,
  address: string,
  description: string,
  location_address: string,
  open_time: any;
  location: any;
}

const handler =
  nextConnect()
    .get(async ( req: NextApiRequest, res: NextApiResponse<GetData>) => {
      const cookies = parse(req.headers.cookie || '')
      const address = cookies.address
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
          open_time: JSON.parse(store.open_time),
          location: store.location ? store.location : {lat : 0, lng: 0}
        });
      } else {
        res.status(500).end()
      }
    })
    .post(async ( req: NextApiRequest, res: NextApiResponse<void>) => {
      const {name, description, location_address, open_time, cover_url, lng, lat} = req.body
      const cookies = parse(req.headers.cookie || '')
      const address = cookies.address
      const location = { type: 'Point', coordinates: [lng, lat]}

      await db.stores.update(
        {
          name: name,
          description: description,
          location_address: location_address,
          open_time: JSON.stringify(open_time),
          cover_url: cover_url,
          location: location
        },
        {where: {address: address}}
      ).then(_ => {
        res.status(204).json()
      }).catch(err => {
        logger.debug(err)
        res.status(500).end()
      })
    })


export default handler
