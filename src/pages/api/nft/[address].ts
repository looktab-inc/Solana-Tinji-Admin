import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import db, { Sequelize } from "../../../../server/models";
import {Op} from "sequelize";
import SolanaHelper from "@/util/solana_helper";
import {NFT_STATUS} from "@/util/enums/generic_enum";

type ReturnResponse = {
  message?: string;
}

const handler =
  nextConnect()
    .patch(async ( req: NextApiRequest, res: NextApiResponse<ReturnResponse>) => {
      const {address} = req.query
      const { status, holder_address } = req.body

      if (!status || !holder_address) {
        return res.status(500).json({
          message: '필수 파라미터가 필요합니다.'
        })
      }

      const nft = await db.nfts.findOne({
        where: {
          nft_address: {
            [Op.eq]: address,
          },
          status: {
            [Op.eq]: NFT_STATUS.NONE,
          },
          holder_address: {
            [Op.eq]: holder_address,
          }
        },
      })

      if (!nft) {
        return res.status(500).json({
          message: '존재하지 않는 nft 입니다.'
        })
      }

      const campaign = await db.campaigns.findOne({
        where: {
          id: {
            [Op.eq]: nft.campaign_id,
          },
        },
        include: [
          {
            model: db.campaign_infos,
            as: "campaign_infos",
          },
        ],
      })

      const solanaHelper = new SolanaHelper()
      const nftByWeb3 = await solanaHelper.findNft(address)
      const {name, description, image, attributes} = nftByWeb3.json
      attributes.map(attribute => {
        if (attribute.trait_type === 'status') {
          attribute.value = status
        }
      })
      const uri = await solanaHelper.getOriginalUri(campaign.description, image, attributes)
      await solanaHelper.updateNft(campaign.title, uri, address as string)
        .then(async _ => {
          const response = await db.nfts.update(
            {
              status: status
            },
            {where: {id: nft.id}}
          )
          return res.status(200).json({})
        }).catch(_ => {
          return res.status(500).json({
            message: '실패.'
          })
        })
    })

export default handler
