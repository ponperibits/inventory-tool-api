const httpStatus = require("http-status");
const Party = require("../models/party.model");

exports.list = async (req, res, next) => {
  try {
    const parties = await Party.list({
      ...req.query,
      userId: req.user._id,
    });
    res.json(parties);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const party = new Party({
      ...req.body,
      userId: req.user._id,
    });
    const savedParty = await party.save();
    res.status(httpStatus.CREATED);
    res.json(savedParty);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { partyId } = req.params;
    const party = await Party.fetch(partyId);
    res.json(party);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { partyId } = req.params;
    await Party.updateParty(partyId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { partyId: _id } = req.params;
    await Party.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};