import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
const logger = require('tracer').console();
import {parse} from "cookie";

const web3 = require("@solana/web3.js");

type Data = {
  name: any
}

const handler =
  nextConnect()
    .get(
      async ( req: NextApiRequest, res: NextApiResponse<Data>) => {
        logger.info('test')
        const cookies = parse(req.headers.cookie || '')
        const address = cookies.address
        logger.info(address)
        res.status(200).json({ name: 'test' });
      })

export default handler

