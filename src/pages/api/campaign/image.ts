const logger = require('tracer').console();
import {apiRoute, upload} from "@/pages/s3Config";


apiRoute.post(upload.single("image"), async (req, res) => {
  const file = req.file;
  const fileLocation = (req as any).file?.location;

  res.status(200).json({
    image: fileLocation
  })
});

export default apiRoute
