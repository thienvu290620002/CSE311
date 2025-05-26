import db from "../models/index";
import UserService from "../services/UserService";

let getAllUser = async (req, res) => {
  try {
    const users = await db.User.findAll({
      // chỉ lấy role là user   // where: { roleId: "user" },
      attributes: { exclude: ["password"] }, // ẩn mật khẩu
    });

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      users: users,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Something went wrong",
    });
  }
};

// let createNewUser = async (req, res) => {
//   try {
//     let data = await UserService.createNewUser(req.body);
//     return res.status(200).json({
//       errCode: 0,
//       message: "User created successfully",
//     });
//   } catch (error) {
//     console.error(error); // Ghi lỗi để kiểm tra chi tiết
//     return res.status(500).json({
//       errCode: -1,
//       errMessage: "Error from Server",
//     });
//   }
// };
let createNewUser = async (req, res) => {
  try {
    // Kiểm tra xem roleId có trong body không, nếu không có thì gán mặc định là 'user'
    const { roleId, ...restData } = req.body;
    const finalRoleId = !roleId || roleId === "" ? "user" : roleId;
    // Gán roleId mặc định là 'user'

    // Tạo người dùng mới với roleId là 'user' nếu không có giá trị roleId
    let data = await UserService.createNewUser({
      ...restData,
      roleId: finalRoleId, // Gán roleId cuối cùng
    });

    if (data.error) {
      return res.status(400).json({
        errCode: 1,
        errMessage: data.message,
      });
    }

    return res.status(200).json({
      errCode: 0,
      message: data.message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from Server",
    });
  }
};

let getUserInforByID = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({
        error: 1,
        errMessage: "Missing required parameter",
      });
    }

    let infor = await UserService.getUserInforByID(userId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: -1,
      errMessage: "Message from server",
    });
  }
};

let deleteUserByID = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");
    let userId = req.query.id;
    let data = await UserService.deleteUserByID(userId);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let updateUserData = async (req, res) => {
  try {
    let data = req.body;
    //console.log(data);
    let allUser = await UserService.updateUserData(data);
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  //console.log(email);

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await UserService.handleLogin(email, password);
  console.log(userData);

  // return res.status(200).json(infor);
  //check email exits
  //compare password
  //return userinfor
  //access token:JWT
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};
let getBillByUserID = async (req, res) => {
  try {
    let infor = await UserService.getBillByUserID(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};

let createWishlist = async (req, res) => {
  try {
    let data = await UserService.createWishlist(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
let getWishListByUserID = async (req, res) => {
  try {
    let infor = await UserService.getWishListByUserID(req.query.id);

    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: -1,
      errMessage: "Messge form sever",
    });
  }
};
let deleteWishlist = async (req, res) => {
  try {
    // console.log(req.body.userId, "ssss");
    let data = await UserService.deleteWishlist(req.body);
    //console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
module.exports = {
  getAllUser: getAllUser,
  getUserInforByID: getUserInforByID,
  createNewUser: createNewUser,
  deleteUserByID: deleteUserByID,
  updateUserData: updateUserData,
  getBillByUserID: getBillByUserID,
  getWishListByUserID: getWishListByUserID,
  handleLogin: handleLogin,
  createWishlist: createWishlist,
  deleteWishlist: deleteWishlist,
};
