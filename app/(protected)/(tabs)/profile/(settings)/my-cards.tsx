import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  MoveVertical as MoreVertical,
  Plus,
  Shield,
  Star,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
  type: "credit" | "debit";
  addedDate: string;
}

interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  description: string;
  cardId: string;
  status: "completed" | "pending" | "failed";
}

export default function MyCardsScreen() {
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);

  const savedCards: SavedCard[] = [
    {
      id: "1",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      holderName: "John Doe",
      type: "credit",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      holderName: "John Doe",
      type: "debit",
      addedDate: "2024-02-20",
    },
    {
      id: "3",
      last4: "3782",
      brand: "American Express",
      expiryMonth: 5,
      expiryYear: 2028,
      isDefault: false,
      holderName: "John Doe",
      type: "credit",
      addedDate: "2024-03-10",
    },
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: "1",
      amount: 49.99,
      date: "2024-12-15",
      description: "Premium Subscription",
      cardId: "1",
      status: "completed",
    },
    {
      id: "2",
      amount: 29.99,
      date: "2024-11-15",
      description: "Basic Subscription",
      cardId: "1",
      status: "completed",
    },
    {
      id: "3",
      amount: 79.99,
      date: "2024-10-15",
      description: "Elite Subscription",
      cardId: "2",
      status: "completed",
    },
  ];

  const getCardBrandImage = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=100";
      case "mastercard":
        return "https://images.pexels.com/photos/2068975/pexels-photo-2068975.jpeg?auto=compress&cs=tinysrgb&w=100";
      case "american express":
        return "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=100";
      default:
        return "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=100";
    }
  };

  const getCardGradient = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return ["#1a365d", "#2d5aa0"] as const;
      case "mastercard":
        return ["#eb1c26", "#f79e1b"] as const;
      case "american express":
        return ["#006fcf", "#00a9e0"] as const;
      default:
        return ["#4a5568", "#718096"] as const;
    }
  };

  const handleSetDefault = (cardId: string) => {
    Alert.alert(
      "Set Default Card",
      "Set this card as your default payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Set Default",
          onPress: () => {
            Alert.alert("Success", "Default payment method updated");
            setShowCardMenu(null);
          },
        },
      ],
    );
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Payment method removed");
            setShowCardMenu(null);
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#10b981", "#34d399"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>My Cards</Text>
            <Text style={styles.headerSubtitle}>
              Manage your payment methods
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("./add-card")}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <CreditCard size={24} color="#10b981" />
              <Text style={styles.statNumber}>{savedCards.length}</Text>
              <Text style={styles.statLabel}>Saved Cards</Text>
            </View>

            <View style={styles.statCard}>
              <DollarSign size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>
                $
                {paymentHistory
                  .reduce((sum, payment) => sum + payment.amount, 0)
                  .toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>

            <View style={styles.statCard}>
              <Shield size={24} color="#7c3aed" />
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Secure</Text>
            </View>
          </View>
        </View>

        {/* Saved Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <View style={styles.cardsContainer}>
            {savedCards.map((card) => (
              <View key={card.id} style={styles.cardWrapper}>
                {/* Card Visual */}
                <LinearGradient
                  colors={getCardGradient(card.brand)}
                  style={styles.cardVisual}
                >
                  <View style={styles.cardHeader}>
                    <Image
                      source={{ uri: getCardBrandImage(card.brand) }}
                      style={styles.cardBrandLogo}
                    />
                    {card.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Star size={12} color="#ffffff" fill="#ffffff" />
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {card.last4}
                    </Text>
                    <View style={styles.cardDetails}>
                      <View>
                        <Text style={styles.cardLabel}>CARDHOLDER</Text>
                        <Text style={styles.cardValue}>{card.holderName}</Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>EXPIRES</Text>
                        <Text style={styles.cardValue}>
                          {card.expiryMonth.toString().padStart(2, "0")}/
                          {card.expiryYear.toString().slice(-2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>

                {/* Card Info */}
                <View style={styles.cardInfo}>
                  <View style={styles.cardInfoLeft}>
                    <Text style={styles.cardBrand}>{card.brand}</Text>
                    <Text style={styles.cardType}>
                      {card.type.charAt(0).toUpperCase() + card.type.slice(1)} •
                      Added {formatDate(card.addedDate)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.cardMenuButton}
                    onPress={() =>
                      setShowCardMenu(showCardMenu === card.id ? null : card.id)
                    }
                  >
                    <MoreVertical size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Card Menu */}
                {showCardMenu === card.id && (
                  <View style={styles.cardMenu}>
                    {!card.isDefault && (
                      <TouchableOpacity
                        style={styles.cardMenuItem}
                        onPress={() => handleSetDefault(card.id)}
                      >
                        <Star size={16} color="#64748b" />
                        <Text style={styles.cardMenuText}>Set as Default</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.cardMenuItem}
                      onPress={() => {
                        setShowCardMenu(null);
                        router.push(`./edit-card?cardId=${card.id}`);
                      }}
                    >
                      <CreditCard size={16} color="#64748b" />
                      <Text style={styles.cardMenuText}>Edit Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.cardMenuItem, styles.deleteMenuItem]}
                      onPress={() => handleDeleteCard(card.id)}
                    >
                      <X size={16} color="#ef4444" />
                      <Text
                        style={[styles.cardMenuText, styles.deleteMenuText]}
                      >
                        Remove Card
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>

          <View style={styles.historyContainer}>
            {paymentHistory.map((payment) => {
              const card = savedCards.find((c) => c.id === payment.cardId);
              return (
                <View key={payment.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIcon}>
                      <CreditCard size={20} color="#64748b" />
                    </View>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyDescription}>
                        {payment.description}
                      </Text>
                      <Text style={styles.historyCard}>
                        {card?.brand} •••• {card?.last4} •{" "}
                        {formatDate(payment.date)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyRight}>
                    <Text style={styles.historyAmount}>${payment.amount}</Text>
                    <View
                      style={[
                        styles.historyStatus,
                        { backgroundColor: getStatusColor(payment.status) },
                      ]}
                    >
                      <Text style={styles.historyStatusText}>
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <View style={styles.securityCard}>
            <Shield size={24} color="#10b981" />
            <Text style={styles.securityTitle}>Your payments are secure</Text>
            <Text style={styles.securityText}>
              All payment information is encrypted and stored securely. We never
              store your full card number or CVV.
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
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: -15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
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
  statNumber: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748b",
    textAlign: "center",
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
  cardsContainer: {
    gap: 20,
  },
  cardWrapper: {
    position: "relative",
  },
  cardVisual: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardBrandLogo: {
    width: 40,
    height: 25,
    borderRadius: 4,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  cardBody: {
    gap: 16,
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    letterSpacing: 2,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfoLeft: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 2,
  },
  cardType: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#64748b",
  },
  cardMenuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  cardMenu: {
    position: "absolute",
    top: 220,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    minWidth: 160,
  },
  cardMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  cardMenuText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1e293b",
  },
  deleteMenuText: {
    color: "#ef4444",
  },
  historyContainer: {
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
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 2,
  },
  historyCard: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#64748b",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyStatusText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  securitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  securityCard: {
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
  securityTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
