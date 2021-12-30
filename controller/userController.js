const User = require('../models/User')
const jwt = require('jsonwebtoken')

//handle errors
const handleErrors = (err) => {

    let errors = { email: '', password: '' }
    if (err.code === 11000) {
        errors.email = "Cette email existe déjà"
        return errors
    }
    if (err.message === "user error" || err.message === "password error") {
        errors.email = "Email ou mot de passe incorrecte"
    }
    if (err.message === "password") {
        errors.password = "Mot de passe doit vérifier les conditions suivante: <br> 8-40 caractère <br> Commencer par une majuscule <br> Contenir au moins une lettre en minuscule et une chiffre "
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

//Creation de token
const createToken = (id) => {
    return jwt.sign({ id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
}


//Sign-in
module.exports.register_get = (req, res) => {
    req.cookies.jwt ? res.redirect('/') : res.render('register')

}
module.exports.register_post = async(req, res) => {
    const { email, password } = req.body
    const verifyPw = password.match(/((?=^[A-Z])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40})/)

    try {
        if (verifyPw) {
            const user = await User.create({ email, password })
            res.status(201).json({ user: user._id })
        } else {
            throw Error("password")
        }

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }


}

//Log-in
module.exports.login_get = (req, res) => {
    req.cookies.jwt ? res.redirect('/') : res.render('login')

}
module.exports.login_post = async(req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true })
        res.status(200).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }

}

module.exports.users_get = async(req, res) => {
    const users = await User.find();
    res.render('users', { users: users });
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}