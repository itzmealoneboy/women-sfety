class ApiResponse {
    constructor(statusCode, data, message = 'Success') {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.timestamp = new Date();
    }
}

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.timestamp = new Date();

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ApiResponse,
    ApiError
};