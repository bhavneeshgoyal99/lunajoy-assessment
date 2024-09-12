module.exports = (
    res,
    status,
    success,
    message = "",
    data = {},
) => {
    return res.status(status).send({
        status,
        success,
        message,
        data,
    });
};
