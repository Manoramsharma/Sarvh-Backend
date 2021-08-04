const jwt = require('jsonwebtoken')


module.exports.isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    console.log("in else block");
    res.status(401).send("You must login first!");
  }
};



exports.requireSignin = (req, res, next) => {
  if(req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  }

  return res.status(400).json({message: "Authorization required"})

}


exports.userMiddleware = (req, res, next) =>{

}


exports.sellerMiddleware = (req, res, next) =>{
  
}

exports.adminMiddleware = (req, res, next) =>{

  if(req.user.role !== "admin"){
    return res.status(400).json({message: "Access Denied"})
  }

  next()
  
}