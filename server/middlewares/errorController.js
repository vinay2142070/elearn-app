

const errorController = (error, req, res, next) => {

    const status = res.status;
    res.status = status
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
    })
}

module.exports = errorController
