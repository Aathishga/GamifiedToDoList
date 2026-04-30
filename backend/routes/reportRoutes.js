const express = require("express");
const router = express.Router();
const { getDailyReport, getWeeklyReport, getMissedAnalysis } = require("../controllers/reportController");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/daily", getDailyReport);
router.get("/weekly", getWeeklyReport);
router.get("/analysis/missed", getMissedAnalysis);

module.exports = router;
