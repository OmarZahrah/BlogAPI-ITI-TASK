const crypto = require("crypto");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

let client;

function getClient() {
  if (!client) {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      throw new Error("IMAGEKIT_PRIVATE_KEY is not set");
    }
    client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
  }
  return client;
}

function safeFileName(originalname) {
  const unique = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  return `${unique}-${String(originalname).replace(/[^a-zA-Z0-9.-]/g, "_")}`;
}

async function uploadPostImage(file) {
  const fileName = safeFileName(file.originalname);
  const uploadable = await toFile(file.buffer, file.originalname);
  const response = await getClient().files.upload({
    file: uploadable,
    fileName,
    folder: "/blog-task",
  });
  if (!response.url) {
    throw new Error("ImageKit upload did not return a URL");
  }
  return response.url;
}

module.exports = { uploadPostImage };
