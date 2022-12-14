import { Schema, model } from "mongoose";
import { IOffencesModel } from "./offencesmodel.types";

const offences = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  userId: String,
  yearlyOffences: [
    {
      year: Number,
      yearlyKarma: Number,
      weeklyData: [
        {
          weekNumber: Number,
          weeklyKarma: Number,
          Offences: [
            {
              offenceType: Number,
              offenceDescription: String,
              commitedOn: Date,
              newKarma: Number,
              karmaChange: Number,
            },
          ],
        },
      ],
    },
  ],
});

const offencesmodel = model<IOffencesModel>("Offences", offences, "offences");

export default offencesmodel;
