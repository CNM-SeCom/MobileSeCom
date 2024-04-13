// import React, {useState} from 'react';
// import AgoraUIKit from 'agora-rn-uikit';
// import {Text} from 'react-native';
// import { useSelector } from 'react-redux';
// const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-token')

// const App = () => {

//   const user = useSelector((state) => state.user.user);

//   //tạo token của agora
//   const generateRtcToken = () => {
//     // Rtc Examples
//     const appId = '32d740730a2a4ef5a76bea03c694a608';
//     const appCertificate = '3d346d52a1434b67adade897b60d7988';
//     const channelName = 'SECOM'+user.idUser;
//     const uid  = user.idUser;
//     const userAccount = user.idUser;
//     const role = RtcRole.PUBLISHER;
  
//     const expirationTimeInSeconds = 3600
  
//     const currentTimestamp = Math.floor(Date.now() / 1000)
  
//     const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
  
//     // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.
  
//     // Build token with uid
//     const tokenA = RtcTokenBuilder.buildTokenWithUid(
//         appId,
//         appCertificate,
//         channelName,
//         uid,
//         role,
//         expirationTimeInSeconds,
//         privilegeExpiredTs
//       );
//     console.log("Token With Integer Number Uid: " + tokenA);
  
//     // Build token with user account
//     const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(
//       appId,
//       appCertificate,
//       channelName,
//       userAccount,
//       role, 
//       privilegeExpiredTs);
//     console.log("Token With UserAccount: " + tokenB);
//   }
//   generateRtcToken()

//   const [videoCall, setVideoCall] = useState(true);
//   const connectionData = {
//     appId: 'db5a69d26a664f998401dd828bbcbd95',
//     channel: "SECOM"+user.idUser,
//      token: tokenA,
//   };
//   console.log("::::::::::::::::::::::::::::::");
//   console.log(connectionData.channel);
//   const rtcCallbacks = {
//     EndCall: () => setVideoCall(false),
//   };
//   return videoCall ? (
//     <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
//   ) : (
//     <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
//   );
// };

// export default App;

// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const VideoCall = () => {
// //   return (
// //     <View>
// //       <Text>VideoCall</Text>
// //     </View>
// //   )
// // }

// // export default VideoCall

// // const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VideoCall = () => {
  return (
    <View>
      <Text>VideoCall</Text>
    </View>
  )
}

export default VideoCall

const styles = StyleSheet.create({})