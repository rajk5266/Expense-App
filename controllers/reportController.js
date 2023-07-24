require("dotenv").config(); 
const path = require('path')
// const User = require('../models/user');
const reportLink = require('../models/report')
const AWS = require('aws-sdk')
const reportService = require('../service/showReport')

exports.showReport = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'report.html'))
}

exports.showReportHistory = async (req, res) => {
    try{
          const history = await reportLink.findAll({
            where: {
                userId : req.user
            }
          })
          res.send(history)
    }catch(err){
        res.status(404).json({message : 'not found'})
        console.log(err)
    }
}

exports.showdailyReportData = async (req, res) => {
    try{
     const date = req.body.Date
     const reportData = await reportService.generateDailyReport(req.user, date)
     res.send(reportData)
    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

exports.showmonthlyReportData = async (req, res) => {
    try {
        console.log(req.user, "hhikhk")
      const { month } = req.body;
      const userId = req.user;
      const reportData = await reportService.generateMonthlyReport(userId, month);
  
      res.send(reportData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

exports.showCustomDateReport = async (req, res) => {
  try{
    const {startDate , endDate} = req.body;
    const reportData = await reportService.generateCustomDateReport(req.user, startDate, endDate)
  
    res.send(reportData)
  }catch(err){
    console.log(err)
    res.status(500).json({success: false, error: 'Internal Server Error'})
  }
}

 function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.S3BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
    
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise ((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                console.log('something went wrong', err)
                reject(err)
            }else{
                console.log('success', s3response)
                resolve(s3response.Location);
            }
        })
    })
  
}

exports.dailyReportDownload = async (req, res) => {
    try{
     const userId = req.user
     const date = req.body.Date

     const downloadReportData = await reportService.generateDailyReport(req.user, date )
     const stringifiedreport = JSON.stringify(downloadReportData)
     const filename  = `Report${userId}/${new Date()}.txt`;
     const fileURL = await uploadToS3(stringifiedreport, filename);
     
     const reportDataLink = await reportLink.create({
         date: date,
         fileURL: fileURL,
         userId: req.user
        })
        res.status(200).send( reportDataLink)

    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, fileURL : ''});
    }
}

exports.monthlyReportDownload = async (req, res) => {
    try{
        const month = req.body.month;
        const userId = req.user

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
        
        const downloadReportData = await reportService.generateMonthlyReport(req.user, month)
        const stringifiedreport = JSON.stringify(downloadReportData)
        const filename  = `Report${userId}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedreport, filename);

        const monthNumber = month-1;
        const monthName = monthNames[monthNumber]

        const reportDataLink = await reportLink.create({
            date: monthName,
            fileURL: fileURL,
            userId: req.user
           })
           res.status(200).send( reportDataLink)
      
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, fileURL : ''});
    
    }
}

exports.customDateReportDownload = async (req, res) => {
    try{
          const startDate = req.body.startDate;
          const endDate= req.body.endDate;
          const userId = req.user;

          const downloadReportData = await reportService.generateCustomDateReport(userId , startDate, endDate)
          const stringifiedreport = JSON.stringify(downloadReportData)
          const filename  = `Report${userId}/${new Date()}.txt`;
          const fileURL = await uploadToS3(stringifiedreport, filename);
          const reportDataLink = await reportLink.create({
            date: `${startDate}' to '${endDate}`,
            fileURL: fileURL,
            userId: req.user
           })
           res.status(200).send( reportDataLink)
    }catch(err){
        console.log(err)
        res.status(500).json({ success: false, fileURL : ''});
    }
}


