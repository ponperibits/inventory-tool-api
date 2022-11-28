/** * *
Party
* */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const partySchemaFields = {
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Customer", "Supplier"],
    required: true,
  },
  gstNumber: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  category: {
    type: String,
  },
  address: {
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
const partySchema = new mongoose.Schema(partySchemaFields, {
  timestamps: { currentTime: () => Date.now() },
});

const allFields = Object.keys(partySchemaFields).join(" ");

partySchema.method({});

partySchema.statics = {
  async list({
    page = 1,
    perPage = 100,
    date,
    fields = allFields,
    searchText,
    ...rest
  }) {
    let options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (!isNullorUndefined(searchText) && searchText != "") {
      options = {
        ...options,
        $or: [{ name: { $regex: searchText, $options: "i" } }],
      };
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
    const party = await this.findOne({ _id }).exec();
    return party;
  },

  async updateParty(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne(
      {
        _id: id,
      },
      updates
    ).exec();
  },
};

partySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Party", partySchema);
