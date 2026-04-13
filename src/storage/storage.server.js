const ImageKit = require("@imagekit/nodejs");
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

const uploadFile = async (file) => {
  try {
    const res = await imageKit.files.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
    });
    return res;
  } catch (err) {
    console.log(err.response.data);
  }
};

module.exports = uploadFile;
