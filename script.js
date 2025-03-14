const habits = ["筋トレ", "ランニング", "読書", "英語学習", "映画鑑賞", "ヨガ"];
const habitData = JSON.parse(localStorage.getItem('habitData')) || {};

document.addEventListener('DOMContentLoaded', () => {
  renderHabits();
  if ('Notification' in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

function renderHabits() {
  const container = document.getElementById('habits');
  container.innerHTML = "";

  habits.forEach(habit => {
    if (!habitData[habit]) {
      habitData[habit] = { streak: 0, lastDone: null };
    }

    const today = new Date().toDateString();
    const doneToday = habitData[habit].lastDone === today;

    const habitEl = document.createElement('div');
    habitEl.className = 'habit';

    habitEl.innerHTML = `
      <div>
        <div class="habit-name">${habit}</div>
        <div class="streak">🔥 ${habitData[habit].streak}日連続中</div>
      </div>
      <button class="complete-btn" ${doneToday ? "disabled" : ""}>${doneToday ? "完了済" : "達成"}</button>
    `;

    habitEl.querySelector('.complete-btn').addEventListener('click', () => completeHabit(habit));

    container.appendChild(habitEl);
  });
}

function completeHabit(habit) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (habitData[habit].lastDone === today) return;

  if (habitData[habit].lastDone === yesterday) {
    habitData[habit].streak += 1;
  } else {
    habitData[habit].streak = 1;
  }

  habitData[habit].lastDone = today;
  localStorage.setItem('habitData', JSON.stringify(habitData));

  notifyUser(habit, habitData[habit].streak);
  renderHabits();
}

function notifyUser(habit, streak) {
  if ('Notification' in window && Notification.permission === "granted") {
    new Notification('🎉 おめでとう！', {
      body: `${habit}を達成しました！${streak}日連続中です。`,
    });
  }
}
