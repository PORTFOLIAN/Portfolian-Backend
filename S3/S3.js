
const AWS = require("aws-sdk");
const multer = require("multer");
// const multerS3 = require("multer-s3"); // 이거 쓰면 console.log 안찍힘
const multerS3 = require("multer-s3-transform");
const path = require("path");
const sharp = require("sharp"); //새로 추가
// const awsLoadPath = path.join(__dirname, "../S3/awsconfig.json");s
// AWS.config.loadFromPath(awsLoadPath);
// let s3 = new AWS.S3();
// bucket: "portfolian-post-image", // 버킷 이름

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEYID,
  secretAccessKey: process.env.S3_PRIVATE_KEY,
  region: process.env.region

});

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: "portfolian-post-image", // 버킷 이름
      contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
      acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
      key: (req, file, cb) => {
          console.log(file);
          cb(null, file.originalname)
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

module.upload = multer(upload);