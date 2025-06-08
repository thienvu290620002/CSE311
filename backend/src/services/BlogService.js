import db from "../models/index";

let getAllBlog = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let blogs = await db.Blog.findAll({
        raw: true,
      });
      console.log(blogs);

      resolve(blogs);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllBlog: getAllBlog,
};
