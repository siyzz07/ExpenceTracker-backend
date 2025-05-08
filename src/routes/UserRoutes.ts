import express from "express";

import { register,loginUser, fetchUserDashboardData} from "../controllers/User/UserControllers";
import { addBorrowing, addLending, addParties, deleteParties, getParties, partieTransactions } from "../controllers/User/PartiesController";
import upload from "../middlewares/MulterUpload";
import tokenVerify from "../middlewares/tokenVerify";
import multer from "multer";
import { addExpenceController, editController, getControlles } from "../controllers/User/ExpenceController";
import { cashBookPost, getCashbook } from "../controllers/User/CashBookController";


const userRouter=express.Router()

userRouter.post("/register",register)



userRouter.post("/login",loginUser)


//---------------------------------------------------------parties details
userRouter.get('/parties/:id',getParties)
userRouter.post('/addparties/:id',addParties)
userRouter.delete('/deletepartie/:partieId/:userId',deleteParties)


//---------------------------------------------------------- parties transaction (each parti lending and borrowing)

userRouter.get('/getPartieTransaction/:userId/:partieId',partieTransactions)
userRouter.post('/addBorrowing/:userId/:partieId',addBorrowing)
userRouter.post('/addLending/:userId/:partieId',addLending)


//----------------------------------------------- expence controller 

userRouter.get(`/getControlles/:id`,getControlles)
userRouter.post(`/addControll/:id`,addExpenceController)
userRouter.put('/editControl/:id/:controlId',editController)



//----------------------------------------------- chashBook 
userRouter.get(`/cashbookData/:id`,getCashbook)
userRouter.post(`/addCashBookData/:userId`,cashBookPost)




// userRouter.get('/home',tokenVerify,homeGet)

// userRouter.post('/edituser',upload.single("profileImage"),tokenVerify,editUser)

// ----------------------------------------------------- Dashboard
userRouter.get(`/dashboard/:id`,fetchUserDashboardData)





export default userRouter