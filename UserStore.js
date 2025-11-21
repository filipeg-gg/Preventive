
// Banco de dados simulado
let users = [];       // Lista de todos os usuários cadastrados
let currentUser = {}; // Usuário logado

export const registerUser = (userData) => {
  // Checar se o email já existe
  const exists = users.find(u => u.email === userData.email);
  if (exists) return false;

  // Adicionar usuário na lista
  users.push(userData);
  return true;
};

export const loginUser = (email, password) => {
  const user = users.find(
    u => u.email === email && u.password === password
  );
  if (user) {
    currentUser = user;
    return true;
  }
  return false;
};

export const getCurrentUser = () => currentUser;

export const logoutUser = () => {
  currentUser = {};
};
