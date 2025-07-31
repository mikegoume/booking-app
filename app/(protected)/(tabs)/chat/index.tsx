import { useApp } from "@/contexts/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send, User } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export default function ChatScreen() {
  const { user, getChatMessages, sendMessage } = useApp();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const chatUserId = params.userId as string;
  const chatUserName = params.userName as string;
  const chatUserRole = params.userRole as string;

  useEffect(() => {
    if (user && chatUserId) {
      const chatMessages = getChatMessages(user.id, chatUserId);
      setMessages(chatMessages);
    }
  }, [user, chatUserId, getChatMessages]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !chatUserId) return;

    const success = sendMessage(user.id, chatUserId, newMessage.trim());
    if (success) {
      const updatedMessages = getChatMessages(user.id, chatUserId);
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={
          user?.role === "trainer"
            ? ["#7c3aed", "#c084fc"]
            : ["#3b82f6", "#60a5fa"]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.chatUserInfo}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.chatUserName}>{chatUserName}</Text>
              <Text style={styles.chatUserRole}>
                {chatUserRole === "trainer" ? "Trainer" : "Trainee"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messageGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Start a conversation with {chatUserName}
              </Text>
            </View>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <View key={groupIndex}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>
                    {formatDate(group.date)}
                  </Text>
                </View>

                {group.messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.isCurrentUser
                        ? styles.messageContainerSent
                        : styles.messageContainerReceived,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        message.isCurrentUser
                          ? styles.messageBubbleSent
                          : styles.messageBubbleReceived,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          message.isCurrentUser
                            ? styles.messageTextSent
                            : styles.messageTextReceived,
                        ]}
                      >
                        {message.text}
                      </Text>
                      <Text
                        style={[
                          styles.messageTime,
                          message.isCurrentUser
                            ? styles.messageTimeSent
                            : styles.messageTimeReceived,
                        ]}
                      >
                        {formatTime(message.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? "#ffffff" : "#94a3b8"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
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
  chatUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  chatUserName: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  chatUserRole: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748b",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  messageContainer: {
    marginBottom: 8,
  },
  messageContainerSent: {
    alignItems: "flex-end",
  },
  messageContainerReceived: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleSent: {
    backgroundColor: "#3b82f6",
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextSent: {
    color: "#ffffff",
  },
  messageTextReceived: {
    color: "#1e293b",
  },
  messageTime: {
    fontSize: 11,
    fontFamily: "Inter-Regular",
  },
  messageTimeSent: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  messageTimeReceived: {
    color: "#94a3b8",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#e2e8f0",
  },
});
