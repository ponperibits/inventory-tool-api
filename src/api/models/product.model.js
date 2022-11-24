/** * *
Product
* */ const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");
const { currenciesSupported } = require("../utils/constants");

const productSchemaFields = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: currenciesSupported,
  },
  noOfUnits: {
    type: Number,
    default: 0,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
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

const productSchema = new mongoose.Schema(productSchemaFields, {
  timestamps: { currentTime: () => Date.now() },
});

const allFields = Object.keys(productSchemaFields).join(" ");

productSchema.method({});

productSchema.statics = {
  async list({ page = 1, perPage = 100, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }
    return this.find(options, fields)
      .populate("supplierId", "name")
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const product = await this.findOne({ _id })
      .populate("supplierId", "name")
      .exec();
    return product;
  },

  async updateProduct(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne(
      {
        _id: id,
      },
      updates
    ).exec();
  },
};

module.exports = mongoose.model("Product", productSchema);
