/** * *
Expense
* */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const expenseSchemaFields = {
  title: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Number,
  },
  amount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
};

const expenseSchema = new mongoose.Schema(expenseSchemaFields, {
  timestamps: { currentTime: () => Date.now() },
});

const allFields = Object.keys(expenseSchemaFields).join(" ");

expenseSchema.method({});

expenseSchema.statics = {
  async list({ page = 1, perPage = 100, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const expense = await this.findOne({ _id }).exec();
    return expense;
  },

  async updateExpense(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne(
      {
        _id: id,
      },
      updates
    ).exec();
  },
};

expenseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Expense", expenseSchema);
