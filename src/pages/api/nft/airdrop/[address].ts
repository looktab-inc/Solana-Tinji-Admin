import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db, { Sequelize } from "../../../../../server/models";
import {Op} from "sequelize";
import SolanaHelper from "@/pages/solana_helper";
import {NFT_STATUS} from "@/pages/enums/generic_enum";

type NFT = {
  nft_address: string,
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
        const campaigns = await db.campaigns.findAll({
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
                transferNft.push({
                  nft_address: mintAddress
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





