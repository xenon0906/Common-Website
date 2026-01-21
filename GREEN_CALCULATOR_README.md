# Snapgo Green Calculator - Complete Feature Specification

## FEATURE OVERVIEW

Build a Savings Calculator that shows users how much money and CO2 they save by carpooling instead of solo cab rides. Includes shareable PNG generation with personalized results.

---

## PART 1: USER INPUTS & STATE

### Input Fields

```
DISTANCE:
  - Type: Slider
  - Range: 2 to 50 km
  - Default: 15 km
  - Step: 1 km

FREQUENCY:
  - Type: Segmented buttons / Pills
  - Options: ["Daily", "Weekly", "Monthly"]
  - Default: "Daily"

RIDERS:
  - Type: Button group
  - Options: [2, 3, 4]
  - Default: 2

VIEW_MODE:
  - Type: Toggle switch
  - Options: ["Monthly", "Yearly"]
  - Default: "Monthly"
```

### State Variables

```typescript
// User inputs
distance: number = 15           // 2-50
frequency: "daily" | "weekly" | "monthly" = "daily"
riders: number = 2              // 2, 3, or 4
viewMode: "monthly" | "yearly" = "monthly"

// Share dialog
shareDialogOpen: boolean = false
userName: string = ""           // Optional name for personalization

// UI states
isSharing: boolean = false      // Loading state during PNG generation
showCelebration: boolean = false // Animation when savings > 2000
```

---

## PART 2: CONSTANTS

```typescript
const CONSTANTS = {
  // Fare rates (Indian Rupees)
  SOLO_CAB_FARE_PER_KM: 14,      // ₹14/km for Ola/Uber
  SNAPGO_FARE_PER_KM: 8,         // ₹8/km for pooled ride
  BOOKING_FEE: 30,               // ₹30 flat booking fee

  // Environmental
  CO2_GRAMS_PER_KM: 120,         // Average car CO2 emission
  TREE_CO2_ABSORPTION: 22,       // kg CO2 absorbed per tree per year

  // Trip frequency (working days logic)
  TRIPS_PER_MONTH: {
    daily: 22,    // 5 days/week × 4.4 weeks (Indian working days)
    weekly: 4,    // 1 trip/week × 4 weeks
    monthly: 1    // 1 trip/month
  }
}
```

---

## PART 3: CALCULATION ALGORITHMS

### Complete Calculation Function

```typescript
function calculateSavings(distance: number, frequency: string, riders: number) {
  // STEP 1: Per-trip cost calculation
  const soloCabCost = (distance * 14) + 30
  const snapgoCostPerPerson = ((distance * 8) + 30) / riders
  const savingsPerTrip = soloCabCost - snapgoCostPerPerson
  const savingsPercent = Math.round((savingsPerTrip / soloCabCost) * 100)

  // STEP 2: Monthly/Yearly projections
  // Using 22 working days for daily commuters (Indian standard)
  const tripsPerMonth = frequency === "daily" ? 22 : frequency === "weekly" ? 4 : 1

  // Multiply by 2 for round trip (to office + back home)
  const monthlySavings = savingsPerTrip * tripsPerMonth * 2
  const yearlySavings = monthlySavings * 12

  // STEP 3: Environmental impact
  // Each additional rider = 1 less car on road
  const co2SavedPerTrip = (distance * 120 * (riders - 1)) / 1000  // in kg
  const monthlyCO2Saved = co2SavedPerTrip * tripsPerMonth * 2
  const yearlyCO2Saved = monthlyCO2Saved * 12
  const treesEquivalent = yearlyCO2Saved / 22  // 1 tree absorbs ~22kg CO2/year

  return {
    // Per trip
    soloCabCost: Math.round(soloCabCost),
    snapgoCost: Math.round(snapgoCostPerPerson),
    savingsPerTrip: Math.round(savingsPerTrip),
    savingsPercent: savingsPercent,

    // Projections
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(yearlySavings),

    // Environmental
    co2SavedPerTrip: Math.round(co2SavedPerTrip * 10) / 10,
    monthlyCO2Saved: Math.round(monthlyCO2Saved),
    yearlyCO2Saved: Math.round(yearlyCO2Saved),
    treesEquivalent: Math.round(treesEquivalent * 10) / 10
  }
}
```

### Example Calculation

```
INPUT: distance=15km, frequency=daily, riders=2

Solo Cab = (15 × 14) + 30 = ₹240
Snapgo = ((15 × 8) + 30) / 2 = ₹75
Savings/Trip = 240 - 75 = ₹165
Savings % = (165/240) × 100 = 69%

Monthly = 165 × 22 × 2 = ₹7,260
Yearly = 7,260 × 12 = ₹87,120

CO2/Trip = (15 × 120 × 1) / 1000 = 1.8 kg
Monthly CO2 = 1.8 × 22 × 2 = 79 kg
Yearly CO2 = 79 × 12 = 950 kg
Trees = 950 / 22 = 43.2 trees
```

---

## PART 4: INDIAN NUMBER FORMATTING

Format numbers in Indian lakhs/crores style (1,50,000 instead of 150,000):

```typescript
function formatIndianNumber(num: number): string {
  const str = Math.abs(num).toString()
  if (str.length <= 3) return num.toString()

  // Indian numbering: last 3 digits, then groups of 2
  const lastThree = str.slice(-3)
  const remaining = str.slice(0, -3)
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree

  return num < 0 ? '-' + formatted : formatted
}

// Examples:
// 1000 → "1,000"
// 15000 → "15,000"
// 150000 → "1,50,000"
// 1500000 → "15,00,000"
// 87120 → "87,120"
```

---

## PART 5: UI COMPONENTS SPECIFICATION

### Card 1: Trip Details Input

```
┌─────────────────────────────────────────┐
│ 🚗 Trip Details                         │
│                                         │
│ Distance                          15 km │
│ [====●========================]         │
│ 2 km                              50 km │
│                                         │
│ Frequency                               │
│ [☀️ Daily] [📅 Weekly] [📆 Monthly]     │
│                                         │
│ Riders                         2 people │
│ [ 2 ]  [ 3 ]  [ 4 ]                    │
└─────────────────────────────────────────┘
```

### Card 2: Per Trip Comparison

```
┌─────────────────────────────────────────┐
│ 📊 Per Trip Comparison                  │
│                                         │
│ Solo Cab Ride                     ₹240  │
│ [████████████████████████████] 100%     │
│                                         │
│ With Snapgo                       ₹75   │
│ [█████████░░░░░░░░░░░░░░░░░░░] 31%      │
│                                         │
│ 💚 Save 69% per trip                    │
└─────────────────────────────────────────┘
```

### Card 3: Projected Savings (Main Display)

```
┌─────────────────────────────────────────┐
│ 💰 Projected Savings    [Monthly|Yearly]│
│                                         │
│              ₹7,260                     │
│                                         │
│        Estimated monthly savings        │
│                                         │
│  That's 14 movie tickets! 🎬            │
└─────────────────────────────────────────┘

Movie tickets calculation: Math.round(savings / 500)
```

### Card 4: Environmental Impact

```
┌─────────────────────────────────────────┐
│ 🌱 Environmental Impact                 │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │    79 kg     │  │    43.2      │    │
│  │   CO₂/mo     │  │  🌳 trees/yr │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Card 5: What You Could Buy (Gamification)

Horizontal scrollable carousel showing items user can afford with yearly savings:

```typescript
const purchasableItems = [
  { name: "Pizza Parties", cost: 5000, icon: "🍕" },
  { name: "Gym Membership", cost: 10000, icon: "💪" },
  { name: "Shopping Spree", cost: 15000, icon: "🛍️" },
  { name: "Apple Watch", cost: 20000, icon: "⌚" },
  { name: "AirPods Max", cost: 25000, icon: "🎧" },
  { name: "Goa Trip", cost: 30000, icon: "✈️" },
  { name: "Gaming Laptop", cost: 50000, icon: "💻" },
  { name: "Sony Camera", cost: 60000, icon: "📷" },
  { name: "International Trip", cost: 80000, icon: "🌍" },
  { name: "iPhone 15 Pro", cost: 100000, icon: "📱" },
  { name: "MacBook Pro", cost: 120000, icon: "💻" },
  { name: "Royal Enfield", cost: 150000, icon: "🏍️" }
]

// Display logic:
// If yearlySavings >= item.cost → Show as "✅ UNLOCKED" (green)
// If yearlySavings < item.cost → Show as "🔒 ₹Xk more" (gray/locked)

// Sort: Show unlocked items first, then locked items
```

---

## PART 6: SHARE DIALOG

When user taps "Share My Savings" button:

```
┌─────────────────────────────────────────┐
│ 📤 Share Your Savings                   │
│    Add your name to personalize         │
│                                         │
│ Your Name (optional)                    │
│ ┌─────────────────────────────────────┐ │
│ │ Enter your name                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Preview:                                │
│ ┌─────────────────────────────────────┐ │
│ │ Rahul is saving ₹7,260 per month    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [    Share with Name    ] (primary)     │
│ [  Share without Name   ] (secondary)   │
│                                         │
│ Your savings card will be generated     │
│ as a shareable image                    │
└─────────────────────────────────────────┘
```

---

## PART 7: PNG SHARE CARD TEMPLATE

### Dimensions & Style

```
Width: 400px (fixed)
Height: Auto (approximately 500-550px)
Background: White (#FFFFFF)
Scale: 2x for high resolution output
Font: System font (San Francisco / Roboto)
```

### PNG Layout Structure

```
┌─────────────────────────────────────────┐
│              [SNAPGO LOGO]              │  Logo: 60px height
│           Smart Ride Sharing            │  Subtitle: 11px, gray, uppercase
│  ─────────────────────────────────────  │  Divider: 2px gradient line
│                                         │
│           {Name} is saving              │  14px, gray (#6b7280)
│              ₹7,260                      │  56px, bold, blue (#0e4493)
│             per month                   │  18px, green (#10b981)
│                                         │
│  ─────────────────────────────────────  │  Divider
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │             │  │             │      │
│  │     69%     │  │    79kg     │      │  32px, white, bold
│  │             │  │             │      │
│  │ saved per   │  │    CO₂      │      │  11px, white, uppercase
│  │    trip     │  │  reduced    │      │
│  │             │  │             │      │
│  └─────────────┘  └─────────────┘      │  Blue box: #0e4493
│                                         │  Green box: #10b981
│  ─────────────────────────────────────  │  Border: 1px #e5e7eb
│                                         │
│  15km • Daily Commuter • 2 Riders      │  13px, gray (#9ca3af)
│    🚗  Ride Smart . Save More 💸        │  16px, bold, blue (#0e4493)
│                                         │
└─────────────────────────────────────────┘
```

### PNG Template Code (React/HTML)

```jsx
<div style={{
  width: '400px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  backgroundColor: '#ffffff',
  padding: '40px 32px',
  textAlign: 'center'
}}>

  {/* Logo */}
  <img src="/logo.png" style={{ height: '60px', marginBottom: '4px' }} />
  <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>
    Smart Ride Sharing
  </div>

  {/* Divider */}
  <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)', margin: '20px 0 32px' }} />

  {/* Hero Savings */}
  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
    {userName ? `${userName} is saving` : "I'm saving"}
  </div>
  <div style={{ fontSize: '56px', fontWeight: 900, color: '#0e4493', lineHeight: 1, letterSpacing: '-2px' }}>
    ₹{formatIndianNumber(viewMode === 'monthly' ? monthlySavings : yearlySavings)}
  </div>
  <div style={{ fontSize: '18px', color: '#10b981', fontWeight: 600, marginTop: '14px' }}>
    per {viewMode === 'monthly' ? 'month' : 'year'}
  </div>

  {/* Divider */}
  <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)', margin: '32px 0 24px' }} />

  {/* Stats Boxes - Side by Side */}
  <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>

    {/* Savings % Box - Blue */}
    <div style={{
      flex: 1,
      background: '#0e4493',
      borderRadius: '16px',
      padding: '24px 20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800 }}>{savingsPercent}%</div>
      <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        saved per trip
      </div>
    </div>

    {/* CO2 Box - Green */}
    <div style={{
      flex: 1,
      background: '#10b981',
      borderRadius: '16px',
      padding: '24px 20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 800 }}>
        {viewMode === 'monthly' ? monthlyCO2Saved : yearlyCO2Saved}kg
      </div>
      <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        CO₂ reduced
      </div>
    </div>
  </div>

  {/* Footer */}
  <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
    <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
      {distance}km • {frequency === 'daily' ? 'Daily Commuter' : frequency === 'weekly' ? 'Weekly Traveller' : 'Monthly Trips'} • {riders} Riders
    </div>
    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0e4493' }}>
      🚗  Ride Smart . Save More 💸
    </div>
  </div>

</div>
```

---

## PART 8: SHARE MESSAGE TEXT

When sharing, include this text along with the PNG:

```typescript
const shareMessage = `🚗 ${userName ? `${userName} is saving` : "I'm saving"} ₹${formatIndianNumber(savings)}/${period} with Snapgo!

📊 ${savingsPercent}% less than solo cabs
🌱 Reducing ${co2Saved}kg CO₂ emissions
🎬 That's ${Math.round(savings / 250)} movie tickets!

Calculate yours too 👇
https://snapgo.co.in

#Snapgo #Carpooling #SaveMoney #GreenCommute`
```

---

## PART 9: PNG GENERATION (Technical)

### Using html2canvas (Web)

```typescript
import html2canvas from 'html2canvas'

async function generatePNG(templateElement: HTMLElement) {
  const canvas = await html2canvas(templateElement, {
    backgroundColor: null,
    scale: 2,              // 2x resolution for sharp images
    useCORS: true,
    logging: false
  })

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95)
  })
}
```

### Native App Approach

For mobile apps, render the template as a view and use:
- iOS: `UIGraphicsImageRenderer` to capture view as image
- Android: `View.drawToBitmap()` or Canvas drawing
- Flutter: `RepaintBoundary` with `toImage()`
- React Native: `react-native-view-shot` library

---

## PART 10: SHARE FUNCTIONALITY

```typescript
async function shareResults(blob: Blob, message: string) {
  const file = new File([blob], 'snapgo-savings.png', { type: 'image/png' })

  // Try native share first
  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: message,
      title: 'My Snapgo Savings'
    })
  } else {
    // Fallback: Download image
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'snapgo-savings.png'
    link.click()
    URL.revokeObjectURL(url)
  }
}
```

---

## PART 11: COLORS & STYLING

```typescript
const COLORS = {
  // Brand
  primary: '#0e4493',        // Snapgo Blue
  primaryLight: '#0e4493/10', // 10% opacity for backgrounds

  // Accent
  teal: '#0d9488',
  emerald: '#10b981',

  // Status
  success: '#10b981',        // Green for savings/positive

  // Neutral
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray800: '#1f2937',

  // Gradients
  primaryGradient: 'linear-gradient(135deg, #0e4493 0%, #0d9488 100%)',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
}
```

---

## PART 12: CELEBRATION ANIMATION

Trigger a brief celebration animation when savings exceed ₹2,000:

```typescript
useEffect(() => {
  const currentSavings = viewMode === 'monthly' ? monthlySavings : yearlySavings

  if (currentSavings > 2000) {
    setShowCelebration(true)

    // Auto-hide after 1.5 seconds
    const timer = setTimeout(() => setShowCelebration(false), 1500)
    return () => clearTimeout(timer)
  }
}, [monthlySavings, yearlySavings, viewMode])

// In UI: Show sparkle icon ✨ or confetti animation when showCelebration is true
```

---

## QUICK REFERENCE: ALL FORMULAS

```
SOLO_COST = (distance × 14) + 30
SNAPGO_COST = ((distance × 8) + 30) / riders
SAVINGS_PER_TRIP = SOLO_COST - SNAPGO_COST
SAVINGS_PERCENT = (SAVINGS_PER_TRIP / SOLO_COST) × 100

TRIPS_PER_MONTH = daily ? 22 : weekly ? 4 : 1
MONTHLY_SAVINGS = SAVINGS_PER_TRIP × TRIPS_PER_MONTH × 2
YEARLY_SAVINGS = MONTHLY_SAVINGS × 12

CO2_PER_TRIP = (distance × 120 × (riders - 1)) / 1000
MONTHLY_CO2 = CO2_PER_TRIP × TRIPS_PER_MONTH × 2
YEARLY_CO2 = MONTHLY_CO2 × 12
TREES = YEARLY_CO2 / 22

MOVIE_TICKETS = SAVINGS / 500
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Distance slider (2-50 km)
- [ ] Frequency selector (Daily/Weekly/Monthly)
- [ ] Riders selector (2/3/4)
- [ ] Real-time calculation updates
- [ ] Monthly/Yearly toggle
- [ ] Per-trip comparison bars
- [ ] Environmental impact display
- [ ] "What You Could Buy" gamification
- [ ] Share dialog with name input
- [ ] PNG generation with template
- [ ] Native share / download fallback
- [ ] Indian number formatting
- [ ] Celebration animation (>₹2000)

---

*This document contains everything needed to recreate the Snapgo Green Calculator feature.*
