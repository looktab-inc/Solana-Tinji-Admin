import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db, { Sequelize } from "../../../../../server/models";
import {Op} from "sequelize";
import SolanaHelper from "@/util/solana_helper";
import {NFT_STATUS} from "@/util/enums/generic_enum";

type NFT = {
  nft_address: string;
  distance: any;
}
type NFTList = {
  list : Array<NFT>;
  count?: number;
  message?: string;
}

const handler =
  nextConnect()
    .post(
      async ( req: NextApiRequest, res: NextApiResponse) => {
        const {address} = req.query
        const { lat, lng } = req.body
        if (!(lat && lng)) {
          return res.status(500).json({
            message: 'need parameters, lat, lng'
          });
        }

        // 위치 기반 발급 및 리스트 전달
        const whereQuery = db.sequelize.fn('ST_Within',
            db.sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`),
            db.sequelize.literal('boundary'));
        const selectDistanceQuery = db.sequelize.fn('ST_DISTANCE_SPHERE',
          db.sequelize.literal('location'),
          db.sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`),)

        const campaigns = await db.campaigns.findAll({
          attributes: [
            'id', 'title', 'store_address', 'description', 'location', 'boundary',
            'display_started_at', 'display_ended_at',
            [selectDistanceQuery, 'distance_by_meter']
          ],
          where: {
            $and: db.sequelize.where(whereQuery, 1),
            display_started_at: {
              [Op.lte]: new Date()
            }
          },
          include: [
            {
              model: db.nfts,
              as: "nfts",
              where: {
                holder_address: {[Op.eq]: null}
              }
            },
            {
              model: db.nfts,
              as: "hasNfts",
              where: {
                holder_address: {[Op.eq]: address}
              },
              required: false,
            },
          ],
          order: [['display_ended_at', 'asc']],
          limit: 5
        })

        await transfer(campaigns, address as string).then(result => {
          res.status(200).json(result)
        }).catch(e => {
          res.status(500).json({
            message: "can't transfer!"
          })
        })
      })


export default handler

const transfer = async (campaigns: any, transferAddress: string) => {
  return new Promise<NFTList>(async (resolve, reject) => {
    const solanaHelper = new SolanaHelper()
    const transferNft: Array<NFT> = [];
    try {
      await Promise.all(campaigns.map(async campaign => {
        if (campaign.nfts.length > 0 && campaign.hasNfts.length === 0) {
          const mintNft = campaign.nfts[0]
          const mintAddress = mintNft.nft_address
          await solanaHelper.transfer(mintAddress, transferAddress)
            .then(async result => {
              if (result) {
                await db.nfts.update(
                  {
                    holder_address: transferAddress,
                    status: NFT_STATUS.NONE
                  },
                  {where: {id: mintNft.id}}
                )
                const distance = Number(campaign.get('distance_by_meter') / 1000)
                transferNft.push({
                  nft_address: mintAddress,
                  distance: distance.toFixed(2),
                })
              }
            })
        }
      })).then(_ => {
        return resolve({
          list: transferNft,
          count: transferNft.length
        })
      })
    } catch (e) {
      return reject(e)
    }
  })
}

const processingTransferNFT = () => {

}





