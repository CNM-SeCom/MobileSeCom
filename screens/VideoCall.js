// import React, {useState} from 'react';
// import AgoraUIKit from 'agora-rn-uikit';

// const App = () => {
//   const [videoCall, setVideoCall] = useState(true);
//   const connectionData = {
//     appId: '32d740730a2a4ef5a76bea03c694a608',
//     channel: 'test',
//     token: '007eJxTYGCU/8UX2unUf6L7NsdkjsK7z0yerJgue1Byh/tXvmWLj5YqMBgbpZibGJgbGyQaJZqkppkmmpslpSYaGCebWZokmhlYVOW/SW0IZGRQ+V/PyMgAgSA+C0NJanEJAwMAPXcfvQ==',
//   };
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