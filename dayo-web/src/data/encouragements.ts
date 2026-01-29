// Toast messages and encouragements for each mode

export const adultEncouragements = {
  taskCreated: 'Task added',
  taskCompleted: 'Great job!',
  taskDeleted: 'Task removed',
  diarySaved: 'Entry saved',
  streakUpdated: (days: number) => `${days} day streak!`,
  habitCompleted: 'Habit completed',
  goalMilestone: 'Milestone achieved!',
  weeklyReview: 'Time to reflect on your week',
  morningGreeting: 'Good morning',
  afternoonGreeting: 'Good afternoon',
  eveningGreeting: 'Good evening',
}

export const kidsEncouragements = {
  taskCreated: 'Awesome! New adventure added!',
  taskCompleted: 'WOOHOO! You did it! 🎉',
  taskDeleted: 'Task zapped away!',
  diarySaved: 'Your story is saved! 📖',
  streakUpdated: (days: number) => `${days} days in a row! You're on FIRE! 🔥`,
  habitCompleted: 'Super star! ⭐',
  goalMilestone: 'AMAZING! You reached a goal! 🏆',
  weeklyReview: 'Let\'s see all your awesome adventures!',
  morningGreeting: 'Good morning, superstar!',
  afternoonGreeting: 'Hey there, champion!',
  eveningGreeting: 'Great job today!',
}

// Celebration messages for streaks
export const adultStreakCelebrations: Record<number, string> = {
  3: 'Nice streak going!',
  7: 'One week strong!',
  14: 'Two weeks of consistency!',
  30: 'One month milestone!',
  50: 'Halfway to 100!',
  100: '100 days! Incredible!',
}

export const kidsStreakCelebrations: Record<number, string> = {
  3: 'You\'re building a streak! Keep going! 🌟',
  7: 'ONE WHOLE WEEK! You\'re amazing! 🎊',
  14: 'TWO WEEKS?! You\'re a superstar! 🌈',
  30: 'A WHOLE MONTH! You\'re LEGENDARY! 👑',
  50: 'FIFTY DAYS! You\'re unstoppable! 🚀',
  100: '100 DAYS!! CHAMPION OF THE WORLD! 🏆',
}
