import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


//telas iniciais e login
import Tl1 from './telas/pre/iniciais/tl1'
import Tl2 from './telas/pre/iniciais/tl2'
import Tl3 from './telas/pre/iniciais/tl3'
import Inicial from './telas/pre/login/Inicial'
import Login from './telas/pre/login/Login'
import Cadastro from './telas/pre/login/Cadastro'

//telas principal
import Principal from './telas/conteudo/principal/Principal'

//telas cuidados
import Cuidados from './telas/conteudo/cuidados/Cuidados'
import Diario from './telas/conteudo/cuidados/tlsCuidados/diario'
import Medicamentos from './telas/conteudo/cuidados/tlsCuidados/medicamentos'
import Respiracao from './telas/conteudo/cuidados/tlsCuidados/respiracao'
import Yoga from './telas/conteudo/cuidados/tlsCuidados/yoga'
import Relatorios from './telas/conteudo/cuidados/tlsCuidados/relatorios'

//telas Eventos
import Consulta from './telas/conteudo/eventos/Consulta'
import Exame from './telas/conteudo/eventos/Exame'
import Resultado from './telas/conteudo/eventos/Resultado'

//telas exames
import Exames from './telas/conteudo/exames/Exames'

//telas chat
import ChatBot from './telas/conteudo/chat/ChatBot'


//telas perfil
import Perfil from './telas/conteudo/perfil/Perfil'
import Ajuda from './telas/conteudo/perfil/Tls/Aju'
import EditP from './telas/conteudo/perfil/Tls/EditP'
import Notificacoes from './telas/conteudo/perfil/Tls/Not'
import Pagamento from './telas/conteudo/perfil/Tls/Pag'
import Preferencias from './telas/conteudo/perfil/Tls/Pref'
import Privacidade from './telas/conteudo/perfil/Tls/Priv'


const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <NavigationContainer >
    <Drawer.Navigator initialRouteName="Tl1" 
        screenOptions={{ 
          swipeEnabled: false, 
          drawerStyle: { display: 'none' },  
          gestureEnabled: false, 
          edgeWidth: 0  
        }}>
      <Drawer.Screen name="Tl1" component={Tl1} options={{headerShown:false}}/>  
      <Drawer.Screen name="Tl2" component={Tl2} options={{headerShown:false}}/> 
      <Drawer.Screen name="Tl3" component={Tl3} options={{headerShown:false}}/>  
      <Drawer.Screen name="Inicial" component={Inicial} options={{headerShown:false}}/>     
      <Drawer.Screen name="Login" component={Login} options={{headerShown:false}}/>  
      <Drawer.Screen name="Cadastro" component={Cadastro} options={{headerShown:false}}/>  
      <Drawer.Screen name="Principal" component={Principal} options={{headerShown:false}}/>  
      <Drawer.Screen name="Cuidados" component={Cuidados} options={{headerShown:false}}/>
      <Drawer.Screen name="Diario" component={Diario} options={{headerShown:false}}/>
      <Drawer.Screen name="Medicamentos" component={Medicamentos} options={{headerShown:false}}/>
      <Drawer.Screen name="Respiracao" component={Respiracao} options={{headerShown:false}}/>
      <Drawer.Screen name="Yoga" component={Yoga} options={{headerShown:false}}/>
      <Drawer.Screen name="Relatorios" component={Relatorios} options={{headerShown:false}}/>
      <Drawer.Screen name="Consulta" component={Consulta} options={{headerShown:false}}/>
      <Drawer.Screen name="Exame" component={Exame} options={{headerShown:false}}/>
      <Drawer.Screen name="Resultado" component={Resultado} options={{headerShown:false}}/>
      <Drawer.Screen name="Exames" component={Exames} options={{headerShown:false}}/>
      <Drawer.Screen name="ChatBot" component={ChatBot} options={{headerShown:false}}/>
      <Drawer.Screen name="Perfil" component={Perfil} options={{headerShown:false}}/>
      <Drawer.Screen name="Ajuda" component={Ajuda} options={{headerShown:false}}/>
      <Drawer.Screen name="EditP" component={EditP} options={{headerShown:false}}/>
      <Drawer.Screen name="Notificacoes" component={Notificacoes} options={{headerShown:false}}/>
      <Drawer.Screen name="Pagamento" component={Pagamento} options={{headerShown:false}}/>
      <Drawer.Screen name="Preferencias" component={Preferencias} options={{headerShown:false}}/>
      <Drawer.Screen name="Privacidade" component={Privacidade} options={{headerShown:false}}/>
    </Drawer.Navigator>
    </NavigationContainer>
  );
}


