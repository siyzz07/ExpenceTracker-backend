import { log } from "node:console";
import Parties from "../../model/PartiesModel";
import { Request, Response } from "express";

//--------------------------------- ADD PARTIES ---------------------------------------
export const addParties = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { name, mobile, description } = req.body;

    let userParties = await Parties.findOne({ userId });

    if (!userParties) {
      userParties = new Parties({
        userId,
        parties: [
          {
            name,
            phone: mobile,
            description,
            transactions: [],
          },
        ],
      });

      await userParties.save();
      return res
        .status(201)
        .json({ message: "Party added successfully", data: userParties });
    }

    const existingParty = userParties.parties.find(
      (party) => party.phone === Number(mobile)
    );

    if (existingParty) {
      return res
        .status(400)
        .json({ message: "Party with this mobile number already exists" });
    }

    userParties.parties.push({
      name,
      phone: mobile,
      description,
      transactions: [],
    });

    await userParties.save();

    return res
      .status(201)
      .json({ message: "Party added successfully", data: userParties });
  } catch (error: any) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//--------------------------------- GET PARTIES ---------------------------------------

export const getParties = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;

    let partiesData = await Parties.findOne({ userId: userId });
    if (!partiesData) {
      partiesData = new Parties({
        userId: userId,
      });
      partiesData.save();
    }

    const parties = partiesData.parties ? partiesData.parties : [];
    const aa = parties.map((value) => {
      return value.transactions;
    });

 

    res.status(200).json({ parties });
  } catch (error: any) {
    console.log(error.message);
  }
};

//------------------------------- DELETE PARTIES ------------------------------

export const deleteParties = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, partieId } = req.params;

    const updatedUser = await Parties.findOneAndUpdate(
      { userId },
      { $pull: { parties: { _id: partieId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User or party not found" });
    }

    res.json({ message: "Party deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting party:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ====================================== === Each partie transaciton === =====================================

// get prtes transaction

export const partieTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, partieId } = req.params;
    // const totalLendig=0
    // const totalBorrwing=0

    const userParties = await Parties.findOne({ userId });

    if (!userParties) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const party = userParties.parties.find((p) => String(p._id) === partieId);

    if (!party) {
      res.status(404).json({ message: "Party not found" });
      return;
    }

    const totalLending = party.transactions.reduce(
      (acc, val) => acc + val.toGet * 1,
      0
    );
    const totalBorrowing = party.transactions.reduce(
      (acc, val) => acc + val.toGave * 1,
      0
    );
    let netTotal = 0;
    netTotal = totalLending - totalBorrowing;
    // console.log(
    //   "totalLending,totalBorrowing,newTotal",
    //   totalLending,
    //   totalBorrowing,
    //   netTotal
    // );

    return res.json({
      party,
      totalBorrowings: totalBorrowing,
      totalLendings: totalLending,
      netTotal: netTotal,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

// ----------------- add borrwin to partie
export const addBorrowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, partieId } = req.params;
    const { description, toGave, toGet } = req.body;

    const userParties = await Parties.findOne({ userId });

    if (!userParties) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const party = userParties.parties.find((p) => String(p._id) === partieId);

    if (!party) {
      res.status(404).json({ message: "Party not found" });
      return;
    }

    party.transactions.push({
      toGet: toGet,
      toGave: toGave,
      reason: description,
      date: new Date(),
    });

    const aa = await userParties.save();

    res.status(200).json({ message: "Borrowing added successfully" });
  } catch (error: any) {
    console.error("Error adding borrowing:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------- add lending  to partie

export const addLending = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, partieId } = req.params;
    const { description, toGave, toGet } = req.body;

    const userParties = await Parties.findOne({ userId });
    // console.log(userParties);

    if (!userParties) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const party = userParties.parties.find((p) => String(p._id) === partieId);

    // console.log("party", party);

    if (!party) {
      res.status(404).json({ message: "Party not found" });
      return;
    }

    party.transactions.push({
      toGet: toGet,
      toGave: toGave,
      reason: description,
      date: new Date(),
    });

    const aa = await userParties.save();

    res.status(200).json({ message: "Lending added successfully", party });
  } catch (error: any) {
    console.error("Error adding borrowing:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
