import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EvilIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text,setText] = useState("");
  const [toDos,setToDos] = useState({})
  const travel = () => setWorking(false);
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload);

  const checkToDo = (key) => {
    setToDos((prev)=>({
        ...prev,[key]:{
          ...prev[key],
          check:!prev[key].check
        }
      })
    )
  }
  const addToDo = async (payload) => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]:{text,working,check:false}
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    console.log("dddd+")
  }
  const STORAGE_KEY = "@toDos";
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
    } catch(e){
      console.log(e)
    }
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    const toDos = JSON.parse(s)
    setToDos(toDos)
  };
  useEffect(() => {
    loadToDos();
  },[])
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do","Are you sure?",[
      {text:"Cancel"},
      {text:"I'm Sure",
      style:"destructive",
    onPress:() => {
      const newToDos = {...toDos};
      delete newToDos[key];
      setToDos(newToDos);
      saveToDos(newToDos);
    }}
    ])
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ?  "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.gray : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput
        onSubmitEditing={addToDo}
        placeholder={working? "Add a To Do" : "Where do you want to go"}
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        />
        <ScrollView>
          {
          Object.keys(toDos).map(key =>(
            toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {console.log(toDos[key])}
              <Text style={toDos[key].check?{...styles.toDoText,textDecorationLine:"line-through",color:"black"}:styles.toDoText}>{toDos[key].text}</Text>
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>checkToDo(key)}>
                  <Feather name={toDos[key].check?"check-square":"square"} size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>deleteToDo(key)}>
                  <EvilIcons name="trash" size={30} color="black"/>
                </TouchableOpacity>
              </View>
            </View>) : null
          ))
          }
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText:{
    fontSize:44,
    fontWeight:"600",
  },
  input:{
    backgroundColor:"white",
    paddingHorizontal: 10,
    paddingVertical:10,
    marginTop:10,
    marginBottom:10,
    fontSize:18,
  },
  toDo:{
    flexDirection:"row",
    justifyContent:'space-between',
    backgroundColor: theme.toDoBg,
    marginBottom:20,
    paddingHorizontal: 20,
    paddingVertical:10,
    borderRadius: 15,
  },
  toDoText:{
    color:"white",
    fontSize:18,
    fontWeight: "500",
  }
});
