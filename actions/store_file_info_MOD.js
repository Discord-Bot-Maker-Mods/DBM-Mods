module.exports = {
  name: 'Store File Info',
  section: 'File Stuff',
  subtitle (data) {
    return `Store File Info - ${data.info}`
  },
  fields: ['filePath', 'info', 'storage', 'varName'],
  variableStorage (data, varType) {
    const type = data.storage
    if (type !== varType) return
    const info = data.info
    let dataType = 'Unknown type'
    switch (info) {
      case 'File Size':
        dataType = 'Number'
        break
      case 'File Extension':
        dataType = 'String'
        break
      case 'File Character Count':
        dataType = 'Number'
        break
      case 'File Creation Date Timestamp':
        dataType = 'Timestamp'
        break
      case 'File Exists':
        dataType = 'Boolean'
        break
      case 'File Content':
        dataType = 'String'
        break
      case 'File Name':
        dataType = 'String'
        break
    }
    return ([data.varName, dataType])
  },
  html (isEvent, data) {
    return `
File path (example: <strong>./bot.js</strong>):
<input class='round' id='filePath' /><br>
Info:
<select class='round' id='info'>
  <option value='File Size'>File Size</option>
  <option value='File Extension'>File Extension</option>
  <option value='File Character Count'>File Character Count</option>
  <option value='File Creation Date Timestamp'>File Creation Date Timestamp</option>
  <option value='File Exists'>File Exists</option>
  <option value='File Content'>File Content</option>
  <option value='File Name'>File Name</option>
</select><br>
Store in:<br>
<select class='round' id='storage'>
  ${data.variables[0]}
</select><br>
Variable name:<br>
<input class='round' id='varName' />`
  },
  init () {},
  action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const info = data.info
    const path = require('path')
    const fs = require('fs')
    const varName = this.evalMessage(data.varName, cache)
    const filePath = this.evalMessage(data.filePath, cache)
    if (!filePath) {
      console.log('Insert a file path!')
    } else {
      let result
      switch (info) {
        case 'File Size':
          result = fs.statSync(filePath).size
          break
        case 'File Extension':
          result = path.extname(/[^/]*$/.exec(filePath)[0])
          break
        case 'File Character Count':
          result = fs.readFileSync(filePath).toString().length
          break
        case 'File Creation Date Timestamp':
          result = fs.statSync(filePath).mtimeMs
          break
        case 'File Exists':
          result = fs.existsSync(filePath)
          break
        case 'File Content':
          result = fs.readFileSync(filePath).toString()
          break
        case 'File Name':
          result = path.basename(filePath)
          break
      }
      this.storeValue(result, storage, varName, cache)
    }
    this.callNextAction(cache)
  },
  mod () {
  }
}
