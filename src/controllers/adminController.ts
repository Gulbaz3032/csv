import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { parseCSVFromURL } from "../utils/csvParser";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { generateEmail, generateTempPassword } from "../utils/generatCreds";
import { sendCredentialsEmail, sendNewPasswordEmail } from "../utils/email";

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    // Check file upload in request
    const file = (req as any).files?.file; // if using express-fileupload
    if (!file) return res.status(400).json({ message: "CSV file required in 'file' field" });

    // 🔹 Upload CSV to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "raw",
      folder: "csv-uploads",
      format: "csv",
    });

    const fileUrl = uploadResult.secure_url;
    console.log(" File uploaded to Cloudinary:", fileUrl);

    // 🔹 Parse CSV from Cloudinary URL
    const rows = await parseCSVFromURL(fileUrl);
    console.log(` Parsed ${rows.length} rows from CSV`);

    const created: any[] = [];

    for (const r of rows) {
      const keys = Object.keys(r).map(k => k.toLowerCase());
      const getVal = (names: string[]) =>
        Object.entries(r).find(([k]) => names.includes(k.toLowerCase()))?.[1];

      const firstName = (getVal(["firstname", "first_name", "fname"]) as string) || "NoName";
      const lastName = (getVal(["lastname", "last_name", "lname"]) as string) || "NoName";
      const zipcode = (getVal(["zipcode", "zip", "postalcode"]) as string) || "";

      const email = generateEmail(firstName, lastName);
      const tempPassword = generateTempPassword();
      const hashed = await bcrypt.hash(tempPassword, 10);

      // Ensure unique email
      let uniqueEmail = email;
      if (await User.findOne({ email: uniqueEmail })) {
        const [prefix, domain] = email.split("@");
        uniqueEmail = `${prefix}.${Math.floor(Math.random() * 9000 + 1000)}@${domain}`;
      }

      // Create user
      const user = new User({
        firstName,
        lastName,
        email: uniqueEmail,
        password: hashed,
        zipcode,
        role: "user",
        mustChangePassword: true,
      });
      await user.save();

      // Send email
      await sendCredentialsEmail(user.email, tempPassword).catch(err =>
        console.warn(" Email failed:", err)
      );

      created.push({ id: user._id, email: user.email, firstName, lastName });
    }

    return res.json({
      message: " CSV processed successfully",
      uploadedTo: fileUrl,
      createdCount: created.length,
      created,
    });
  } catch (err: any) {
    console.error(" Error in uploadCSV:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Regenerate password
export const regeneratePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);
    user.password = hashed;
    user.mustChangePassword = true;
    await user.save();

    await sendNewPasswordEmail(user.email, tempPassword);
    res.json({ message: " New password sent", userId: user._id });
  } catch (err: any) {
    console.error(" Error regenerating password:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
