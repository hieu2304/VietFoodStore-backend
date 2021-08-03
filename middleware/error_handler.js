/**
 *
 * @description This function will be set when initiating app.
 * @define app.use(error404());
 */
 export function error404() {
    return function (req, res, next) {
        //res.sendError({code: 404});
        let err = new Error('404 - Not found');
        res.status(404).send(err.message);
        // next(err);
    };
}

/**
 *
 * @description This function will be set when initiating app.
 * @define app.use(errorHandler());
 */
export function errorHandler() {
    return function (err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        if (!err.statusCode) err.statusCode = 500; // Sets a generic server error status code if none is part of the err
        res.status(err.statusCode).send(err.message); // If shouldRedirect is not defined in our error, sends our original err data
    }
}