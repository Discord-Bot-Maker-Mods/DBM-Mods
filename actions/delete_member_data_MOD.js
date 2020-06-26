module.exports = {

	name: "Delete Member Data",

	section: "Deprecated",

	subtitle: function(data) {
		const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${members[parseInt(data.member)]} - ${data.dataName}`;
	},

	github: "LeonZ2019",
	author: "LeonZ",
	version: "1.1.1",

	fields: ["member", "varName", "dataName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Member:<br>
			<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
				${data.members[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 80%;">
			Data Name:<br>
			<input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.memberChange(document.getElementById('member'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);
		const dataName = this.evalMessage(data.dataName, cache);
		member.delData(dataName);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
		DBM.Actions["Delete Member Data MOD"] = DBM.Actions["Delete Member Data"];
		DBM.DiscordJS.Structures.extend("GuildMember", (GuildMember) => class extends GuildMember {
			constructor(client, data, guild) {
				super(client, data, guild);
			}
			delData(name) {
				let players = DBM.Files.data.players;
				if (players[this.id] && name && players[this.id][name]) {
					delete players[this.id][name];
					DBM.Files.saveData("players");
				} else if (!name) {
					delete players[this.id];
					DBM.Files.saveData("players");
				};
			};
		});
		DBM.DiscordJS.Structures.extend("User", (User) => class extends User {
			delData(name) {
				let players = DBM.Files.data.players;
				if (players[this.id] && name && players[this.id][name]) {
					delete players[this.id][name];
					DBM.Files.saveData("players");
				} else if (!name) {
					delete players[this.id];
					DBM.Files.saveData("players");
				};
			};
		});
	}

};