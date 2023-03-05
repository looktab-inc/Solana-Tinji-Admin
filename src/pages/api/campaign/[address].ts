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
  open_time: any
}

const handler =
  nextConnect()
    .get(async ( req: NextApiRequest, res: NextApiResponse<GetData>) => {
      // 현재 위치 기반으로 가져와서 nft 보여주기? 주기?
    })
    .post(async ( req: NextApiRequest, res: NextApiResponse<void>) => {
      const {address} = req.query
      const {title, description, lng, lat, distance, display_started_at, display_ended_at, nft_type, nft_info, file} = req.body
      const centerLocation = { type: 'Point', coordinates: [lng, lat]};
      logger.info(req.body)

      const response = await db.campaigns.create({
        title: title,
        store_address: address,
        description: description,
        location: centerLocation,
        distance: distance,
        display_started_at: display_started_at,
        display_ended_at: display_ended_at,
      })

      //nft 생성 처리 및 저장

      res.status(204).json()

    })
export default handler
