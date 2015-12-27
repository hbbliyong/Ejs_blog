var express = require('express'),
  router = express.Router(),
  crypto=require('crypto'),//用来生成散列值来加密密码
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),

  User=mongoose.model('User');
  
module.exports = function (app) {
  app.use('/', router);
};



router.get('/', function (req, res) {
    res.render('index', {
      title: '主页', 
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()   
  });
});

router.get('/reg',checkNotLogin);

router.get('/reg', function (req, res) {
    res.render('reg', {
      title: '注册',  
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()    
  });
});

router.post('/reg',checkNotLogin);
router.post('/reg', function (req, res) {
    var name=req.body.name,
        password=req.body.password,
        password_re=req.body['password-repeat'];
   //检验用户两次输入的密码是否一致
   if(password_re!=password){
       req.flash('error','两次输入的密码不一致！');
      
       return res.redirect('/reg');//返回注册页
   }
   //生成密码的md5值
   var md5=crypto.createHash('md5'),
   password=md5.update(req.body.password).digest('hex');
   
   var newUser=new User({
       name:name,
       password:password,
       email:req.body.email
   }); 
   
   //检查用户名是否存在
   console.log(User.toString()+name);
    User.findOne({name:name},function(err,user){
        console.log(user);
        if(err){
            req.flash('error',err);
 
            return res.redirect('/');
        }
        if(user){
            req.flash('error','用户已存在！');
            console.log('用户已存在！');
            return res.redirect('/reg');//返回注册页
        }

        //如果不存在则新增用户
        newUser.save(function(err,user){
           if(err){
               req.flash('error',err);
                console.log('保存失败'+err);
               return res.redirect('/reg');//注册失败返回注册页
           } 
           req.session.user=user;
           req.flash('success','注册成功！');
            console.log('注册成功！');
           res.redirect('/');//注册成功后返回主页
        });
    }); 
});

router.get('/login',checkNotLogin);
router.get('/login', function (req, res) {
    res.render('login', {
      title: '登录',  
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()    
  });
});

router.post('/login',checkNotLogin);
router.post('/login', function (req, res) {
  //生成密码的md5
  var md5=crypto.createHash('md5'),
      password=md5.update(req.body.password).digest('hex');
  
  //检查用户是否存在
  User.findOne({name:req.body.name},function(err,user){
     if(!user){
         req.flash('error','用户不存在！');
         return req.redirect('/login');
     } 
     //检查密码是否一致
     if(user.password!=password){
         req.flash('error','密码错误！');
         return req.redirect('/login');
     }
     
     //登录成功，将用户信息存入session
     req.session.user=user;
     req.flash('success','登录成功！');
     res.redirect('/');
  });
  
});

router.get('/post',checkLogin);
router.get('/post', function (req, res) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

router.post('/post',checkLogin);
router.post('/post', function (req, res) {
  
});

router.get('/logout',checkLogin);
router.get('/logout', function (req, res) {
   req.session.user=null;
   req.flash('success','退出成功！');
   res.redirect('/');
});
/*
router.get('/', function (req, res) {
    res.render('index', {
      title: '主页',    
  });
});

router.get('/', function (req, res) {
    res.render('index', {
      title: '主页',    
  });
});
*/

//页面权限控制
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录！');
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录！');
        res.redirect('back');//返回之前的界面
    }
    next();
}