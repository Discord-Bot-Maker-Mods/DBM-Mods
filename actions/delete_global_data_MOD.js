module.exports = {

	name: "Delete Global Data",

	section: "Deprecated",

	subtitle: function(data) {
		return `Data : ${data.dataName ? data.dataName : "All Data"}`;
	},

	github: "LeonZ2019",
	author: "LeonZ",
	version: "1.1.1",

	fields: ["dataName"],

	html: function(isEvent, data) {
		return `
	<div style="padding-top: 8px;">
		<div style="float: left; width: 80%;">
			Data Name:<br>
			<input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const dataName = this.evalMessage(data.dataName, cache);
		Global.delData(dataName);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
		let fs = require('fs');
		let path = require('path');
		let filePath = path.join(process.cwd(), "data", "globals.json");
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, "{}");
		}
		DBM.Files.data.globals = JSON.parse(fs.readFileSync(filePath));
		class GlobalsData {
			delData(name) {
				if (name && DBM.Files.data.globals[name]) {
					delete DBM.Files.data.globals[name];
					DBM.Files.saveData("globals");
				} else if (!name) {
					DBM.Files.data.globals = {};
					DBM.Files.saveData("globals");
				}
			};
			data(name, defaultValue) {
				if(DBM.Files.data.globals[name] || defaultValue !== undefined) {
					let data = (DBM.Files.data.globals[name]) ? DBM.Files.data.globals[name] : defaultValue;
					return data;
				} else {
					return null;
				};
			};
			setData(name,value) {
				if (value !== undefined) {
					DBM.Files.data.globals[name] = value;
					DBM.Files.saveData("globals");
				};
			};
			addData(name, value) {
				if(data[name] === undefined) {
					this.setData(name, value);
				} else {
					this.setData(name, this.data(name) + value);
				};
			}
		}
		Globals = new GlobalsData();
		
	}

};