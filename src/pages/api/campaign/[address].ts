import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db from "../../../../server/models";
const logger = require('tracer').console();
const { Op } = require("sequelize");
import SolanaHelper from "@/pages/solana_helper";
import {DISCOUNT_TYPE, NFT_STATUS, NFT_TYPE} from "@/pages/enums/generic_enum";

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

type Campaigns = {
  list: Array<Campaign>
}

type Campaign = {
  id: number,
  title: string,
  impress: string,
  dislike_count: number,
  like_count: number,
  used_count: number,
  none_count: number,
  nft_info: Array<NFTInfo>
}

type NFTInfo = {
  id: number,
  holder_address?: string,
  status?: string,
  time?: string,
}

const handler =
  nextConnect()
    .get(async ( req: NextApiRequest, res: NextApiResponse<Campaigns>) => {
      const {address} = req.query

      const campaigns = await db.campaigns.findAll({
        where: {
          store_address: {
            [Op.eq]: address,
          },
        },
        include: [
          {
            model: db.nfts,
            as: "nfts",
          },
        ],
        order: [['id', 'desc']],
      })

      let campaignList = []
      campaigns.forEach(campaign => {
        let dislikeCount = 0
        let likeCount = 0
        let usedCount = 0
        let noneCount = 0
        let nftList = []

        campaign.nfts.forEach(nft => {
          if (nft.status === NFT_STATUS.NONE) noneCount+= 1
          else if (nft.status === NFT_STATUS.LIKE) likeCount+=1
          else if (nft.status === NFT_STATUS.DISLIKE) dislikeCount+=1
          else if (nft.status === NFT_STATUS.USED) usedCount+=1

          if (nft.status) {
            nftList.push({
              id: nft.id,
              holder_address: nft.holder_address,
              status: nft.status,
              time: nft.updatedAt
            })
          }
        })

        campaignList.push({
          id: campaign.id,
          title: campaign.title,
          impress: `${dislikeCount + likeCount + usedCount + noneCount}/100`,
          dislike_count: dislikeCount,
          like_count: likeCount,
          used_count: usedCount,
          none_count: noneCount,
          nft_info: nftList
        })
      })
      res.status(200).json({
        list: campaignList
      })
    })
    .post(async ( req: NextApiRequest, res: NextApiResponse<void>) => {
      const {address} = req.query
      const { title, description, lat, lng, distance, display_started_at, display_ended_at, campaign_settings, nft_type} = req.body

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
          boundary: boundary,
          display_started_at: display_started_at,
          display_ended_at: display_ended_at
        })

        // TODO 다이나믹 nft 날짜 조정
        const campaignSettingsDto = getCampaignSettingsDto(nft_type, campaign_settings, campaign)

        // 캠페인 정보 업데이트
        await db.campaign_infos.bulkCreate(campaignSettingsDto)

        await createNFT(
          campaign.id,
          title,
          description,
          campaignSettingsDto[0],
          address as string,
          store.location
        ).then(async _ => {
          await transaction.commit()
          res.status(200).json()
        }).catch(e => {
          throw "MakeNFTError"
        })
      } catch (e) {
        await transaction.rollback()
        logger.error(e.message)
        return res.status(500).end()
      }
    })
export default handler

const createNFT = async (
  campaignId: number,
  title: string,
  description: string,
  campaignSetting: any,
  address: string,
  location: {
    lat: number,
    lng: number
  }
) => {
  const solanaHelper = new SolanaHelper()
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const attributes = [
        { trait_type: 'store_address', value: address },
        { trait_type: 'store_location_lat', value: location.lat },
        { trait_type: 'store_location_lng', value: location.lng },
        { trait_type: 'status', value: 'none' },
        { trait_type: 'started_at', value: campaignSetting.display_started_at },
        { trait_type: 'ended_at', value: campaignSetting.display_ended_at },
        { trait_type: 'discount_type', value: campaignSetting.discount_type },
        { trait_type: 'discount_rate', value: campaignSetting.discount_type === 'rate'?  campaignSetting.discount_value : 0},
        { trait_type: 'discount_amount', value: campaignSetting.discount_type === 'amount'?  campaignSetting.discount_value : 0},
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

const getCampaignSettingsDto = (nftType: string, campaign_settings: any, campaign: any) => {
  if (nftType === NFT_TYPE.STANDARD) {
    return campaign_settings.map(campaign_setting => {
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
  } else {
    let initialStartDate = new Date(campaign.display_started_at)
    let initialEndDate = null
    return campaign_settings.map(campaign_setting => {
      let startDate = new Date()
      let endDate = new Date()
      if (!initialEndDate) {
        startDate.setDate(initialStartDate.getDate())
        initialEndDate = new Date()
        initialEndDate.setDate(initialStartDate.getDate() + campaign_setting.days)
        endDate = initialEndDate
      } else {
        startDate.setDate(initialEndDate.getDate())
        endDate.setDate(initialEndDate.getDate() + campaign_setting.days)
      }

      return {
        campaign_id: campaign.id,
        nft_type: campaign_setting.nft_type,
        discount_type: campaign_setting.discount_type,
        discount_value:  campaign_setting.discount_type === DISCOUNT_TYPE.AMOUNT
          ? campaign_setting.discount_amount: campaign_setting.discount_rate,
        image_url: campaign_setting.image_url,
        display_started_at: startDate,
        display_ended_at: endDate,
      }
    })
  }
}

