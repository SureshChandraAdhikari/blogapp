const express = require("express");
const path = require("path")
const userRoute = require('./Routes/user.js')
const blogRoute = require("./Routes/blog.js");
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./Middlewares/authentication.js");
const Blog = require('./Models/blog.js')

const app = express();
const port = 8000;

mongoose.connect('mongodb://localhost:27017/bolgger').then(e =>(console.log("Mongodb Connected Successfully")))

app.set("view engine" , "ejs")
app.set('views' , path.resolve("./Views"))


app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));



app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({})
  res.render("Home" , {
    user :req.user,
    blogs:allBlogs,
  })
});

app.use('/user' , userRoute)
app.use("/blog", blogRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
