const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        // Check whether user is authenticated
        if (!req.user) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        // Check whether user has the required role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Access forbidden"
            });
        }

        // Allow access
        next();
    };
};

module.exports = authorize;
