const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('../models/user');
const {generateQrCode} = require('../functions')

// async function requireAuth(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) res.status(401).send('Access denied no valid token provided');
//     req.user = await User.getByToken(token);
//     if (!req.user) res.status(401).send('Access denied no valid token provided');
//     next();
//     // if (!token) res.status(401).send('Access denied no token provided');
//     // try {
//     // } catch(ex) {
//     //     res.status(400).send('token is not valid')
//     // }
// }
function requireAuth(userType = 'business') {
    return async (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) res.status(401).send('Access denied no valid token provided');
        req.user = await User.getByToken(token);
        if (!req.user) res.status(401).send('Access denied no valid token provided');
        // console.log(req.user);
        if (userType === 'admin') {
            if (req.user.toObject().userType !== 'admin') {
                return res.status(401).send('Access denied not allowed');
            }
        }
        next();
        // if (!token) res.status(401).send('Access denied no token provided');
        // try {
        // } catch(ex) {
        //     res.status(400).send('token is not valid')
        // }
    }
}


module.exports.requireAuth = requireAuth;