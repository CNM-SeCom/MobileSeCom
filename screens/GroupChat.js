import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faMagnifyingGlass, faUserMinus, faPlus, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import ConversationUnit from '../components/ConversationUnit';
import DataUser from '../data/dataUser';
import DataGroupChat from '../data/dataGroupChat';
import Avatar from '../components/Avatar';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ip from '../data/ip'
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setChatData } from '../redux/chatDataSlice';
import { setCurrentId } from '../redux/currentIdSlice';
import axios from 'axios';
import { set } from 'core-js/core/dict';
import { setGroupInfo } from '../redux/groupInfoSlice';

const heigh = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const GroupChat = () => {

  const navigation = useNavigation();
  const mode = useSelector((state) => state.mode.mode);
  const user = useSelector((state) => state.user.user);
  let chatData = useSelector((state) => state.chatData.chatData);
  const dispatch = useDispatch()

;

  const [add, setAdd] = useState(false);
  const [valid, setValid] = useState(false);
  let [countmember, setCountmember] = useState(1);
  const [listAdd, setListAdd] = useState([]);
  const [name , setName] = useState('');
  const [listFriendFilter, setListFriendFilter] = useState([]);
  const [messageData, setMessageData] = useState([]);


  const [ participants, setParticipants] = useState([]);

  const [subModalVisible, setSubModalVisible] = useState(false);
  const [modalVisibleCreate, setModalVisibleCreate] = useState(false);
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;
      default:
        return state.theme.lightColors;
    }
  });

  useEffect(() => {
    handleSortByLastMessage(messageData);
  },[listAdd,messageData,countmember]);
  
  const getChatData = () => {
    axios.post('http://'+ip+':3000/getChatByUserId',{
      idUser: user.idUser
  })
    .then((response) => {
      setMessageData(handleFilterGroupChat(response.data.data)); 
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleFilterGroupChat = (chatData) => {
    const chat = chatData.filter((item) => item.type  === 'group' );
    return chat;
  }

  useFocusEffect(
    React.useCallback(() => {
      //loại bỏ hết các phần tử  trong mảng listAdd
      setListAdd([]);
      setCountmember(1);
      getChatData();
      return () => {
        
      };
    }, [])
  );

  const renderAddBtnModal = (add, id) => {
    if ( listAdd.indexOf(id) === -1){
      return (
        <TouchableOpacity
          style={styles.buttonAddFriend}
          onPress={() => {
            setAdd(true);
            setCountmember(countmember + 1);
            console.log('countmember', countmember);
            //xóa id khỏi mảng listAdd
            setListAdd(prevListAdd => [...prevListAdd, id]);
          }}
        >
          <FontAwesomeIcon icon={faPlus} size={30} color="#000" />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonAddFriend}
          onPress={() => {
            setAdd(false);
            setCountmember(countmember - 1);
            setListAdd(prevListAdd => prevListAdd.filter(itemId => itemId !== id));
          }}
        >
          <FontAwesomeIcon icon={faUserMinus} size={30} color="#000" />
        </TouchableOpacity>
      )
    }
  };

const searchFriendByName = (text) => {
    let filteredUser = {listFriend: user.listFriend.filter((item) => { 
        return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
    })};
    setListFriendFilter(filteredUser.listFriend);
}


  const renderCreateBtn =()=>{
      if(countmember > 2){
        return(
          <TouchableOpacity
            onPress={
              () => {
                setModalVisibleCreate(!modalVisibleCreate)
                handleCreateGroup();
                setListAdd([]);
              }}
            style={styles.buttonCreateGroup}
          >
            <LinearGradient
              colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
              start={{x: 0, y: 0}} // Điểm bắt đầu của gradient
              end={{x: 1, y: 1}} // Điểm kết thúc của gradient
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            />
            <Text
              style={styles.titleCreateGroup}
            >Tạo nhóm</Text>

          </TouchableOpacity>
        )
  }}

    // load tin nhan
    const loadMessageData = (id, navigation, name, idUser, image, participants) => {
      dispatch(setCurrentId(id));
      axios.post('http://'+ip+':3000/getMessageByChatId',{
        chatId: id
      }).then((response) => {
        dispatch(setChatData(response.data.data));
        dispatch(setGroupInfo({name: name, id: id, avatar: image, participants: participants}));
        navigation.navigate('ConversationGroup', {username: name, id : idUser, chatId: id,avatar: image, participants: participants});
      }).catch((error) => {
        console.log(error);
      });
    }

  const handleReload = () => {
    axios.post('http://'+ip+':3000/getChatByUserId',{
      idUser: user.idUser
    })
    .then((response) => {
      setMessageData(handleFilterGroupChat(response.data.data));
    })
    .catch((error) => {
      console.log(error);
    });

  }

  const handleSortByLastMessage = (data) => {
    data.sort((a, b) => {
      if(a.lastMessageTime < b.lastMessageTime){
        return -1; // Đảo ngược giá trị trả về
      }
      if(a.lastMessageTime > b.lastMessageTime){
        return 1; // Đảo ngược giá trị trả về
      }
      return 0;
    });
    setMessageData(data);
  }
  

  const handleCreateGroup = async() => {
    //các id có cả trong mảng listAdd và user.listFriend thì thêm vào mảng participants và thêm trường "role" = "member"    
    
    let listFriend = user.listFriend;
    let participants = [];
    listFriend.map((item) => {
      if(listAdd.indexOf(item.idUser) !== -1){
        if(user.idUser !== item.idUser ){
          let newItem = { ...item, role: "member" };
          participants.push(newItem);      
        }
        }    
    });
    let admin = { 
      idUser: user.idUser,
      name: user.name,
      avatar: user.avatar,
      role: "admin"
    };
    participants.unshift(admin);
    let data = {
      name: name ? name : "Nhóm mới " + user.name,
      listParticipant: participants,
      type: "group",
      idAdmin : user.idUser,
    };
    
    await axios.post('http://'+ip+':3000/createGroupChat', data )
      .then((res) => {
        setCountmember(1);
        handleReload();
      })
    // setCountmember(1);
    console.log('data', data);
  }



  const handleChooseGroup =(item)=>{
    navigation.navigate('ConversationGroup', {groupChat : item});
  }

  return (
    <View style={[
      { backgroundColor: colors.background },
      styles.container]}>
      <View style={[
        { backgroundColor: colors.background },
        styles.container]}>
        <View style={{
          width: '100%',
          height: 50,
          justifyContent: 'center',

        }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#001f3f" style={{
            position: 'absolute',
            top: 15,
            left: 25,
            zIndex: 1,

          }} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm"
            paddingLeft={40}
            opacity={0.5}
          />
        </View>
        <View style={[
          { backgroundColor: colors.background },
          styles.users]}>
          <FlatList
            
            data={messageData}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Avatar
                image={item.avatar}
              />
            )}
            keyExtractor={item => item.id}
            horizontal={true}
          />
        </View>
        <View style={{
          width: '100%',
          height: heigh * 0.7,
          alignItems: 'center',
        }}>
         {
          user != null ? (
            <FlatList
            contentContainerStyle={{
              paddingBottom : 100
            }}
            data={messageData}
            renderItem={({ item }) => (
              <ConversationUnit
                name={item.groupName}
                image={item.avatar}
                newMess={item.lastMessage}
                onPress={() => { 
                  // navigation.navigate('ConversationGroup')
                  // handleChooseGroup(item) 
                  loadMessageData(item.id, navigation, item.groupName, user.idUser, item.avatar, item.participants)
                }}
              />
            )}
          // keyExtractor={item => item.id}
          />
          ):null
         }
          <View
            style={styles.plusContainer}
          >
            <TouchableOpacity
              onPress={() => setModalVisibleCreate(true)}
              style={styles.iconPlusButton}
            >
              <FontAwesomeIcon icon={faPlus} size={40} color="#fff" />
            </TouchableOpacity>
          </View>


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleCreate}
            onRequestClose={() => {
              setModalVisibleCreate(!modalVisibleCreate);
            }}
          >
            <View
              style={styles.modalAddGroup}
            >
              <View
                style={styles.groupButtonModal}
              >
                <TextInput
                  style={styles.textInputGroupName}
                  placeholder="Nhập tên nhóm"
                  placeholderTextColor={'#000'}
                  onChangeText={(text) => setName(text)}
                />
                <TouchableOpacity
                  onPress={() => {
                    setSubModalVisible(!subModalVisible);
                  }}
                  style={styles.buttonSearchModal}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} size={25} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCloseModal}
                  onPress={() => setModalVisibleCreate(!modalVisibleCreate)}
                >
                  <FontAwesomeIcon icon={faXmark} size={35} color="#000" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                }}
              >
                {
                  user != null ? (
                    <FlatList
                    style={{
                    marginTop: 10,
                    width: '90%',
                    alignSelf: 'center',
                  }}
                  data={ listFriendFilter.length > 0 ? listFriendFilter : user.listFriend}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        //add == false và id không có trong mảng listAdd
                        listAdd.indexOf(item.idUser) == -1   ? { backgroundColor: '#C3F8FF' } : {
                          backgroundColor: '#9BCF53'
                        }
                        , styles.friendItem]}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          image={item.avatar}
                        />
                        <Text
                          style={{ color: '#000' }}
                        >{item.name}</Text>
                      </View>

                      {
                        renderAddBtnModal(add, item.idUser)
                      }
                    </View>
                  )}
                  keyExtractor={item => item.idUser}
                />
                  ): null
                }
                
              </View>
              {renderCreateBtn()}
            </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={subModalVisible}
                  onRequestClose={() => {
                    setSubModalVisible(!subModalVisible);
                  }}
                >
                  
                  <View
                    style={styles.subModal}
                  >
                    <LinearGradient
                      colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                      start={{ x: 0, y: 0 }} // Điểm bắt đầu của gradient
                      end={{ x: 1, y: 1 }} // Điểm kết thúc của gradient
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        borderRadius: 20,
                        alignSelf: 'center',
                        right: 0,
                        
                      }}
                    />
                    <TextInput
                      style={styles.textInputGroupName}
                      placeholder="Tìm kiếm"
                      autoFocus={true}
                      
                      placeholderTextColor={'#000'}
                      onChangeText={(text) => searchFriendByName(text)}
                    />
                    
                    <TouchableOpacity
                      style={styles.buttonCloseModal}
                      onPress={() => setSubModalVisible(!subModalVisible)}
                    >
                      <FontAwesomeIcon icon={faCheck} size={35} color="#000" />
                    </TouchableOpacity>
                    
                  </View>
                </Modal>

          </Modal>

        </View>
      </View>
    </View>
  )
}

export default GroupChat

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  customHeader: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  iconHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20,
    alignSelf: 'center',
  },
  iconUser: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  users: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
  },
  inputSearch: {
    width: '97%',
    height: 40,
    backgroundColor: '#808080',
    padding: 5,
    alignSelf: 'center',
    borderRadius: 30,
    color: '#fff',
    paddingLeft: 50,
  },
  plusContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,

  },
  iconPlusButton: {
    fontSize: 40,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3F8FF',
    borderRadius: 25,
  },
  modalAddGroup: {
    width: '95%',
    height: '75%',
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  groupButtonModal: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // backgroundColor: '#C3F8FF',
    padding: 5,
  },
  buttonSearchModal: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCloseModal: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputGroupName: {
    color: '#000',
    width: '80%',
    height: 50,
    padding: 5,
    alignSelf: 'center',
    borderRadius: 30,
    color: '#000',
    paddingLeft: 10,
    borderWidth: 2
  },
  friendItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
    marginVertical: 5,
    // backgroundColor: '#C3F8FF',
    borderRadius: 30,
    elevation: 10,
  },
  avatarFriendModal: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonCreateGroup: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3F8FF',
    borderRadius: 30,
    position  : 'absolute',
    bottom : 10,
    overflow: 'hidden',
    elevation: 10,

  }, 
  titleCreateGroup: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonAddFriend: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  subModal: {
    width: '95%',
    height:90,
    backgroundColor: 'pink',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '70%',
    borderRadius: 20,
    borderWidth: 2,
    elevation: 15,
    justifyContent : 'space-around',
    flexDirection : 'row',
  },
})