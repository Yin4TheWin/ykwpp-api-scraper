require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
let checkAndPush=(rows)=>{
  let newChanges=[]
  console.log("Loaded "+doc.title);
  rows.forEach(el=>{
    let yokaiObj={
      //name rank tribe hp attack soult skill g series
      name: el.name,
      rank: el.rank,
      tribe: el.tribe,
      hp: el.hp,
      attack: el.attack,
      soult: el.soult,
      skill: el.skill,
      g: el.g,
      series: el.series
    }
    newChanges.push(yokaiObj)
  })
  newChanges.forEach(el=>{
    console.log(el)
  })
}
(async()=>{
  await doc.useServiceAccountAuth(require('./credential.json'))
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows();
  checkAndPush(rows)
  setInterval(function(){checkAndPush(rows)}, 50000)
})()
