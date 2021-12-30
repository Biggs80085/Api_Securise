const jwt = require('jsonwebtoken')
const User = require('../models/User')


//Verifier si le user est connecté
const requireUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decodedToken) => {
            if (err) {
                res.redirect('/login')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}


//Verifier que le user est toujours connecté et récuperer son id
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', async(err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireUser, checkUser }