// This mod was created by Savaşçı#6666
// For Discord.js v12
module.exports = {
  name: 'Store Shard Info',
  section: 'Bot Client Control',

  subtitle (data) {
    const info = ['Total Count of Servers (in All Shards)', 'Total Count of Members (in All Shards)', 'Shard\'s Ping (On The Current Server)', 'Shard\'s ID (On The Current Server)', 'Total Number of Servers (in Current Server\'s Shard)', 'Total Count of Members (in Current Server\'s Shard)', 'Total Server\'s List (On The Current Server\'s Shard)']
    return `Shard - ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Type'
    switch (info) {
      case 0: // Total Number of Servers in All Shards
        dataType = 'Number'
        break
      case 1: // Total Number of Members in All Shards
        dataType = 'Number'
        break
      case 2: // Shard's Ping On The Current Server
        dataType = 'Number'
        break
      case 3: // Shard's ID On The Current Server
        dataType = 'Number'
        break
      case 4: // Total Number of Servers in Current Server's Shard
        dataType = 'Number'
        break
      case 5: // Total Count of Members in Current Server's Shard
        dataType = 'Number'
        break
      case 6: // Total Server's List On The Current Server's Shard
    }
    return ([data.varName2, dataType])
  },

  fields: ['info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<p>This Mod Was Created By Savaşçı#6666</p>
<p>For Discord.js v12</p>
<div style="float: left; width: 80%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
      <option value="0">Total Count of Servers (in All Shards)</option>
      <option value="1">Total Count of Members (in All Shards)</option>
      <option value="2">Shard's Ping (On The Current Server)</option>
      <option value="3">Shard's ID (On The Current Server)</option>
      <option value="4">Total Number of Servers (in Current Server's Shard)</option>
      <option value="5">Total Count of Members (in Current Server's Shard)</option>
      <option value="6">Total Server's List (On The Current Server's Shard)</option>
  </select>
</div><br><br><br>
<div>
  <div style="float: left; width: 35%; padding-top: 8px;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const client = this.getDBM().Bot.bot
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
// Server Count - Total Shards
client.shard.fetchClientValues('guilds.cache.size')
.then(results => {
const totalshardservercount = results.reduce((prev, guildCount) => prev + guildCount, 0)

// Member Count - Total Shards
client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
.then(results => {
const totalshardmembercount = results.reduce((prev, memberCount) => prev + memberCount, 0)

// Shard's ID - Current Server
const shardid2 = client.shard.ids
const shardid = Number(shardid2) + 1

    if (!client) {
      this.callNextAction(cache)
      return
    }
    let result
    switch (info) {
      case 0: // Total Count of Servers in All Shards
        result = totalshardservercount
        break
      case 1: // Total Count of Members in All Shards
        result = totalshardmembercount
        break
      case 2: // Shard's Ping On The Current Server
        result = client.shard.client.ws.ping
        break
      case 3: // Shard's ID On The Current Server
        result = shardid
        break
        case 4: // Total Count of Servers in Current Server's Shard
        result = client.guilds.cache.size
        break
        case 5: // Total Count of Members in Current Server's Shard
        result = client.guilds.cache.array()[0].memberCount
        break
        case 6: // Total Server's List On The Current Server's Shard
        result = client.shard.client.guilds.cache.array()
        break
      default:
        break
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  })
})
  },

  mod () {}
}