const {
    decodeToken,
    HttpErrorResponse
} = require("../helper/helper");
const User = require("../models/user");

userAuthMiddleware = async (request, response, next) => {
    // console.log(request.headers)
    let { authorization: Token } = request.headers;
    const { userId } = request.body;
    Token = Token.split('Bearer ')[1];
    // if (!Token || !userId) {
    if (!Token) {
        HttpErrorResponse({
            response,
            status: "error",
            code: 400,
            message: "Authentication error 1",
        })
        return;
    }
    try {
        let tokenData = await decodeToken(Token)
        // if (!tokenData || !tokenData.userId || tokenData.userId !== userId) {
        if (!tokenData || !tokenData.userId) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Authentication error 2",
            })
            return;
        }
        let user = await User.findOne({ _id: tokenData.userId, loginTokens: { $in: [Token] } })
        if (!user) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Authentication error 3",
            })
            return;
        }
        request.body.userId = tokenData.userId;
        request.userId = tokenData.userId
    } catch (err) {
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Unable to authenticate",
            data: err
        })
        return;
    }
    
    next()
}
module.exports = userAuthMiddleware