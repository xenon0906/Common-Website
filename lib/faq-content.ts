// FAQ content for the FAQ page
// Categories: General, Safety, Payments, Account

export const FAQ_CATEGORIES = ['General', 'Safety', 'Payments', 'Account'] as const

export type FAQCategory = (typeof FAQ_CATEGORIES)[number]

export interface FAQItemType {
  question: string
  answer: string
  category: FAQCategory
}

export const FAQ_ITEMS: FAQItemType[] = [
  // General Questions
  {
    question: 'What is Snapgo?',
    answer:
      'Snapgo is India\'s trusted ride-sharing platform that connects travelers heading to the same destination. Instead of traveling alone in a cab, you can find verified co-riders going your way and split the fare, saving up to 75% on your daily commute while reducing your carbon footprint.',
    category: 'General',
  },
  {
    question: 'How does Snapgo matching work?',
    answer:
      'Snapgo uses smart location-based matching. For real-time rides, we search for riders within a 750m radius of your location heading to a similar destination. For scheduled rides, the search radius extends to 2km. Once matched, you can chat with your co-rider and coordinate the pickup.',
    category: 'General',
  },
  {
    question: 'Which cities is Snapgo available in?',
    answer:
      'Snapgo is currently available in 15+ cities across India, with a strong presence in Greater Noida, Delhi NCR, and other major metros. We\'re rapidly expanding to more cities. Check the app for the latest availability in your area.',
    category: 'General',
  },
  {
    question: 'What is the difference between Real-Time and Scheduled rides?',
    answer:
      'Real-Time rides help you find co-riders immediately within a 750m radius - perfect for spontaneous travel. Scheduled rides let you plan ahead with a 2km search radius and find matches for future trips, ensuring better matching options for regular commutes.',
    category: 'General',
  },
  {
    question: 'Does Snapgo book cabs for me?',
    answer:
      'No, Snapgo is a ride-sharing connector, not a cab booking service. We help you find verified co-riders. Once matched, you or your co-rider can book a cab through any preferred service (Ola, Uber, etc.) and share the fare directly.',
    category: 'General',
  },
  {
    question: 'Can I use Snapgo for intercity travel?',
    answer:
      'Currently, Snapgo is optimized for intracity travel and daily commutes. We\'re working on expanding our service to support intercity ride-sharing in the future. Stay tuned for updates!',
    category: 'General',
  },
  {
    question: 'What if I don\'t have a car?',
    answer:
      'No problem! Find verified co-riders heading your way, meet up, and book a cab together via Ola, Uber, or any service you prefer. Split the fare and save up to 75% — no car needed.',
    category: 'General',
  },
  {
    question: 'Can I offer rides if I have a car?',
    answer:
      'Yes! Car owners can create rides and offer seats to verified co-riders heading the same direction. Share the journey and costs with others while helping reduce traffic and emissions.',
    category: 'General',
  },
  {
    question: 'What\'s the difference between pooling with and without a car?',
    answer:
      'Both options help you save money and reduce emissions. Without a car, you match with co-riders and book a cab together. With a car, you create a ride for others to join. Either way, you\'re part of India\'s greenest commuting community.',
    category: 'General',
  },

  // Safety Questions
  {
    question: 'How does Snapgo verify users?',
    answer:
      'All Snapgo users must complete mandatory Aadhaar-based KYC verification through DigiLocker, a Government of India initiative. This ensures every person on the platform is who they claim to be, creating a 100% verified community.',
    category: 'Safety',
  },
  {
    question: 'What is the Female-Only ride option?',
    answer:
      'Female users can enable the Female-Only option to be matched exclusively with other verified female riders. This feature uses Aadhaar-verified gender information to ensure matches, providing an extra layer of comfort and safety for women travelers.',
    category: 'Safety',
  },
  {
    question: 'How does the SOS feature work?',
    answer:
      'If you feel unsafe at any point, you can trigger the SOS feature from the app. This immediately alerts your emergency contacts with your real-time location, ride details, and co-rider information. It also notifies our safety team for immediate assistance.',
    category: 'Safety',
  },
  {
    question: 'What information is shared with matched riders?',
    answer:
      'For safety and coordination, matched riders can see your name, profile photo, KYC verification status, and meeting point details. Your phone number and personal details are only shared through the in-app chat, never directly.',
    category: 'Safety',
  },
  {
    question: 'How do I report a safety concern?',
    answer:
      'You can report any safety concern through the app\'s report feature or by contacting us at info@snapgo.co.in. We take all reports seriously and aim to respond within 24 hours. For immediate emergencies, use the SOS feature or contact local authorities.',
    category: 'Safety',
  },
  {
    question: 'Are chat messages monitored?',
    answer:
      'In-app chat messages are stored for safety purposes and may be reviewed if a dispute or safety concern is reported. We encourage all communication to happen through the app for your protection.',
    category: 'Safety',
  },

  // Payment Questions
  {
    question: 'How much does Snapgo cost?',
    answer:
      'Snapgo offers two pricing options: Pay-per-ride at ₹5 per successful match, or a Monthly subscription at ₹90 for unlimited rides. New users may receive complimentary access during promotional periods. Cab fares are paid separately to the cab service.',
    category: 'Payments',
  },
  {
    question: 'How do I split the cab fare with my co-rider?',
    answer:
      'Snapgo shows estimated fare splits based on your journey. The actual fare splitting happens directly between riders - you can use UPI, cash, or any preferred method. We recommend using UPI for transparent, easy splitting.',
    category: 'Payments',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'For Snapgo platform fees, we accept UPI, credit/debit cards, net banking, and popular wallets. Cab fare payments are handled separately through your chosen cab service or directly with your co-rider.',
    category: 'Payments',
  },
  {
    question: 'Can I get a refund if no match is found?',
    answer:
      'Yes! If you\'re on the pay-per-ride plan and no match is found within the search period, the ₹5 platform fee is automatically refunded to your original payment method. Monthly subscriptions are non-refundable.',
    category: 'Payments',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your monthly subscription anytime through the app settings. The subscription remains active until the end of your current billing period, and you won\'t be charged for the next month.',
    category: 'Payments',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'New users often receive promotional free rides to experience Snapgo. Check the app for current offers. Even without promotions, you only pay ₹5 per successful match, making it risk-free to try.',
    category: 'Payments',
  },

  // Account Questions
  {
    question: 'How do I create a Snapgo account?',
    answer:
      'Download the Snapgo app from Google Play Store or Apple App Store. Sign up with your mobile number, complete the OTP verification, and then complete mandatory Aadhaar KYC through DigiLocker. Once verified, you\'re ready to start sharing rides!',
    category: 'Account',
  },
  {
    question: 'Can I change my phone number?',
    answer:
      'Yes, you can update your phone number in account settings. You\'ll need to verify the new number with an OTP. Note that your account history and verification status will be preserved.',
    category: 'Account',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'To delete your account, go to Settings > Account > Delete Account in the app. Your data will be removed according to our Privacy Policy. Note that some data may be retained for legal compliance.',
    category: 'Account',
  },
  {
    question: 'What happens if I fail KYC verification?',
    answer:
      'If KYC verification fails, ensure your Aadhaar details are correct and linked to your mobile number in DigiLocker. Try again with accurate information. Contact support at info@snapgo.co.in if issues persist.',
    category: 'Account',
  },
  {
    question: 'Can I have multiple accounts?',
    answer:
      'No, each user can only have one Snapgo account linked to their Aadhaar. Multiple accounts are not allowed and may result in suspension. This policy ensures platform integrity and safety.',
    category: 'Account',
  },
  {
    question: 'How do I update my profile information?',
    answer:
      'Go to your Profile in the app to update your name, photo, and preferences. Note that some information linked to your Aadhaar KYC (like your legal name and gender) cannot be changed without re-verification.',
    category: 'Account',
  },
]
