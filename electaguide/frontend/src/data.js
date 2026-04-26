export const STATE_ELECTIONS = [
  //──2025 (CONCLUDED) ──────────────────────────────────────────
  { state: "Delhi", year: 2025, seats: 70, phase1: "5 Feb 2025", counting: "8 Feb 2025", result: "BJP won (165/70)", cm: "Rekha Gupta", party: "BJP", partyColor: "#ff9933", alliance: "NDA", status: "done", rs: 3 },
  { state: "Bihar", year: 2025, seats: 243, phase1: "6 Nov 2025", phase2: "11 Nov 2025", counting: "14 Nov 2025", result: "NDA won (200+/243)", cm: "Nitish Kumar", party: "JD(U)+BJP", partyColor: "#ff9933", alliance: "NDA", status: "done", rs: 16 },

  // ── 2026 (LIVE RIGHT NOW — April 2026) ───────────────────────
  { state: "Tamil Nadu", year: 2026, seats: 234, phase1: "23 Apr 2026", counting: "4 May 2026", currentParty: "DMK", partyColor: "#e11d48", alliance: "INDIA", cm: "M.K. Stalin", status: "live", rs: 18 },
  { state: "West Bengal", year: 2026, seats: 294, phase1: "23 Apr 2026", phase2: "29 Apr 2026", counting: "4 May 2026", currentParty: "TMC", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Mamata Banerjee", status: "live", rs: 16 },
  { state: "Kerala", year: 2026, seats: 140, phase1: "9 Apr 2026", counting: "4 May 2026", currentParty: "LDF (CPI-M)", partyColor: "#dc2626", alliance: "Left", cm: "Pinarayi Vijayan", status: "live", rs: 9 },
  { state: "Assam", year: 2026, seats: 126, phase1: "9 Apr 2026", counting: "4 May 2026", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Himanta Biswa Sarma", status: "live", rs: 7 },
  { state: "Puducherry", year: 2026, seats: 30, phase1: "9 Apr 2026", counting: "4 May 2026", currentParty: "AINRC+BJP", partyColor: "#f97316", alliance: "NDA", cm: "N. Rangasamy", status: "live", rs: 1 },

  // ── 2027 ──────────────────────────────────────────────────────
  { state: "Goa", year: 2027, seats: 40, period: "Feb–Mar 2027", tenure: "15 Mar 2022 – 14 Mar 2027", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Pramod Sawant", status: "upcoming", rs: 1 },
  { state: "Manipur", year: 2027, seats: 60, period: "Feb–Mar 2027", tenure: "14 Mar 2022 – 13 Mar 2027", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "N. Biren Singh", status: "upcoming", rs: 1 },
  { state: "Punjab", year: 2027, seats: 117, period: "Feb–Mar 2027", tenure: "17 Mar 2022 – 16 Mar 2027", currentParty: "AAP", partyColor: "#2563eb", alliance: "INDIA", cm: "Bhagwant Mann", status: "upcoming", rs: 7 },
  { state: "Uttar Pradesh", year: 2027, seats: 403, period: "Apr–May 2027", tenure: "23 May 2022 – 22 May 2027", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Yogi Adityanath", status: "upcoming", rs: 31 },
  { state: "Gujarat", year: 2027, seats: 182, period: "Nov–Dec 2027", tenure: "12 Dec 2022 – 11 Dec 2027", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Bhupendra Patel", status: "upcoming", rs: 11 },
  { state: "Himachal Pradesh", year: 2027, seats: 68, period: "Nov–Dec 2027", tenure: "12 Dec 2022 – 11 Dec 2027", currentParty: "Congress", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Sukhvinder Singh Sukhu", status: "upcoming", rs: 3 },

  // ── 2028 ──────────────────────────────────────────────────────
  { state: "Meghalaya", year: 2028, seats: 60, period: "Feb–Mar 2028", tenure: "23 Mar 2023 – 22 Mar 2028", currentParty: "NPP", partyColor: "#8b5cf6", alliance: "NDA", cm: "Conrad Sangma", status: "future", rs: 1 },
  { state: "Nagaland", year: 2028, seats: 60, period: "Feb–Mar 2028", tenure: "23 Mar 2023 – 22 Mar 2028", currentParty: "NDPP+BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Neiphiu Rio", status: "future", rs: 1 },
  { state: "Tripura", year: 2028, seats: 60, period: "Feb–Mar 2028", tenure: "23 Mar 2023 – 22 Mar 2028", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Manik Saha", status: "future", rs: 1 },
  { state: "Karnataka", year: 2028, seats: 224, period: "Apr–May 2028", tenure: "14 May 2023 – 13 May 2028", currentParty: "Congress", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Siddaramaiah", status: "future", rs: 12 },
  { state: "Chhattisgarh", year: 2028, seats: 90, period: "Nov–Dec 2028", tenure: "5 Dec 2023 – 4 Dec 2028", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Vishnu Deo Sai", status: "future", rs: 5 },
  { state: "Madhya Pradesh", year: 2028, seats: 230, period: "Nov–Dec 2028", tenure: "5 Dec 2023 – 4 Dec 2028", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Mohan Yadav", status: "future", rs: 11 },
  { state: "Rajasthan", year: 2028, seats: 200, period: "Nov–Dec 2028", tenure: "5 Dec 2023 – 4 Dec 2028", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Bhajan Lal Sharma", status: "future", rs: 10 },
  { state: "Telangana", year: 2028, seats: 119, period: "Nov–Dec 2028", tenure: "5 Dec 2023 – 4 Dec 2028", currentParty: "Congress", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Revanth Reddy", status: "future", rs: 7 },
  { state: "Mizoram", year: 2028, seats: 40, period: "Nov–Dec 2028", tenure: "6 Dec 2023 – 5 Dec 2028", currentParty: "ZPM", partyColor: "#10b981", alliance: "Independent", cm: "Lalduhoma", status: "future", rs: 1 },

  // ── 2029 (+ General Election) ─────────────────────────────────
  { state: "Lok Sabha (General)", year: 2029, seats: 543, period: "May–Jun 2029", tenure: "6 Jun 2024 – 5 Jun 2029", currentParty: "BJP+NDA", partyColor: "#ff9933", alliance: "NDA", cm: "Narendra Modi (PM)", status: "future", rs: 245 },
  { state: "Andhra Pradesh", year: 2029, seats: 175, period: "May–Jun 2029", currentParty: "TDP+BJP", partyColor: "#f59e0b", alliance: "NDA", cm: "N. Chandrababu Naidu", status: "future", rs: 11 },
  { state: "Odisha", year: 2029, seats: 147, period: "May–Jun 2029", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Mohan Majhi", status: "future", rs: 10 },
  { state: "Haryana", year: 2029, seats: 90, period: "Sept–Oct 2029", tenure: "8 Oct 2024 – 7 Oct 2029", currentParty: "BJP", partyColor: "#ff9933", alliance: "NDA", cm: "Nayab Singh Saini", status: "future", rs: 5 },
  { state: "Maharashtra", year: 2029, seats: 288, period: "Oct–Nov 2029", tenure: "23 Nov 2024 – 22 Nov 2029", currentParty: "Mahayuti (BJP+SS+NCP)", partyColor: "#ff9933", alliance: "NDA", cm: "Devendra Fadnavis", status: "future", rs: 19 },
  { state: "Jharkhand", year: 2029, seats: 81, period: "Oct–Nov 2029", tenure: "23 Nov 2024 – 22 Nov 2029", currentParty: "JMM+Congress", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Hemant Soren", status: "future", rs: 6 },
  { state: "Jammu & Kashmir", year: 2029, seats: 90, period: "Sept–Oct 2029", tenure: "8 Oct 2024 – 7 Oct 2029", currentParty: "NC+Congress", partyColor: "#1d4ed8", alliance: "INDIA", cm: "Omar Abdullah", status: "future", rs: 4 },
];
