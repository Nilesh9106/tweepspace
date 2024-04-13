import { Config } from '@/config';
import { v2 as cloudinary, TransformationOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET
});

export const upload = async (base64: string, folder: 'profile' | 'tweep', id: string) => {
  try {
    let transformation: TransformationOptions | undefined = undefined;
    if (folder === 'profile') {
      transformation = [{ width: 500, height: 500, crop: 'scale' }];
    } else {
      transformation = [{ width: 1000, crop: 'scale' }];
    }
    let uploaded = await cloudinary.uploader.upload(base64, {
      public_id: id,
      folder: folder,
      overwrite: true,
      transformation: transformation
    });
    return uploaded;
  } catch (err) {
    console.log(err);
  }
};

export const deleteImage = async (imageUrl: string) => {
  try {
    let temp = imageUrl.split('/');
    let public_id = temp[temp.length - 2] + '/' + temp[temp.length - 1].split('.')[0];
    let deleted = await cloudinary.uploader.destroy(public_id);
    return deleted;
  } catch (err) {
    console.log(err);
  }
};
