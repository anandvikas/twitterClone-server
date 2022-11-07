require('dotenv').config()
const path = require('path')
require('./src/connection/dbConnect')
const express = require('express');
const cors = require('cors');


const userRouter = require('./src/routes/user')
const postRouter = require('./src/routes/post')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './uploads')))


app.use('/user', userRouter)
app.use('/post', postRouter)

app.listen(process.env.PORT, () => {
    console.log(`running at port ${process.env.PORT}`)
})