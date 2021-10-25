const { User } = require("./../models");
const catchAsyncFunc = require("./../utils/catchAsyncFuncs");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const handshakeToken = (user, statusCode, res) => {
  const token = signtoken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  user.user_password = undefined;
  // res.cookie('sessionid', token, cookieOptions);
  res.status(statusCode).send({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsyncFunc(async (req, res, next) => {
  const user = await User.create(req.body);

  if (user) {
    handshakeToken(user, 200, res);
  }
});
exports.login = catchAsyncFunc(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (user && user.validPassword(req.body.user_password)) {
    handshakeToken(user, 200, res);
  }
});

//@route    auth.protect
//@desc     api authorisation
//@access   Public

exports.protect = catchAsyncFunc(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie) {
    token = getCookie("sessionid");
  }

  if (!token || token == undefined || token == null) {
    return next(
      new AppError("You are not logged in, Please login to get access", 401)
    );
  }

  const decodedtoken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exist
  const currentUser = await User.findByPk(decodedtoken.id);
  if (!currentUser) {
    return new AppError(
      "User no longer exists, Please signup and get new token",
      401
    );
  }

  // if (currentUser.passwordChanged(decodedtoken.iat)) {
  //   return new AppError("Password changed, Please login again", 401);
  // }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return new AppError("You are not allowed to perform this action", 403);
    }
    next();
  };
};
