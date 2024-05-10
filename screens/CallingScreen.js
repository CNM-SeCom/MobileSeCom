import React, {useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
const localHtmlFile = require('./CallView.html'); // Thay đổi đường dẫn tới tệp HTML của bạn



export default function App() {

  useEffect(() => {
    console.log('HtmlCall', localHtmlFile);
  });

  return (
    <View style={styles.container}>
      <WebView
        source={localHtmlFile}
        style={styles.webview}
        
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
