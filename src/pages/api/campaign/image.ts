import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
const logger = require('tracer').console();
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import {parse} from "cookie";

const s3 = new S3Client({
  credentials: {
    accessKeyId: String(process.env.AWS_S3_ACCESS_KEY),
    secretAccessKey: String(process.env.AWS_S3_ACCESS_SECRET_KEY),
  },
  region:  process.env.AWS_S3_IMAGE_BUKET_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_IMAGE_BUKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, callback) => {
      const cookies = parse(req.headers.cookie || '')
      const address = cookies.address
      callback(null, `${address}/${Date.now().toString()}`);
    },
  }),
})

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})

apiRoute.post(upload.single("image"), async (req, res) => {
  const file = req.file;
  const fileLocation = (req as any).file?.location;

  res.status(200).json({
    image: fileLocation
  })
});

export default apiRoute

export const config = {
  api: {
    bodyParser: false,
  },
};
