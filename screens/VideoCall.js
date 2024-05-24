import React, {useEffect, useRef, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
const localHtmlFile = require('./CallView.html'); // Thay đổi đường dẫn tới tệp HTML của bạn
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, set } from 'core-js/core/dict';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    
  }, [checkCall]);
  let [token, setToken] = useState('');
  let [callerId, setCallerId] = useState('');
  let [calleeId, setCalleeId] = useState(''); 
  let [checkCall, setCheckCall] = useState('');
  let [calleeName, setCalleeName] = useState('');

  const getToken = async () => {
    try {
      const data = await AsyncStorage.getItem('callToken');
      const datacallerId = await AsyncStorage.getItem('callerId');
      const datacalleeId = await AsyncStorage.getItem('calleeId');
      const datacheckCall = await AsyncStorage.getItem('checkCall');
      console.log("checkDataCall121211 :"+ datacheckCall);
      const datacalleeName = await AsyncStorage.getItem('calleeName');
      setToken(data);
      setCallerId(datacallerId);
      setCalleeId(datacalleeId);
      setCheckCall(datacheckCall);
      setCalleeName(datacalleeName);


      return data;
    } catch (error) {
      console.error(error);
    }
  }
  getToken();
  
  const webViewRef = useRef()


  return (
    <View style={styles.container}>
      <WebView
        source={localHtmlFile}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true} 
        onContentProcessDidTerminate={() => webViewRef.current.reload()}
        ref={webViewRef}
        onMessage={(event) => {
          if(event.nativeEvent.data === 'end'){
            navigation.goBack();
          }
        }}
        injectedJavaScript={`
            
        var callerId = 'user'+'${callerId}'
        var calleeId = 'user'+'${calleeId}'
        var token = '${token}'
        

        function settingCallEvent(call1, localVideo, remoteVideo, callButton, answerCallButton, endCallButton, rejectCallButton,calleeName) {
          call1.on('addremotestream', function (stream) {
          // reset srcObject to work around minor bugs in Chrome and Edge.
          console.log('addremotestream');
          remoteVideo.srcObject = null;
          remoteVideo.srcObject = stream;
      });
  
      call1.on('addlocalstream', function (stream) {
          // reset srcObject to work around minor bugs in Chrome and Edge.
          console.log('addlocalstream');
          localVideo.srcObject = null;
          localVideo.srcObject = stream;
      });
  
      call1.on('signalingstate', function (state) {
          console.log('signalingstate ', state);
          if (state.code === 3 ){
              calleeName.hide();
          }
          if (state.code === 6 || state.code === 5)//end call or callee rejected
          {
              //gửi ngược về react native thông báo end call và log nó ra
              callButton.show();
              endCallButton.hide();
              rejectCallButton.hide();
              answerCallButton.hide();
              localVideo.srcObject = null;
              remoteVideo.srcObject = null;
             
              window.ReactNativeWebView.postMessage("end")
              $('#incoming-call-notice').hide();
          }
      });
  
      call1.on('mediastate', function (state) {
          console.log('mediastate ', state);
      });
  
      call1.on('info', function (info) {
          console.log('on info:' + JSON.stringify(info));
      });
  }
  
  jQuery(function(){
  
      var localVideo = document.getElementById('localVideo');
      var remoteVideo = document.getElementById('remoteVideo');
      
      var callButton = $('#callButton');
      var answerCallButton = $('#answerCallButton');
      var rejectCallButton = $('#rejectCallButton');
      var endCallButton = $('#endCallButton');
      var toggleCameraButton = $('#toggleCamera');
      var toggleMicroButton = $('#toggleMic');
      var toggleCameraOn = $('#toggleCameraOn');
      var toggleMicroOn = $('#toggleMicOn');
      var calleeName = ''
      
      if('${checkCall}'==='true'){  
        calleeName = $('#call');
      }else{
        calleeName = $('#ring');
      }   

      var currentCall = null;
  
      var client = new StringeeClient();
      client.connect(token);
    
      client.on('connect', function(){
          console.log('+++ connected!');
      });
  
      client.on('authen', function(res){
          console.log('+++ on authen: ', res);
          // toggleCameraButton.show();
          // toggleMicroButton.show();
      });
  
      client.on('disconnect', function(res){
          console.log('+++ disconnected');
      });
  
      //MAKE CALL
      const makeCall = () => {
          currentCall = new StringeeCall(client, callerId, calleeId, true);
          calleeName.hide();

          settingCallEvent(currentCall, localVideo, remoteVideo, callButton, answerCallButton, endCallButton, rejectCallButton, calleeName);
          currentCall.customParameters = {x: true};
           currentCall.makeCall(function(res){
              console.log('+++ call callback: ', res);
              if (res.message === 'SUCCESS')
              {

                  document.dispatchEvent(new Event('connect_ok'));
              }
          });
      }

      

      if('${checkCall}'==='true'){
        setTimeout(() => {
          makeCall();
        }, 500);
       }

      if('${checkCall}'==='false'){
        // calleeName.text('${calleeName}'+ ' đang gọi');
      }else{
        // calleeName.text('Đang gọi ' + '${calleeName}');
      }

  
      //RECEIVE CALL
      client.on('incomingcall', function(incomingcall){
  
          $('#incoming-call-notice').show();
          currentCall = incomingcall;
          settingCallEvent(currentCall, localVideo, remoteVideo, callButton, answerCallButton, endCallButton, rejectCallButton, calleeName);

          calleeName.show();
          callButton.hide();
          rejectCallButton.show();
          answerCallButton.show()
      });
  
      //Event handler for buttons
      answerCallButton.on('click', function(){
          $(this).hide();
          rejectCallButton.hide();
          endCallButton.show();
          toggleCameraButton.show();
          toggleMicroOn.show();
          callButton.hide();
          calleeName.hide();
          console.log('current call ', currentCall, typeof currentCall);
          if (currentCall != null)
          {
              currentCall.answer(function(res){
                  console.log('+++ answering call: ', res);
              });
          }
          
      });
  
      rejectCallButton.on('click', function(){
          if (currentCall != null)
          {
              currentCall.reject(function(res){
                // AsyncStorage.setItem('checkCall', "true");
                  console.log('+++ reject call: ', res);
              });
          }
  
          $(this).hide();
          window.ReactNativeWebView.postMessage("end")
          answerCallButton.hide();
          
      });
  
      endCallButton.on('click', function(){
          if (currentCall != null)
          {
              currentCall.hangup(function(res){
                  console.log('+++ hangup: ', res);
                  // AsyncStorage.setItem('checkCall', "true");

                  window.ReactNativeWebView.postMessage("end")
              });
              
          }
          callButton.show();
          endCallButton.hide();
          
      });
  
      toggleCameraButton.on('click', function(){
        if (currentCall != null)
        {
           currentCall.enableLocalVideo(false);
           toggleCameraButton.hide();
           toggleCameraOn.show();
        }
        // Thêm điều kiện để thay đổi màu của nút button sau khi tắt camera
      });

      toggleCameraOn.on('click', function(){
        if (currentCall != null)
        {
           currentCall.enableLocalVideo(true);
           toggleCameraOn.hide();
           toggleCameraButton.show();
        }
        // Thêm điều kiện để thay đổi màu của nút button sau khi bật camera
      });
    
      toggleMicroOn.on('click', function(){
        if (currentCall != null)
        {
           currentCall.mute(false);
           toggleMicroOn.hide();
           toggleMicroButton.show();
        }
        // Thêm điều kiện để thay đổi màu của nút button sau khi tắt mic
      });

      toggleMicroButton.on('click', function(){
        if (currentCall != null)
        {
           currentCall.mute(true);
           toggleMicroButton.hide();
           toggleMicroOn.show();
        }
        // Thêm điều kiện để thay đổi màu của nút button sau khi bật mic
      });
  
      //event listener to show and hide the buttons
      document.addEventListener('connect_ok', function(){
          callButton.hide();
          endCallButton.show();
          toggleCameraButton.show();
          toggleMicroOn.show();
          calleeName.show();


      });
  
  
  });
        
        `}       
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
