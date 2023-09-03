'use strict'
module.exports = (req,res, next) => {
    if(!req.session.user || req.session.user.UserType) {
        return res.status(401).json({message: 'Access denied. Not a Medical Specialist.'})
    }
    next();
}