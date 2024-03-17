

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    // Ensure next is included in the function signature
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next(); // Use return to exit the function after calling next
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      return next(); // Use return to exit the function after calling next
    } catch (error) {
      return next(); // Use return to exit the function after calling next
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
