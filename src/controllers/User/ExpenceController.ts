import ExpenseControl from "../../model/ExpenceControllerModel";
import { Request, Response } from "express";

// ----------------------------- get uer controlles
export const getControlles = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;

    const userControl = await ExpenseControl.findOne({ userId });

    if (userControl) {
      return res.json({ controles: userControl.controles });
    } else {
      return res.json({ controles: [] });
    }
  } catch (error: any) {
    console.error("Error adding expense control:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// ---------------------------- Add expence controller

export const addExpenceController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const { controlName, controlAmount, description, endDate } = req.body;

    if (!controlName || !controlAmount || !endDate) {
      return res.status(400).json({
        message:
          "Please provide all required fields: controlName, controlAmount, and endDate.",
      });
    }

    let userControllers = await ExpenseControl.findOne({ userId });

    if (!userControllers) {
      userControllers = new ExpenseControl({
        userId,
        controles: [
          {
            categoryName: controlName,
            description,
            endDate,
            TotalSpend:0,
            amount: controlAmount,
            expenceHistory: [],
          },
        ],
      });
    } else {
      let checkExist = await ExpenseControl.findOne({
        userId,
        "controles.categoryName": controlName,
        "controles.description": description,
      });

      if (checkExist) {
        return res.status(400).json({
          message: "Already exist.",
        });
      }

      userControllers.controles.push({
        categoryName: controlName,
        description,
        endDate,
        amount: controlAmount,
        status: true,
        TotalSpend:0,
        expenceHistory: [],
      });
    }

    await userControllers.save();

    return res.status(201).json({
      message: "Expense control added successfully.",
      data: userControllers,
    });
  } catch (error) {
    console.error("Error adding expense control:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// --------------------------------- editController
export const editController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { id, controlId } = req.params;
    const updates = req.body;
  
    console.log('updates', updates);
  
    try {
      
      const existingControl = await ExpenseControl.findOne({
        userId: id,
        controles: {
          $elemMatch: {
            _id: { $ne: controlId }, 
            categoryName: updates.categoryName, 
            description: updates.description, 
          },
        },
      });
  
      if (existingControl) {
        return res.status(400).json({
          message: "it's already exist.",
        });
      }
  
     
      const control = await ExpenseControl.findOneAndUpdate(
        { userId: id, "controles._id": controlId },
        {
          $set: Object.keys(updates).reduce((acc: any, key: any) => {
            acc[`controles.$.${key}`] = updates[key];
            return acc;
          }, {}),
        },
        { new: true }
      );
  
      console.log(control);
  
      if (!control) {
        return res.status(404).json({ message: "User or control not found" });
      }
  
      res.status(200).json({ message: "Control updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  