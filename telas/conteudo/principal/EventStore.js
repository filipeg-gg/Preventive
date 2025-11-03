// EventStore.js- arrumar o armazenamento de dados, adicionar evento no dia correto, criar telas de detalhes, dar uma geral em tudo. 
let events = [];
let currentId = 1;

const tipoCor = {
  Exame: "#f472b6",
  Resultado: "#60a5fa",
  Consulta: "#fb923c",
};

// Adiciona evento
export function addEvent(event) {
  const [dia, mes, ano] = event.data.split("/").map(Number);
  const dataObj = new Date(ano, mes - 1, dia);

  const newEvent = {
    ...event,
    id: currentId++,
    date: dataObj,
    color: tipoCor[event.tipo] || "#3b82f6",
  };

  events.push(newEvent);
  return newEvent;
}

// Retorna todos
export function getEvents() {
  return events;
}

// Busca evento por id
export function getEventById(id) {
  return events.find((e) => e.id === id);
}

// Retorna só os futuros
export function getUpcomingEvents() {
  const hoje = new Date();
  return events.filter((ev) => ev.date >= hoje);
}
