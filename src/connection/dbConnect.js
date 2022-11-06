const mongoose = require("mongoose");

const path = process.env.DB;
const other = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
}

mongoose.connect(path, other).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log("couldn't connect the database\n"+err);
});