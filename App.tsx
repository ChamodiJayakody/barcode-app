import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import styles from './App.styles';

function App(): React.JSX.Element {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to scan barcodes',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'authorized');
    }
  };

  const fetchMessages = (code: string) => [
    `Broadcast for ${code} - 1`,
    `Broadcast for ${code} - 2`,
    `Broadcast for ${code} - 3`,
  ];

  const handleBarcodeDetected = (code: string) => {
    if (code && code !== barcode) {
      setBarcode(code);
      setError('');
      setLoading(true);
      setTimeout(() => {
        setScanning(false);
        setMessages(fetchMessages(code));
        setLoading(false);
      }, 600);
    }
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // Here you would implement the barcode detection logic
    // This is a placeholder - you'll need to implement the actual barcode detection
    // using a native module or a library like MLKit
    const detectedCode = ''; // Replace with actual barcode detection
    if (detectedCode) {
      runOnJS(handleBarcodeDetected)(detectedCode);
    }
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Permission Required</Text>
        <Text style={styles.helper}>Please grant camera permission to scan barcodes</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={checkPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanning && messages.length === 0 ? (
        <>
          <Text style={styles.title}>Scan the bar code</Text>
          <Text style={styles.helper}>Press the button below and scan the barcode.</Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => {
              setScanning(true);
              setBarcode('');
              setMessages([]);
              setError('');
            }}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        </>
      ) : scanning ? (
        <View style={{ flex: 1 }}>
          {device && (
            <Camera
              style={{ flex: 1 }}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          )}
          <View style={styles.overlay}>
            <View style={styles.magnifierIcon}>
              <View style={styles.magnifierCircle} />
              <View style={styles.magnifierHandle} />
            </View>
            <Text style={styles.title}>Scanning...</Text>
            <Text style={styles.helper}>Point camera at barcode</Text>
            {error ? (
              <Text style={{ color: 'red', alignSelf: 'center', marginTop: 8 }}>{error}</Text>
            ) : null}
            {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}
          </View>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => {
              setScanning(false);
              setBarcode('');
              setMessages([]);
              setError('');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.prevButtonText}>← Home</Text>
          </TouchableOpacity>
        </View>
      
      ) : (
        <>
          <Text style={styles.checkmark}>✔</Text>
          <Text style={styles.title}>Broadcast Messages</Text>
          <Text style={styles.helper}>
            Scanned barcode: <Text style={styles.barcode}>{barcode}</Text>
          </Text>
          {messages.length === 0 ? (
            <Text style={styles.emptyState}>No messages found for this barcode.</Text>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.messageItem}>
                  <Text>{item}</Text>
                </View>
              )}
              style={{ marginTop: 10, marginBottom: 20 }}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setMessages([]);
              setBarcode('');
              setError('');
              setScanning(true);
              setTimeout(() => inputRef.current?.focus(), 100);
              console.log('Scan another button pressed',test);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Scan Another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.prevButton}
            onPress={() => {
              setMessages([]);
              setBarcode('');
              setError('');
              setScanning(false);
              
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.prevButtonText}>⌂ Home</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default App;