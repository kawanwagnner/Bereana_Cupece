// Variáveis globais
let nav = 0;
let clicked = null;
let events = [];

// Referências do DOM
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const calendar = document.getElementById("calendar");
const monthDisplay = document.getElementById("monthDisplay");
const viewEventModal = document.getElementById("viewEventModal");
const eventText = document.getElementById("eventText");
const closeButton = document.getElementById("closeButton");

// Constantes
const weekdays = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

// Carregar eventos do JSON
async function loadEvents() {
  try {
    const response = await fetch("db/events.json");
    events = await response.json();
    console.log("Eventos carregados do arquivo JSON: ", events);
    loadCalendar();
  } catch (error) {
    console.error("Erro ao carregar o arquivo JSON: ", error);
  }
}

// Carregar o calendário
function loadCalendar() {
  const currentDate = getCurrentDate();
  updateMonthDisplay(currentDate);
  generateCalendarDays(currentDate);
}

function getCurrentDate() {
  const date = new Date();
  if (nav !== 0) date.setMonth(new Date().getMonth() + nav);
  return date;
}

function updateMonthDisplay(date) {
  monthDisplay.innerText = date.toLocaleDateString("pt-br", {
    month: "long",
    year: "numeric",
  });
}

function generateCalendarDays(date) {
  calendar.innerHTML = "";
  const daysInMonth = getDaysInMonth(date);
  const paddingDays = getPaddingDays(date);

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const dayElement = createDayElement(i, paddingDays, date);
    calendar.appendChild(dayElement);
  }
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getPaddingDays(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dateString = firstDayOfMonth.toLocaleDateString("pt-br", {
    weekday: "long",
  });
  return weekdays.indexOf(dateString);
}

function createDayElement(dayIndex, paddingDays, date) {
  const dayElement = document.createElement("div");
  dayElement.classList.add("day");

  const dayNumber = dayIndex - paddingDays;
  const dayString = formatDateString(
    date.getFullYear(),
    date.getMonth() + 1,
    dayNumber
  );

  if (dayIndex > paddingDays) {
    dayElement.innerText = dayNumber;
    highlightCurrentDay(dayNumber, date, dayElement);
    displayEventIfExist(dayString, dayElement);
    dayElement.addEventListener("click", () => handleDayClick(dayString));
  } else {
    dayElement.classList.add("padding");
  }

  return dayElement;
}

function formatDateString(year, month, day) {
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

function highlightCurrentDay(dayNumber, date, dayElement) {
  const isToday = dayNumber === date.getDate() && nav === 0;
  if (isToday) dayElement.id = "currentDay";
}

function displayEventIfExist(dayString, dayElement) {
  const event = findEventByDate(dayString);
  if (event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");

    // Verifica o comprimento do título e aplica a truncagem
    eventDiv.innerText =
      event.title.length > 7 ? event.title.slice(0, 7) + "..." : event.title;

    dayElement.appendChild(eventDiv);
  }
}

function findEventByDate(dayString) {
  return events.find((event) => {
    const eventDate = new Date(event.date);
    return (
      formatDateString(
        eventDate.getFullYear(),
        eventDate.getMonth() + 1,
        eventDate.getDate()
      ) === dayString
    );
  });
}

function handleDayClick(dayString) {
  const event = findEventByDate(dayString);
  if (event) openEventModal(event);
}

// Abrir o modal de visualização de eventos
function openEventModal(event) {
  eventText.innerText = event.title;
  viewEventModal.style.display = "block";
  backDrop.style.display = "block";
  centerModal(viewEventModal);
}

function centerModal(modal) {
  const scrollPosition = window.scrollY;
  modal.style.top = `${scrollPosition + window.innerHeight / 2}px`;
}

// Fechar o modal
closeButton.addEventListener("click", closeEventModal);

// Fechar modal ao clicar fora dele
backDrop.addEventListener("click", (e) => {
  if (e.target === backDrop) closeEventModal();
});

function closeEventModal() {
  viewEventModal.style.display = "none";
  backDrop.style.display = "none";
}

// Navegação entre meses
function initializeNavigationButtons() {
  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    loadCalendar();
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    loadCalendar();
  });
}

// Inicializar a aplicação
function initialize() {
  loadEvents();
  initializeNavigationButtons();
}

initialize();
