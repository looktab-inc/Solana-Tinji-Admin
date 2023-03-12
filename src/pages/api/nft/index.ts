import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db, { Sequelize } from "../../../../server/models";
import {Op} from "sequelize";
import SolanaHelper from "@/pages/solana_helper";
import {NFT_STATUS, NFT_TYPE} from "@/pages/enums/generic_enum";
import moment from "moment";

const handler =
  nextConnect()
    .patch(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        // 다이나믹 nft 업데이트 처리
        const now = moment()
        console.log()
        const whereQuery = db.sequelize.fn('date', db.sequelize.col('campaign_infos.display_started_at'))

        const campaigns = await db.campaigns.findAll({
          where: {
            display_started_at: {
              [Op.lte]: new Date()
            }
          },
          include: [
            {
              model: db.campaign_infos,
              as: "campaign_infos",
              where: {
                nft_type: {
                  [Op.eq]: NFT_TYPE.DYNAMIC,
                },
                $and: db.sequelize.where(whereQuery, now.format("YYYY-MM-DD")),
                completed_at: {
                  [Op.eq]: null
                }
              }
            },
            {
              model: db.nfts,
              as: "nfts",
              where: {
                holder_address: {
                  [Op.eq]: null,
                },
                status: {
                  [Op.eq]: null
                }
              }
            },
          ],
        })

        try{
          const response = await updateDynamicNft(campaigns)
          res.status(294).json({});
        } catch (e) {
          res.status(500).end()
        }
      })


export default handler

const updateDynamicNft = async (campaigns: any) => {
  const solanaHelper = new SolanaHelper()
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await Promise.all(
        campaigns.forEach(async campaign => {
          campaign.nfts.forEach(async nft => {
            const nftByWeb3 = await solanaHelper.findNft(nft.nft_address)
            const {name, description, image, attributes} = nftByWeb3.json
            attributes.map(attribute => {
              attribute.discount_type = campaign.campaign_infos.discount_type
              attribute.discount_rate = campaign.campaign_infos.discount_rate
              attribute.discount_amount = campaign.campaign_infos.discount_amount
              attribute.started_at = campaign.campaign_infos.discount_amount
              attribute.ended_at = campaign.campaign_infos.discount_type
            })
            const uri = await solanaHelper.getOriginalUri(campaign.description, campaign.campaign_infos.image_url, attributes)
            const response = await solanaHelper.updateNft(campaign.title, uri, nftByWeb3)
            const updateResult = await db.campaign_infos.update({
              complted_at: moment()
            }, {
              where: {id: campaign.campaign_infos.id}
            })
          })
        })
      ).then(_ =>{
        return resolve(true)
      })
    } catch (e) {
      return reject(e)
    }
  })
}

