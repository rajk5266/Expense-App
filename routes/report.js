const express = require('express');
const router = express.Router();
const controller = require('../controllers/report')
const auth = require('../middleware/auth')

router.get('/premium/report', controller.showReport)

router.get('/premium/report/history', auth.auth,controller.showReportHistory )

router.post('/premium/report/dailyReport', auth.auth, controller.showdailyReportData)

router.post('/premium/report/monthlyReport', auth.auth, controller.showmonthlyReportData)

router.post('/premium/report/customDate', auth.auth, controller.showCustomDateReport)

router.post('/premium/report/dailyReport/download', auth.auth, controller.dailyReportDownload )

router.post('/premium/report/monthlyReport/download', auth.auth, controller.monthlyReportDownload)

router.post('/premium/report/customDate/download', auth.auth, controller.customDateReportDownload)


module.exports = router;