'use strict';
import ErrorCode from '../lib/error_codes';

export default function response() {
    return function (req, res, next) {
        res.sendJson = function ({message, data, paging}) {
            let tmp = {
                status: 'success',
                message: message || 'success',
                data: data || {},
            };
            if (paging) {
                tmp.paging = paging || {};
            }
            res.statusCode = 200;
            res.json(tmp);
        };

        /**
         *
         * @param code
         * @param message
         * @param httpStatusCode
         * @param data
         * @param messFormat
         */
        res.sendError = function ({code, message, httpStatusCode, data, messFormat}) {
            if (!code) code = '400';
            message = message || ErrorCode[code];

            res.statusCode = httpStatusCode * 1 || 200;
            if (res.statusCode === 401) {
                res.setHeader("WWW-Authenticate", 'Bearer realm="Users", error="invalid_token"');
            }
            res.json({
                message: message,
                status: 'error',
                error_code: code,
                data: data
            });
        };

        next();
    }
}