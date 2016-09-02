var restful = require('node-restful');
var mongoose = restful.mongoose;

var safetySheetSchema = new mongoose.Schema({
	created: { type: Date, default: Date.now },
	manufacturer: { type: String, required: true},
	product: { type: String, required: true},
	tradeName: {type: String, default: ''},
	file: {type: mongoose.Schema.Types.Mixed, required: true}
});

//Return Model
module.exports = restful.model('safetySheets', safetySheetSchema);