const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const config = require('config');  

cloudinary.config({ 
  cloud_name: config.CLOUDINARY_CLOUD_NAME, 
  api_key: config.CLOUDINARY_API_KEY, 
  api_secret: config.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
   try {
    if(!localFilePath)return null;
    const response= await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
    console.log("uplodaded", response.url)
    return response;
   } catch (error) {
    fs.unlinkSync(localFilePath)
    return null;
   }
}


module.exports = uploadOnCloudinary;