import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
const logger = require('tracer').console();

type Data = {
  name: any
}

const handler =
  nextConnect()
    .put(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 쿠기 정보 삭제
        try {
          res.setHeader('Set-Cookie', [`address=; path=/; expires=-1;`])
          res.status(200).json({});
        } catch (e) {
          res.status(500).json({})
        }
      })

export default handler

