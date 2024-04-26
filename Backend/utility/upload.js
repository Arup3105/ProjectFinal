const fs = require('fs');
const uploadOnCloudinary = require('../utility/cloudinary');
const MAX_RETRY_ATTEMPTS = 3;

const upload = async (file)=>{
    let fname = await uploadOnCloudinary(filepath);
    let retryCount = 0;

    while (fname === null && retryCount < MAX_RETRY_ATTEMPTS) {
        console.log(`Retry attempt ${retryCount + 1}`);
        fname = await uploadOnCloudinary(filepath);
        retryCount++;
      }
      if (fname === null) {
        fs.unlinkSync(filepath);
          return null;
      } else {
        fs.unlinkSync(filepath);
        return fname;
      }
}
module.exports=upload;