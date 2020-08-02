module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Store Playlist Info',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'YouTube Tools',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle: function (data) {
    // Each item corresponds to each switch statement.
    const INFO = ['Item 1', 'Item 2', 'Item 3']
    // What user sees when previewing actions box on bottom.
    return 'Store YouTube playlist information.'
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Playlist Info'
    return ([data.varName, dataType])
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['query', 'info', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editting actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The "data" parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  // ---------------------------------------------------------------------

  html: function (isEvent, data) {
    return `
<div style="width: 90%;">
  Playlist URL:<br>
  <input id="query" class="round" type="text">
</div><br>
<div style="padding-top: 8px; width: 60%;">
  Options:
  <select id="info" class="round">
    <option value="0" selected>Video Data List</option>
    <option value="1">Video URL List</option>
    <option value="2">Video Name List</option>
    <option value="3">Video Duration List</option>
    <option value="4">Video ID List</option>
  </select>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init: function () {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existance.
  // ---------------------------------------------------------------------

  action: async function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const query = this.evalMessage(data.query, cache)
    const INFO = parseInt(data.info)
    const ytlist = require('youtube-playlist')
    const url = query
    let result = 5

    const urls = await ytlist(url, 'url')
    const urllist = JSON.stringify(urls)

    const names = await ytlist(url, 'name')
    const namelist = JSON.stringify(names)

    const datas = await ytlist(url, ['id', 'name', 'url'])
    const datalist = JSON.stringify(datas)

    const durationis = await ytlist(url, 'duration')
    const durationlist = JSON.stringify(durationis)

    const ids = await ytlist(url, 'id')
    const idlist = JSON.stringify(ids)

    switch (INFO) {
      case 0:
        result = datalist
        break;
      case 1:
        result = urllist
        break;
      case 2:
        result = namelist
        break;
      case 3:
        result = durationlist
        break;
      case 4:
        result = idlist
        break;
    }

    this.storeValue(result, storage, varName, cache)
    this.callNextAction(cache)
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod: function (DBM) {}
}
