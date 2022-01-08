
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3"); // 이거 쓰면 console.log 안찍힘
// const multerS3 = require("multer-s3-transform");
// const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

let upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME, // 버킷 이름
      contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
      acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
      key : function(req, file, cb) {
          cb(null, `${Date.now()}_${file.originalname}.jpg`);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

module.upload = multer(upload);