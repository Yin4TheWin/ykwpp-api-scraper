require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const functions = require('firebase-functions');
const admin=require('firebase-admin')
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const serviceAccount = require("./serviceKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const db=admin.database()

let checkAndPush=async (doc)=>{
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]
  const oldSheet = doc.sheetsByIndex[1]
  const old = await oldSheet.getRows();
  const rows = await sheet.getRows();
  let newChanges=[]
  //Look at info from previous scrape and remove from current
  old.forEach(oldName=>{
    rows.forEach((el,i)=>{
      if(oldName.name===el.name){
        rows.splice(i, 1)
      }
    })
  })
  console.log("Loaded "+doc.title);
  rows.forEach(async(el)=>{
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
      series: el.series,
      img: el.img,
      alias: el.alias
    }
    newChanges.push(yokaiObj)
  })
  await oldSheet.addRows(newChanges)
  newChanges.forEach(async(el)=>{
    console.log(el)
    try{
      let aliases=el.alias.split(", ")
      const ref=db.ref("en/yokai/"+el.name.replace(/[^0-9a-z]/gi, '').toLowerCase())
      await ref.set({
        tribe: el.tribe,
        rank: el.rank,
        hp: el.hp,
        atk: el.attack,
        soult: el.soult,
        skill: el.skill,
        gsoult: el.g,
        img: el.img,
        series: el.series,
        actualName: el.name,
        alias: aliases
      })
      console.log("Push success")
    }catch(err){
      console.log("Something bad happen.")
    }
  })
}
(async()=>{
  await doc.useServiceAccountAuth(require('./credential.json'))
  checkAndPush(doc)
  setInterval(function(){checkAndPush(doc)}, 60000)
})()
