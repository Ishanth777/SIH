import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

interface KYCUploadScreenProps {
  workerId: string;
  apiUrl: string;
  token: string;
}

export const KYCUploadScreen: React.FC<KYCUploadScreenProps> = ({
  workerId,
  apiUrl,
  token,
}) => {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking document", err);
      Alert.alert("Error", "Could not select document");
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a document first");
      return;
    }

    if (!consentGiven) {
      Alert.alert(
        "Consent Required",
        "You must agree to the DPDPA-aligned consent capture to upload your KYC document (Rule S7).",
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      // React Native FormData requires a specific object structure for files
      const fileData = {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || "application/octet-stream",
      } as any;

      formData.append("file", fileData);

      const response = await fetch(`${apiUrl}/workers/${workerId}/kyc-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const responseData = await response.json();

      // Update verification status on backend
      const verifyResponse = await fetch(
        `${apiUrl}/workers/${workerId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationStatus: "UNDER_REVIEW",
            kycDocumentUrls: [responseData.url],
          }),
        },
      );

      if (!verifyResponse.ok) {
        console.warn("Failed to submit verify patch");
      }

      Alert.alert("Success", "KYC Document uploaded successfully");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error", err);
      Alert.alert("Upload Error", "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>

      <View style={styles.consentContainer}>
        <Text style={styles.consentText}>
          I hereby consent to the collection, processing, and secure storage of
          my Aadhaar and KYC details for verification purposes as per DPDPA
          guidelines.
        </Text>
        <Button
          title={consentGiven ? "Consent Given" : "I Agree"}
          onPress={() => setConsentGiven(true)}
          color={consentGiven ? "green" : undefined}
        />
      </View>

      <Button title="Select Document" onPress={pickDocument} />

      {selectedFile && (
        <Text style={styles.fileName}>Selected: {selectedFile.name}</Text>
      )}

      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <View style={styles.uploadBtn}>
          <Button
            title="Upload Document"
            onPress={uploadDocument}
            disabled={!selectedFile || !consentGiven}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  consentContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
    borderRadius: 8,
  },
  consentText: {
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  fileName: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
  },
  loader: {
    marginTop: 20,
  },
  uploadBtn: {
    marginTop: 20,
  },
});
