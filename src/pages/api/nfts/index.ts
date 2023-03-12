import type { NextApiRequest, NextApiResponse } from 'next'
import db  from "../../../../server/models";
import nextConnect from 'next-connect'
import {Op} from "sequelize";

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 다이나믹 nft 업데이트 처리
        const now = new Date()
        const campaigns = await db.campaigns.findAll({
          where: {
            display_started_at: {
              [Op.lte]: now
            },
            display_ended_at: {
              [Op.gte]: now
            }
          },
          include: [
            {
              model: db.campaign_infos,
              as: "campaign_infos",
              where: {
                display_started_at: {
                  [Op.lte]: now
                },
                display_ended_at: {
                  [Op.gte]: now
                }
              }
            }
          ]
        })

        res.status(200).json({

        });
      })


export default handler

