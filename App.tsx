import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import styles from './App.styles';

function App(): React.JSX.Element {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const fetchMessages = (code: string) => [
    `Broadcast for ${code} - 1`,
    `Broadcast for ${code} - 2`,
    `Broadcast for ${code} - 3`,
  ];

  const handleScanSubmit = () => {
    if (!barcode.trim()) return;
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
          <Text style={styles.helper}>Press the button below to start scanning.</Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => {
              setScanning(true);
              setBarcode('');
              setMessages([]);
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
    {/* Top reload button */}
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={() => {
          setBarcode('');
          setMessages([]);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.reloadButtonText}>⟳ Reload</Text>
      </TouchableOpacity>
    </View>
    {/* Main content centered */}
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={styles.magnifierIcon}>
        <View style={styles.magnifierCircle} />
        <View style={styles.magnifierHandle} />
      </View>
      <Text style={styles.title}>Scanning...</Text>
      <Text style={styles.helper}>Type or scan the barcode, then press the arrow.</Text>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.visibleInput}
          autoFocus
          value={barcode}
          onChangeText={setBarcode}
          onSubmitEditing={handleScanSubmit}
          placeholder="Type barcode here"
          blurOnSubmit={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleScanSubmit}
          style={styles.arrowButton}
          disabled={!barcode.trim()}
        >
          <Text style={{ fontSize: 22, color: barcode.trim() ? '#288392' : '#ccc' }}>➔</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}
    </View>
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