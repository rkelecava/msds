var safetySheet = require('../../models/safetySheets');
var fs = require('fs');
var multiparty = require('multiparty');
var form = new multiparty.Form();
var util = require('util');
var path = require('path');

safetySheet.methods(['get', 'put', 'post', 'delete']);
safetySheet.before('get', skipAndLimit);
safetySheet.before('post', uploadFile);
safetySheet.before('delete', deleteFile);
safetySheet.before('put', deleteFile);
safetySheet.before('put', uploadFileUpdate);

safetySheet.route('download.get', function(req, res, next) {

	safetySheet.findById(req.query._id, function (err, safetySheet) {
		if (err) { return next(err); }
			var file = safetySheet.file.url;

			var filename = path.basename(file);

  			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  			res.setHeader('Content-type', safetySheet.file.contentType);

  			res.download(file, filename, function(err){
  				if (err) { return next(err); }
			});
	});
});

safetySheet.route('updateDatasheet.put', function (req, res, next) {
	safetySheet.findById(req.query._id, function (err, sheet) {

		// Update manufacturer if set in form
		if (req.body.manufacturer) { sheet.manufacturer = req.body.manufacturer; }

		// Update product if set in form
		if (req.body.product) { sheet.product = req.body.product; }

		// Update tradeName if set in form
		if (req.body.tradeName) { sheet.tradeName = req.body.tradeName; }


		// Save changes to sheet using the mongoose save method
		sheet.save(function (err) {
			// Return any errors
			if (err) { return next(err); }
		});
	});
});

safetySheet.route('searchByManufacturer.get', function (req, res, next) {

	safetySheet.find({"manufacturer": new RegExp('.*'+req.query.search+'.*','i')}).limit(parseInt(req.query.limit)).sort('manufacturer').exec(function (err, safetySheets) {
		res.status(200).json(safetySheets);
	});
});

safetySheet.route('searchByProduct.get', function (req, res, next) {

	safetySheet.find({"product": new RegExp('.*'+req.query.search+'.*','i')}, function (err, safetySheets) {
		res.status(200).json(safetySheets);
	});
});

safetySheet.route('searchByTradeName.get', function (req, res, next) {

	safetySheet.find({"tradeName": new RegExp('.*'+req.query.search+'.*','i')}, function (err, safetySheets) {
		res.status(200).json(safetySheets);
	});
});

safetySheet.route('count.get', function(req, res, next) {

	safetySheet.find().count(function (err, count) {
		if (err) { return next(err); }
		res.status(200).json(count);
	});
});

function skipAndLimit(req, res, next) {
	req.query.skip = parseInt(req.query.skip);
	req.query.limit = parseInt(req.query.limit);
	next();
}

function uploadFile(req, res, next) {
	form.parse(req, function (err, fields, files) {
		var newFileName = '';
		var fileExists = false;
		var i = 1;
		var newPath = path.join(__dirname, '../../../files/');
		newFileName = files.safetySheet[0].originalFilename;
		fileExists = fs.existsSync(newPath+newFileName);
		while (fileExists) {
			newFileName = i+'_'+files.safetySheet[0].originalFilename;;
			fileExists = fs.existsSync(newPath+newFileName);
			i++;
		}
		newPath = newPath+newFileName;
		var myRequest = {};
		myRequest.manufacturer = fields.manufacturer[0];
		myRequest.product = fields.product[0];
		myRequest.tradeName = fields.tradeName[0];
		myRequest.fileName = newFileName;
		myRequest.size = files.safetySheet[0].headers.size;
		myRequest.url = newPath;
		myRequest.contentType = files.safetySheet[0].headers['content-type'];
		req.headers = {'content-type' : 'application/json'};
		req.body.manufacturer = myRequest.manufacturer;
		req.body.product = myRequest.product;
		req.body.tradeName = myRequest.tradeName;
		req.body.file = {
			fileName: myRequest.fileName,
			url: myRequest.url,
			contentType: myRequest.contentType,
			size: myRequest.size
		};
		fs.readFile(files.safetySheet[0].path, function (err, data) {
		  	fs.writeFile(newPath, data, function (err) {
		    	if (err) { return next(err); }
		    	form = new multiparty.Form();
		    	next();
		  	});
		});
	});

}

function uploadFileUpdate(req, res, next) {
	form.parse(req, function (err, fields, files) {
		var newFileName = '';
		var fileExists = false;
		var i = 1;
		var newPath = path.join(__dirname, '../../../files/');
		newFileName = files.safetySheet[0].originalFilename;
		fileExists = fs.existsSync(newPath+newFileName);
		while (fileExists) {
			newFileName = i+'_'+files.safetySheet[0].originalFilename;
			fileExists = fs.existsSync(newPath+newFileName);
			i++;
		}
		newPath = newPath+newFileName;
		var myRequest = {};
		myRequest.fileName = newFileName;
		myRequest.size = files.safetySheet[0].headers.size;
		myRequest.url = newPath;
		myRequest.contentType = files.safetySheet[0].headers['content-type'];
		req.headers = {'content-type' : 'application/json'};
		req.body.file = {
			fileName: myRequest.fileName,
			url: myRequest.url,
			contentType: myRequest.contentType,
			size: myRequest.size
		};
		fs.readFile(files.safetySheet[0].path, function (err, data) {
		  	fs.writeFile(newPath, data, function (err) {
		    	if (err) { return next(err); }
		    	form = new multiparty.Form();
		    	next();
		  	});
		});
	});

}

function deleteFile(req, res, next) {
	safetySheet.findById(req.params.id, function (err, safetySheet) {
		if (err) { return next(err); }
		fs.unlink(safetySheet.file.url, function (err) {
			if (err) { return next(err); }
		});
	});
	next();
}


module.exports = safetySheet;