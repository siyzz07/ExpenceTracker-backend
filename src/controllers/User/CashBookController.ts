import { Request, Response } from "express";
import CashBook from "../../model/CashBookModel.";
import ExpenseControl from "../../model/ExpenceControllerModel";
import { log } from "console";

//------------------ get cash book data --------------------------
export const getCashbook = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userid = req.params.id;

    let userCahsbookData = await CashBook.findOne({ userId: userid });

    return res.json({ cashbook: userCahsbookData?.data ?? [] });
  } catch (error: any) {
    console.log(error.message);
  }
};

// ----------------- post amount to Cahsbook ---------------------
export const cashBookPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.userId;
    let { amount, description, type, dropdownValue, showDropdown } = req.body;

    if (showDropdown && showDropdown === false) {
      dropdownValue = null;
    } else {
      const control = await ExpenseControl.findOne(
        { userId: userId, "controles._id": dropdownValue },
        { "controles.$": 1 }
      );

      if (!control) {
        return res.status(404).json({ message: "Control not found" });
      } else {
        let ControlData = null;
        let checkTotalSpend = 0;
        if (control && control.controles) {
          ControlData = control.controles[0];
          checkTotalSpend = amount + ControlData.TotalSpend;
          if (checkTotalSpend > ControlData.amount) {
            return void res
              
              .json({
                message: `you control is out of limit. you have only Rs ${
                  ControlData.amount - ControlData.TotalSpend
                } balance`, type:"wrning"
              });
          }
        }
      }
    }

    let userCashBook = await CashBook.findOne({ userId: userId });

    if (!userCashBook) {
      if (dropdownValue) {
        const control = await ExpenseControl.findOne(
          { userId: userId, "controles._id": dropdownValue },
          { "controles.$": 1 }
        );

        let ControlData = null;
        let checkTotalSpend = 0;

        if (control && control.controles) {
          ControlData = control.controles[0];
          checkTotalSpend = amount + ControlData.TotalSpend;

          await ExpenseControl.updateOne(
            { userId: userId, "controles._id": dropdownValue },
            { $set: { "controles.$.TotalSpend": checkTotalSpend } }
          );
        }

        userCashBook = new CashBook({
          userId: userId,
          data: [
            {
              description: description,
              amount: amount,
              type: type,
              controlId: dropdownValue,
            },
          ],
        });
      } else {
        userCashBook = new CashBook({
          userId: userId,
          data: [
            {
              description: description,
              amount: amount,
              type: type,
            },
          ],
        });
      }
    } else {
      if (dropdownValue) {
        const control = await ExpenseControl.findOne(
          { userId: userId, "controles._id": dropdownValue },
          { "controles.$": 1 }
        );

        let ControlData = null;
        let checkTotalSpend = 0;

        if (control && control.controles) {
          ControlData = control.controles[0];
          checkTotalSpend = amount + ControlData.TotalSpend;

          await ExpenseControl.updateOne(
            { userId: userId, "controles._id": dropdownValue },
            { $set: { "controles.$.TotalSpend": checkTotalSpend } }
          );
        }

        userCashBook.data.push({
          description: description,
          amount: amount,
          type: type,
          controlId: dropdownValue,
        });
      } else {
        userCashBook.data.push({
          description: description,
          amount: amount,
          type: type,
        });
      }
    }

    await userCashBook.save();

    res.status(200).json({
      message: "Cash book entry added successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
