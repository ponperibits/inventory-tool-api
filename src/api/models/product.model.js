/** * *
Product
* */
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const productSchemaFields = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  sku: {
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
  noOfUnits: {
    type: Number,
    default: 0,
  },
  minStockWarning: {
    type: Number,
    default: 5,
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
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { description: { $regex: searchText, $options: "i" } },
          { sku: { $regex: searchText, $options: "i" } },
        ],
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
    const product = await this.findOne({ _id }).exec();
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

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
