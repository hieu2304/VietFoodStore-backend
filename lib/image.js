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
                prod_id: dependentID,
                data: result.url
            })
        }
        else if (type === 'update') {
            await knex('product_images')
                .where('data', oldImageLink)
                .update({
                    data: result.url
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
        await knex('accounts')
            .where({ id: accId })
            .update({ avatar: result.url })
            
    }
    else if (type === 'update') {
        await knex('account')
            .where({ id: accId, avatar: oldImageLink })
            .update({ avatar: result.url })
    } else { }
}



const deleteImage = (image) => {
    image = image.split('/')
    image = image[image.length - 1].split(".")
    image = image[0]
    cloudStorage.cloudinary.api.delete_resources([image, ''], (error, result) => { });
}

const getImage = (images) => {
    return images.image
}

const getImageLength = (images) => {
    if (images.length === undefined) {// number of uploaded image is 1
        return 1;
    }
    else {
        var count = 0;
        for (let i = 0; i < images.length; i++) {
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