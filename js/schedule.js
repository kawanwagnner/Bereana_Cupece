// Variáveis globais
let nav = 0;
let clicked = null;
let events = JSON.parse(localStorage.getItem("events") || "[]"); // Inicializando de forma segura

// Variáveis do modal:
const newEvent = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");

// Array com os dias da semana:
const weekdays = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

// Funções

function openModal(date) {
  console.log("Abrindo modal para a data: ", date);
  clicked = date;
  const eventDay = events.find((event) => event.date === clicked);

  if (eventDay) {
    console.log("Evento existente encontrado: ", eventDay.title);
    document.getElementById("eventText").innerText = eventDay.title;
    deleteEventModal.style.display = "block";
  } else {
    console.log("Nenhum evento existente, abrindo modal de novo evento");
    newEvent.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  console.log("Carregando calendário...");
  const date = new Date();

  // Alterar o título do mês
  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);
  const dateString = firstDayMonth.toLocaleDateString("pt-br", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  // Mostrar mês e ano
  console.log(`Exibindo mês: ${month + 1}, Ano: ${year}`);
  document.getElementById(
    "monthDisplay"
  ).innerText = `${date.toLocaleDateString("pt-br", {
    month: "long",
  })}, ${year}`;

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  // Criar divs para os dias
  for (let i = 1; i <= paddingDays + daysMonth; i++) {
    const dayS = document.createElement("div");
    dayS.classList.add("day");
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      dayS.innerText = i - paddingDays;

      const eventDay = events.find((event) => event.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        console.log("Destacando o dia atual");
        dayS.id = "currentDay"; // Destacar o dia atual
      }

      if (eventDay) {
        console.log("Evento encontrado para o dia: ", eventDay.title);
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener("click", () => {
        console.log("Dia clicado: ", dayString);
        openModal(dayString);
      });
    } else {
      dayS.classList.add("padding");
    }

    calendar.appendChild(dayS);
  }
}

function closeModal() {
  console.log("Fechando modal");
  eventTitleInput.classList.remove("error");
  newEvent.style.display = "none";
  backDrop.style.display = "none";
  deleteEventModal.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

// Validação de eventos duplicados e limite de caracteres
function saveEvent() {
  const eventTitle = eventTitleInput.value.trim();
  console.log("Salvando evento: ", eventTitle);

  if (eventTitle.length === 0) {
    eventTitleInput.classList.add("error");
    console.log("Erro: Título do evento vazio");
    return;
  }

  if (eventTitle.length > 30) {
    eventTitleInput.classList.add("error");
    console.log("Erro: O título do evento é muito longo");
    alert("O título do evento não pode ter mais de 30 caracteres!");
    return;
  }

  const duplicateEvent = events.find(
    (event) => event.date === clicked && event.title === eventTitle
  );

  if (duplicateEvent) {
    eventTitleInput.classList.add("error");
    console.log("Erro: Evento duplicado");
    alert("Já existe um evento com esse título nesta data.");
    return;
  }

  eventTitleInput.classList.remove("error");
  console.log("Evento salvo com sucesso");
  events.push({ date: clicked, title: eventTitle });
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function deleteEvent() {
  console.log("Deletando evento para a data: ", clicked);
  events = events.filter((event) => event.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

// Fechar modal com 'Esc' ou clique fora do modal
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    console.log("Tecla 'Esc' pressionada, fechando modal");
    closeModal();
  }
});

backDrop.addEventListener("click", () => {
  console.log("Clique fora do modal, fechando");
  closeModal();
});

// Botões
function buttons() {
  document.getElementById("backButton").addEventListener("click", () => {
    console.log("Botão 'Voltar' clicado");
    nav--;
    load();
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    console.log("Botão 'Próximo' clicado");
    nav++;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", () => {
    console.log("Botão 'Salvar' clicado");
    saveEvent();
  });

  document.getElementById("cancelButton").addEventListener("click", () => {
    console.log("Botão 'Cancelar' clicado");
    closeModal();
  });

  document.getElementById("deleteButton").addEventListener("click", () => {
    console.log("Botão 'Deletar' clicado");
    deleteEvent();
  });

  document.getElementById("closeButton").addEventListener("click", () => {
    console.log("Botão 'Fechar' clicado");
    closeModal();
  });
}

buttons();
load();
