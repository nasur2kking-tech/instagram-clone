const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
{
userId: {
type: String,
required: true,
},
caption: {
type: String,
default: "",
},
image: {
type: String,
required: true,
},
likes: {
type: [String],
default: [],
},
comments: {
type: [
{
userId: String,
text: String,
},
],
default: [],
},
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
