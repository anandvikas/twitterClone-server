require('dotenv').config()
require('./src/connection/dbConnect')
const express = require('express');
const cors = require('cors');

const userRouter = require('./src/routes/user')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/user', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`running at port ${process.env.PORT}`)
})