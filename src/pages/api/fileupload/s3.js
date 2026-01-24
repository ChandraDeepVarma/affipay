import customId from "custom-id-new";
import sessionChecker from "@/lib/sessionPermission";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const endPointURL = "https://sin1.contabostorage.com";

const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
  const client = new S3Client({
    region,
    endpoint: endPointURL,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
  // Specify the bucket name explicitly in the key structure
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key, // Include bucket name in the path
    ACL: "public-read",
  });
  console.log("Put Object Response ", command);
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export default async function apiHandler(req, res) {
  const { method } = req;

  // if (!(await sessionChecker(req, "general"))) {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "Access Forbidden" });
  // }

  try {
    switch (method) {
      case "POST": {
        const { query } = req;

        if (!query.name) {
          return res
            .status(400)
            .json({ success: false, message: "Name parameter is required" });
        }

        const imageName =
          customId({ randomLength: 7, lowerCase: true }) + query.name;

        const s3Params = {
          region,
          bucket: bucketName,
          key: imageName,
        };

        const url = await createPresignedUrlWithClient(s3Params);

        return res.status(200).json({ success: true, name: imageName, url });
      }

      case "DELETE": {
        const { query } = req;

        if (!query.name) {
          return res
            .status(400)
            .json({ success: false, message: "Name parameter is required" });
        }

        const client = new S3Client({
          region,
          endpoint: endPointURL,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          forcePathStyle: true,
        });

        const command = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: query.name,
        });
        await client.send(command);

        return res.status(200).json({ success: true, err: null });
      }

      default:
        return res
          .status(405)
          .json({ success: false, message: `Method ${method} not allowed` });
    }
  } catch (err) {
    console.error("Error processing request:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request",
      err: err.message,
    });
  }
}
