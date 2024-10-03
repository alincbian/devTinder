const authMiddleware = ((req, res, next) => {
    const token = 'xyz'
    const authorizedRoute = token === 'xyz'
    if(!authorizedRoute){
     return res.status(401).send("unauthorized request")
    }

    return next()
})

const userAuthorize = ((req, res, next) => {
    const token = 'abc'
    const userAuthorizeRoute = token === 'abc'
    if(!userAuthorizeRoute){
        return res.status(401).send("unauthorized request")
    }

    return next()
})

module.exports = {authMiddleware, userAuthorize}