// import { Request, Response, NextFunction } from "express";
// import fileUpload from "express-fileupload";
// import fs from "fs";
// import path from "path";

// // 1️⃣ Middleware setup to use express-fileupload globally
// export const fileUploadMiddleware = fileUpload({
//   useTempFiles: true,              // store files temporarily on disk
//   tempFileDir: path.join(__dirname, "../../temp"), // temp folder for uploads
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // 2️⃣ Ensure temp directory exists
// const tempDir = path.join(__dirname, "../../temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// // 3️⃣ Check file presence before controller
// export const verifyCSVFile = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.files || !req.files.file) {
//     return res.status(400).json({ message: "CSV file required in 'file' field" });
//   }
//   next();
// };
