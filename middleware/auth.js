import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  console.log("Token received by server:", token);  // Log the token

  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", token_decode); // Log token decoding step

req.userId = token_decode.id;
    console.log("req.body after adding userId:", req.body); // Confirm userId is added

    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
