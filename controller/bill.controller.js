const Bill = require('../model/bill.model');
const asyncHandler = require('express-async-handler');
const validate = require("../lib/validate");
const jwtHelper = require('../lib/jwt');

/**
 * controller getDetailBill
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getDetails = asyncHandler(async function (req, res, next) {
    // {
    //     "billId": 10
    // }
    try {
        const { error, value } = validate.checkBillDetails(req.body);
        if (error) {
            res.status(422).json({
                message: 'Invalid request',
                data: req.body
            })
        } else {
            //get info bill
            const result_bill = await Bill.getBillById(req.body.billId);
            console.log(result_bill);
            if (result_bill.length === 0) {
                return res.status(404).json({
                    ListDetail: [],
                    statusCode: 1,
                })
            }
            var billMaster = result_bill[0];
            var listDetail = {
                billId: billMaster.id,
                accountID: billMaster.acc_id,
                totalPrice: "76000",
                billQuantity: 5,
                billStatus: billMaster.status == 0 ? 'delivering' : billMaster.status == 1 ? 'deliveried' : billMaster.status == 2 ? 'cancel' : '',
                priceShip: billMaster.price_ship,
                billAddress: billMaster.accdress,
                fullNameReceiver: billMaster.receiver_name,
                phoneNumberReceiver: billMaster.receiver_phone,
                noteReceiver: "",
                createDate: billMaster.create_date,
                expectedDate: billMaster.expected_date,
            }

            //get detail bill
            const result = await Bill.getDetails(req.body.billId);
            if (result.length === 0) {
                listDetail.billDetailList = [];
                listDetail.billQuantity = 0;
                listDetail.totalPrice = 0;
                return listDetail;
            } else {
                //sum price
                var sumPrice = 0;
                result.forEach(element => {
                    sumPrice += (element.prodprice || 0) * (parseInt(element.prodquantity) || 1);
                });
                listDetail.totalPrice = sumPrice;
                listDetail.billQuantity = result.length;
                listDetail.billDetailList = result;
            }
            return res.status(200).json({
                ListDetail: listDetail,
                statusCode: 0
            })
        }
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});

module.exports.getListBill = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    try {
        // get param billMaster.status == 0 ? 'delivering' : billMaster.status == 1 ? 'deliveried' : billMaster.status == 2 ? 'cancel' : '',
        const statusParams = req.query.status || req.params.status || 'all';
        var status = null;
        if (statusParams == 'delivered') {
            status = 1;
        }else if (statusParams == 'shipping') {
            status = 0;
        }else if (statusParams == 'cancel') {
            status = 2;
        }else {
            //get all
            status = null;
        }

        const result_bill = await Bill.getList(currentUser.accId, status);

        //get info bill
        
        if (result_bill.length === 0) {
            return res.status(404).json({
                ListDetail: [],
                statusCode: 1,
            })
        }

        var listBillResult = [];
        result_bill.map(async bill => {
            var billMaster = bill;
            var listDetail = {
                billId: billMaster.id,
                accountID: billMaster.acc_id,
                totalPrice: "76000",
                billQuantity: 5,
                billStatus: billMaster.status == 0 ? 'delivering' : billMaster.status == 1 ? 'deliveried' : billMaster.status == 2 ? 'cancel' : '',
                priceShip: billMaster.price_ship,
                billAddress: billMaster.accdress,
                fullNameReceiver: billMaster.receiver_name,
                phoneNumberReceiver: billMaster.receiver_phone,
                noteReceiver: "",
                createDate: billMaster.create_date,
                expectedDate: billMaster.expected_date,
            }

            //get detail bill
            var result = await Bill.getDetails(billMaster.id);
            if (result.length === 0) {
                listDetail.billDetailList = [];
                listDetail.billQuantity = 0;
                listDetail.totalPrice = 0;
            } else {
                //sum price
                var sumPrice = 0;
                result.forEach(element => {
                    sumPrice += (element.prodprice || 0) * (parseInt(element.prodquantity) || 1);
                });
                listDetail.totalPrice = sumPrice;
                listDetail.billQuantity = result.length;
                listDetail.billDetailList = result;
            }

            listBillResult.push(listDetail);
            if (listBillResult.length === result_bill.length) {
                //page and limit
                let { page, limit } = req.query;
                let paginationResult = [];
                if (page || limit) {
                    let startIndex = (parseInt(page) - 1) * parseInt(limit)
                    let endIndex = (parseInt(page) * parseInt(limit))
                    let totalPage = Math.floor(listBillResult.length / parseInt(limit))

                    if (listBillResult.length % parseInt(limit) !== 0) {
                        totalPage = totalPage + 1
                    }

                    paginationResult = listBillResult.slice(startIndex, endIndex);
                    return res.status(200).send({
                        totalPage,
                        paginationResult,
                        statusCode: 0
                    });
                }
                return res.status(200).send({
                    totalPage: listBillResult.length,
                    paginationResult: listBillResult,
                    statusCode: 0

                });
                
                // return res.status(200).json({
                //     listBillResult,
                //     statusCode: 0
                // })
            }
        })
    } catch (error) {
        res.send({ code: error.code, message: error.message || undefined });
    }
});

/**
 * controller get List Bill for Account
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getBill = asyncHandler(async function (req, res, next) {
    const id = req.query.id || req.params.id || 0;
    const result = await Bill.getList(id)
    if (result.length === 0) {
        return res.status(404).json({
            listBill: [],
            statusCode: 1
        })
    }
    return res.status(200).json({
        listBill: result,
        statusCode: 0
    })
});

module.exports.addBill = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    let date = new Date();
    try {
        //add bill
        let bill = {
            acc_id: currentUser.accId,
            create_date: new Date(),
            expected_date: date.addDays(2),
            price_ship: req.body.priceShip,
            status: 0,
            accdress: req.body.accAddress,
            receiver_name: req.body.receiverName,
            // receiver_note: req.body.receiverNote,
            receiver_phone: req.body.receiverNote
        };

        const result_bill = await Bill.add(bill);
        console.log(result_bill)
        console.log("ádasd")

        //add bill detail
        listProduct = req.body.listProduct;
        if (listProduct.length > 0) {
            listProduct.forEach(async element => {
                var bill_detail = {
                    bill_id: result_bill[0],
                    prod_id: element.prodId,
                    quantity: element.prodQuantity,
                };
                console.log(bill_detail)
                await Bill.addBillDetail(bill_detail);
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }

    res.json({
        message: 'Bill create success',
        statusCode: 0
    })
});

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports.cancelBill = asyncHandler(async function (req, res, next) {
    // {
    //     “billId”: 10
    // }
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    console.log(currentUser)
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    try {
        //add bill
        let bill = {
            update_date: new Date(),
            id: req.body.billId,
            status: 2
        };

        const result_bill = await Bill.cancelBill(bill);
        console.log(result_bill)

    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }

    res.json({
        message: 'Bill cancel success',
        statusCode: 0
    })
});

module.exports.updateStatus = asyncHandler(async function (req, res, next) {
    let currentUser = jwtHelper.decodeToken(req.headers["authorization"], process.env.SECRET_KEY);
    if (!currentUser) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    var status = 0;
    if (req.body.status == 'deliveried') {
        status = 1;
    } else if (req.body.status == 'cancel') {
        status = 2;
    } else {
        status = 0;
    }

    try {
        //add bill
        let bill = {
            update_date: new Date(),
            status
        };

        const result_bill = await Bill.updateStatusBill(bill, req.body.billId);
        console.log(result_bill)

    } catch (error) {
        return res.status(404).json({
            message: error,
            statusCode: 1
        })
    }

    res.json({
        message: 'Bill update status success',
        statusCode: 0
    })
});