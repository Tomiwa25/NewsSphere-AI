import jwt from "jsonwebtoken";


export const authenticate = (
  req: any,
  res: any,
  next: any
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = decoded;
    next();
}