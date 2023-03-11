import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
const logger = require('tracer').console()

type Store = {
  name: string,
  address: string,
  description: string,
  location_address: string,
  open_time: any
}

type StoreList = {
  list: Array<Store>
}

const handler =
  nextConnect()
    .get(async ( req: NextApiRequest, res: NextApiResponse<StoreList>) => {
      try {
        const stores = await db.stores.findAll()
        const storeList = stores.map(store => {
          return {
            name: store.name,
            address: store.address,
            description: store.description,
            location_address: store.location_address,
            open_time: JSON.parse(store.open_time)
          }
        })
        res.status(200).json({list: storeList});
      } catch (e) {
        res.status(500).end()
      }
    })


export default handler
