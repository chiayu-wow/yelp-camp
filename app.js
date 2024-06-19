if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')
const campgroundRoute = require('./routes/campgrounds')
const reviewRoute = require('./routes/reviews')
const userRoute = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User  = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
const secret = process.env.secret || 'thisismysecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))//define the query string's name
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    store,
    name : 'session__',
    secret,
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    }
}))
//use flash middleware
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy : false}))

//for passport config
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) =>{
    //In each request, each view page can get user data from session
    res.locals.CurrentUser = req.user
    res.returnTo = req.session.returnTo
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

//for routing
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)
app.use('/',userRoute)
main()
    .then(()=>{
        console.log("connected");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl); // use the movieApp database
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.get('/home',(req, res)=>{
    res.render('campground/home')
})

app.all('*',(req, res, next)=>{
    next(new ExpressError('page not found', 404))
})


app.use((err,req,res,next)=>{
    const {status =500} = err
    if(!err.message){
        err.message  = "oh no something went wrong"
    }
    res.status(status).render('error',{err})
})
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`listen on port ${port}`)
})