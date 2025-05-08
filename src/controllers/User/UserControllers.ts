import { Request, Response } from "express";
import User from "../../model/userModel";
import Parties from '../../model/PartiesModel'
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import jwt from "jsonwebtoken";
import { log } from "console";

// ---------------------- REGISTER USER --------------------------------
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return void res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    const userData = await newUser.save();
    if (userData) {
      res.status(201).json({ message: "User created successfully", userData });
    } else {
      res.status(500).json({ message: "registration failed" });
    }
  } catch (error: any) {
    console.log(error.message);
  }
};



// //-------------------- LOGIN USER ----------------------------------

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("1");
    
    // check the user is exist
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("2");

      return void res
        .status(400)
        .json({ message: "User not found please register" });
    }
    if (!user.isActive) {
      console.log("3");

      return void res
        .status(400)
        .json({ message: "Your accound is blocked by admin" });
    }
    console.log("4");

    // check the passwored is match or not
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return void res.status(400).json({ message: "worong password" });
    }
    console.log("5");

    const token = generateToken({
      _id: String(user._id),
      isActive:Boolean(user.isActive)
      
    });
    console.log("6");

    res.json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        isActive:user.isActive
    
      },
    });
  } catch (error: any) {
    console.log("err1");

    console.log(error.message);
    
  }
};



// //----------------------------- GET HOME --------------------------------------------
// export const homeGet = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return void res.status(401).json({ message: "access denied" });
//     }

//     const decode: any = await jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY as string
//     );

//     if (!decode) {
//       return void res.status(401).json({ message: "access denied" });
//     }
//     if (decode.role !== "User") {
//       return res.status(401).json({ message: "access denied" });
//     }

//     const user = await User.findById(decode._id).select("-password");

//     res.json(user);
//   } catch (error: any) {
//     console.log(error.message);
//   }
// };

// //------------------------- EDIT USER -----------------------------
// export const editUser = async (req: Request, res: Response): Promise<void> => {
//   try {


//     const { name, email } = req.body;

    
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
//     const profileImage = req.file ? `/uploads/${req.file.filename}` : user.profileImage;

//     user.name = name || user.name; 
//     user.profileImage = profileImage

//     await user.save();
    
//     res.status(200).json({
//       message: "User updated successfully",
//       user: {
//         name: user.name,
//         email: user.email,
//         profileImage: user.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Error updating user", error });
//   }
// };


// ======================================== Dashboard =============================================
export const fetchUserDashboardData = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;

    const parties: any = await Parties.findOne({ userId: userId });
    let totalGet = 0;
    let totalGave = 0;

    // Calculate start and end of the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // Generate week structure
    const currentWeek: Record<string, { totalToGet: number; totalToGave: number }> = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      currentWeek[day] = { totalToGet: 0, totalToGave: 0 };
    }

    if (parties) {
      // Calculate totalGet and totalGave
      totalGet = parties.parties.reduce((acc: number, party: any) => {
        const partyTotalGet = party.transactions.reduce(
          (sum: number, transaction: any) => sum + transaction.toGet,
          0
        );
        return acc + partyTotalGet;
      }, 0);

      totalGave = parties.parties.reduce((acc: number, party: any) => {
        const partyTotalGave = party.transactions.reduce(
          (sum: number, transaction: any) => sum + transaction.toGave,
          0
        );
        return acc + partyTotalGave;
      }, 0);

      // Filter transactions for the current week and group by day
      parties.parties.forEach((party: any) => {
        party.transactions.forEach((transaction: any) => {
          const transactionDate = new Date(transaction.date);

          if (transactionDate >= startOfWeek && transactionDate <= endOfWeek) {
            const day = transactionDate.toLocaleDateString('en-US', { weekday: 'long' });
            currentWeek[day].totalToGet += transaction.toGet;
            currentWeek[day].totalToGave += transaction.toGave;
          }
        });
      });
    }

    // Prepare result
    const result = Object.entries(currentWeek).map(([day, data]) => ({
      day,
      ...data,
    }));

    console.log(result);

    res.status(200).json({ totalGet, totalGave, currentWeek: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
