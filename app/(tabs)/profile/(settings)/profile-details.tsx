import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CreditCard as Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileDetailsScreen() {
  const { user, setUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Fitness Street, Gym City, GC 12345",
    dateOfBirth: "1990-05-15",
    emergencyContact: "Jane Doe - +1 (555) 987-6543",
    fitnessGoals: "Build muscle, improve endurance, maintain healthy lifestyle",
    medicalConditions: "None",
    preferredWorkoutTime: "Morning (6:00 AM - 10:00 AM)",
    experience: "Intermediate",
  });

  const handleSave = () => {
    if (!editedProfile.name.trim() || !editedProfile.email.trim()) {
      Alert.alert("Error", "Name and email are required fields");
      return;
    }

    // Update user context
    if (user) {
      setUser({
        ...user,
        name: editedProfile.name,
        email: editedProfile.email,
      });
    }

    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleCancel = () => {
    setEditedProfile({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 (555) 123-4567",
      address: "123 Fitness Street, Gym City, GC 12345",
      dateOfBirth: "1990-05-15",
      emergencyContact: "Jane Doe - +1 (555) 987-6543",
      fitnessGoals:
        "Build muscle, improve endurance, maintain healthy lifestyle",
      medicalConditions: "None",
      preferredWorkoutTime: "Morning (6:00 AM - 10:00 AM)",
      experience: "Intermediate",
    });
    setIsEditing(false);
  };

  interface ProfileField {
    key: string;
    label: string;
    icon: React.JSX.Element;
    required?: boolean;
    multiline?: boolean;
  }

  interface ProfileSection {
    title: string;
    fields: ProfileField[];
  }

  const profileSections: ProfileSection[] = [
    {
      title: "Basic Information",
      fields: [
        {
          key: "name",
          label: "Full Name",
          icon: <User size={20} color="#3b82f6" />,
          required: true,
        },
        {
          key: "email",
          label: "Email Address",
          icon: <Mail size={20} color="#3b82f6" />,
          required: true,
        },
        {
          key: "phone",
          label: "Phone Number",
          icon: <Phone size={20} color="#3b82f6" />,
        },
        {
          key: "dateOfBirth",
          label: "Date of Birth",
          icon: <Calendar size={20} color="#3b82f6" />,
        },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        {
          key: "address",
          label: "Address",
          icon: <MapPin size={20} color="#10b981" />,
          multiline: true,
        },
        {
          key: "emergencyContact",
          label: "Emergency Contact",
          icon: <Phone size={20} color="#10b981" />,
        },
      ],
    },
    {
      title: "Fitness Profile",
      fields: [
        {
          key: "fitnessGoals",
          label: "Fitness Goals",
          icon: <User size={20} color="#7c3aed" />,
          multiline: true,
        },
        {
          key: "experience",
          label: "Experience Level",
          icon: <User size={20} color="#7c3aed" />,
        },
        {
          key: "preferredWorkoutTime",
          label: "Preferred Workout Time",
          icon: <Calendar size={20} color="#7c3aed" />,
        },
      ],
    },
    {
      title: "Health Information",
      fields: [
        {
          key: "medicalConditions",
          label: "Medical Conditions",
          icon: <User size={20} color="#f59e0b" />,
          multiline: true,
        },
      ],
    },
  ];

  const getRoleGradient = () => {
    return user?.role === "trainer"
      ? (["#7c3aed", "#c084fc"] as const)
      : (["#3b82f6", "#60a5fa"] as const);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={getRoleGradient()} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Profile Details</Text>
            <Text style={styles.headerSubtitle}>
              {isEditing
                ? "Edit your information"
                : "View your personal information"}
            </Text>
          </View>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit3 size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <X size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
                }}
                style={styles.profileImage}
              />
              {isEditing && (
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>
              {user?.role === "trainer" ? "Personal Trainer" : "Fitness Member"}
            </Text>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.fieldsContainer}>
              {section.fields.map((field, fieldIndex) => (
                <View
                  key={field.key}
                  style={[
                    styles.fieldContainer,
                    fieldIndex === section.fields.length - 1 &&
                      styles.lastFieldContainer,
                  ]}
                >
                  <View style={styles.fieldHeader}>
                    <View style={styles.fieldIconContainer}>{field.icon}</View>
                    <Text style={styles.fieldLabel}>
                      {field.label}
                      {field.required && (
                        <Text style={styles.requiredStar}> *</Text>
                      )}
                    </Text>
                  </View>

                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.fieldInput,
                        field.multiline && styles.fieldInputMultiline,
                      ]}
                      value={
                        editedProfile[field.key as keyof typeof editedProfile]
                      }
                      onChangeText={(text) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          [field.key]: text,
                        }))
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      placeholderTextColor="#94a3b8"
                      multiline={field.multiline}
                      numberOfLines={field.multiline ? 3 : 1}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.fieldValue,
                        field.multiline && styles.fieldValueMultiline,
                      ]}
                    >
                      {editedProfile[field.key as keyof typeof editedProfile] ||
                        "Not specified"}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.fieldsContainer}>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <Calendar size={20} color="#64748b" />
                </View>
                <Text style={styles.fieldLabel}>Member Since</Text>
              </View>
              <Text style={styles.fieldValue}>January 15, 2024</Text>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <User size={20} color="#64748b" />
                </View>
                <Text style={styles.fieldLabel}>Account Type</Text>
              </View>
              <Text style={styles.fieldValue}>
                {user?.role === "trainer"
                  ? "Professional Trainer"
                  : "Premium Member"}
              </Text>
            </View>

            <View style={[styles.fieldContainer, styles.lastFieldContainer]}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconContainer}>
                  <User size={20} color="#64748b" />
                </View>
                <Text style={styles.fieldLabel}>User ID</Text>
              </View>
              <Text style={styles.fieldValue}>{user?.id}</Text>
            </View>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacySection}>
          <View style={styles.privacyCard}>
            <User size={24} color="#64748b" />
            <Text style={styles.privacyTitle}>Privacy & Security</Text>
            <Text style={styles.privacyText}>
              Your personal information is encrypted and stored securely. We
              never share your data with third parties without your explicit
              consent.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    opacity: 0.9,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profilePictureContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginTop: -15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profilePicture: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#64748b",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 16,
  },
  fieldsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  fieldContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lastFieldContainer: {
    borderBottomWidth: 0,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
  },
  requiredStar: {
    color: "#ef4444",
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 22,
  },
  fieldValueMultiline: {
    lineHeight: 24,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  privacySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  privacyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
