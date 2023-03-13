import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db, { Sequelize } from "../../../../server/models";
import {Op} from "sequelize";
import SolanaHelper from "@/util/solana_helper";
import moment from "moment";
import {NFT_STATUS, NFT_TYPE} from "@/util/enums/generic_enum";

const handler =
  nextConnect()
    .patch(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const {nft_address} = req.body

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
                status: {
                  [Op.ne]: NFT_STATUS.USED
                }
              },
            },
            {
              model: db.stores,
              as: "stores",
              required: true
            },
          ],
        })

        try{
          await updateDynamicNft(campaigns).then(response => {
            console.log(response)
            res.status(200).json({});
          }).catch(e => {
            console.log(e)
            res.status(500).end()
          })
        } catch (e) {
          console.log(e)
          res.status(500).end()
        }
      })


export default handler

const updateDynamicNft = async (campaigns: any) => {
  const functionArray = []
  campaigns.forEach(campaign => {
    functionArray.push(updateNftByCampaign(campaign.nfts, campaign))
  })

  return Promise.all(functionArray).then(response => {
    console.log(response)
    return true
  }).catch(e => {
    console.log(e)
    return false
  })
}

const updateNftByCampaign = async (nfts, campaign) => {
  const solanaHelper = new SolanaHelper()
  const functionArray = []
  nfts.forEach(nft => {
    functionArray.push(processingUpdateNFT(solanaHelper, nft, campaign))
  })
  return Promise.all(functionArray)
    .then(response => {
      console.log(response)
      return true
    }).catch(e => {
      console.log(e)
      return false
    })
}

const processingUpdateNFT = async (solanaHelper, nft, campaign) => {
  return new Promise<boolean>(async (resolve, reject) => {
    const nftByWeb3 = await solanaHelper.findNft(nft.nft_address)
    const {name, description, attributes} = nftByWeb3.json
    const campaignInfo = campaign.campaign_infos[0]
    const newAttributes = changeAttributes(campaign, nft.status, campaignInfo)
    const uri = await solanaHelper.getOriginalUri(description, campaignInfo.image_url, newAttributes)
    const response = await solanaHelper.updateNft(name, uri, nftByWeb3)
    const updateResult = await db.campaign_infos.update({
      completed_at: db.sequelize.literal('CURRENT_TIMESTAMP')
    }, {
      where: {id: campaignInfo.id}
    })

    if (updateResult) return resolve(true)
    else return reject(false)
  })
}

const changeAttributes = (campaign, nftStatus, campaignInfos) => {
  return [
    { trait_type: 'store_address', value: campaign.store_address },
    { trait_type: 'store_location_lat', value: campaign.location.lat },
    { trait_type: 'store_location_lng', value: campaign.location.lng },
    { trait_type: 'status', value: nftStatus },
    { trait_type: 'started_at', value: campaignInfos.display_started_at },
    { trait_type: 'ended_at', value: campaignInfos.display_ended_at },
    { trait_type: 'discount_type', value: campaignInfos.discount_type },
    { trait_type: 'discount_rate', value: campaignInfos.discount_type === 'rate'?  campaignInfos.discount_rate : 0},
    { trait_type: 'discount_amount', value: campaignInfos.discount_type === 'amount'?  campaignInfos.discount_amount : 0},
  ]
}
