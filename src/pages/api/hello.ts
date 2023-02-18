import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from '../../../server/models/index';

const web3 = require("@solana/web3.js");

type Data = {
  name: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<Data>) => {
              // TODO 이렇게 하면 됩니당
        const collections = await db.CollectionModel.findAll()
        let connection = new web3.Connection(web3.clusterApiUrl("testnet"), "confirmed");

        let slot = await connection.getSlot();
        console.log(slot)
        let block = await connection.getBlock(slot);
        console.log(block)

        res.status(200).json({ name: collections });
      })

export default handler

