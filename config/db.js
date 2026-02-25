const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


url="mongodb+srv://social:fahim@cluster0.hexmrb0.mongodb.net/?appName=Cluster0";


mongoose.connect(url , (err)=>{
if (err)
{
    console.log(err)
}
else
{
    console.log("connected Success")
}

} )
