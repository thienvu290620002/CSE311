import db from "../models/index";
import BlogService from "../services/BlogService";

let getAllBlog = async (req, res) => {
  // console.log(123);

  try {
    let data = await BlogService.getAllBlog();
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errCode: -1,
      errMessage: " Error from Server",
    });
  }
};
module.exports = {
  getAllBlog: getAllBlog,
};
