import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import styles from './App.styles';

function App(): React.JSX.Element {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [test,settest] = useState("text test")

  const fetchMessages = (code: string) => [
    `Broadcast for ${code} - 1`,
    `Broadcast for ${code} - 2`,
    `Broadcast for ${code} - 3`,
  ];

  // Only update barcode as user scans/types
  const handleBarcodeInput = (text: string) => {
    setBarcode(text);
    setError('');
  };

  // Called when "Scan Complete" is pressed
  const handleScanComplete = () => {
    if (!barcode.trim()) {
      setError('Please scan a barcode before continuing.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setScanning(false);
      setMessages(fetchMessages(barcode));
      setLoading(false);
      Keyboard.dismiss();
    }, 600);
  };

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
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        </>
      ) : scanning ? (
        <View style={{ flex: 1 }}>
          {/* Main content centered */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.magnifierIcon}>
              <View style={styles.magnifierCircle} />
              <View style={styles.magnifierHandle} />
            </View>
            <Text style={styles.title}>Scanning...</Text>
            <Text style={styles.helper}>Scan the barcode now.</Text>
            {/* Hidden TextInput for barcode input */}
            <TextInput
              ref={inputRef}
              style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}
              value={barcode}
              onChangeText={handleBarcodeInput}
              blurOnSubmit={false}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="done"
              showSoftInputOnFocus={false}
            />
            {/* Scan Complete button */}
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={handleScanComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Scan Complete</Text>
            </TouchableOpacity>
            {error ? (
              <Text style={{ color: 'red', alignSelf: 'center', marginTop: 8 }}>{error}</Text>
            ) : null}
            {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}
          </View>
          {/* Left arrow button to go home */}
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