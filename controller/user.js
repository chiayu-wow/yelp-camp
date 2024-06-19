const User = require('../models/user');

module.exports.sendRegisterForm = (req, res)=>{
    res.render('user/register')
}

module.exports.register = async(req, res, next)=>{
    try{
        const {email , username,password} = req.body;
        const newUser = new User({username, email})
        const result = await User.register(newUser, password);
        req.login(result, function(err) {
            if (err) { return next(err); }
             req.flash('success', 'wow register successfully')
             res.redirect('/campgrounds') 
          });
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res)=>{
    res.render('user/login')
}

module.exports.Login = (req, res)=>{
    req.flash('success', 'welcome back')  
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}