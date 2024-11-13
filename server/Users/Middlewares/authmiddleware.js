const JWT = require("jsonwebtoken");
const { UserSchema } = require("../usersModel");
const requireSignin = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.SECRET_KEY
    );
   
  
   
    next();
  } catch (error) {
    res.status(404).send({
      success: false,
      massage: "token invalid",
    });
    console.log(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.SECRET_KEY
    );
    req.user = decode;
    const user = await UserSchema.findById(req.user._id)
    if(user.role !== 1){
      return res.status(404).send({
        success : false,
        message : "Authentication failed"
      })
    }
   
      
    
   
  
   
    next();
   
  } catch (error) {
    res.send({
      message: "khraab",
      error
    });
  }
};

module.exports = { requireSignin, isAdmin };
