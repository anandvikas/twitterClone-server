const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs")
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs")
// const en = require("../locales/en.json")
// const hi = require("../locales/hi.json")


const hashPassword = async (password) => {
    let hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

const comparePassword = async (passRecieved, passInDB) => {
    return await bcrypt.compare(passRecieved, passInDB);
};

const HttpErrorResponse = ({ response, status, code, message, data }) => {
    response.status(code).json({ status, message, data })
    return;
};

const generateToken = async (data, expire) => {
    const token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: expire ? expire : '365d' });
    return token;
};

const decodeToken = async (token) => {
    const data = jwt.verify(token, process.env.JWT_KEY);
    return data;
};

const emailSend = async (response, data, responseMessage) => {
    const { to, subject, body } = data
    const { success, fail } = responseMessage

    var transporter = nodemailer.createTransport({
        host: process.env.SENDER_EMAIL_HOST,
        port: process.env.SENDER_EMAIL_PORT,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html:body,
    };

    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
            HttpErrorResponse(response, "error", 500, fail, data = null)
        } else {
            response.status(200).json({
                status: "success",
                message: success
            })
        }
    });

};

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000)
}

// const translate = (language, message) => {
//     let langObj = {
//         'en': en,
//         'hi': hi
//     }
//     if (!langObj[language]) {
//         language = "en"
//     }
//     return langObj[language][message]
// }

//-------------------------------------------------------
const MIME_TYPE_MAP = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

let pathTillUploads = path.join(__dirname, '../uploads')
const storageControl = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync(`${pathTillUploads}/${file.fieldname}`)) {
            fs.mkdirSync(`${pathTillUploads}/${file.fieldname}`)
        }
        callback(null, `${pathTillUploads}/${file.fieldname}`);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
});
const filterControl = (req, file, cb) => {
    let isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : {
        status: "error",
        message: "not valid file type"
    }
    if (error) {
        console.log('wow error')
    }
    cb(error, isValid)
}
const limitsControl = {
    fileSize: 1 * 1024 * 1024
}
const upload = multer(
    {
        storage: storageControl,
        fileFilter: filterControl,
        limits: limitsControl,
    }
);

// const upload = (folder) => {
//     let pathTillFolder = path.join(__dirname, `../uploads/${folder}`)
//     return {
//         storage: multer.diskStorage({
//             destination: (req, file, callback) => {
//                 if (!fs.existsSync(pathTillFolder)) {
//                     fs.mkdirSync(pathTillFolder)
//                 }
//                 callback(null, pathTillFolder);
//             },
//             filename: (req, file, callback) => {
//                 callback(null, `${Date.now()}_${file.originalname}`);
//             },
//         })
//     }
// }


module.exports = {
    hashPassword,
    comparePassword,
    HttpErrorResponse,
    generateToken,
    decodeToken,
    emailSend,
    generateOTP,
    // translate,
    upload,
};
