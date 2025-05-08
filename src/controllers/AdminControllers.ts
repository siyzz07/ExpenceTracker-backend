// import User from "../model/userRegisterModel";
// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { generateToken } from "../utils/jwt";
// import jwt from "jsonwebtoken";

// //-------------------------------- LOGIN ADMIN --------------------------------
// // login Adimn
// export const adminLogin = async (req: Request, res: Response): Promise<any> => {
//   const { email, password } = req.body;
//   const admin = await User.findOne({ email: email });
//   if (!admin) {
    

//     return void res
//       .status(400)
//       .json({ message: "Can't find admin check your email " });
//   }

//   if (admin.role !== "Admin") {
//     return res.status(401).json({ message: "You are not and admin" });
//   }

//   const passwordMatch = await bcrypt.compare(password, admin.password);
//   if (!passwordMatch) {
//     return res.status(401).json({ message: "Wrong Pasword" });
//   }

//   const token = await generateToken({
//     _id: String(admin._id),
//     role: String(admin.role),
//   });

//   return res.json({
//     token,
//     admin: {
//       id: String(admin._id),
//       email: String(admin.email),
//       name: admin.name,
//       role: admin.role,
//     },
//   });
// };

// // fetch the user data
// export const getUserData = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     let userData = await User.find({ role: "User" });
//     res.json({ userData });
//   } catch (error: any) {
//     console.log(error.message);
//     res.status(500).json({ message: "interval server error" });
//   }
// };

// // delet user
// export const deleteUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.params.id;

//     let user = await User.findById(userId);
//     if (user) {
//       let bool = user.isActive;
//       user.isActive = !bool; 
//       await user.save();
      
//       res.json({ message: "successfully deleted" });
//     } 
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "internal server error" });
//   }
// };



// //--------------------------- EDIT USER ----------------------------------------
//  export const adminEditUser=async(req:Request,res:Response):Promise<void>=>{

//     try{

//         const {name,email}=req.body

//     const user=await User.findOne({email:email})

//     if(!user){
//         res.status(404).json({ message: "User not found" });
//         return; 
//     }

//     user.name=name
//     user.save()
//     res.status(200).json({
//         message: "User updated successfully",
//         user: {
//           name: user.name,
//           email: user.email,
//           profileImage: user.profileImage,
//         },
//       });
//     }catch(error:any){
//         console.log(error.message);
        
//     }
    
    
//  }


//  //---------------------------------add user------------------------------
//  export const addUser = async (req: Request, res: Response): Promise<void> => {
//   try {
    
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//       return void res.status(409).json({ message: "User already exists" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);
//     const profile = req.file ? `/uploads/${req.file.filename}` : " ";

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashPassword,
//       profileImage: profile,
//     });

//     const userData = await newUser.save();
//     console.log(userData);

//     if (userData) {
//       res.status(201).json({ message: "User created successfully", userData });
//     } else {
//       res.status(500).json({ message: "registration failed" });
//     }
//   } catch (error: any) {
//     console.log(error.message);
//   }
// };