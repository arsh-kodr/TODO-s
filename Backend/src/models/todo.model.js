const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    user : {
       type : mongoose.Schema.Types.ObjectId,
       ref : "user",
       required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["pending" , "completed"],
        default : "pending"
    }
}, {
    timestamps : true
}
)

const todoModel = mongoose.model("todo" , todoSchema);

module.exports = todoModel;