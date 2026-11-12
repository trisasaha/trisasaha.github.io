const UNITS = { Water: "cups", Sleep: "hrs", Exercise: "min" };
let entries = [];
let currentFilter = "All";

const form = document.getElementById("entryForm");
const list = document.getElementById("entryList");
const message = document.getElementById("message");

async function loadEntries() {
  const saved = localStorage.getItem("habits");
  if (saved) { entries = JSON.parse(saved); return; }
  try {
    const res = await fetch("habits.json");
    if (!res.ok) throw new Error("Could not load starter data");
    entries = await res.json();
    save();
  } catch (err) {
    message.textContent = "Sorry, starter data could not be loaded.";
  }
}

function save() {
  localStorage.setItem("habits", JSON.stringify(entries));
}

function render() {
  const shown = entries.filter(e => currentFilter === "All" || e.habit === currentFilter);
  list.innerHTML = "";
  if (shown.length === 0) {
    list.innerHTML = "<li>No entries yet.</li>";
    return;
  }
  shown.sort((a, b) => b.date.localeCompare(a.date)).forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${e.habit}</strong> · ${e.date}</span><span>${e.amount} ${e.unit}</span>`;
    list.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const habit = document.getElementById("habit").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  if (isNaN(amount) || amount <= 0 || !date) {
    message.textContent = "Please enter an amount above 0 and a date.";
    return;
  }
  message.textContent = "";
  entries.push({ habit, amount, unit: UNITS[habit], date });
  save();
  render();
  form.reset();
});

document.getElementById("filters").addEventListener("click", e => {
  if (e.target.dataset.filter) {
    currentFilter = e.target.dataset.filter;
    document.querySelectorAll("#filters button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    render();
  }
});

loadEntries().then(render);
