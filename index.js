require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
let checkAndPush=(rows)=>{
  console.log("Loaded "+doc.title);
  rows.forEach(el=>{
    console.log(el.G)
  })
}
(async()=>{
  await doc.useServiceAccountAuth(require('./credential.json'))
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows();
  setInterval(function(){checkAndPush(rows)}, 5000)
})()
