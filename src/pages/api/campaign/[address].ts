import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
const logger = require('tracer').console();
const { Op } = require("sequelize");
import SolanaHelper from "@/pages/solana_helper";
import {NFT_STATUS} from "../../../../server/enums/generic_enum";

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
      const { title, description, lat, lng, distance, campaign_settings} = req.body

      const transaction = await db.sequelize.transaction()
      const centerLocation = { type: 'Point', coordinates: [lng, lat]}
      const boundary = makePolygon(lat, lng, distance)

      const store = await db.stores.findOne({
        where: {
          address: {
            [Op.eq]: address,
          },
        },
      })
      if (!store) {
        throw "Invalid address"
      }

      try {
        const campaign = await db.campaigns.create({
          title: title,
          store_address: address,
          description: description,
          distance: distance,
          location: centerLocation,
          boundary: boundary
        })

        const campaignSettingsDto = campaign_settings.map(campaign_setting => {
          return {
            campaign_id: campaign.id,
            nft_type: campaign_setting.nft_type,
            discount_type: campaign_setting.discount_type,
            discount_value:  campaign_setting.discount_value,
            image_url: campaign_setting.image_url,
            display_started_at: campaign_setting.display_started_at,
            display_ended_at: campaign_setting.display_ended_at,
          }
        })

        // 캠페인 정보 업데이트
        await db.campaign_infos.bulkCreate(campaignSettingsDto)

        await createNFT(
          campaign.id,
          title,
          description,
          campaignSettingsDto[0],
          address as string
        ).then(async _ => {
          await transaction.commit()
          res.status(200).json()
        }).catch(e => {
          throw "MakeNFTError"
        })
      } catch (e) {
        await transaction.rollback()
        logger.error(e.message)
        res.status(500).end()
      }
    })
export default handler

const createNFT = async (campaignId: number, title: string, description: string, campaignSetting: any, address: string) => {
  const solanaHelper = new SolanaHelper()
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const attributes = [
        { trait_type: 'store_address', value: address },
        { trait_type: 'status', value: 'none' },
        { trait_type: 'started_at', value: campaignSetting.display_started_at },
        { trait_type: 'ended_at', value: campaignSetting.display_ended_at },
        { trait_type: 'discountRate', value: campaignSetting.discount_type === 'rate'?  campaignSetting.discount_value : 0},
        { trait_type: 'discountAmount', value: campaignSetting.discount_type === 'amount'?  campaignSetting.discount_value : 0},
      ]
      const uri = await solanaHelper.getOriginalUri(description, campaignSetting.image_url, attributes)
      for (let i = 0; i < 2; i++) {
        const nft = await solanaHelper.createNft(
          `${title} ${i + 1}`,
          description,
          uri,
        )
        await db.nfts.create({
          campaign_id: campaignId,
          store_address: address,
          nft_address: nft.address.toString(),
          status: NFT_STATUS.NONE
        })
      }
      return resolve(true)
    } catch (e) {
      return reject(e)
    }
  });
}

const makePolygon = (lat: number, lng: number, distance: number) => {
  const locationValue = distance * 1000 * 0.00001;
  const points = [
    [lng + locationValue, lat + locationValue],
    [lng - locationValue, lat + locationValue],
    [lng - locationValue, lat - locationValue],
    [lng + locationValue, lat - locationValue],
    [lng + locationValue, lat + locationValue],
  ];
  console.log({ type: 'Polygon', coordinates: [points]})
  return { type: 'Polygon', coordinates: [points]};
}

