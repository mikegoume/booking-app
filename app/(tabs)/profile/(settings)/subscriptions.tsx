import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  Crown,
  MessageCircle,
  Star,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
  color: string[];
  icon: React.ReactNode;
  description: string;
  maxSessions: string;
  support: string;
}

export default function SubscriptionsScreen() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: billingPeriod === "monthly" ? 29.99 : 299.99,
      originalPrice: billingPeriod === "yearly" ? 359.88 : undefined,
      period: billingPeriod === "monthly" ? "month" : "year",
      features: [
        "10 Training Sessions per month",
        "Basic workout plans",
        "Mobile app access",
        "Email support",
        "Progress tracking",
      ],
      color: ["#3b82f6", "#60a5fa"],
      icon: <Star size={24} color="#ffffff" />,
      description: "Perfect for getting started with your fitness journey",
      maxSessions: "10/month",
      support: "Email",
    },
    {
      id: "premium",
      name: "Premium",
      price: billingPeriod === "monthly" ? 49.99 : 499.99,
      originalPrice: billingPeriod === "yearly" ? 599.88 : undefined,
      period: billingPeriod === "monthly" ? "month" : "year",
      features: [
        "Unlimited training sessions",
        "Custom workout plans",
        "Nutrition guidance",
        "Priority support",
        "Advanced progress tracking",
        "Group class access",
        "Mobile & web access",
      ],
      popular: true,
      color: ["#7c3aed", "#c084fc"],
      icon: <Crown size={24} color="#ffffff" />,
      description: "Most popular choice for serious fitness enthusiasts",
      maxSessions: "Unlimited",
      support: "Priority",
    },
    {
      id: "elite",
      name: "Elite",
      price: billingPeriod === "monthly" ? 79.99 : 799.99,
      originalPrice: billingPeriod === "yearly" ? 959.88 : undefined,
      period: billingPeriod === "monthly" ? "month" : "year",
      features: [
        "Everything in Premium",
        "Personal trainer assignment",
        "1-on-1 training sessions",
        "Custom meal plans",
        "24/7 support",
        "Body composition analysis",
        "Recovery & wellness coaching",
        "Exclusive member events",
      ],
      recommended: true,
      color: ["#f59e0b", "#fbbf24"],
      icon: <Zap size={24} color="#ffffff" />,
      description: "Ultimate fitness experience with personal attention",
      maxSessions: "Unlimited + 1-on-1",
      support: "24/7",
    },
  ];

  const currentPlan = "basic"; // This would come from user context

  const handleSubscribe = (plan: SubscriptionPlan) => {
    Alert.alert(
      "Subscribe to " + plan.name,
      `Subscribe to ${plan.name} for $${plan.price}/${plan.period}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Subscribe",
          onPress: () => {
            // Navigate to payment screen
            router.push({
              pathname: "/payment",
              params: {
                planId: plan.id,
                planName: plan.name,
                price: plan.price.toString(),
                period: plan.period,
              },
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7c3aed", "#c084fc"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Subscriptions</Text>
            <Text style={styles.headerSubtitle}>
              Choose the perfect plan for your fitness goals
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan Status */}
        <View style={styles.currentPlanSection}>
          <View style={styles.currentPlanCard}>
            <View style={styles.currentPlanHeader}>
              <Crown size={24} color="#7c3aed" />
              <Text style={styles.currentPlanTitle}>Current Plan</Text>
            </View>
            <Text style={styles.currentPlanName}>Basic Plan</Text>
            <Text style={styles.currentPlanDetails}>
              Next billing: January 15, 2025 • $29.99/month
            </Text>
            <View style={styles.currentPlanStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Sessions Left</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Days Remaining</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Billing Period Toggle */}
        <View style={styles.billingToggleSection}>
          <Text style={styles.sectionTitle}>Choose Billing Period</Text>
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === "monthly" && styles.billingOptionActive,
              ]}
              onPress={() => setBillingPeriod("monthly")}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingPeriod === "monthly" && styles.billingOptionTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.billingOption,
                billingPeriod === "yearly" && styles.billingOptionActive,
              ]}
              onPress={() => setBillingPeriod("yearly")}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingPeriod === "yearly" && styles.billingOptionTextActive,
                ]}
              >
                Yearly
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save 17%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.plansContainer}
            contentContainerStyle={styles.plansContent}
          >
            {subscriptionPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.popular && styles.popularCard,
                  plan.recommended && styles.recommendedCard,
                  currentPlan === plan.id && styles.currentCard,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}

                {plan.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}

                {currentPlan === plan.id && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>Current Plan</Text>
                  </View>
                )}

                <LinearGradient
                  colors={plan.color as [string, string]}
                  style={styles.planHeader}
                >
                  <View style={styles.planIcon}>{plan.icon}</View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </LinearGradient>

                <View style={styles.planBody}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${plan.price}</Text>
                    <Text style={styles.period}>/{plan.period}</Text>
                    {plan.originalPrice && (
                      <Text style={styles.originalPrice}>
                        ${plan.originalPrice}
                      </Text>
                    )}
                  </View>

                  <View style={styles.planHighlights}>
                    <View style={styles.highlight}>
                      <Calendar size={16} color="#64748b" />
                      <Text style={styles.highlightText}>
                        {plan.maxSessions}
                      </Text>
                    </View>
                    <View style={styles.highlight}>
                      <MessageCircle size={16} color="#64748b" />
                      <Text style={styles.highlightText}>
                        {plan.support} support
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.feature}>
                        <Check size={16} color="#10b981" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {currentPlan !== plan.id ? (
                    <TouchableOpacity
                      style={[
                        styles.subscribeButton,
                        { backgroundColor: plan.color[0] },
                      ]}
                      onPress={() => handleSubscribe(plan)}
                    >
                      <Text style={styles.subscribeButtonText}>
                        {currentPlan ? "Upgrade" : "Subscribe"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.currentPlanButton}>
                      <Text style={styles.currentPlanButtonText}>
                        Current Plan
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Features Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Plan Comparison</Text>

          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonTitle}>What&apos;s included</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Training Sessions</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValue}>10/month</Text>
                <Text style={styles.comparisonValue}>Unlimited</Text>
                <Text style={styles.comparisonValue}>Unlimited</Text>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Personal Trainer</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValueNo}>✗</Text>
                <Text style={styles.comparisonValueNo}>✗</Text>
                <Text style={styles.comparisonValueYes}>✓</Text>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonFeature}>Nutrition Plans</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValueNo}>✗</Text>
                <Text style={styles.comparisonValueYes}>✓</Text>
                <Text style={styles.comparisonValueYes}>✓</Text>
              </View>
            </View>

            <View style={[styles.comparisonRow, styles.lastComparisonRow]}>
              <Text style={styles.comparisonFeature}>24/7 Support</Text>
              <View style={styles.comparisonValues}>
                <Text style={styles.comparisonValueNo}>✗</Text>
                <Text style={styles.comparisonValueNo}>✗</Text>
                <Text style={styles.comparisonValueYes}>✓</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>
              Can I change my plan anytime?
            </Text>
            <Text style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect at your next billing cycle.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>
              What happens to unused sessions?
            </Text>
            <Text style={styles.faqAnswer}>
              Unused sessions from your current billing period will carry over
              to the next month (up to 5 sessions maximum).
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Is there a cancellation fee?</Text>
            <Text style={styles.faqAnswer}>
              No cancellation fees. You can cancel your subscription anytime and
              continue using the service until your current billing period ends.
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
  content: {
    flex: 1,
  },
  currentPlanSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  currentPlanCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  currentPlanTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#7c3aed",
  },
  currentPlanName: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  currentPlanDetails: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    marginBottom: 16,
  },
  currentPlanStats: {
    flexDirection: "row",
    gap: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748b",
  },
  billingToggleSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 16,
  },
  billingToggle: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  billingOptionActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billingOptionText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
  },
  billingOptionTextActive: {
    color: "#1e293b",
  },
  savingsBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },
  plansSection: {
    marginBottom: 32,
  },
  plansContainer: {
    marginTop: 16,
  },
  plansContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  planCard: {
    width: width * 0.8,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginRight: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    position: "relative",
  },
  popularCard: {
    borderWidth: 2,
    borderColor: "#7c3aed",
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  currentCard: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#7c3aed",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  recommendedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  currentBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  currentText: {
    fontSize: 10,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  planHeader: {
    padding: 24,
    alignItems: "center",
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
  },
  planBody: {
    padding: 24,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
    justifyContent: "center",
  },
  price: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#1e293b",
  },
  period: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#64748b",
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  planHighlights: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#64748b",
  },
  featuresContainer: {
    gap: 8,
    marginBottom: 24,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    flex: 1,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  currentPlanButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  currentPlanButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#64748b",
  },
  comparisonSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  comparisonCard: {
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
  comparisonHeader: {
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lastComparisonRow: {
    borderBottomWidth: 0,
  },
  comparisonFeature: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#1e293b",
    flex: 1,
  },
  comparisonValues: {
    flexDirection: "row",
    gap: 24,
  },
  comparisonValue: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    width: 60,
    textAlign: "center",
  },
  comparisonValueYes: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#10b981",
    width: 60,
    textAlign: "center",
  },
  comparisonValueNo: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#ef4444",
    width: 60,
    textAlign: "center",
  },
  faqSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  faqCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1e293b",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748b",
    lineHeight: 20,
  },
});
