const habits = ["筋トレ", "ランニング", "読書", "英語学習", "映画鑑賞", "ヨガ"];
let habitData = JSON.parse(localStorage.getItem("habitData")) || {};

document.addEventListener("DOMContentLoaded", () => {
  updateDate();
  renderHabits();
  setInterval(updateDate, 1000);
});

// 日付とカウントダウンを更新
function updateDate() {
  const now = new Date();
  document.getElementById("today-date").textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 (${["日", "月", "火", "水", "木", "金", "土"][now.getDay()]})`;

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById("countdown").textContent = 
    `日付変更まで ${h}時間${m}分${s}秒`;
}

// 習慣の描画
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
      <span class="habit-name">${habit}</span>
      <span class="streak">🔥 ${habitData[habit].streak}日連続</span>
      <button class="complete-btn" ${doneToday ? 'disabled' : ''}>
        ${doneToday ? '完了済み' : '完了'}
      </button>
    `;

    habitEl.querySelector(".complete-btn").onclick = () => completeHabit(habit);
    container.appendChild(habitEl);
  });
}

// 習慣を完了した時の処理
function completeHabit(habit) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (habitData[habit].lastDone === today) return;

  if (habitData[habit].lastDone === yesterday) {
    habitData[habit].streak++;
  } else {
    habitData[habit].streak = 1;
  }

  habitData[habit].lastDone = today;
  localStorage.setItem('habitData', JSON.stringify(habitData));

  renderHabits();
}
