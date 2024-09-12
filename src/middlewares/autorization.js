import jwt from 'jsonwebtoken';

export const auth = (accessRoles = []) => {
    return asyncHandler(
        async (req, res, next) => {
            const { authorization } = req.headers;
            
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return next(new Error("In-valid Bearer key", { cause: 400 }));
            } 

            try {
                const token = authorization.split(process.env.BearerKey)[1];
                const decoded = jwt.verify(token, process.env.tokenSignature);
                
                if (!decoded?.id || !decoded?.isLoggedIn) {
                    return next(new Error("In-valid token payload ", { cause: 400 }));
                }
                
                const user = await findById({ model: userModel, filter: decoded.id, select: 'email userName role blocked' });
                if (!user) {
                    return next(new Error("Not register user", { cause: 401 }));
                }
                
                // if (user.blocked) {
                //     return next(new Error("Blocked Account", { cause: 400 }));
                // }
                
                if (!accessRoles.includes(user.role)) {
                    return next(new Error("Not Auth User", { cause: 403 }));
                }
                
                req.user = user;
                return next();
            
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return next(new Error("Token has expired", { cause: 401 }));
                }
                return next(new Error("Validation error", { cause: 500 }));
            }
        }
    );
}
