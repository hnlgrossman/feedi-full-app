
module.exports = function (err, req, res, next) {
    if (err.message === 'invalid token') {
        res.status(400).send('token is not valid')
    }
    console.log(err.message);
    res.status(500).send('something failed.')
}