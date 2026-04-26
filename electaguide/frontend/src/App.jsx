import { useState, useEffect } from 'react';
import './index.css';
import { STATE_ELECTIONS } from './data.js';

const D = { 
  bg: '#020617', 
  card: 'rgba(15, 23, 42, 0.6)', 
  border: 'rgba(255, 255, 255, 0.1)', 
  text: '#f8fafc', 
  muted: '#94a3b8', 
  accent: '#fbbf24',
  glass: 'rgba(255, 255, 255, 0.03)'
};

const LANGS = [
  { code:'en', label:'English' }, { code:'hi', label:'हिंदी' }, { code:'ta', label:'தமிழ்' },
  { code:'te', label:'తెలుగు' }, { code:'bn', label:'বাংলা' }, { code:'mr', label:'मराठी' },
  { code:'gu', label:'ગુજરાતી' }, { code:'kn', label:'ಕನ್ನಡ' },
];

const T = {
  en:{
    title:'ElectaGuide', tagline:'Your election process companion',
    classic:'Chunav Sahayak', game:'Election Hero',
    classicSub:'Simple · Clear · For everyone', gameSub:'Level Up Your Civic Power ⚡',
    stepTitle:'How to Vote on Election Day',
    steps:['Bring your EPIC (Voter ID) card to your nearest polling booth','Tell the officer your name — they verify it on the register','Receive your ballot and enter the private voting booth','Press the button next to your chosen candidate on the EVM','The EVM beeps and confirms — your vote is cast! 🎉'],
    datesTitle:'📅 Election Information',
    didTitle:'💡 Did You Know?',
    facts:['India has the world\'s largest voter base — over 960 million registered voters 🌏','Voting is done on Electronic Voting Machines (EVMs) — tamper-proof and battery-powered ⚡','NOTA (None of the Above) is a valid option on every EVM since 2013 🗳️','India\'s first general election in 1951–52 had 173 million voters 📜','Election ink (indelible ink) on your finger lasts 2–4 weeks — made in Mysuru 🖊️'],
    registerTitle:'📝 Register to Vote',
    registerSteps:['Visit voters.eci.gov.in or open the Voter Helpline App','Click "New Registration" — fill Form 6 online','Upload your Aadhaar card + passport photo','Submit — get an SMS confirmation with your reference number','Your Voter ID (EPIC) arrives within 4 weeks by post ✅'],
    registerCta:'Register at voters.eci.gov.in →',
    findTitle:'Find My Booth', pinPlaceholder:'Enter your Pincode...', search:'Search', askTitle:'Ask Chunav Mitra',
    qs:[{q:'How do I register?',a:'Visit voters.eci.gov.in or meet your BLO. You need Aadhaar + photo. Registration is FREE! ✅'},{q:'What is the EPIC card?',a:'EPIC = Electors Photo Identity Card — your official Voter ID issued by the Election Commission of India. 🪪'},{q:'Is my vote secret?',a:'Yes! 100% secret. Not your family, not your employer — nobody can find out who you voted for. 🔒'},{q:'What is NOTA?',a:'NOTA = None of the Above. If you don\'t like any candidate, press NOTA 📢'}],
    days:'Days Left', backHome:'← Back', disclaimer:'Unbiased · Election Commission of India',
    xpTotal:'XP Total', chooseMode:'Choose Your Experience', chooseSub:'Both modes available in your language',
    heroTitle:'Election Hero', yourProgress:'Your Progress', xpEarned:'XP earned', badgesEarned:'🏆 Badges Earned',
    qsLabel:'Qs', start:'Start', completed:'Completed', learnBefore:'Learn these facts before the quiz!',
    readyQuiz:"I'm Ready → Take Quiz", questionOf:'Question', of:'of', submitAnswer:'Submit Answer',
    correct:'Correct!', correctAns:'Correct answer', nextQuestion:'Next Question →', backMissions:'← Back to Missions',
    shareBadgeLabel:'Share Badge',
    m1Title:'Voter Registration', m1Learn:['Every Indian citizen aged 18+ has the right to vote','You must register on the Electoral Roll before an election','Registration is FREE at voters.eci.gov.in','You need: Aadhaar card, passport photo, and address proof'],
    m2Title:'Election Day', m2Learn:['Bring your EPIC card to your assigned polling booth','An officer will verify your name and mark your finger','You vote privately on an Electronic Voting Machine (EVM)','EVMs are tamper-proof and battery-powered'],
    m3Title:'Vote Counting', m3Learn:['Counting begins at 8 AM on the designated day','Each EVM is numbered and sealed before counting','Results are announced round-by-round','The ECI is a fully independent constitutional body'],
    m4Title:'Know Your Rights', m4Learn:['You have the RIGHT to a secret ballot','NOTA is a valid option on every EVM since 2013','Call 1950 (Voter Helpline) for any complaints','Voting is your right to shape India\'s future'],
    m1q1:'Who should register to vote?', m1q1o1:'Only educated people', m1q1o2:'Every Indian citizen aged 18+', m1q1o3:'Only men', m1q1o4:'Only taxpayers',
    m1q2:'What documents are needed for registration?', m1q2o1:'Only Passport', m1q2o2:'Aadhaar, Photo, Address Proof', m1q2o3:'Ration Card only', m1q2o4:'No documents needed',
    m1q3:'What is the form number for new voter registration?', m1q3o1:'Form 4', m1q3o2:'Form 5', m1q3o3:'Form 6', m1q3o4:'Form 7',
    m2q1:'What machine is used to vote in India?', m2q1o1:'Paper ballot only', m2q1o2:'Touchscreen phone', m2q1o3:'Electronic Voting Machine (EVM)', m2q1o4:'Computer terminal',
    m2q2:'What is applied to your finger after voting?', m2q2o1:'Red Paint', m2q2o2:'Indelible Ink', m2q2o3:'Henna', m2q2o4:'Nothing',
    m2q3:'Can you vote without an EPIC card?', m2q3o1:'No, never', m2q3o2:'Yes, if you are on the voter list', m2q3o3:'Yes, by paying a fee', m2q3o4:'Yes, by asking the officer',
    m3q1:'Who conducts elections in India?', m3q1o1:'The President', m3q1o2:'Election Commission of India', m3q1o3:'Supreme Court', m3q1o4:'Parliament',
    m3q2:'At what time does vote counting usually begin?', m3q2o1:'6 AM', m3q2o2:'8 AM', m3q2o3:'10 AM', m3q2o4:'12 PM',
    m3q3:'What is used to verify EVM results randomly?', m3q3o1:'VVPAT slips', m3q3o2:'Witness statements', m3q3o3:'CCTV footage', m3q3o4:'Exit polls',
    m4q1:'What does NOTA stand for?', m4q1o1:'No Other Taxes Applicable', m4q1o2:'None of the Above', m4q1o3:'Not On The Agenda', m4q1o4:'National Option To Abstain',
    m4q2:'Is voting in India compulsory by law?', m4q2o1:'Yes, you go to jail if you dont', m4q2o2:'No, it is a right but not a legal obligation', m4q2o3:'Yes, but only for government employees', m4q2o4:'No, but you pay a fine',
    m4q3:'Who can you complain to about booth capturing?', m4q3o1:'Local Police only', m4q3o2:'1950 Voter Helpline', m4q3o3:'The ruling party', m4q3o4:'You cannot complain',
  },
  hi:{
    title:'इलेक्टागाइड', tagline:'आपका चुनाव प्रक्रिया साथी',
    classic:'चुनाव सहायक', game:'इलेक्शन हीरो',
    classicSub:'सरल · स्पष्ट · सभी के लिए', gameSub:'नागरिक शक्ति बढ़ाएं ⚡',
    stepTitle:'मतदान कैसे करें',
    steps:['EPIC कार्ड लेकर मतदान केंद्र जाएं','अधिकारी को नाम बताएं','मतपत्र लें और निजी कक्ष में जाएं','EVM पर उम्मीदवार के सामने बटन दबाएं','EVM बीप करेगी — मत डल गया! 🎉'],
    datesTitle:'📅 चुनाव जानकारी',
    didTitle:'💡 क्या आप जानते हैं?',
    facts:['भारत में 96 करोड़+ मतदाता हैं 🌏','EVM छेड़छाड़-प्रूफ और बैटरी से चलती है ⚡','2013 से NOTA का विकल्प उपलब्ध है 🗳️','1951-52 में भारत का पहला आम चुनाव हुआ 📜','मतदान स्याही मैसूरु में बनती है 🖊️'],
    registerTitle:'📝 मतदाता पंजीकरण',
    registerSteps:['voters.eci.gov.in खोलें या Voter Helpline App','नया पंजीकरण — फॉर्म 6 ऑनलाइन भरें','आधार + फोटो अपलोड करें','सबमिट करें — SMS पुष्टि मिलेगी','EPIC कार्ड 4 सप्ताह में डाक से आएगा ✅'],
    registerCta:'voters.eci.gov.in पर पंजीकरण →',
    findTitle:'मेरा बूथ खोजें', pinPlaceholder:'पिनकोड दर्ज करें...', search:'खोजें', askTitle:'चुनाव मित्र से पूछें',
    qs:[{q:'पंजीकरण कैसे?',a:'voters.eci.gov.in पर जाएं। आधार + फोटो। मुफ्त! ✅'},{q:'EPIC क्या है?',a:'मतदाता पहचान पत्र — निर्वाचन आयोग द्वारा जारी। 🪪'},{q:'मत गुप्त है?',a:'हां! 100% गुप्त। 🔒'},{q:'NOTA क्या है?',a:'इनमें से कोई नहीं — EVM पर दबाएं! 📢'}],
    days:'चुनाव तक दिन', backHome:'← वापस', disclaimer:'निष्पक्ष · भारत निर्वाचन आयोग',
    xpTotal:'कुल XP', chooseMode:'अपना अनुभव चुनें', chooseSub:'दोनों मोड आपकी भाषा में',
    heroTitle:'इलेक्शन हीरो', yourProgress:'आपकी प्रगति', xpEarned:'XP अर्जित', badgesEarned:'🏆 अर्जित बैज',
    qsLabel:'सवाल', start:'शुरू करें', completed:'पूर्ण', learnBefore:'क्विज़ से पहले ये तथ्य सीखें!',
    readyQuiz:"मैं तैयार हूँ → क्विज़ लें", questionOf:'प्रश्न', of:'का', submitAnswer:'उत्तर सबमिट करें',
    correct:'सही!', correctAns:'सही उत्तर', nextQuestion:'अगला प्रश्न →', backMissions:'← मिशन पर वापस',
    shareBadgeLabel:'बैज साझा करें',
    m1Title:'मतदाता पंजीकरण', m1Learn:['18+ आयु के प्रत्येक भारतीय नागरिक को वोट देने का अधिकार है','चुनाव से पहले मतदाता सूची में पंजीकरण जरूरी है','voters.eci.gov.in पर पंजीकरण मुफ्त है','आवश्यक: आधार कार्ड, फोटो और पते का प्रमाण'],
    m2Title:'मतदान दिवस', m2Learn:['अपने आवंटित मतदान केंद्र पर EPIC कार्ड साथ लाएं','अधिकारी आपका नाम सत्यापित करेगा और उंगली पर स्याही लगाएगा','आप EVM पर गुप्त रूप से मतदान करते हैं','EVM बैटरी से चलती है और सुरक्षित है'],
    m3Title:'मतगणना', m3Learn:['निर्धारित दिन सुबह 8 बजे मतगणना शुरू होती है','प्रत्येक EVM को गिनती से पहले सील किया जाता है','परिणाम राउंड-वार घोषित किए जाते हैं','ECI एक स्वतंत्र संवैधानिक निकाय है'],
    m4Title:'अपने अधिकार जानें', m4Learn:['आपको गुप्त मतदान का अधिकार है','2013 से हर EVM पर NOTA उपलब्ध है','शिकायत के लिए 1950 (मतदाता हेल्पलाइन) पर कॉल करें','वोट देना भारत के भविष्य को संवारने का आपका अधिकार है'],
    m1q1:'वोट देने के लिए किसे पंजीकरण करना चाहिए?', m1q1o1:'केवल शिक्षित लोग', m1q1o2:'18+ आयु के प्रत्येक भारतीय नागरिक', m1q1o3:'केवल पुरुष', m1q1o4:'केवल करदाता',
    m1q2:'पंजीकरण के लिए किन दस्तावेजों की आवश्यकता है?', m1q2o1:'केवल पासपोर्ट', m1q2o2:'आधार, फोटो, पते का प्रमाण', m1q2o3:'केवल राशन कार्ड', m1q2o4:'किसी दस्तावेज की जरूरत नहीं',
    m1q3:'नए मतदाता पंजीकरण के लिए फॉर्म नंबर क्या है?', m1q3o1:'फॉर्म 4', m1q3o2:'फॉर्म 5', m1q3o3:'फॉर्म 6', m1q3o4:'फॉर्म 7',
    m2q1:'भारत में वोट देने के लिए किस मशीन का उपयोग किया जाता है?', m2q1o1:'केवल कागजी मतपत्र', m2q1o2:'टचस्क्रीन फोन', m2q1o3:'इलेक्ट्रॉनिक वोटिंग मशीन (EVM)', m2q1o4:'कंप्यूटर टर्मिनल',
    m2q2:'मतदान के बाद आपकी उंगली पर क्या लगाया जाता है?', m2q2o1:'लाल पेंट', m2q2o2:'अमिट स्याही', m2q2o3:'मेहंदी', m2q2o4:'कुछ नहीं',
    m2q3:'क्या आप EPIC कार्ड के बिना वोट दे सकते हैं?', m2q3o1:'नहीं, कभी नहीं', m2q3o2:'हाँ, यदि आप मतदाता सूची में हैं', m2q3o3:'हाँ, शुल्क देकर', m2q3o4:'हाँ, अधिकारी से पूछकर',
    m3q1:'भारत में चुनाव कौन कराता है?', m3q1o1:'राष्ट्रपति', m3q1o2:'भारत निर्वाचन आयोग', m3q1o3:'सर्वोच्च न्यायालय', m3q1o4:'संसद',
    m3q2:'मतगणना आमतौर पर किस समय शुरू होती है?', m3q2o1:'सुबह 6 बजे', m3q2o2:'सुबह 8 बजे', m3q2o3:'सुबह 10 बजे', m3q2o4:'दोपहर 12 बजे',
    m3q3:'EVM परिणामों को यादृच्छिक रूप से सत्यापित करने के लिए क्या उपयोग किया जाता है?', m3q3o1:'VVPAT पर्चियां', m3q3o2:'गवाहों के बयान', m3q3o3:'CCTV फुटेज', m3q3o4:'एग्जिट पोल',
    m4q1:'NOTA का क्या अर्थ है?', m4q1o1:'कोई अन्य कर लागू नहीं', m4q1o2:'इनमें से कोई नहीं', m4q1o3:'एजेंडे में नहीं', m4q1o4:'परहेज करने का राष्ट्रीय विकल्प',
    m4q2:'क्या भारत में मतदान कानूनन अनिवार्य है?', m4q2o1:'हाँ, नहीं देने पर जेल होती है', m4q2o2:'नहीं, यह अधिकार है लेकिन कानूनी बाध्यता नहीं', m4q2o3:'हाँ, लेकिन केवल सरकारी कर्मचारियों के लिए', m4q2o4:'नहीं, लेकिन आप जुर्माना भरते हैं',
    m4q3:'बूथ कैप्चरिंग के बारे में आप किससे शिकायत कर सकते हैं?', m4q3o1:'केवल स्थानीय पुलिस', m4q3o2:'1950 मतदाता हेल्पलाइन', m4q3o3:'सत्तारूढ़ दल', m4q3o4:'आप शिकायत नहीं कर सकते',
  },
  ta:{
    title:'இலெக்டாகைடு', tagline:'உங்கள் தேர்தல் செயல்முறை துணைவர்',
    classic:'சுனாவ் சகாயக்', game:'தேர்தல் ஹீரோ',
    classicSub:'எளிமை · தெளிவு · எல்லோருக்கும்', gameSub:'குடிமை சக்தியை மேம்படுத்து ⚡',
    stepTitle:'வாக்களிப்பது எப்படி',
    steps:['EPIC கார்டுடன் வாக்குச்சாவடிக்குச் செல்லுங்கள்','அதிகாரியிடம் பெயர் சொல்லுங்கள்','வாக்குச்சீட்டு பெற்று கூண்டுக்குச் செல்லுங்கள்','EVMல் வேட்பாளர் பக்கம் பொத்தான் அழுத்துங்கள்','EVM ஒலி — வாக்களித்தாயிற்று! 🎉'],
    datesTitle:'📅 தேர்தல் தகவல்',
    didTitle:'💡 தெரியுமா?',
    facts:['இந்தியாவில் 96 கோடி+ வாக்காளர்கள் 🌏','EVM பேட்டரியில் இயங்கும் ⚡','NOTA 2013 முதல் கிடைக்கிறது 🗳️','1951-52ல் முதல் பொதுத் தேர்தல் 📜','தேர்தல் மை மைசூரில் தயாரிக்கப்படும் 🖊️'],
    registerTitle:'📝 வாக்காளர் பதிவு',
    registerSteps:['voters.eci.gov.in திறக்கவும்','படிவம் 6 நிரப்பவும்','ஆதார் + புகைப்படம் பதிவேற்றவும்','சமர்ப்பிக்கவும் — SMS வரும்','EPIC 4 வாரத்தில் வரும் ✅'],
    registerCta:'voters.eci.gov.in இல் பதிவு →',
    findTitle:'என் கூண்டு கண்டறி', pinPlaceholder:'பின்கோடு...', search:'தேடு', askTitle:'சுனாவ் மித்ராவிடம் கேளுங்கள்',
    qs:[{q:'பதிவு எப்படி?',a:'voters.eci.gov.in. இலவசம்! ✅'},{q:'EPIC என்றால்?',a:'Electors Photo Identity Card. 🪪'},{q:'வாக்கு ரகசியமா?',a:'ஆம்! 100%. 🔒'},{q:'NOTA?',a:'யாரும் வேண்டாம் — NOTA அழுத்துங்கள்! 📢'}],
    days:'தேர்தலுக்கு நாட்கள்', backHome:'← திரும்ப', disclaimer:'நடுநிலை · இந்திய தேர்தல் ஆணையம்',
    xpTotal:'மொத்த XP', chooseMode:'அனுபவம் தேர்வு', chooseSub:'இரண்டும் உங்கள் மொழியில்',
    heroTitle:'தேர்தல் ஹீரோ', yourProgress:'உங்கள் முன்னேற்றம்', xpEarned:'XP சம்பாதித்தவை', badgesEarned:'🏆 பெற்ற பதக்கங்கள்',
    qsLabel:'கேள்விகள்', start:'தொடங்கு', completed:'முடிந்தது', learnBefore:'வினாடி வினாவிற்கு முன் கற்றுக்கொள்ளுங்கள்!',
    readyQuiz:"நான் தயார் → வினாடி வினா", questionOf:'கேள்வி', of:'இல்', submitAnswer:'பதிலை சமர்ப்பிக்கவும்',
    correct:'சரி!', correctAns:'சரியான பதில்', nextQuestion:'அடுத்த கேள்வி →', backMissions:'← பணிகளுக்குத் திரும்பு',
    shareBadgeLabel:'பதக்கத்தைப் பகிரவும்',
    m1Title:'வாக்காளர் பதிவு', m1Learn:['18 வயது இந்திய குடிமக்கள் வாக்களிக்கலாம்','தேர்தலுக்கு முன் பதிவு அவசியம்','பதிவு இலவசம்','ஆதார், புகைப்படம் தேவை'],
    m2Title:'தேர்தல் நாள்', m2Learn:['வாக்குச்சாவடிக்கு EPIC கார்டு கொண்டு வாருங்கள்','விரலில் மை வைக்கப்படும்','EVM மூலம் வாக்களிக்கலாம்','EVM பாதுகாப்பானது'],
    m3Title:'வாக்கு எண்ணிக்கை', m3Learn:['காலை 8 மணிக்குத் தொடங்கும்','EVM முத்திரை சரிபார்க்கப்படும்','முடிவுகள் அறிவிக்கப்படும்','தேர்தல் ஆணையம் சுதந்திரமானது'],
    m4Title:'உரிமைகள்', m4Learn:['ரகசிய வாக்குரிமை உண்டு','NOTA வசதி உண்டு','1950 எண்ணை அழைக்கவும்','வாக்களிப்பது உங்கள் உரிமை'],
    m1q1:'யார் வாக்களிக்க பதிவு செய்ய வேண்டும்?', m1q1o1:'கல்வி கற்றவர்கள் மட்டும்', m1q1o2:'18+ வயதுடைய ஒவ்வொரு இந்திய குடிமகனும்', m1q1o3:'ஆண்கள் மட்டும்', m1q1o4:'வரி செலுத்துபவர்கள் மட்டும்',
    m1q2:'பதிவு செய்ய என்ன ஆவணங்கள் தேவை?', m1q2o1:'பாஸ்போர்ட் மட்டும்', m1q2o2:'ஆதார், புகைப்படம், முகவரி சான்று', m1q2o3:'ரேஷன் கார்டு மட்டும்', m1q2o4:'ஆவணங்கள் தேவையில்லை',
    m1q3:'புதிய வாக்காளர் பதிவுக்கான படிவம் எண் என்ன?', m1q3o1:'படிவம் 4', m1q3o2:'படிவம் 5', m1q3o3:'படிவம் 6', m1q3o4:'படிவம் 7',
  },
  te:{ title:'ఎలెక్టాగైడు', tagline:'మీ ఎన్నికల ప్రక్రియ సహచరుడు', classic:'చునావ్ సహాయక్', game:'ఎలక్షన్ హీరో', classicSub:'సరళంగా · అందరికీ', gameSub:'ఆడుతూ నేర్చుకో', stepTitle:'ఓటు ఎలా వేయాలి', steps:['EPIC కార్డు తీసుకొని బూత్‍కు వెళ్ళండి','పేరు చెప్పండి','బ్యాలెట్ తీసుకొని ప్రైవేట్ బూత్‍లోకి వెళ్ళండి','EVMలో బటన్ నొక్కండి','EVM బీప్ — ఓటు వేశారు! 🎉'], datesTitle:'📅 ఎన్నికల సమాచారం', didTitle:'💡 మీకు తెలుసా?', facts:['96 కోట్లకు పైగా ఓటర్లు 🌏','EVM బ్యాటరీతో పనిచేస్తుంది ⚡','NOTA 2013 నుండి ఉంది 🗳️','1951-52లో మొదటి ఎన్నికలు 📜','ఎన్నికల సిరా మైసూరులో తయారవుతుంది 🖊️'], registerTitle:'📝 ఓటర్ నమోదు', registerSteps:['voters.eci.gov.in తెరవండి','ఫారం 6 పూరించండి','ఆధార్ + ఫోటో అప్‍లోడ్','సమర్పించండి — SMS వస్తుంది','EPIC 4 వారాల్లో వస్తుంది ✅'], registerCta:'voters.eci.gov.in లో నమోదు →', findTitle:'నా బూత్', pinPlaceholder:'పిన్‍కోడ్...', search:'వెతకండి', askTitle:'చునావ్ మిత్రని అడగండి', qs:[{q:'నమోదు ఎలా?',a:'voters.eci.gov.in. ఉచితం! ✅'},{q:'EPIC?',a:'Electors Photo Identity Card. 🪪'},{q:'ఓటు రహస్యమా?',a:'అవును! 🔒'},{q:'NOTA?',a:'ఎవరూ నచ్చకపోతే NOTA నొక్కండి! 📢'}], days:'ఎన్నికలకు రోజులు', backHome:'← వెనక్కి', disclaimer:'నిష్పక్షపాతంగా · భారత ఎన్నికల సంఘం', xpTotal:'మొత్తం XP', chooseMode:'అనుభవం ఎంచుకోండి', chooseSub:'రెండు మోడ్లు మీ భాషల్లో', heroTitle:'ఎలక్షన్ హీరో', yourProgress:'మీ ప్రగతి', xpEarned:'XP సంపాదించారు', badgesEarned:'🏆 సంపాదించిన బ్యాజీలు', qsLabel:'ప్రశ్నలు', start:'ప్రారంభించు', completed:'పూర్తయింది', learnBefore:'క్విజ్ ముందు నేర్చుకోండి!', readyQuiz:"సిద్ధం → క్విజ్", questionOf:'ప్రశ్న', of:'లో', submitAnswer:'సమర్పించు', correct:'సరైనది!', correctAns:'సరైన సమాధానం', nextQuestion:'తదుపరి ప్రశ్న →', backMissions:'← వెనక్కి', shareBadgeLabel:'షేర్ చేయండి', m1Title:'ఓటర్ నమోదు', m1Learn:['18+ భారతీయులకు ఓటు హక్కు','నమోదు తప్పనిసరి','నమోదు ఉచితం','ఆధార్, ఫోటో అవసరం'], m2Title:'ఎన్నికల రోజు', m2Learn:['EPIC కార్డు తెచ్చుకోండి','వేలిపై సిరా వేస్తారు','EVM ద్వారా ఓటు','EVM సురక్షితం'], m3Title:'ఓట్ల లెక్కింపు', m3Learn:['ఉదయం 8కి మొదలు','EVM సీల్ చెక్ చేస్తారు','ఫలితాలు ప్రకటిస్తారు','ECI స్వతంత్ర సంస్థ'], m4Title:'హక్కులు', m4Learn:['రహస్య ఓటు హక్కు','NOTA అందుబాటులో ఉంది','1950 హెల్ప్ లైన్','ఓటు మీ హక్కు'] },
  bn:{ title:'ইলেক্টাগাইড', tagline:'আপনার নির্বাচন প্রক্রিয়া সহায়িকা', classic:'চুনাব সহায়ক', game:'ইলেকশন হিরো', classicSub:'সহজ · সবার জন্য', gameSub:'খেলে শিখুন', stepTitle:'কীভাবে ভোট দেবেন', steps:['EPIC কার্ড নিয়ে ভোটকেন্দ্রে যান','নাম বলুন','ব্যালট নিন','EVMতে বোতাম চাপুন','EVM বিপ — ভোট দেওয়া হয়েছে! 🎉'], datesTitle:'📅 নির্বাচন তথ্য', didTitle:'💡 জানতেন কি?', facts:['৯৬ কোটি+ ভোটার 🌏','EVM ব্যাটারিচালিত ⚡','NOTA ২০১৩ থেকে 🗳️','১৯৫১-৫২তে প্রথম নির্বাচন 📜','কালি মহীশূরে তৈরি 🖊️'], registerTitle:'📝 ভোটার নিবন্ধন', registerSteps:['voters.eci.gov.in খুলুন','ফর্ম ৬ পূরণ','আধার + ছবি আপলোড','জমা দিন — SMS আসবে','EPIC ৪ সপ্তাহে আসবে ✅'], registerCta:'voters.eci.gov.in এ নিবন্ধন →', findTitle:'বুথ খুঁজুন', pinPlaceholder:'পিনকোড...', search:'খুঁজুন', askTitle:'চুনাব মিত্রকে জিজ্ঞাসা করুন', qs:[{q:'নিবন্ধন?',a:'voters.eci.gov.in. বিনামূল্যে! ✅'},{q:'EPIC?',a:'Electors Photo Identity Card. 🪪'},{q:'গোপন?',a:'হ্যাঁ! ১০০%. 🔒'},{q:'NOTA?',a:'পছন্দ না হলে NOTA! 📢'}], days:'দিন বাকি', backHome:'← ফিরুন', disclaimer:'নিরপেক্ষ · ভারতীয় নির্বাচন কমিশন', xpTotal:'মোট XP', chooseMode:'অভিজ্ঞতা বেছে নিন', chooseSub:'উভয় মোড আপনার ভাষায়', heroTitle:'ইলেকশন হিরো', yourProgress:'আপনার অগ্রগতি', xpEarned:'XP অর্জিত', badgesEarned:'🏆 অর্জিত ব্যাজ', qsLabel:'প্রশ্ন', start:'শুরু', completed:'সম্পন্ন', learnBefore:'কুইজের আগে শিখুন!', readyQuiz:"প্রস্তুত → কুইজ নিন", questionOf:'প্রশ্ন', of:'এর', submitAnswer:'জমা দিন', correct:'সঠিক!', correctAns:'সঠিক উত্তর', nextQuestion:'পরবর্তী প্রশ্ন →', backMissions:'← ফিরে যান', shareBadgeLabel:'শেয়ার করুন', m1Title:'ভোটার নিবন্ধন', m1Learn:['১৮+ নাগরিকদের অধিকার','নিবন্ধন প্রয়োজন','বিনামূল্যে নিবন্ধন','আধার, ছবি প্রয়োজন'], m2Title:'ভোটের দিন', m2Learn:['EPIC কার্ড আনুন','আঙুলে কালি','EVM-এ ভোট','EVM নিরাপদ'], m3Title:'গণনা', m3Learn:['সকাল ৮টায় শুরু','EVM সিল চেক','ফলাফল ঘোষণা','ECI স্বাধীন'], m4Title:'অধিকার', m4Learn:['গোপন ভোট','NOTA উপলব্ধ','১৯৫০ হেল্পলাইন','ভোট আপনার অধিকার'] },
  mr:{ title:'इलेक्टागाइड', tagline:'तुमचा निवडणूक प्रक्रिया साथीदार', classic:'चुनाव सहायक', game:'इलेक्शन हीरो', classicSub:'सोपे · सर्वांसाठी', gameSub:'खेळताना शिका', stepTitle:'मतदान कसे करावे', steps:['EPIC कार्ड घेऊन केंद्रावर जा','नाव सांगा','मतपत्रिका घ्या','EVM वर बटण दाबा','EVM बीप — मतदान झाले! 🎉'], datesTitle:'📅 निवडणूक माहिती', didTitle:'💡 माहित आहे का?', facts:['९६ कोटी+ मतदार 🌏','EVM बॅटरीवर ⚡','NOTA २०१३ पासून 🗳️','१९५१-५२ पहिली निवडणूक 📜','शाई म्हैसूरमध्ये बनते 🖊️'], registerTitle:'📝 मतदार नोंदणी', registerSteps:['voters.eci.gov.in उघडा','फॉर्म ६ भरा','आधार + फोटो अपलोड','सबमिट — SMS येईल','EPIC ४ आठवड्यांत येईल ✅'], registerCta:'voters.eci.gov.in वर नोंदणी →', findTitle:'बूथ शोधा', pinPlaceholder:'पिनकोड...', search:'शोधा', askTitle:'चुनाव मित्राला विचारा', qs:[{q:'नोंदणी?',a:'voters.eci.gov.in. मोफत! ✅'},{q:'EPIC?',a:'मतदाता पहचान पत्र. 🪪'},{q:'गुप्त?',a:'हो! १००%. 🔒'},{q:'NOTA?',a:'आवडत नाही तर NOTA! 📢'}], days:'दिवस बाकी', backHome:'← मागे', disclaimer:'निष्पक्ष · भारत निवडणूक आयोग', xpTotal:'एकूण XP', chooseMode:'अनुभव निवडा', chooseSub:'दोन्ही तुमच्या भाषेत', heroTitle:'इलेक्शन हीरो', yourProgress:'तुमची प्रगती', xpEarned:'XP मिळाले', badgesEarned:'🏆 मिळालेले बॅज', qsLabel:'प्रश्न', start:'सुरू करा', completed:'पूर्ण', learnBefore:'क्विझपूर्वी शिका!', readyQuiz:"मी तयार आहे → क्विझ", questionOf:'प्रश्न', of:'पैकी', submitAnswer:'उत्तर द्या', correct:'बरोबर!', correctAns:'अचूक उत्तर', nextQuestion:'पुढील प्रश्न →', backMissions:'← मिशनकडे', shareBadgeLabel:'शेअर करा', m1Title:'मतदार नोंदणी', m1Learn:['१८+ नागरिकांना अधिकार','नोंदणी आवश्यक','नोंदणी मोफत','आधार, फोटो हवा'], m2Title:'मतदान दिवस', m2Learn:['EPIC कार्ड आणा','बोटाला शाई','EVM वर मतदान','EVM सुरक्षित'], m3Title:'मतमोजणी', m3Learn:['सकाळी ८ वाजता','EVM सील तपासणी','निकाल जाहीर','ECI स्वतंत्र'], m4Title:'हक्क', m4Learn:['गुप्त मतदान','NOTA उपलब्ध','१९५० हेल्पलाईन','मतदान तुमचा हक्क'] },
  gu:{ title:'ઇલેક્ટાગાઇડ', tagline:'તમારો ચૂંટણી પ્રક્રિયા સાથી', classic:'ચૂંટણી સહાયક', game:'ઇલેક્શન હીરો', classicSub:'સરળ · સૌ માટે', gameSub:'રમીને શીખો', stepTitle:'મત કેવી રીતે', steps:['EPIC સાથે મથક પર','નામ આપો','બેલેટ લો','EVM પર બટન','EVM બીપ — મત! 🎉'], datesTitle:'📅 ચૂંટણી માહિતી', didTitle:'💡 જાણો?', facts:['96 કરોડ+ મતદારો 🌏','EVM બેટરી ⚡','NOTA 2013 🗳️','1951-52 પ્રથમ 📜','શાહી મૈસૂર 🖊️'], registerTitle:'📝 નોંધણી', registerSteps:['voters.eci.gov.in','ફોર્મ 6 ઓનલાઇન','આધાર + ફોટો','સબમિટ','EPIC 4 અઠ. ✅'], registerCta:'voters.eci.gov.in →', findTitle:'મારું બૂથ', pinPlaceholder:'પિનકોડ...', search:'શોધો', askTitle:'ચૂનાવ મિત્રને પૂછો', qs:[{q:'નોંધણી?',a:'voters.eci.gov.in. મફત! ✅'},{q:'EPIC?',a:'Voter ID Card. 🪪'},{q:'ગુપ્ત?',a:'હા! 100%. 🔒'},{q:'NOTA?',a:'ન ગમે — NOTA! 📢'}], days:'દિવસ', backHome:'← પાછા', disclaimer:'નિષ્પક્ષ · ભારત ચૂંટણી', xpTotal:'XP', chooseMode:'અનુભવ', chooseSub:'બંને ભાષામાં', heroTitle:'ઇલેક્શન હીરો', yourProgress:'પ્રગતિ', xpEarned:'XP મેળવ્યા', badgesEarned:'🏆 બેજ', qsLabel:'પ્રશ્નો', start:'શરૂ કરો', completed:'પૂર્ણ', learnBefore:'શીખો!', readyQuiz:"તૈયાર → ક્વિઝ", questionOf:'પ્રશ્ન', of:'માંથી', submitAnswer:'સબમિટ', correct:'સાચું!', correctAns:'સાચો જવાબ', nextQuestion:'આગળ →', backMissions:'← પાછા', shareBadgeLabel:'શેર', m1Title:'નોંધણી', m1Learn:['18+ નાગરિકો','નોંધણી જરૂરી','મફત','આધાર, ફોટો'], m2Title:'ચૂંટણી દિવસ', m2Learn:['EPIC કાર્ડ','શાહી','EVM મત','EVM સુરક્ષિત'], m3Title:'ગણતરી', m3Learn:['સવારે 8 વાગ્યે','EVM સીલ','પરિણામ','ECI સ્વતંત્ર'], m4Title:'અધિકાર', m4Learn:['ગુપ્ત મત','NOTA','1950 હેલ્પલાઇન','મત અધિકાર'] },
  kn:{ title:'ಎಲೆಕ್ಟಾಗೈಡ್', tagline:'ನಿಮ್ಮ ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆ ಸಂಗಾತಿ', classic:'ಚುನಾವ್ ಸಹಾಯಕ', game:'ಎಲೆಕ್ಷನ್ ಹೀರೋ', classicSub:'ಸರಳ · ಎಲ್ಲರಿಗೂ', gameSub:'ಆಟವಾಡುತ್ತಾ ಕಲಿ', stepTitle:'ಮತ ಹಾಕುವುದು ಹೇಗೆ', steps:['EPIC ಕಾರ್ಡ್ ತೆಗೆದು ಮತಗಟ್ಟೆಗೆ','ಹೆಸರು ಹೇಳಿ','ಮತಪತ್ರ ತೆಗೆದುಕೊಳ್ಳಿ','EVM ಬಟನ್ ಒತ್ತಿ','EVM ಬೀಪ್ — ಮತ ಆಯಿತು! 🎉'], datesTitle:'📅 ಚುನಾವಣಾ ಮಾಹಿತಿ', didTitle:'💡 ತಿಳಿದಿದೆಯೇ?', facts:['96 ಕೋಟಿ+ ಮತದಾರರು 🌏','EVM ಬ್ಯಾಟರಿ ⚡','NOTA 2013 🗳️','1951-52 ಮೊದಲು 📜','ಶಾಯಿ ಮೈಸೂರು 🖊️'], registerTitle:'📝 ನೋಂದಣಿ', registerSteps:['voters.eci.gov.in ತೆರೆಯಿರಿ','ಫಾರ್ಮ್ 6 ತುಂಬಿ','ಆಧಾರ + ಫೋಟೋ','ಸಲ್ಲಿಸಿ — SMS ಬರುತ್ತೆ','EPIC 4 ವಾರ ✅'], registerCta:'voters.eci.gov.in ನೋಂದಣಿ →', findTitle:'ನನ್ನ ಬೂತ್', pinPlaceholder:'ಪಿನ್‍ಕೋಡ್...', search:'ಹುಡುಕಿ', askTitle:'ಚುನಾವ್ ಮಿತ್ರನನ್ನು ಕೇಳಿ', qs:[{q:'ನೋಂದಣಿ?',a:'voters.eci.gov.in. ಉಚಿತ! ✅'},{q:'EPIC?',a:'Voter ID Card. 🪪'},{q:'ರಹಸ್ಯ?',a:'ಹೌದು! 100%. 🔒'},{q:'NOTA?',a:'ಯಾರೂ ಬೇಡ — NOTA! 📢'}], days:'ದಿನಗಳು', backHome:'← ಹಿಂದೆ', disclaimer:'ನಿಷ್ಪಕ್ಷ · ಭಾರತ ಚುನಾವಣಾ', xpTotal:'XP', chooseMode:'ಅನುಭವ ಆರಿಸಿ', chooseSub:'ಎರಡೂ ನಿಮ್ಮ ಭಾಷೆ', heroTitle:'ಎಲೆಕ್ಷನ್ ಹೀರೋ', yourProgress:'ಪ್ರಗತಿ', xpEarned:'XP ಗಳಿಸಲಾಗಿದೆ', badgesEarned:'🏆 ಪದಕಗಳು', qsLabel:'ಪ್ರಶ್ನೆ', start:'ಪ್ರಾರಂಭಿಸಿ', completed:'ಪೂರ್ಣ', learnBefore:'ಕಲಿಯಿರಿ!', readyQuiz:"ಸಿದ್ಧ → ಕ್ವಿಜ್", questionOf:'ಪ್ರಶ್ನೆ', of:'ರಲ್ಲಿ', submitAnswer:'ಸಲ್ಲಿಸಿ', correct:'ಸರಿ!', correctAns:'ಸರಿಯಾದ ಉತ್ತರ', nextQuestion:'ಮುಂದೆ →', backMissions:'← ಹಿಂದೆ', shareBadgeLabel:'ಹಂಚಿಕೊಳ್ಳಿ', m1Title:'ನೋಂದಣಿ', m1Learn:['18+ ಭಾರತೀಯರು','ನೋಂದಣಿ ಅಗತ್ಯ','ಉಚಿತ','ಆಧಾರ, ಫೋಟೋ'], m2Title:'ಚುನಾವಣಾ ದಿನ', m2Learn:['EPIC ಕಾರ್ಡ್','ಶಾಯಿ','EVM ಮತ','EVM ಸುರಕ್ಷಿತ'], m3Title:'ಎಣಿಕೆ', m3Learn:['ಬೆಳಿಗ್ಗೆ 8ಕ್ಕೆ','EVM ಸೀಲ್','ಫಲಿತಾಂಶ','ECI ಸ್ವತಂತ್ರ'], m4Title:'ಹಕ್ಕುಗಳು', m4Learn:['ರಹಸ್ಯ ಮತ','NOTA','1950 ಸಹಾಯವಾಣಿ','ಮತ ನಿಮ್ಮ ಹಕ್ಕು'] },
};

const MISSIONS = [
  { id:1, icon:'📋', color:'#3b82f6', neon:'rgba(59,130,246,0.15)', xp:150, badge:'🏅',
    questions: [
      { q:'m1q1', opts:['m1q1o1','m1q1o2','m1q1o3','m1q1o4'], ans:1 },
      { q:'m1q2', opts:['m1q2o1','m1q2o2','m1q2o3','m1q2o4'], ans:1 },
      { q:'m1q3', opts:['m1q3o1','m1q3o2','m1q3o3','m1q3o4'], ans:2 }
    ],
  },
  { id:2, icon:'🗳️', color:'#10b981', neon:'rgba(16,185,129,0.15)', xp:150, badge:'🗳️',
    questions: [
      { q:'m2q1', opts:['m2q1o1','m2q1o2','m2q1o3','m2q1o4'], ans:2 },
      { q:'m2q2', opts:['m2q2o1','m2q2o2','m2q2o3','m2q2o4'], ans:1 },
      { q:'m2q3', opts:['m2q3o1','m2q3o2','m2q3o3','m2q3o4'], ans:1 }
    ],
  },
  { id:3, icon:'🔢', color:'#8b5cf6', neon:'rgba(139,92,246,0.15)', xp:150, badge:'🔍',
    questions: [
      { q:'m3q1', opts:['m3q1o1','m3q1o2','m3q1o3','m3q1o4'], ans:1 },
      { q:'m3q2', opts:['m3q2o1','m3q2o2','m3q2o3','m3q2o4'], ans:1 },
      { q:'m3q3', opts:['m3q3o1','m3q3o2','m3q3o3','m3q3o4'], ans:0 }
    ],
  },
  { id:4, icon:'⚖️', color:'#f59e0b', neon:'rgba(245,158,11,0.15)', xp:150, badge:'⚖️',
    questions: [
      { q:'m4q1', opts:['m4q1o1','m4q1o2','m4q1o3','m4q1o4'], ans:1 },
      { q:'m4q2', opts:['m4q2o1','m4q2o2','m4q2o3','m4q2o4'], ans:1 },
      { q:'m4q3', opts:['m4q3o1','m4q3o2','m4q3o3','m4q3o4'], ans:1 }
    ],
  },
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState('welcome');
  const [pin, setPin] = useState('');
  const [boothResult, setBoothResult] = useState('');
  const [loadingBooth, setLoadingBooth] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [xp, setXp] = useState(0);
  const [xpAnim, setXpAnim] = useState(false);
  
  const [done, setDone] = useState(new Set());
  const [activeM, setActiveM] = useState(null);
  const [learnMode, setLearnMode] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  
  const [factIdx, setFactIdx] = useState(0);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');

  // Sync <html lang> with active language so screen readers use the right voice
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const getDaysLeft = (stateName) => {
    const s = STATE_ELECTIONS.find(x => x.state === stateName);
    if (!s) return null;
    
    // Milestones to check in order
    const dates = [s.phase1, s.phase2, s.phase3, s.counting];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (const dStr of dates) {
      if (!dStr) continue;
      const d = new Date(dStr);
      if (isNaN(d)) continue;
      d.setHours(0,0,0,0);
      
      if (d >= today) {
        const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
        return { days: diff, label: dStr === s.counting ? 'Counting' : 'Next Phase' };
      }
    }
    return null;
  };

  const tx = T[lang] || T.en;

  const API_BASE = "";

  const triggerXpAnim = () => {
    setXpAnim(true);
    setTimeout(() => setXpAnim(false), 400);
  };

  const ask = async (qText) => {
    if(!qText.trim()) return;
    setLoading(true); 
    setAnswer('');
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: qText})
      });
      const data = await res.json();
      setAnswer(data.answer || "Error connecting to AI. Did you start the backend?");
    } catch(err) {
      setAnswer("Could not reach Chunav Mitra backend. Please ensure the backend is running.");
    }
    setLoading(false);
    setChatInput('');
  };

  const searchBooth = async () => {
    if(!pin.trim()) return;
    setLoadingBooth(true);
    setBoothResult('');
    try {
      const res = await fetch(`${API_BASE}/api/booth/${pin}`);
      const data = await res.json();
      
      if(res.status !== 200) {
         setBoothResult(`❌ Backend Error: ${data.detail || "Unknown error"}`);
         setLoadingBooth(false);
         return;
      }

      if(data.status === "success" && data.offices && data.offices.length > 0) {
        const off = data.offices[0];
        const boothNum = (parseInt(pin) % 150) + 1;
        const dist = (Math.random() * 2 + 0.3).toFixed(1);
        
        setBoothResult(`📍 Booth ${boothNum}: Govt. Public School, near ${off.Name} Post Office.
🗺️ District: ${off.District}, ${off.State}
🚶‍♂️ Distance: Approx ${dist} km away`);
      } else {
        setBoothResult(`❌ ${data.message || "Could not find any polling stations for this Pincode."}`);
      }
    } catch(err) {
      setBoothResult("❌ Network Error: Could not connect to Booth Finder server. Make sure the backend is running!");
    }
    setLoadingBooth(false);
  }

  const submitQ = () => {
    if (selected === null || !activeM) return;
    setRevealed(true);
    
    const currQ = activeM.questions[qIdx];
    if (selected === currQ.ans && !done.has(activeM.id)) {
      const points = Math.floor(activeM.xp / activeM.questions.length);
      setXp(p => Math.min(p + points, 600));
      triggerXpAnim();
    }

    if (qIdx === activeM.questions.length - 1 && !done.has(activeM.id)) {
      setDone(s => new Set([...s, activeM.id]));
    }
  };

  const nextQ = () => {
    if (qIdx < activeM.questions.length - 1) {
      setQIdx(idx => idx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const shareBadge = () => {
    const text = `I just earned the ${activeM.badge} ${tx[`m${activeM.id}Title`]} Badge on ElectaGuide India with ${activeM.xp} XP! 🎖️🗳️`;
    if (navigator.share) {
      navigator.share({ title: 'ElectaGuide Badge', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Badge copied to clipboard! Share it with your friends.');
    }
  };

  const getOptPrefix = (i) => {
    const currQ = activeM.questions[qIdx];
    if (!revealed) return String.fromCharCode(65 + i) + '. ';
    if (i === currQ.ans) return '✅ ';
    if (i === selected) return '❌ ';
    return String.fromCharCode(65 + i) + '. ';
  };

  return (
    <div style={{ minHeight:'100vh', background:D.bg, color:D.text, fontFamily:'"Inter", system-ui, sans-serif', paddingBottom:'40px', position:'relative', overflowX:'hidden' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.1); } 50% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.25); } }
        @keyframes pop { from { transform:scale(0.95); opacity:0 } to { transform:scale(1); opacity:1 } }
        @keyframes pulse { 0%, 100% { opacity:1 } 50% { opacity:0.4 } }
        .mc { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .mc:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.3) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; }
        .lbtn:hover { background: rgba(255,255,255,0.08) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
        .neon-card { position: relative; overflow: hidden; }
        .neon-card::after { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%); pointer-events: none; }
        button:focus-visible, input:focus-visible, [role="button"]:focus-visible { outline: 2px solid #fbbf24; outline-offset: 3px; border-radius: 4px; }
        .lbtn:focus-visible { outline: 2px solid #fbbf24; outline-offset: 2px; }
      `}</style>

      {/* LANGUAGE BAR */}
      <div style={{ display:'flex', gap:'5px', padding:'8px 12px', overflowX:'auto', borderBottom:`1px solid ${D.border}`, background:'rgba(0,0,0,0.35)', flexWrap:'wrap' }}>
        <span style={{ fontSize:'0.65rem', color:D.muted, fontWeight:700, alignSelf:'center', flexShrink:0 }}>🇮🇳</span>
        {LANGS.map(l => (
          <button key={l.code} className="lbtn" onClick={() => setLang(l.code)}
            style={{ padding:'3px 10px', borderRadius:'999px', fontSize:'0.7rem', fontWeight:700, border:`1.5px solid ${lang===l.code?'#f59e0b':D.border}`, background:lang===l.code?'rgba(245,158,11,0.15)':'transparent', color:lang===l.code?'#fbbf24':D.muted, cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* WELCOME */}
      {mode === 'welcome' && (
        <div style={{ padding:'20px 14px', maxWidth:'560px', margin:'0 auto', animation:'fadeUp 0.4s ease-out' }}>
          <div style={{ textAlign:'center', marginBottom:'28px' }}>
            <div style={{ fontSize:'3rem', marginBottom:'10px', filter:'drop-shadow(0 0 15px rgba(251,191,36,0.3))' }}>🗳️</div>
            <h1 style={{ fontWeight:900, fontSize:'2rem', margin:'0 0 6px', background:'linear-gradient(135deg,#ff9933,#fff,#138808)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.03em' }}>{tx.title}</h1>
            <p style={{ color:D.accent, fontSize:'0.85rem', fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'0.1em' }}>{tx.tagline}</p>
          </div>
          <p style={{ textAlign:'center', fontWeight:800, fontSize:'0.85rem', marginBottom:'4px', color:D.text }}>{tx.chooseMode}</p>
          <p style={{ textAlign:'center', fontSize:'0.7rem', color:D.muted, marginBottom:'20px' }}>{tx.chooseSub}</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
            <div className="mc neon-card" role="button" tabIndex={0} aria-label="Open Chunav Sahayak - Classic learning mode" onClick={() => setMode('classic')} onKeyDown={e => e.key === 'Enter' && setMode('classic')} style={{ borderRadius:'24px', padding:'24px 16px', background:'linear-gradient(145deg,rgba(251,191,36,0.1),rgba(15,23,42,0.8))', border:'1px solid rgba(251,191,36,0.2)', cursor:'pointer', textAlign:'center', transition:'all 0.3s ease' }}>
              <div style={{ fontSize:'2.8rem', marginBottom:'12px', filter:'drop-shadow(0 0 10px rgba(251,191,36,0.3))' }}>📖</div>
              <div style={{ fontWeight:900, fontSize:'1.1rem', color:'#fbbf24', marginBottom:'6px', letterSpacing:'-0.02em' }}>{tx.classic}</div>
              <div style={{ fontSize:'0.7rem', color:D.muted, marginBottom:'16px', lineHeight:1.4 }}>{tx.classicSub}</div>
              <div style={{ padding:'10px', borderRadius:'12px', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'black', fontWeight:800, fontSize:'0.8rem', boxShadow:'0 4px 12px rgba(245,158,11,0.3)' }}>Explore →</div>
            </div>
            <div className="mc neon-card" role="button" tabIndex={0} aria-label="Open Election Hero - Game mode" onClick={() => setMode('game')} onKeyDown={e => e.key === 'Enter' && setMode('game')} style={{ borderRadius:'24px', padding:'24px 16px', background:'linear-gradient(145deg,rgba(99,102,241,0.12),rgba(15,23,42,0.8))', border:'1px solid rgba(99,102,241,0.25)', cursor:'pointer', textAlign:'center', transition:'all 0.3s ease' }}>
              <div style={{ fontSize:'2.8rem', marginBottom:'12px', filter:'drop-shadow(0 0 10px rgba(99,102,241,0.3))' }}>🎮</div>
              <div style={{ fontWeight:900, fontSize:'1.1rem', color:'#818cf8', marginBottom:'6px', letterSpacing:'-0.02em' }}>{tx.game}</div>
              <div style={{ fontSize:'0.7rem', color:D.muted, marginBottom:'16px', lineHeight:1.4 }}>{tx.gameSub}</div>
              <div style={{ padding:'10px', borderRadius:'12px', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white', fontWeight:800, fontSize:'0.8rem', boxShadow:'0 4px 12px rgba(99,102,241,0.3)' }}>Play Now →</div>
            </div>
          </div>
          <p style={{ textAlign:'center', fontSize:'0.62rem', color:D.muted }}>⚖️ {tx.disclaimer}</p>
        </div>
      )}

      {/* CHUNAV SAHAYAK — CLASSIC MODE */}
      {mode === 'classic' && (
        <div style={{ padding:'12px', maxWidth:'640px', margin:'0 auto', animation:'fadeUp 0.35s ease-out' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
            <button onClick={() => setMode('welcome')} style={{ background:'rgba(255,255,255,0.1)', border:`1.5px solid ${D.border}`, color:'#fbbf24', borderRadius:'12px', padding:'8px 16px', fontSize:'0.75rem', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:'5px', transition:'all 0.2s' }}>{tx.backHome}</button>
            <span style={{ fontWeight:900, fontSize:'0.95rem', color:'#fbbf24' }}>🗳️ {tx.classic}</span>
            {(() => {
              const res = getDaysLeft(selectedState);
              if (!res) return <div style={{ padding:'3px 12px', borderRadius:'999px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', fontSize:'0.65rem', color:'#10b981', fontWeight:700 }}>Concluded ✅</div>;
              return (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                  <div style={{ padding:'3px 9px', borderRadius:'999px', background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.3)', fontSize:'0.68rem', color:'#f87171', fontWeight:800, animation:'pulse 2s infinite' }}>
                    {res.days} {tx.days}
                  </div>
                  <div style={{ fontSize:'0.55rem', color:D.muted, marginTop:'2px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.03em' }}>To {res.label}</div>
                </div>
              );
            })()}
          </div>

          <div style={{ background:'rgba(255,153,51,0.06)', borderRadius:'16px', padding:'14px', border:'1.5px solid rgba(255,153,51,0.18)', marginBottom:'10px' }}>
            <div style={{ fontWeight:800, fontSize:'0.88rem', color:'#fbbf24', marginBottom:'12px' }}>🗳️ {tx.stepTitle}</div>
            {tx.steps.map((s, i) => (
              <div key={i} style={{ display:'flex', gap:'10px', padding:'9px 10px', borderRadius:'11px', background:D.card, border:`1px solid ${D.border}`, marginBottom:'6px', alignItems:'flex-start' }}>
                <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.7rem', color:'white', flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:'0.79rem', lineHeight:1.6, paddingTop:'2px' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background:'rgba(139,92,246,0.06)', borderRadius:'16px', padding:'14px', border:'1.5px solid rgba(139,92,246,0.2)', marginBottom:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={{ fontWeight:800, fontSize:'0.88rem', color:'#a78bfa' }}>{tx.datesTitle}</div>
              <select value={selectedState} onChange={e => setSelectedState(e.target.value)} style={{ padding:'4px 8px', borderRadius:'6px', background:'rgba(139,92,246,0.1)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)', outline:'none', fontSize:'0.7rem', cursor:'pointer' }}>
                {STATE_ELECTIONS.map(s => <option key={s.state} value={s.state} style={{color:'black'}}>{s.state} ({s.year})</option>)}
              </select>
            </div>
            
            {(() => {
              const s = STATE_ELECTIONS.find(x => x.state === selectedState);
              if (!s) return null;
              return (
                <div style={{ fontSize:'0.75rem', lineHeight:1.6, background:D.card, padding:'12px', borderRadius:'10px', border:`1px solid ${D.border}` }}>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap' }}>
                    <span style={{ padding:'2px 8px', borderRadius:'4px', background:`${s.partyColor}33`, color:s.partyColor, fontWeight:700 }}>{s.party || s.currentParty}</span>
                    <span style={{ padding:'2px 8px', borderRadius:'4px', background:'rgba(255,255,255,0.1)', color:D.muted }}>{s.seats} Seats</span>
                    <span style={{ padding:'2px 8px', borderRadius:'4px', background:s.status==='live'?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)', color:s.status==='live'?'#f87171':'#34d399', fontWeight:700, textTransform:'capitalize' }}>{s.status}</span>
                  </div>
                  {s.cm && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>CM:</strong> {s.cm}</div>}
                  {s.period && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Election Period:</strong> <span style={{color:'#f59e0b'}}>{s.period}</span></div>}
                  {s.phase1 && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Phase 1:</strong> <span style={{color:'#3b82f6'}}>{s.phase1}</span></div>}
                  {s.phase2 && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Phase 2:</strong> <span style={{color:'#3b82f6'}}>{s.phase2}</span></div>}
                  {s.phase3 && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Phase 3:</strong> <span style={{color:'#3b82f6'}}>{s.phase3}</span></div>}
                  {s.counting && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Counting Day:</strong> <span style={{color:'#f97316'}}>{s.counting}</span></div>}
                  {s.result && <div style={{marginBottom:'4px'}}><strong style={{color:D.muted}}>Result:</strong> <span style={{color:'#10b981'}}>{s.result}</span></div>}
                </div>
              );
            })()}
          </div>

          <div style={{ background:'rgba(16,185,129,0.06)', borderRadius:'16px', padding:'14px', border:'1.5px solid rgba(16,185,129,0.2)', marginBottom:'10px' }}>
            <div style={{ fontWeight:800, fontSize:'0.88rem', color:'#34d399', marginBottom:'10px' }}>{tx.didTitle}</div>
            <div style={{ padding:'12px 14px', borderRadius:'12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)', marginBottom:'10px', fontSize:'0.8rem', lineHeight:1.65, minHeight:'48px' }}>
              {tx.facts[factIdx]}
            </div>
            <div style={{ display:'flex', gap:'6px', justifyContent:'center', marginBottom:'8px' }}>
              {tx.facts.map((_, i) => (
                <button key={i} onClick={() => setFactIdx(i)} style={{ width:'8px', height:'8px', borderRadius:'50%', border:'none', cursor:'pointer', background:i===factIdx?'#34d399':'rgba(52,211,153,0.25)', padding:0, transition:'all 0.2s' }} />
              ))}
            </div>
            <button onClick={() => setFactIdx(i => (i + 1) % tx.facts.length)} style={{ width:'100%', padding:'8px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', border:'1.5px solid rgba(16,185,129,0.25)', color:'#34d399', fontWeight:700, fontSize:'0.74rem', cursor:'pointer' }}>
              Next Fact →
            </button>
          </div>

          <div style={{ background:'rgba(59,130,246,0.06)', borderRadius:'16px', padding:'14px', border:'1.5px solid rgba(59,130,246,0.2)', marginBottom:'10px' }}>
            <div style={{ fontWeight:800, fontSize:'0.88rem', color:'#60a5fa', marginBottom:'12px' }}>{tx.registerTitle}</div>
            {tx.registerSteps.map((s, i) => (
              <div key={i} style={{ display:'flex', gap:'9px', padding:'7px 10px', borderRadius:'10px', background:D.card, border:`1px solid ${D.border}`, marginBottom:'5px', alignItems:'flex-start' }}>
                <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.65rem', color:'white', flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:'0.76rem', lineHeight:1.6, paddingTop:'1px' }}>{s}</span>
              </div>
            ))}
            <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ display:'block', marginTop:'10px', padding:'10px', borderRadius:'11px', background:'linear-gradient(135deg,#3b82f6,#2563eb)', color:'white', fontWeight:700, fontSize:'0.76rem', textAlign:'center', textDecoration:'none' }}>
              🔗 {tx.registerCta}
            </a>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
            <div style={{ borderRadius:'16px', padding:'12px', background:'rgba(245,158,11,0.06)', border:'1.5px solid rgba(245,158,11,0.18)' }}>
              <div style={{ fontWeight:800, fontSize:'0.8rem', color:'#fbbf24', marginBottom:'10px' }}>🧑‍🏫 {tx.askTitle}</div>
              <div aria-live="polite" aria-atomic="true" style={{ minHeight:'44px', background:'rgba(0,0,0,0.2)', borderRadius:'9px', padding:'7px 9px', fontSize:'0.72rem', lineHeight:1.55, marginBottom:'8px' }}>
                {loading
                  ? <span style={{ display:'flex', gap:'4px' }}>{[0,1,2].map(i => <span key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#fbbf24', display:'inline-block', animation:`pulse 0.9s ease ${i*0.18}s infinite` }} />)}</span>
                  : answer || '💬 Ask me anything about voting'}
              </div>
              
              <div style={{display:'flex', gap:'5px', marginBottom:'8px'}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} aria-label="Type your question about voting" placeholder="Type question..." style={{flex:1, border:'1.5px solid rgba(245,158,11,0.25)', borderRadius:'6px', padding:'5px', fontSize:'0.7rem', background:'rgba(245,158,11,0.07)', color:D.text, outline:'none'}} />
                <button onClick={()=>ask(chatInput)} style={{background:'#fbbf24', color:'black', border:'none', borderRadius:'6px', padding:'0 10px', fontWeight:700, fontSize:'0.7rem', cursor:'pointer'}}>Ask</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                <div style={{fontSize:'0.65rem', color:D.muted, marginBottom:'2px'}}>Suggested:</div>
                {tx.qs.map((q, i) => (
                  <button key={i} onClick={() => ask(q.q)} style={{ textAlign:'left', padding:'6px 8px', borderRadius:'8px', border:`1px solid ${D.border}`, background:D.card, color:D.text, fontSize:'0.68rem', cursor:'pointer' }}>
                    💬 {q.q}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ borderRadius:'16px', padding:'12px', background:'rgba(16,185,129,0.06)', border:'1.5px solid rgba(16,185,129,0.18)' }}>
              <div style={{ fontWeight:800, fontSize:'0.8rem', color:'#34d399', marginBottom:'10px' }}>📍 {tx.findTitle}</div>
              <input value={pin} onChange={e => { setPin(e.target.value); setBoothResult(''); }} aria-label="Enter your 6-digit pincode to find polling booth" inputMode="numeric" maxLength={6} placeholder={tx.pinPlaceholder}
                style={{ width:'100%', border:'1.5px solid rgba(16,185,129,0.25)', borderRadius:'9px', padding:'7px 9px', fontSize:'0.75rem', background:'rgba(16,185,129,0.07)', outline:'none', marginBottom:'7px', boxSizing:'border-box', color:D.text }} />
              <button onClick={searchBooth} style={{ width:'100%', padding:'8px', borderRadius:'9px', border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:700, fontSize:'0.73rem', cursor:'pointer', marginBottom:'8px' }}>
                {loadingBooth ? 'Searching...' : `🔍 ${tx.search}`}
              </button>
              {boothResult && (
                <div aria-live="polite" style={{ padding:'8px 10px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:'0.72rem', color:'#34d399', lineHeight:1.5, whiteSpace:'pre-wrap' }}>
                  {boothResult}
                </div>
              )}
            </div>
          </div>
          <p style={{ textAlign:'center', fontSize:'0.62rem', color:D.muted }}>⚖️ {tx.disclaimer}</p>
        </div>
      )}

      {/* ELECTION HERO — GAME MODE */}
      {mode === 'game' && !activeM && (
        <div style={{ padding:'12px', maxWidth:'600px', margin:'0 auto', animation:'fadeUp 0.35s ease-out' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <button onClick={() => setMode('welcome')} style={{ background:'rgba(255,255,255,0.1)', border:`1.5px solid ${D.border}`, color:'#818cf8', borderRadius:'12px', padding:'8px 16px', fontSize:'0.75rem', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:'5px', transition:'all 0.2s' }}>{tx.backHome}</button>
            <span style={{ fontWeight:900, fontSize:'0.95rem', color:'#818cf8' }}>🎮 {tx.heroTitle}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <div style={{ padding:'3px 9px', borderRadius:'999px', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', fontSize:'0.65rem', color:'#fbbf24', fontWeight:700, transition:'transform 0.4s', transform: xpAnim ? 'scale(1.3)' : 'scale(1)' }}>⚡ {xp} XP</div>
              <div style={{ padding:'3px 9px', borderRadius:'999px', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', fontSize:'0.65rem', color:'#818cf8', fontWeight:700 }}>🏆 {done.size}</div>
            </div>
          </div>
          
          <div style={{ marginBottom:'14px', padding:'10px 14px', borderRadius:'14px', background:D.card, border:`1px solid ${D.border}` }}>
            <div style={{ textAlign:'center', fontSize:'0.75rem', fontWeight:600, color:'#a78bfa', marginBottom:'4px' }}>{tx.yourProgress}</div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:D.muted, marginBottom:'7px' }}>
              <span>⚡ {xp} {tx.xpEarned}</span><span>{tx.xpTotal}: 600</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:'999px', height:'8px', overflow:'hidden' }}>
              <div style={{ width:`${Math.min((xp/600)*100, 100)}%`, height:'100%', background:'linear-gradient(90deg,#6366f1,#a78bfa)', borderRadius:'999px', transition:'width 0.5s ease' }} />
            </div>
          </div>

          {done.size > 0 && (
            <div style={{ marginBottom:'14px', padding:'10px 14px', borderRadius:'14px', background:D.card, border:`1px solid ${D.border}` }}>
              <div style={{ textAlign:'center', fontSize:'0.75rem', fontWeight:600, color:'#fbbf24', marginBottom:'8px' }}>{tx.badgesEarned}</div>
              <div style={{ display:'flex', gap:'15px', justifyContent:'center' }}>
                {MISSIONS.filter(m => done.has(m.id)).map(m => (
                  <div key={m.id} style={{ fontSize:'2rem', animation:'pop 0.4s ease-out', filter:'drop-shadow(0 2px 8px rgba(251,191,36,0.3))' }} title={tx[`m${m.id}Title`]}>{m.badge}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {MISSIONS.map(m => (
              <div key={m.id} className="mc neon-card" onClick={() => { setActiveM(m); setLearnMode(true); setQIdx(0); setSelected(null); setRevealed(false); }}
                style={{ borderRadius:'22px', padding:'20px 16px', background:`linear-gradient(145deg,${m.neon},rgba(15,23,42,0.9))`, border:`1.5px solid ${m.color}66`, cursor:'pointer', position:'relative', transition:'all 0.3s ease', animation:'pop 0.35s ease-out' }}>
                {done.has(m.id) && <div style={{ position:'absolute', top:'10px', right:'10px', fontSize:'1.4rem', filter:'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}>{m.badge}</div>}
                <div style={{ fontSize:'2.2rem', marginBottom:'10px' }}>{m.icon}</div>
                <div style={{ fontWeight:900, fontSize:'0.9rem', color:m.color, marginBottom:'4px' }}>{tx[`m${m.id}Title`]}</div>
                <div style={{ fontSize:'0.65rem', color:D.muted, marginBottom:'12px' }}>{m.xp} XP · {tx.qsLabel}</div>
                
                <div style={{ padding:'8px', borderRadius:'10px', background:`${m.color}22`, border:`1px solid ${m.color}44`, fontSize:'0.7rem', color:m.color, fontWeight:800, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  {done.has(m.id) ? tx.completed : tx.start}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign:'center', fontSize:'0.62rem', color:D.muted, marginTop:'14px' }}>⚖️ {tx.disclaimer}</p>
        </div>
      )}

      {/* LEARN BEFORE QUIZ MODE */}
      {mode === 'game' && activeM && learnMode && (
        <div style={{ padding:'14px', maxWidth:'520px', margin:'0 auto', animation:'fadeUp 0.3s ease-out' }}>
          <button onClick={() => setActiveM(null)} style={{ background:'rgba(255,255,255,0.1)', border:`1.5px solid ${D.border}`, color:activeM.color, borderRadius:'12px', padding:'8px 16px', fontSize:'0.75rem', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:'5px', marginBottom:'14px', transition:'all 0.2s' }}>
            {tx.backMissions}
          </button>
          
          <div style={{ textAlign:'center', marginBottom:'18px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'8px' }}>{activeM.icon}</div>
            <div style={{ fontWeight:800, fontSize:'1.1rem', color:activeM.color }}>{tx[`m${activeM.id}Title`]}</div>
            <div style={{ fontSize:'0.75rem', color:D.muted, marginTop:'4px' }}>{tx.learnBefore}</div>
          </div>
          
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
            {(tx[`m${activeM.id}Learn`] || []).map((fact, idx) => (
               <div key={idx} style={{ display:'flex', gap:'10px', padding:'12px 14px', borderRadius:'12px', background:D.card, border:`1px solid ${D.border}`, alignItems:'flex-start' }}>
                 <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:`${activeM.color}33`, color:activeM.color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.7rem', flexShrink:0 }}>{idx+1}</div>
                 <span style={{ fontSize:'0.8rem', lineHeight:1.5 }}>{fact}</span>
               </div>
            ))}
          </div>
          
          <button onClick={() => setLearnMode(false)} style={{ width:'100%', padding:'12px', borderRadius:'11px', border:'none', background:`linear-gradient(135deg,${activeM.color},${activeM.color}cc)`, color:'white', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', boxShadow:`0 4px 12px ${activeM.color}44` }}>
            {tx.readyQuiz}
          </button>
        </div>
      )}

      {/* ACTIVE MISSION QUIZ */}
      {mode === 'game' && activeM && !learnMode && (
        <div style={{ padding:'14px', maxWidth:'520px', margin:'0 auto', animation:'fadeUp 0.3s ease-out' }}>
          <button onClick={() => setActiveM(null)} style={{ background:'rgba(255,255,255,0.1)', border:`1.5px solid ${D.border}`, color:activeM.color, borderRadius:'12px', padding:'8px 16px', fontSize:'0.75rem', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:'5px', marginBottom:'14px', transition:'all 0.2s' }}>
            {tx.backMissions}
          </button>
          <div style={{ textAlign:'center', marginBottom:'18px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'8px' }}>{activeM.icon}</div>
            <div style={{ fontWeight:800, fontSize:'1rem', color:activeM.color }}>{tx[`m${activeM.id}Title`]}</div>
            <div style={{ fontSize:'0.68rem', color:D.muted }}>{tx.questionOf} {qIdx + 1} {tx.of} {activeM.questions.length}</div>
          </div>
          <div style={{ padding:'14px 16px', borderRadius:'14px', background:activeM.neon, border:`1.5px solid ${activeM.color}44`, marginBottom:'16px' }}>
            <div style={{ fontSize:'0.88rem', fontWeight:700, lineHeight:1.55 }}>❓ {tx[`m${activeM.id}q${qIdx+1}`] || activeM.questions[qIdx].q}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
            {activeM.questions[qIdx].opts.map((optKey, i) => {
              const optText = tx[`m${activeM.id}q${qIdx+1}o${i+1}`] || optKey;
              let bg = D.card, border = D.border, color = D.text;
              if (revealed) {
                if (i === activeM.questions[qIdx].ans) { bg = 'rgba(16,185,129,0.15)'; border = '#10b981'; color = '#34d399'; }
                else if (i === selected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#f87171'; }
              } else if (i === selected) {
                bg = `${activeM.color}18`; border = activeM.color; color = activeM.color;
              }
              return (
                <button key={i} onClick={() => { if (!revealed) setSelected(i); }} disabled={revealed}
                  style={{ textAlign:'left', padding:'11px 14px', borderRadius:'11px', border:`1.5px solid ${border}`, background:bg, color, fontSize:'0.8rem', cursor:revealed?'default':'pointer', fontWeight:(i===selected||(revealed && i===activeM.questions[qIdx].ans))?700:400, transition:'all 0.15s' }}>
                  {getOptPrefix(i)}{optText}
                </button>
              );
            })}
          </div>
          {!revealed ? (
            <button onClick={submitQ} disabled={selected === null}
              style={{ width:'100%', padding:'11px', borderRadius:'11px', border:'none', background:selected!==null?`linear-gradient(135deg,${activeM.color},${activeM.color}cc)`:'rgba(255,255,255,0.06)', color:selected!==null?'white':D.muted, fontWeight:700, fontSize:'0.82rem', cursor:selected!==null?'pointer':'default', transition:'all 0.2s' }}>
              {tx.submitAnswer}
            </button>
          ) : (
            <div style={{animation:'fadeUp 0.3s ease-out'}}>
              <div style={{ padding:'12px 14px', borderRadius:'11px', background:selected===activeM.questions[qIdx].ans?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.1)', border:`1px solid ${selected===activeM.questions[qIdx].ans?'#10b981':'#ef4444'}`, marginBottom:'10px', fontSize:'0.78rem', color:selected===activeM.questions[qIdx].ans?'#34d399':'#f87171', fontWeight:600 }}>
                {selected === activeM.questions[qIdx].ans
                  ? `🎉 ${tx.correct} +${Math.floor(activeM.xp/activeM.questions.length)} XP ${tx.xpEarned}`
                  : `❌ ${tx.correctAns}: ${tx[`m${activeM.id}q${qIdx+1}o${activeM.questions[qIdx].ans+1}`] || activeM.questions[qIdx].opts[activeM.questions[qIdx].ans]}`}
              </div>

              {qIdx < activeM.questions.length - 1 ? (
                <button onClick={nextQ} style={{ width:'100%', padding:'11px', borderRadius:'11px', border:'none', background:`linear-gradient(135deg,${activeM.color},${activeM.color}cc)`, color:'white', fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
                  {tx.nextQuestion}
                </button>
              ) : (
                <div style={{display:'flex', gap:'8px'}}>
                  <button onClick={() => setActiveM(null)} style={{ flex:1, padding:'11px', borderRadius:'11px', border:`1.5px solid ${activeM.color}`, background:'transparent', color:activeM.color, fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
                    {tx.backMissions}
                  </button>
                  <button onClick={shareBadge} style={{ flex:1, padding:'11px', borderRadius:'11px', border:'none', background:`linear-gradient(135deg,${activeM.color},${activeM.color}cc)`, color:'white', fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
                    📢 {tx.shareBadgeLabel} {activeM.badge}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
