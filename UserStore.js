import { auth, db } from './firebaseConfig'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

let currentUser = null; 
export const registerUser = async (userData) => {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      usuario: userData.usuario,
      sobrenome: userData.sobrenome,
      sexo: userData.sexo,
      dataNascimento: userData.dataNascimento,
      email: userData.email,
      createdAt: new Date().toISOString()
    });

    return { success: true, user };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    let msg = "Erro ao criar conta.";
    if (error.code === 'auth/email-already-in-use') msg = "E-mail já está em uso.";
    if (error.code === 'auth/invalid-email') msg = "E-mail inválido.";
    if (error.code === 'auth/weak-password') msg = "A senha deve ter pelo menos 6 caracteres.";
    return { success: false, error: msg };
  }
};


export const loginUser = async (email, password) => {
  try {
   
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
  
      currentUser = { uid: user.uid, ...docSnap.data() };
      return { success: true, user: currentUser };
    } else {
      return { success: false, error: "Usuário encontrado, mas sem dados de perfil." };
    }

  } catch (error) {
    console.error("Erro no login:", error);
    let msg = "Erro ao entrar.";
    if (error.code === 'auth/invalid-credential') msg = "E-mail ou senha incorretos.";
    if (error.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
    if (error.code === 'auth/wrong-password') msg = "Senha incorreta.";
    return { success: false, error: msg };
  }
};


export const getCurrentUser = () => currentUser;

export const logoutUser = async () => {
  try {
    await signOut(auth);
    currentUser = null;
    return true;
  } catch (error) {
    return false;
  }
};