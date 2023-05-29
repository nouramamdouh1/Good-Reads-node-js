const mongoose = require("mongoose");

const validateCustomId = async (model, id) => {
	const objectId = new mongoose.Types.ObjectId(id)
	const results = await model.findById(objectId);

	if (!results) {
		throw new Error(`No ${model.modelName} found with id ${id}`);
	}

	return true;
};

module.exports = { validateCustomId };
