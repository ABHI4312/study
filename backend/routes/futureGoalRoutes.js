const express = require('express');
const router = express.Router();
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  toggleGoal,
  deleteGoal,
} = require('../controllers/futureGoalController');

router.route('/').get(getGoals).post(createGoal);

router.route('/:id').get(getGoal).put(updateGoal).delete(deleteGoal);

router.route('/:id/toggle').put(toggleGoal);

module.exports = router;
