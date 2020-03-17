const express = require('express');
const auth = require('basic-auth');
const {accesCode} = require('./config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {SupplyAndLeft,Student,School, SupplyAndLeftAnalysis} = require('../models')

const router = express.Router()

const checkHeader = (req,res,next) => {
  let message = null;
  const credential = auth(req);
  if(credential){
    if(accesCode[credential.name]==credential.pass){
      req.auth = credential
    } else {
      req.auth = null
      message = "AccessCode is wrong."
    }
  } else {
    message = 'There is no credential.'
  }
  if(message){
    const error = new Error(message);
    error.status = 401;
    next(error);
  } else {
    next();
  }
}

/**
 * 데이터가 있는 날짜 리스트 
 */
router.get('/days/:table/:limit', async (req,res,next)=>{
  const {table, limit} = req.params
  let dates = []
  if(table === 'SupplyAndLeft'){
    dates = await SupplyAndLeft.findAll({
      attributes:[[
        Sequelize.fn('DISTINCT', Sequelize.col('date')), 'date'
      ]],
      order:[
        ['date', 'DESC']
      ],
      limit: Number(limit)
    }).catch((err)=>{
      console.log('err', err)
     res.status(500).json()})

  } else if ( table === 'SupplyAndLeftAnalysis') {
    dates = await SupplyAndLeftAnalysis.findAll({
      attributes:[[
        Sequelize.fn('DISTINCT', Sequelize.col('date')),'date'
      ]],
      order:[
        ['date', 'DESC']
      ],
      limit: Number(limit)
    }).catch((err)=>{
      console.log('err', err)
     res.status(500).json()})
  }
  const dateList = Object.values(dates).reduce((acc, date)=>{
    return [...acc, date.date]
  },[])
  console.log(dateList)
  res.status(200).json(dateList)
})

/*
schoolId, grade, classNumber, selectedDate 에 대하여
"all" 혹은 특정 값을 넣어 데이터 추출하는 라우팅
 */
router.get('/supplyandleft/:schoolUniqueNum/:grade/:classNumber/:selectedDate/:firstDate', checkHeader, (req,res,next) => {
  if(req.auth){
    const {schoolUniqueNum, grade, classNumber, selectedDate, firstDate} = req.params
    const queries = {
      include:[{
        model:Student,
        where:{}
      }],
      where:{}
    }
    schoolUniqueNum != "all" ? queries.include[0].where.schoolUniqueNum=schoolUniqueNum : null
    grade != "all" ? queries.include[0].where.grade=grade : null
    classNumber != "all" ? queries.include[0].where.class_num=classNumber : null
    selectedDate != "all" ? queries.where.date = {
      [Op.and]:{
        [Op.gte]:firstDate,
        [Op.lte]:selectedDate
      }
    } : null

    SupplyAndLeft.findAll(queries).then(data =>{
      res.status(200).json(data)
    }).catch(err =>{
      throw err;
    })
  } else {
    res.status(401).end()
  }

});


/*
  supplyandleft 와 같으나 supplyAndLeftAnlaysis 테이블 데이터 가져옴
 */
 router.get('/supplyAndLeftAnalysis/:schoolUniqueNum/:grade/:classNumber/:selectedDate/:firstDate', checkHeader, (req,res,next) => {
   if(req.auth){
     const {schoolUniqueNum, grade, classNumber, selectedDate, firstDate} = req.params
     const queries = {
       include:[{
         model:Student,
         where:{}
       }],
       where:{}
     }
     schoolUniqueNum != "all" ? queries.include[0].where.schoolUniqueNum=schoolUniqueNum : null
     grade != "all" ? queries.include[0].where.grade=grade : null
     classNumber != "all" ? queries.include[0].where.class_num=classNumber : null
     selectedDate != "all" ? queries.where.date = {
       [Op.and]:{
         [Op.gte]:firstDate,
         [Op.lte]:selectedDate
       }
     } : null

     SupplyAndLeftAnalysis.findAll(queries).then(data =>{
       res.status(200).json(data)
     }).catch(err =>{
       throw err;
     })
   } else {
     res.status(401).end()
   }

 })

router.get('/students/:schoolUniqueNum', (req,res,next)=>{
  const {schoolUniqueNum} = req.params
  Student.findAll({
    attributes:["uniqueNum"],
    where:{
      schoolUniqueNum:schoolUniqueNum,
      participate:1
    }
  }).then(data =>
  res.status(200).json(data)).catch(err=>{
    throw err;
  })
})




router.get('/org', checkHeader,(req,res,next) =>{
  if(req.auth){
    res.status(200).json(req.auth)
  } else {
    res.status(404).end()
  }
})

module.exports = router
