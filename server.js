const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const cookieParser = require('cookie-parser')
const { checkUser } = require('./middleware/userMiddleware')



// Connect DB
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())


//Templates
app.set('view engine', 'ejs')

//Routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('index'))
app.use(routes)


app.listen(8000, () => {
    console.log("http://localhost:8000")
})