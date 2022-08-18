const mongoose = require('mongoose')

const connection = ()=>{
    return mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("Connected");
    }).catch((err)=>{
        console.log('Connection ""ERROR"" ==>',err);
    })
}

module.exports = {connection}