import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
import {parse} from "cookie";
const logger = require('tracer').console();
const { Op } = require("sequelize");

type PostResult = {
  message?: string;
}

type GetData = {
  name: string,
  address: string,
  description: string,
  location_address: string,
  open_time: any;
  location: any;
  cover_url: string;
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
          location: store.location ? store.location : {lat : 0, lng: 0},
          cover_url: store.cover_url,
        });
      } else {
        res.status(500).end()
      }
    })
    .post(async ( req: NextApiRequest, res: NextApiResponse<PostResult>) => {
      const {name, description, location_address, open_time, cover_url, lng, lat} = req.body
      const cookies = parse(req.headers.cookie || '')
      const address = cookies.address
      const location = { type: 'Point', coordinates: [lng, lat]}
      const store = await db.stores.findOne({
        where: {
          address: {
            [Op.eq]: address,
          },
        },
      })
      if (!store) {
        return res.status(404).json({
          message: "not found"
        })
      }

      try {
        store.name = name
        store.description = description
        store.location_address = location_address
        store.cover_url = cover_url
        store.location = location
        store.open_time = JSON.stringify(open_time)
        await store.save()

        res.status(200).json({})
      } catch (e) {
        console.log(e)
        res.status(500).json({
          message: '저장 실패'
        })
      }
    })


export default handler
