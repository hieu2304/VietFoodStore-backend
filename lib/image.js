cloudStorage = require('../util/cloudinary')
const knex = require('../util/knex')

const productUploader = function (image, dependentID, type, oldImageLink) {
    let streamUploader = function (image) {
        return new Promise(function (resolve, reject) {
            let stream = cloudStorage.cloudinary.uploader.upload_stream(
                function (error, result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            cloudStorage.streamifier.createReadStream(image.data).pipe(stream);
        });
    };

    async function upload(image) {
        let result = await streamUploader(image);
        if (type === 'insert') {
            await knex('product_images').insert({
                prod_img_product_id: dependentID,
                prod_img_data: result.url
            })
        }
        else if (type === 'update') {
            await knex('product_images')
                .where('data', oldImageLink)
                .update({
                    prod_img_data: result.url
                })
        }
    }

    upload(image);
}

const avatarUploader = async (image, accId, type, oldImageLink) => {
    let result = await new Promise((resolve, reject) => {
        let stream = cloudStorage.cloudinary.uploader.upload_stream(
            function (error, result) {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        )
        cloudStorage.streamifier.createReadStream(image.data).pipe(stream);
    })
    
    if (type === 'insert') {
        await knex('account')
            .where({ acc_id: accId })
            .update({ acc_avatar: result.url })
            
    }
    else if (type === 'update') {
        await knex('accounts')
            .where({ acc_id: accId, acc_avatar: oldImageLink })
            .update({ acc_avatar: result.url })
    } else { }
}



const deleteImage = (image) => {
    //seperate image url to a single string of iamge name
    image = image.split('/')
    image = image[image.length - 1].split(".")
    image = image[0]
    //delete image on cloud
    cloudStorage.cloudinary.api.delete_resources([image, ''], (error, result) => { });
}

const getImage = (images) => {
    return images.image
}

const getImageLength = (images) => {
    if(images == null){
        return 0
    }
    if (images.image.length === undefined) {// number of uploaded image is 1
        return 1;
    }
    else {
        var count = 0;
        for (let i = 0; i < images.image.length; i++) {
            count++;
        }
        return count;
    }
}

module.exports = {
    avatarUploader,
    deleteImage,
    getImage,
    getImageLength,
    productUploader
}