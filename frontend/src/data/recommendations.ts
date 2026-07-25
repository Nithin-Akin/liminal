import type { RecommendationGroup, UserProfile } from "@/types/app";

const checked = "2026-07-24";

export function getRecommendationGroups(profile: UserProfile): RecommendationGroup[] {
  const city = profile.city || "Bangalore";
  const locality = profile.locality || "your area";
  const destination = profile.destination || "your college/work area";

  return [
    {
      id: "banking",
      title: "Banking setup",
      whyNow: "Before rent, salary, UPI, deposits, and recurring bills stack up, compare accounts using the same fields.",
      columns: ["Min balance", "Debit card fee", "Free ATM txns", "Digital fit", "Why it fits"],
      options: [
        {
          name: "SBI Savings Account",
          fields: {
            "Min balance": "₹0 for basic savings; varies by account",
            "Debit card fee": "₹125-300/yr typical range",
            "Free ATM txns": "5/month typical metro cap",
            "Digital fit": "UPI + YONO",
            "Why it fits": "Lower balance pressure if budget is tight."
          },
          why: "Better when minimum balance is more important than premium branch/app experience.",
          sourceUrl: "https://sbi.co.in/web/personal-banking/accounts/saving-account",
          sourceType: "official",
          lastChecked: checked
        },
        {
          name: "HDFC Regular Savings",
          fields: {
            "Min balance": "₹10,000 urban typical",
            "Debit card fee": "₹150-750/yr typical range",
            "Free ATM txns": "5/month typical metro cap",
            "Digital fit": "UPI + PayZapp + NetBanking",
            "Why it fits": "Useful if salary credit or employer banking is HDFC."
          },
          why: "Better when salary credit and polished app/branch workflows matter.",
          sourceUrl: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts",
          sourceType: "official",
          lastChecked: checked
        },
        {
          name: "ICICI Regular Savings",
          fields: {
            "Min balance": "₹10,000 urban typical",
            "Debit card fee": "₹200-750/yr typical range",
            "Free ATM txns": "5/month typical metro cap",
            "Digital fit": "UPI + iMobile Pay",
            "Why it fits": "Useful if you prefer app-first banking."
          },
          why: "Better when fast digital onboarding and app experience matter more than lowest balance.",
          sourceUrl: "https://www.icicibank.com/personal-banking/accounts/savings-account",
          sourceType: "official",
          lastChecked: checked
        }
      ]
    },
    {
      id: "housing",
      title: `Housing search near ${locality}`,
      whyNow: `For ${city}, shortlist housing by rent, deposit, commute, food, and safety constraints before visiting properties.`,
      columns: ["Search target", "Budget filter", "Deposit check", "Commute check", "Why it fits"],
      options: [
        {
          name: "Women-only PG search",
          fields: {
            "Search target": `${locality} women PG`,
            "Budget filter": `≤ ₹${profile.monthlyBudget || 18000}/mo`,
            "Deposit check": "Ask exact months upfront",
            "Commute check": `Map to ${destination}`,
            "Why it fits": "Prioritizes gender/safety filters first."
          },
          why: "Use when safety preference is high or family needs a women-only housing option.",
          sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(`${locality} women PG ${city}`)}`,
          sourceType: "search-link",
          lastChecked: checked
        },
        {
          name: "Flatmate search",
          fields: {
            "Search target": `${locality} flatmates`,
            "Budget filter": `Rent + utilities ≤ ₹${profile.monthlyBudget || 18000}/mo`,
            "Deposit check": "Commonly 2-10 months; verify",
            "Commute check": `≤ 45 min to ${destination}`,
            "Why it fits": "Lower monthly cost when deposits are manageable."
          },
          why: "Use when monthly rent matters more than managed-food convenience.",
          sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(`${locality} flatmates ${city}`)}`,
          sourceType: "search-link",
          lastChecked: checked
        },
        {
          name: "Managed coliving search",
          fields: {
            "Search target": `${locality} coliving`,
            "Budget filter": `Compare food + laundry extras`,
            "Deposit check": "Usually lower than flats; verify",
            "Commute check": `Check metro/bus to ${destination}`,
            "Why it fits": "Reduces setup work in first 30 days."
          },
          why: "Use when speed, furniture, and predictable setup matter more than lowest rent.",
          sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(`${locality} coliving ${city}`)}`,
          sourceType: "search-link",
          lastChecked: checked
        }
      ]
    },
    {
      id: "sim",
      title: "SIM and data setup",
      whyNow: "Reliable mobile data affects UPI, maps, commute, food delivery, and emergency access.",
      columns: ["Typical plan", "5G availability", "Store/KYC", "Best check", "Why it fits"],
      options: [
        {
          name: "Jio",
          fields: {
            "Typical plan": "28-day prepaid plans vary by data/day",
            "5G availability": "Broad urban 5G footprint",
            "Store/KYC": "Aadhaar KYC at store/app flow",
            "Best check": "Indoor signal at home",
            "Why it fits": "Good first test if 5G coverage is strong at housing."
          },
          why: "Choose only if signal is strong inside the room, not just outside.",
          sourceUrl: "https://www.jio.com/mobile",
          sourceType: "official",
          lastChecked: checked
        },
        {
          name: "Airtel",
          fields: {
            "Typical plan": "28-day prepaid plans vary by data/day",
            "5G availability": "Broad urban 5G footprint",
            "Store/KYC": "Aadhaar KYC at store/app flow",
            "Best check": "Office/college signal",
            "Why it fits": "Often strong for work corridors; verify your route."
          },
          why: "Choose if your daily route has stronger Airtel signal than Jio.",
          sourceUrl: "https://www.airtel.in/prepaid-4g-sim/",
          sourceType: "official",
          lastChecked: checked
        },
        {
          name: "Vi",
          fields: {
            "Typical plan": "28-day prepaid plans vary by data/day",
            "5G availability": "Check current city coverage",
            "Store/KYC": "Aadhaar KYC at store/app flow",
            "Best check": "Plan price vs signal",
            "Why it fits": "Consider if cheaper and signal is reliable locally."
          },
          why: "Choose only if verified signal and price beat the alternatives in your exact area.",
          sourceUrl: "https://www.myvi.in/prepaid",
          sourceType: "official",
          lastChecked: checked
        }
      ]
    }
  ];
}
