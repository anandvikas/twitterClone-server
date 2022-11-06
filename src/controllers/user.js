const User = require("../models/user");

const {
    hashPassword,
    HttpErrorResponse,
    comparePassword,
    generateToken,
    decodeToken,
    generateOTP,
    emailSend
} = require("../helper/helper");

exports.create = async (request, response) => {
    let { name, userName, email, password } = request.body;
    let isExists;
    try {
        isExists = await User.find({ $or: [{ email, userName }] })
        if (isExists.length > 0) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Username or Email already exists",
            })
            return;
        }
        const hashedPass = await hashPassword(password)
        const newUser = new User({ name, email, userName, password: hashedPass });
        await newUser.save();

    } catch (err) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot create the User",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "User has been created successfully"
    })
};

exports.signIn = async (request, response) => {
    const { emailOrUserName, password } = request.body;
    let isExists, user, token;
    try {
        isExists = await User
            .find({ $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] })
            .select({ password: 1 });

        if (!isExists.length) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid credential email",
            })
            return;
        } else {
            user = isExists[0]
        }

        let isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid credential pass",
                data: err
            })
            return;
        }

        token = await generateToken({
            id: user._id,
            otp: generateOTP()
        })

        await User.findByIdAndUpdate(user._id, {
            $push: { loginTokens: { token } }
        })

    } catch (err) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot Login",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "User logged in successfully",
        token
    })
}

exports.autoSignIn = async (request, response) => {
    const { token } = request.body;
    let tokenData, user;
    try {
        tokenData = await decodeToken(token);
        if (!tokenData || !tokenData.id) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid token 1",
            })
            return;
        }
        user = await User.findOne({ _id: tokenData.id, 'loginTokens.token': { $in: [token] } });
        if (!user) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid token 2",
            })
            return;
        }
    } catch (err) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot auto-login",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "User logged in successfully",
        token
    })
}

exports.forgotPassword = async (request, response) => {
    const { email } = request.body;
    let user;
    try {
        user = await User.findOne({ email })
        if (!user) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid credential",
            })
            return;
        }
        let token = await generateToken({
            userId: user._id,
        }, 300)
        let data = {
            to: email,
            subject: 'Reset Password Link',
            body: `<h1>Click on the following link to reset the password. <br><a style="color:blue;" href='${process.env.CLIENT_URL}reset-password/${token}'>Click here</a></h1>`
        }
        responseMessage = {
            success: 'A reset-password link has been send to your email address',
            fail: 'Unable to reset the password'
        }

        await User.findByIdAndUpdate(user._id, {
            $set: {
                resetPasswordToken: token
            }
        })

        emailSend(
            response,
            data,
            responseMessage
        )

    } catch (err) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot auto-login",
            data: err
        })
        return;
    }
}

exports.resetPassword = async (request, response) => {
    const { token, newPassword } = request.body;
    try {
        let tokenData = await decodeToken(token)
        if (!tokenData || !tokenData.userId) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid reset password link 1",
            })
            return;
        }

        let userData = await User.findOne({ resetPasswordToken: token })
        if (!userData) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Invalid reset password link 2",
            })
            return;
        }
        let hashedPassword = await hashPassword(newPassword)

        await User.findByIdAndUpdate(userData._id, {
            $set: {
                password: hashedPassword,
                resetPasswordToken: null
            }
        })
    } catch (error) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot change password",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "Password changed successfully",
    })
}

exports.getUser = async (request, response) => {
    const { userName } = request.params;    
    let user;
    try {
        user = await User.findOne({ userName }).select(
            {
                userName: 1,
                email: 1,
            }
        )
        if (!user) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Cannot find the user",
            })
            return;
        }
    } catch (error) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot find the user",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "User fetched successfully",
        user
    })
}



