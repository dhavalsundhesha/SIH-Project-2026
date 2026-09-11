require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const GuardianType = require("../models/Guardian");
const State = require("../models/State");
const Artifact = require("../models/Artifact");
const Quiz = require("../models/Quiz");
const Mission = require("../models/Mission");
const Award = require("../models/Award");
const Story = require("../models/Story");

async function seed() {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await connectDB();

    console.log("==========================================");
    console.log("Clearing existing reference data...");
    console.log("==========================================");

    await Promise.all([
      GuardianType.deleteMany(),
      State.deleteMany(),
      Artifact.deleteMany(),
      Quiz.deleteMany(),
      Mission.deleteMany(),
      Award.deleteMany(),
      Story.deleteMany(),
    ]);

    // ==========================================
    // GUARDIANS
    // ==========================================

    console.log("Seeding guardian types...");

    await GuardianType.insertMany([
      {
        key: "explorer",
        name: "The Explorer",
        hindiName: "The Explorer",
        icon: "🧭",
        skillTags: ["Map Reading", "Survival"],
        description:
          "Brave and curious, you venture into the unknown lands of Bharat, discovering hidden wonders and ancient secrets.",
        specialPowerTitle: "Discovery Master",
        specialPower: "Unlock hidden locations on the India map.",
        baseStats: {
          courage: 90,
          wisdom: 70,
          creativity: 60,
          discipline: 55,
        },
        themeColor: "#2f855a",
      },

      {
        key: "historian",
        name: "The Historian",
        hindiName: "The Historian",
        icon: "📚",
        skillTags: ["Ancient Scripts", "Timeline Mastery"],
        description:
          "A keeper of memory and time, you decode ancient scripts and piece together the story of civilizations long past.",
        specialPowerTitle: "History Master",
        specialPower:
          "Reveal deeper historical lore and source facts behind every artifact.",
        baseStats: {
          courage: 55,
          wisdom: 95,
          creativity: 60,
          discipline: 75,
        },
        themeColor: "#4c51bf",
      },

      {
        key: "artist",
        name: "The Artist",
        hindiName: "The Artist",
        icon: "🎨",
        skillTags: ["Folk Art", "Classical Dance"],
        description:
          "With colour and rhythm as your tools, you bring India's living traditions of art, music and dance to life.",
        specialPowerTitle: "Creative Master",
        specialPower:
          "Unlock bonus stories in the Folk Art and Dance gallery.",
        baseStats: {
          courage: 60,
          wisdom: 65,
          creativity: 95,
          discipline: 55,
        },
        themeColor: "#dd6b20",
      },

      {
        key: "protector",
        name: "The Protector",
        hindiName: "The Protector",
        icon: "🛡️",
        skillTags: ["Defense Arts", "Artifact Shield"],
        description:
          "Guardian of heritage, you stand watch over India's monuments and artifacts, protecting them from being forgotten.",
        specialPowerTitle: "Heritage Guardian",
        specialPower:
          "Earn extra XP for protecting and collecting rare and legendary artifacts.",
        baseStats: {
          courage: 80,
          wisdom: 60,
          creativity: 55,
          discipline: 90,
        },
        themeColor: "#3182ce",
      },
    ]);

    // ==========================================
    // STATES
    // ==========================================

    console.log("Seeding states...");

    const states = await State.insertMany([
      {
        name: "Rajasthan",
        icon: "🏰",
        mapPosition: { x: 30, y: 35 },
        region: "North",
        culture:
          "Land of kings, magnificent forts, colorful traditions and vibrant folk culture.",
        food: "Dal Baati Churma, Ker Sangri",
        art: "Miniature Painting, Kathputli Puppetry",
        heritage: "Amber Fort, Jaisalmer Fort, Mehrangarh Fort",
        xpReward: 20,
      },

      {
        name: "Gujarat",
        icon: "🦁",
        mapPosition: { x: 22, y: 45 },
        region: "West",
        culture:
          "Home of the Rann of Kutch, vibrant festivals, traditional crafts and Garba dance.",
        food: "Dhokla, Thepla, Undhiyu",
        art: "Bandhani Tie-Dye, Rogan Art",
        heritage: "Rani ki Vav, Dholavira, Gir National Park",
        xpReward: 20,
      },

      {
        name: "Kerala",
        icon: "🌴",
        mapPosition: { x: 38, y: 88 },
        region: "South",
        culture:
          "Known for its backwaters, classical traditions, Ayurveda and rich cultural heritage.",
        food: "Appam, Sadya, Puttu",
        art: "Kathakali, Mohiniyattam",
        heritage: "Alleppey Backwaters, Padmanabhaswamy Temple",
        xpReward: 20,
      },

      {
        name: "Tamil Nadu",
        icon: "🛕",
        mapPosition: { x: 42, y: 82 },
        region: "South",
        culture:
          "A land of ancient Dravidian temples, classical arts, literature and architecture.",
        food: "Idli, Dosa, Sambar",
        art: "Bharatanatyam, Tanjore Painting",
        heritage: "Brihadeeswarar Temple, Mahabalipuram",
        xpReward: 20,
      },

      {
        name: "Uttar Pradesh",
        icon: "🕌",
        mapPosition: { x: 45, y: 40 },
        region: "North",
        culture:
          "A major center of Indian history, spirituality, architecture, literature and culture.",
        food: "Kebabs, Petha, Chaat",
        art: "Chikankari Embroidery",
        heritage: "Taj Mahal, Sarnath, Varanasi Ghats",
        xpReward: 20,
      },

      {
        name: "Maharashtra",
        icon: "🎭",
        mapPosition: { x: 32, y: 58 },
        region: "West",
        culture:
          "Known for Maratha history, vibrant festivals, cinema, literature and performing arts.",
        food: "Vada Pav, Puran Poli, Misal Pav",
        art: "Warli Painting, Lavani Dance",
        heritage: "Ajanta and Ellora Caves, Gateway of India",
        xpReward: 20,
      },

      {
        name: "West Bengal",
        icon: "🐅",
        mapPosition: { x: 62, y: 48 },
        region: "East",
        culture:
          "A center of literature, music, art, Durga Puja and the unique ecosystem of the Sundarbans.",
        food: "Rasgulla, Macher Jhol",
        art: "Rabindra Sangeet, Patachitra Painting",
        heritage: "Victoria Memorial, Sundarbans",
        xpReward: 20,
      },

      {
        name: "Punjab",
        icon: "🌾",
        mapPosition: { x: 33, y: 22 },
        region: "North",
        culture:
          "Known for its agricultural heritage, energetic Bhangra, traditional food and Sikh heritage.",
        food: "Sarson da Saag, Makki di Roti",
        art: "Bhangra, Phulkari Embroidery",
        heritage: "Golden Temple, Jallianwala Bagh",
        xpReward: 20,
      },

      {
        name: "Odisha",
        icon: "🐢",
        mapPosition: { x: 55, y: 55 },
        region: "East",
        culture:
          "A land of ancient temples, classical dance, traditional crafts and the Jagannath tradition.",
        food: "Chhena Poda, Pakhala",
        art: "Odissi Dance, Pattachitra Painting",
        heritage: "Konark Sun Temple, Jagannath Temple Puri",
        xpReward: 20,
      },
    ]);

    const bySlugState = Object.fromEntries(
      states.map((state) => [state.name, state._id])
    );

    // ==========================================
    // ARTIFACTS
    // ==========================================

    console.log("Seeding artifacts...");

    await Artifact.insertMany([
      {
        name: "Dancing Girl Bronze",
        icon: "💃",
        era: "2300 BCE",
        location: "Mohenjo-daro",
        rarity: "legendary",
        description:
          "A famous bronze figurine from the Indus Valley Civilization, created using the lost-wax casting technique.",
        xpReward: 50,
      },

      {
        name: "Unicorn Seal",
        icon: "🦄",
        era: "2500 BCE",
        location: "Harappa",
        rarity: "epic",
        description:
          "A steatite seal engraved with a one-horned creature, believed to have been associated with trade and administration.",
        xpReward: 35,
      },

      {
        name: "Ashoka's Lion Capital",
        icon: "🦁",
        era: "250 BCE",
        location: "Sarnath",
        rarity: "legendary",
        description:
          "A sandstone capital featuring four lions standing back-to-back. It is the inspiration for India's national emblem.",
        xpReward: 50,
      },

      {
        name: "Painted Black and Red Pottery",
        icon: "🏺",
        era: "2600 BCE",
        location: "Dholavira",
        rarity: "rare",
        description:
          "Ancient pottery decorated with geometric and natural motifs associated with the Harappan cultural tradition.",
        xpReward: 20,
      },

      {
        name: "Ancient Chess Pieces",
        icon: "♟️",
        era: "600 CE",
        location: "Gupta Empire",
        rarity: "epic",
        description:
          "Early game pieces associated with Chaturanga, an ancient Indian strategy game considered an ancestor of modern chess.",
        xpReward: 35,
      },

      {
        name: "Nataraja Bronze",
        icon: "🕉️",
        era: "900 CE",
        location: "Chola Empire",
        rarity: "legendary",
        description:
          "A remarkable Chola bronze representing Shiva as Nataraja, the cosmic dancer, demonstrating the extraordinary skill of South Indian metalworkers.",
        xpReward: 50,
      },
    ]);

    // ==========================================
    // QUIZZES
    // ==========================================

    console.log("Seeding quizzes...");

    await Quiz.insertMany([
      // ==========================================
      // QUIZ 1
      // ==========================================

      {
        title: "Indus Valley Civilization",
        relatedState: bySlugState["Gujarat"],

        // FIXED: easy -> Easy
        difficulty: "Easy",

        xpReward: 30,

        questions: [
          {
            prompt:
              "Which of these is a major Indus Valley Civilization site in modern-day India?",
            options: ["Dholavira", "Athens", "Rome", "Thebes"],
            correctIndex: 0,
            explanation:
              "Dholavira is a major Harappan site located in present-day Gujarat.",
          },

          {
            prompt: "The Great Bath was found at which site?",
            options: ["Lothal", "Mohenjo-daro", "Kalibangan", "Rakhigarhi"],
            correctIndex: 1,
            explanation:
              "The Great Bath is one of the most famous structures at Mohenjo-daro.",
          },

          {
            prompt: "Dholavira is located in which present-day state?",
            options: ["Rajasthan", "Gujarat", "Punjab", "Odisha"],
            correctIndex: 1,
            explanation: "Dholavira is located in Gujarat.",
          },

          {
            prompt: "The famous Dancing Girl figurine was made of:",
            options: ["Gold", "Bronze", "Marble", "Iron"],
            correctIndex: 1,
            explanation:
              "The Dancing Girl is a bronze figurine from the Indus Valley Civilization.",
          },

          {
            prompt:
              "Which civilization is also known as the Harappan Civilization?",
            options: [
              "Indus Valley Civilization",
              "Roman Civilization",
              "Greek Civilization",
              "Persian Civilization",
            ],
            correctIndex: 0,
            explanation:
              "The Indus Valley Civilization is commonly called the Harappan Civilization.",
          },

          {
            prompt:
              "Which site is famous for its advanced water management system?",
            options: ["Dholavira", "Taxila", "Sanchi", "Nalanda"],
            correctIndex: 0,
            explanation:
              "Dholavira is well known for reservoirs and sophisticated water management.",
          },

          {
            prompt: "The Unicorn Seal is associated with which civilization?",
            options: [
              "Indus Valley Civilization",
              "Mauryan Empire",
              "Gupta Empire",
              "Chola Empire",
            ],
            correctIndex: 0,
            explanation:
              "Unicorn seals are important archaeological objects from the Harappan culture.",
          },

          {
            prompt: "Lothal is located in which present-day state?",
            options: ["Gujarat", "Kerala", "Punjab", "Tamil Nadu"],
            correctIndex: 0,
            explanation:
              "Lothal is an important Harappan site in Gujarat.",
          },

          {
            prompt: "The Indus Valley Civilization is mainly known for:",
            options: [
              "Urban planning",
              "Steam engines",
              "Modern computers",
              "Gunpowder",
            ],
            correctIndex: 0,
            explanation:
              "Harappan cities are famous for planned streets, drainage and urban infrastructure.",
          },

          {
            prompt: "Which material was commonly used for Harappan seals?",
            options: ["Steatite", "Plastic", "Steel", "Glass"],
            correctIndex: 0,
            explanation: "Many Harappan seals were made from steatite.",
          },
        ],
      },

      // ==========================================
      // QUIZ 2
      // ==========================================

      {
        title: "Ancient India",
        relatedState: bySlugState["Uttar Pradesh"],

        // FIXED
        difficulty: "Easy",

        xpReward: 30,

        questions: [
          {
            prompt: "Who founded the Mauryan Empire?",
            options: [
              "Chandragupta Maurya",
              "Ashoka",
              "Harsha",
              "Samudragupta",
            ],
            correctIndex: 0,
            explanation:
              "Chandragupta Maurya founded the Mauryan Empire.",
          },

          {
            prompt: "Ashoka belonged to which dynasty?",
            options: ["Maurya", "Chola", "Gupta", "Mughal"],
            correctIndex: 0,
            explanation:
              "Ashoka was one of the most famous rulers of the Mauryan dynasty.",
          },

          {
            prompt:
              "Which event deeply influenced Ashoka's later policies?",
            options: [
              "Kalinga War",
              "Battle of Plassey",
              "First Battle of Panipat",
              "Battle of Haldighati",
            ],
            correctIndex: 0,
            explanation:
              "The Kalinga War is traditionally associated with Ashoka's change toward promoting peace and ethical conduct.",
          },

          {
            prompt: "Nalanda was famous as a:",
            options: ["University", "Fort", "Port", "Temple complex"],
            correctIndex: 0,
            explanation:
              "Nalanda was a renowned ancient center of learning.",
          },

          {
            prompt: "The Gupta period is often associated with achievements in:",
            options: [
              "Science and arts",
              "Steam technology",
              "Modern aviation",
              "Printing press",
            ],
            correctIndex: 0,
            explanation:
              "The Gupta period saw important developments in mathematics, astronomy, literature and art.",
          },

          {
            prompt: "Who wrote the Arthashastra?",
            options: ["Kautilya", "Kalidasa", "Banabhatta", "Tulsidas"],
            correctIndex: 0,
            explanation:
              "The Arthashastra is traditionally attributed to Kautilya, also known as Chanakya.",
          },

          {
            prompt:
              "Which ancient text is associated with Kalidasa?",
            options: [
              "Abhijnanashakuntalam",
              "Arthashastra",
              "Rajatarangini",
              "Akbarnama",
            ],
            correctIndex: 0,
            explanation:
              "Abhijnanashakuntalam is one of Kalidasa's famous works.",
          },

          {
            prompt: "Sarnath is strongly associated with:",
            options: [
              "Buddhism",
              "Sikhism",
              "Zoroastrianism",
              "Jainism only",
            ],
            correctIndex: 0,
            explanation:
              "Sarnath is traditionally associated with Buddha's first sermon.",
          },

          {
            prompt:
              "Which language was widely used in ancient Indian inscriptions?",
            options: ["Prakrit", "English", "French", "Portuguese"],
            correctIndex: 0,
            explanation:
              "Prakrit was used in many ancient Indian inscriptions, including several associated with Ashoka.",
          },

          {
            prompt: "What was Chaturanga?",
            options: [
              "An ancient Indian strategy game",
              "A temple",
              "A coin",
              "A musical instrument",
            ],
            correctIndex: 0,
            explanation:
              "Chaturanga is an ancient Indian strategy game associated with the development of chess.",
          },
        ],
      },

      // ==========================================
      // QUIZ 3
      // ==========================================

      {
        title: "Famous Indian Monuments",
        relatedState: bySlugState["Uttar Pradesh"],

        // FIXED
        difficulty: "Easy",

        xpReward: 30,

        questions: [
          {
            prompt: "The Taj Mahal is located in:",
            options: ["Agra", "Jaipur", "Delhi", "Mumbai"],
            correctIndex: 0,
            explanation:
              "The Taj Mahal is located in Agra, Uttar Pradesh.",
          },

          {
            prompt: "The Red Fort is located in:",
            options: ["Delhi", "Kolkata", "Chennai", "Pune"],
            correctIndex: 0,
            explanation: "The Red Fort is located in Delhi.",
          },

          {
            prompt: "The Gateway of India is located in:",
            options: ["Mumbai", "Delhi", "Ahmedabad", "Lucknow"],
            correctIndex: 0,
            explanation:
              "The Gateway of India is located in Mumbai.",
          },

          {
            prompt: "The Konark Sun Temple is located in:",
            options: ["Odisha", "Gujarat", "Punjab", "Kerala"],
            correctIndex: 0,
            explanation:
              "The Konark Sun Temple is located in Odisha.",
          },

          {
            prompt: "Rani ki Vav is located in:",
            options: ["Patan, Gujarat", "Agra", "Amritsar", "Kochi"],
            correctIndex: 0,
            explanation:
              "Rani ki Vav is a famous stepwell in Patan, Gujarat.",
          },

          {
            prompt: "The Golden Temple is located in:",
            options: ["Amritsar", "Jaipur", "Varanasi", "Bhopal"],
            correctIndex: 0,
            explanation:
              "The Golden Temple is located in Amritsar, Punjab.",
          },

          {
            prompt: "The Brihadeeswarar Temple is located in:",
            options: ["Tamil Nadu", "Rajasthan", "Gujarat", "Punjab"],
            correctIndex: 0,
            explanation:
              "Brihadeeswarar Temple is located in Tamil Nadu.",
          },

          {
            prompt: "Ajanta and Ellora Caves are located in:",
            options: ["Maharashtra", "Kerala", "Odisha", "West Bengal"],
            correctIndex: 0,
            explanation:
              "Ajanta and Ellora Caves are located in Maharashtra.",
          },

          {
            prompt: "Jaisalmer Fort is located in:",
            options: ["Rajasthan", "Gujarat", "Punjab", "Haryana"],
            correctIndex: 0,
            explanation:
              "Jaisalmer Fort is a famous fort in Rajasthan.",
          },

          {
            prompt: "Victoria Memorial is located in:",
            options: ["Kolkata", "Delhi", "Mumbai", "Hyderabad"],
            correctIndex: 0,
            explanation:
              "Victoria Memorial is located in Kolkata, West Bengal.",
          },
        ],
      },

      // ==========================================
      // QUIZ 4
      // ==========================================

      {
        title: "Indian Art and Culture",
        relatedState: bySlugState["Rajasthan"],

        // FIXED
        difficulty: "Medium",

        xpReward: 40,

        questions: [
          {
            prompt:
              "Kathakali is a classical dance form associated with:",
            options: ["Kerala", "Punjab", "Gujarat", "Rajasthan"],
            correctIndex: 0,
            explanation:
              "Kathakali originated in Kerala.",
          },

          {
            prompt:
              "Bharatanatyam is traditionally associated with:",
            options: ["Tamil Nadu", "Punjab", "Odisha", "Gujarat"],
            correctIndex: 0,
            explanation:
              "Bharatanatyam is a classical dance tradition of Tamil Nadu.",
          },

          {
            prompt: "Odissi is a classical dance form from:",
            options: ["Odisha", "Kerala", "Rajasthan", "Maharashtra"],
            correctIndex: 0,
            explanation:
              "Odissi originated in Odisha.",
          },

          {
            prompt: "Garba is strongly associated with:",
            options: ["Gujarat", "Punjab", "Kerala", "Assam"],
            correctIndex: 0,
            explanation:
              "Garba is a traditional dance form strongly associated with Gujarat.",
          },

          {
            prompt: "Kathputli puppetry is associated with:",
            options: ["Rajasthan", "Kerala", "Odisha", "Tamil Nadu"],
            correctIndex: 0,
            explanation:
              "Kathputli is a traditional string puppet art of Rajasthan.",
          },

          {
            prompt: "Warli painting is associated with:",
            options: ["Maharashtra", "Punjab", "Bihar", "Kerala"],
            correctIndex: 0,
            explanation:
              "Warli painting is a traditional art form associated with Maharashtra.",
          },

          {
            prompt: "Phulkari embroidery is associated with:",
            options: ["Punjab", "Gujarat", "Odisha", "Kerala"],
            correctIndex: 0,
            explanation:
              "Phulkari is a traditional embroidery style associated with Punjab.",
          },

          {
            prompt: "Rogan art is associated with:",
            options: ["Gujarat", "Rajasthan", "Punjab", "Tamil Nadu"],
            correctIndex: 0,
            explanation:
              "Rogan painting is a traditional textile art associated with Gujarat.",
          },

          {
            prompt:
              "Lavani is a traditional performance form associated with:",
            options: ["Maharashtra", "Kerala", "Odisha", "Punjab"],
            correctIndex: 0,
            explanation:
              "Lavani is a traditional performance art associated with Maharashtra.",
          },

          {
            prompt:
              "Tanjore painting is traditionally associated with:",
            options: ["Tamil Nadu", "Gujarat", "Punjab", "West Bengal"],
            correctIndex: 0,
            explanation:
              "Tanjore painting is a traditional art form of Tamil Nadu.",
          },
        ],
      },

      // ==========================================
      // QUIZ 5
      // ==========================================

      {
        title: "States and Heritage of India",
        relatedState: bySlugState["Maharashtra"],

        // FIXED
        difficulty: "Easy",

        xpReward: 30,

        questions: [
          {
            prompt: "Which state is famous for the Rann of Kutch?",
            options: ["Gujarat", "Kerala", "Punjab", "Odisha"],
            correctIndex: 0,
            explanation:
              "The Rann of Kutch is located in Gujarat.",
          },

          {
            prompt: "Which state is famous for backwaters?",
            options: ["Kerala", "Rajasthan", "Punjab", "Gujarat"],
            correctIndex: 0,
            explanation:
              "Kerala is famous for its backwaters.",
          },

          {
            prompt:
              "Which state is known for magnificent desert forts?",
            options: ["Rajasthan", "Kerala", "Punjab", "West Bengal"],
            correctIndex: 0,
            explanation:
              "Rajasthan is famous for its forts and desert landscapes.",
          },

          {
            prompt:
              "Which state is famous for the Sundarbans?",
            options: ["West Bengal", "Gujarat", "Punjab", "Tamil Nadu"],
            correctIndex: 0,
            explanation:
              "The Sundarbans are located in West Bengal and Bangladesh.",
          },

          {
            prompt:
              "Which state is famous for the Golden Temple?",
            options: ["Punjab", "Rajasthan", "Odisha", "Maharashtra"],
            correctIndex: 0,
            explanation:
              "The Golden Temple is located in Amritsar, Punjab.",
          },

          {
            prompt:
              "Which state is famous for Konark Sun Temple?",
            options: ["Odisha", "Gujarat", "Kerala", "Punjab"],
            correctIndex: 0,
            explanation:
              "The Konark Sun Temple is located in Odisha.",
          },

          {
            prompt:
              "Which state is famous for Ajanta and Ellora Caves?",
            options: ["Maharashtra", "Tamil Nadu", "Punjab", "Rajasthan"],
            correctIndex: 0,
            explanation:
              "Ajanta and Ellora Caves are located in Maharashtra.",
          },

          {
            prompt:
              "Which state is famous for Brihadeeswarar Temple?",
            options: ["Tamil Nadu", "Gujarat", "Kerala", "Punjab"],
            correctIndex: 0,
            explanation:
              "Brihadeeswarar Temple is located in Tamil Nadu.",
          },

          {
            prompt:
              "Which state is famous for Chikankari embroidery?",
            options: ["Uttar Pradesh", "Gujarat", "Punjab", "Kerala"],
            correctIndex: 0,
            explanation:
              "Chikankari is a famous embroidery tradition associated with Uttar Pradesh.",
          },

          {
            prompt: "Which state is famous for Kathakali?",
            options: ["Kerala", "Rajasthan", "Punjab", "Gujarat"],
            correctIndex: 0,
            explanation:
              "Kathakali is a classical dance tradition from Kerala.",
          },
        ],
      },

      // ==========================================
      // QUIZ 6
      // ==========================================

      {
        title: "Medieval India",
        relatedState: bySlugState["Rajasthan"],

        // FIXED
        difficulty: "Medium",

        xpReward: 40,

        questions: [
          {
            prompt: "Who founded the Mughal Empire in India?",
            options: ["Babur", "Akbar", "Shah Jahan", "Aurangzeb"],
            correctIndex: 0,
            explanation:
              "Babur established the Mughal Empire after the First Battle of Panipat.",
          },

          {
            prompt: "Akbar was the son of:",
            options: ["Humayun", "Babur", "Shah Jahan", "Aurangzeb"],
            correctIndex: 0,
            explanation: "Akbar was the son of Humayun.",
          },

          {
            prompt: "The Taj Mahal was commissioned by:",
            options: ["Shah Jahan", "Akbar", "Babur", "Aurangzeb"],
            correctIndex: 0,
            explanation:
              "Shah Jahan commissioned the Taj Mahal.",
          },

          {
            prompt: "Who built the Red Fort in Delhi?",
            options: ["Shah Jahan", "Akbar", "Babur", "Humayun"],
            correctIndex: 0,
            explanation:
              "Shah Jahan ordered the construction of the Red Fort in Delhi.",
          },

          {
            prompt:
              "Which ruler is associated with Fatehpur Sikri?",
            options: ["Akbar", "Babur", "Aurangzeb", "Humayun"],
            correctIndex: 0,
            explanation:
              "Akbar developed Fatehpur Sikri as an imperial city.",
          },

          {
            prompt:
              "The Chola dynasty was especially influential in:",
            options: [
              "South India",
              "Northwest India",
              "Central Asia",
              "Europe",
            ],
            correctIndex: 0,
            explanation:
              "The Cholas were a major power in South India.",
          },

          {
            prompt:
              "Nataraja bronze sculptures are strongly associated with:",
            options: [
              "Chola art",
              "Mughal art",
              "Rajput miniature art",
              "Gandhara art",
            ],
            correctIndex: 0,
            explanation:
              "Chola artisans became famous for bronze sculptures including Nataraja.",
          },

          {
            prompt:
              "Rajput forts are especially associated with:",
            options: ["Rajasthan", "Kerala", "Odisha", "West Bengal"],
            correctIndex: 0,
            explanation:
              "Rajasthan is renowned for its historic Rajput forts.",
          },

          {
            prompt:
              "Hampi was an important city of the:",
            options: [
              "Vijayanagara Empire",
              "Mauryan Empire",
              "Mughal Empire",
              "Gupta Empire",
            ],
            correctIndex: 0,
            explanation:
              "Hampi was the capital of the Vijayanagara Empire.",
          },

          {
            prompt:
              "The Vijayanagara Empire was centered in:",
            options: [
              "South India",
              "Punjab",
              "Gujarat only",
              "Bengal only",
            ],
            correctIndex: 0,
            explanation:
              "The Vijayanagara Empire was a major South Indian empire.",
          },
        ],
      },

      // ==========================================
      // QUIZ 7
      // ==========================================

      {
        title: "Modern Indian History",
        relatedState: bySlugState["Gujarat"],

        // FIXED
        difficulty: "Medium",

        xpReward: 40,

        questions: [
          {
            prompt:
              "Who is popularly known as the Father of the Indian Constitution?",
            options: [
              "B. R. Ambedkar",
              "Jawaharlal Nehru",
              "Sardar Patel",
              "Subhas Chandra Bose",
            ],
            correctIndex: 0,
            explanation:
              "B. R. Ambedkar played a leading role in drafting the Constitution of India.",
          },

          {
            prompt: "Who led the Dandi March?",
            options: [
              "Mahatma Gandhi",
              "Subhas Chandra Bose",
              "Bhagat Singh",
              "Bal Gangadhar Tilak",
            ],
            correctIndex: 0,
            explanation:
              "Mahatma Gandhi led the Dandi March in 1930.",
          },

          {
            prompt:
              "The Dandi March was related to the protest against:",
            options: [
              "Salt tax",
              "Land tax only",
              "Income tax",
              "Education tax",
            ],
            correctIndex: 0,
            explanation:
              "The Dandi March was part of the Civil Disobedience Movement against the salt laws.",
          },

          {
            prompt: "India became independent in:",
            options: ["1947", "1942", "1950", "1930"],
            correctIndex: 0,
            explanation:
              "India became independent on 15 August 1947.",
          },

          {
            prompt: "India became a republic in:",
            options: ["1950", "1947", "1942", "1952"],
            correctIndex: 0,
            explanation:
              "India became a republic on 26 January 1950.",
          },

          {
            prompt:
              "Who was the first Prime Minister of independent India?",
            options: [
              "Jawaharlal Nehru",
              "Sardar Patel",
              "Rajendra Prasad",
              "B. R. Ambedkar",
            ],
            correctIndex: 0,
            explanation:
              "Jawaharlal Nehru became the first Prime Minister of independent India.",
          },

          {
            prompt: "Who was the first President of India?",
            options: [
              "Dr. Rajendra Prasad",
              "Jawaharlal Nehru",
              "Sardar Patel",
              "C. Rajagopalachari",
            ],
            correctIndex: 0,
            explanation:
              "Dr. Rajendra Prasad was the first President of India.",
          },

          {
            prompt:
              "The Quit India Movement was launched in:",
            options: ["1942", "1930", "1947", "1919"],
            correctIndex: 0,
            explanation:
              "The Quit India Movement was launched in 1942.",
          },

          {
            prompt:
              "Who was the prominent leader associated with the Indian National Army?",
            options: [
              "Subhas Chandra Bose",
              "Mahatma Gandhi",
              "Jawaharlal Nehru",
              "Sardar Patel",
            ],
            correctIndex: 0,
            explanation:
              "Subhas Chandra Bose became the prominent leader associated with the Indian National Army.",
          },

          {
            prompt: "The Indian Constitution was adopted on:",
            options: [
              "26 November 1949",
              "15 August 1947",
              "26 January 1950",
              "2 October 1948",
            ],
            correctIndex: 0,
            explanation:
              "The Constitution of India was adopted on 26 November 1949.",
          },
        ],
      },

      // ==========================================
      // QUIZ 8
      // ==========================================

      {
        title: "Indian Architecture",
        relatedState: bySlugState["Tamil Nadu"],

        // FIXED
        difficulty: "Medium",

        xpReward: 40,

        questions: [
          {
            prompt:
              "Dravidian temple architecture is strongly associated with:",
            options: [
              "South India",
              "North America",
              "Central Asia",
              "Europe",
            ],
            correctIndex: 0,
            explanation:
              "Dravidian architecture is especially associated with South Indian temples.",
          },

          {
            prompt: "A gopuram is commonly found in:",
            options: [
              "South Indian temples",
              "Harappan houses",
              "Mughal gardens",
              "Buddhist stupas only",
            ],
            correctIndex: 0,
            explanation:
              "Gopurams are monumental entrance towers commonly seen in South Indian temples.",
          },

          {
            prompt:
              "Brihadeeswarar Temple is an example of:",
            options: [
              "Chola architecture",
              "Mughal architecture",
              "Rajput architecture",
              "Gothic architecture",
            ],
            correctIndex: 0,
            explanation:
              "Brihadeeswarar Temple is a major example of Chola temple architecture.",
          },

          {
            prompt:
              "The Taj Mahal is primarily built using:",
            options: ["White marble", "Red brick", "Wood", "Granite only"],
            correctIndex: 0,
            explanation:
              "The Taj Mahal is famous for its extensive use of white marble.",
          },

          {
            prompt: "A stepwell is designed primarily around:",
            options: [
              "Access to water",
              "Military training",
              "Royal coronation",
              "Astronomy only",
            ],
            correctIndex: 0,
            explanation:
              "Stepwells were constructed to provide access to stored groundwater.",
          },

          {
            prompt: "Rani ki Vav is an example of a:",
            options: ["Stepwell", "Fort", "Palace", "Stupa"],
            correctIndex: 0,
            explanation:
              "Rani ki Vav is a famous stepwell at Patan in Gujarat.",
          },

          {
            prompt:
              "The Konark Sun Temple is designed in the form of a:",
            options: ["Chariot", "Ship", "Fort", "Pyramid"],
            correctIndex: 0,
            explanation:
              "The Konark temple is famously designed as a monumental stone chariot.",
          },

          {
            prompt: "Stupas are strongly associated with:",
            options: [
              "Buddhist architecture",
              "Modern architecture",
              "Industrial architecture",
              "Colonial railway architecture",
            ],
            correctIndex: 0,
            explanation:
              "Stupas are important monuments in Buddhist architectural traditions.",
          },

          {
            prompt:
              "The Great Bath demonstrates advanced:",
            options: [
              "Water engineering",
              "Gun manufacturing",
              "Railway engineering",
              "Steel production",
            ],
            correctIndex: 0,
            explanation:
              "The Great Bath reflects sophisticated construction and water-management knowledge.",
          },

          {
            prompt: "Hampi is famous for the remains of:",
            options: [
              "Vijayanagara architecture",
              "Roman architecture",
              "Greek architecture",
              "Egyptian architecture",
            ],
            correctIndex: 0,
            explanation:
              "Hampi contains extensive remains of the Vijayanagara period.",
          },
        ],
      },

      // ==========================================
      // QUIZ 9
      // ==========================================

      {
        title: "Festivals and Traditions of India",
        relatedState: bySlugState["Gujarat"],

        // FIXED
        difficulty: "Easy",

        xpReward: 30,

        questions: [
          {
            prompt:
              "Navratri is especially celebrated with Garba in:",
            options: ["Gujarat", "Punjab", "Kerala", "Odisha"],
            correctIndex: 0,
            explanation:
              "Garba is a major traditional dance associated with Navratri celebrations in Gujarat.",
          },

          {
            prompt: "Onam is a major festival of:",
            options: ["Kerala", "Rajasthan", "Punjab", "Gujarat"],
            correctIndex: 0,
            explanation:
              "Onam is a major festival celebrated in Kerala.",
          },

          {
            prompt:
              "Durga Puja is especially associated with:",
            options: ["West Bengal", "Gujarat", "Punjab", "Kerala"],
            correctIndex: 0,
            explanation:
              "Durga Puja is particularly prominent in West Bengal.",
          },

          {
            prompt:
              "Baisakhi is strongly associated with:",
            options: ["Punjab", "Kerala", "Tamil Nadu", "Odisha"],
            correctIndex: 0,
            explanation:
              "Baisakhi is an important festival in Punjab.",
          },

          {
            prompt:
              "Pongal is traditionally celebrated in:",
            options: ["Tamil Nadu", "Rajasthan", "Punjab", "Gujarat"],
            correctIndex: 0,
            explanation:
              "Pongal is a major harvest festival of Tamil Nadu.",
          },

          {
            prompt:
              "Rath Yatra is strongly associated with:",
            options: ["Odisha", "Kerala", "Punjab", "Rajasthan"],
            correctIndex: 0,
            explanation:
              "The Jagannath Rath Yatra at Puri is a major tradition of Odisha.",
          },

          {
            prompt:
              "Bhangra is traditionally associated with:",
            options: ["Punjab", "Gujarat", "Kerala", "Tamil Nadu"],
            correctIndex: 0,
            explanation:
              "Bhangra is a traditional dance form associated with Punjab.",
          },

          {
            prompt:
              "Kathakali performances are traditionally associated with:",
            options: ["Kerala", "Punjab", "Gujarat", "Rajasthan"],
            correctIndex: 0,
            explanation:
              "Kathakali is a classical performance tradition from Kerala.",
          },

          {
            prompt:
              "Which festival is commonly known as the festival of lights?",
            options: ["Diwali", "Holi", "Onam", "Baisakhi"],
            correctIndex: 0,
            explanation:
              "Diwali is widely known as the festival of lights.",
          },

          {
            prompt: "Holi is popularly associated with:",
            options: ["Colours", "Boats", "Puppetry", "Harvest only"],
            correctIndex: 0,
            explanation:
              "Holi is widely celebrated as a festival of colours.",
          },
        ],
      },

      // ==========================================
      // QUIZ 10
      // ==========================================

      {
        title: "Indian Heritage Sites",
        relatedState: bySlugState["Maharashtra"],

        // FIXED
        difficulty: "Hard",

        xpReward: 50,

        questions: [
          {
            prompt:
              "Dholavira is associated with which ancient civilization?",
            options: [
              "Indus Valley Civilization",
              "Roman Civilization",
              "Greek Civilization",
              "Egyptian Civilization",
            ],
            correctIndex: 0,
            explanation:
              "Dholavira was an important city of the Indus Valley Civilization.",
          },

          {
            prompt:
              "Hampi is located in which present-day state?",
            options: ["Karnataka", "Gujarat", "Rajasthan", "Punjab"],
            correctIndex: 0,
            explanation:
              "Hampi is located in Karnataka.",
          },

          {
            prompt: "The Taj Mahal is located in which state?",
            options: [
              "Uttar Pradesh",
              "Gujarat",
              "Rajasthan",
              "Maharashtra",
            ],
            correctIndex: 0,
            explanation:
              "The Taj Mahal is located in Agra, Uttar Pradesh.",
          },

          {
            prompt: "The Konark Sun Temple is located in:",
            options: ["Odisha", "Tamil Nadu", "Gujarat", "Punjab"],
            correctIndex: 0,
            explanation:
              "Konark Sun Temple is located in Odisha.",
          },

          {
            prompt: "Ajanta Caves are located in:",
            options: ["Maharashtra", "Kerala", "Rajasthan", "Punjab"],
            correctIndex: 0,
            explanation:
              "Ajanta Caves are located in Maharashtra.",
          },

          {
            prompt: "Ellora Caves are located in:",
            options: [
              "Maharashtra",
              "Gujarat",
              "West Bengal",
              "Punjab",
            ],
            correctIndex: 0,
            explanation:
              "Ellora Caves are located in Maharashtra.",
          },

          {
            prompt: "Rani ki Vav is located at:",
            options: ["Patan", "Agra", "Amritsar", "Hampi"],
            correctIndex: 0,
            explanation:
              "Rani ki Vav is located at Patan in Gujarat.",
          },

          {
            prompt:
              "The monuments at Mahabalipuram are associated with:",
            options: [
              "Pallava architecture",
              "Mughal architecture",
              "Mauryan architecture",
              "Harappan architecture",
            ],
            correctIndex: 0,
            explanation:
              "Mahabalipuram contains important monuments associated with the Pallava period.",
          },

          {
            prompt:
              "The Sundarbans are best known for their:",
            options: [
              "Mangrove ecosystem",
              "Desert forts",
              "Stepwells",
              "Mountain monasteries",
            ],
            correctIndex: 0,
            explanation:
              "The Sundarbans are famous for their extensive mangrove ecosystem.",
          },

          {
            prompt:
              "Dholavira is particularly notable for its:",
            options: [
              "Water management system",
              "Modern skyscrapers",
              "Railway network",
              "Roman roads",
            ],
            correctIndex: 0,
            explanation:
              "Dholavira is notable for its reservoirs and sophisticated water-management system.",
          },
        ],
      },
    ]);

    console.log("✅ Quizzes seeded: 10 quizzes / 100 questions");

    // ==========================================
    // MISSION
    // ==========================================

    console.log("Seeding sample mission...");

    await Mission.create({
      title: "The Lost Seal of Harappa",

      description:
        "A trader has lost a precious Unicorn Seal somewhere along an ancient trade route. Follow the clues, investigate the evidence and recover the artifact.",

      relatedState: bySlugState["Gujarat"],

      steps: [
        "Speak to the merchant at the city gate.",
        "Examine the trade records for unusual entries.",
        "Search the riverside warehouse.",
        "Analyze the evidence and identify the correct location.",
        "Return the seal and claim your reward.",
      ],

      xpReward: 40,
    });

    // ==========================================
    // AWARDS
    // ==========================================

    console.log("Seeding awards...");

    await Award.insertMany([
      {
        name: "First Steps",
        description: "Explore your first state on the India map.",
        icon: "🥾",
        criteria: "Explore 1 state",
      },

      {
        name: "Artifact Hunter",
        description: "Collect your first historical artifact.",
        icon: "🔍",
        criteria: "Collect 1 artifact",
      },

      {
        name: "Quiz Whiz",
        description: "Score 100% on any quiz.",
        icon: "🧠",
        criteria: "Perfect quiz score",
      },

      {
        name: "Museum Curator",
        description:
          "Collect every artifact available in the museum.",
        icon: "🏛️",
        criteria: "Collect every artifact",
      },

      {
        name: "7-Day Guardian",
        description:
          "Maintain a seven-day learning activity streak.",
        icon: "🔥",
        criteria: "7-day streak",
      },

      {
        name: "Heritage Explorer",
        description:
          "Explore five different regions of India.",
        icon: "🗺️",
        criteria: "Explore 5 regions",
      },

      {
        name: "History Master",
        description:
          "Complete ten history-based learning challenges.",
        icon: "📚",
        criteria: "Complete 10 history challenges",
      },
    ]);

    // ==========================================
    // STORIES
    // ==========================================

    console.log("Seeding stories...");

    await Story.insertMany([
      {
        title: "The Great Bath of Mohenjo-daro",

        relatedState: bySlugState["Gujarat"],

        coverIcon: "🛁",

        era: "c. 2500 BCE",

        body:
          "The Great Bath of Mohenjo-daro is one of the most remarkable structures of the Indus Valley Civilization. It was a large waterproofed pool constructed with carefully laid bricks and sophisticated drainage arrangements. The structure provides important evidence about the engineering skills and social practices of the people who lived in the ancient city.",

        xpReward: 15,
      },

      {
        title: "Ashoka's Change of Heart",

        relatedState: bySlugState["Uttar Pradesh"],

        coverIcon: "🦁",

        era: "c. 261 BCE",

        body:
          "After the Kalinga War, Emperor Ashoka is traditionally described as deeply affected by the consequences of conflict. He later promoted messages of peace, tolerance and ethical conduct throughout his empire. His inscriptions on rocks and pillars provide valuable evidence about his ideas and administration.",

        xpReward: 15,
      },

      {
        title: "The Cholas and the Bronze Art Tradition",

        relatedState: bySlugState["Tamil Nadu"],

        coverIcon: "🕉️",

        era: "c. 850–1250 CE",

        body:
          "During the Chola period, South Indian bronze casting reached an extraordinary level of artistic and technical achievement. Using the lost-wax technique, skilled artisans created detailed sculptures, including famous representations of Nataraja. These works demonstrate the combination of artistic creativity, religious tradition and advanced craftsmanship.",

        xpReward: 15,
      },

      {
        title: "Dholavira: The Ancient City of Water",

        relatedState: bySlugState["Gujarat"],

        coverIcon: "💧",

        era: "c. 3000–1500 BCE",

        body:
          "Dholavira was an important city of the Indus Valley Civilization located in present-day Gujarat. The settlement is particularly known for its sophisticated water-management system, reservoirs and carefully planned urban layout. Its remains provide valuable insights into ancient engineering and city planning.",

        xpReward: 20,
      },

      {
        title: "The Living Heritage of Rajasthan",

        relatedState: bySlugState["Rajasthan"],

        coverIcon: "🏰",

        era: "Medieval to Modern",

        body:
          "Rajasthan is famous for its magnificent forts, palaces, traditional crafts and colorful performing arts. Historic cities and monuments across the region reveal the architectural and cultural traditions of many different periods. Folk music, dance, puppetry and handicrafts continue to form an important part of its living heritage.",

        xpReward: 15,
      },
    ]);

    // ==========================================
    // COMPLETE
    // ==========================================

    console.log("");

    console.log("==========================================");
    console.log("✅ SEED COMPLETE");
    console.log("==========================================");

    console.log("Guardians : 4");
    console.log("States    : 9");
    console.log("Artifacts : 6");
    console.log("Quizzes   : 10");
    console.log("Questions : 100");
    console.log("Mission   : 1");
    console.log("Awards    : 7");
    console.log("Stories   : 5");

    console.log("==========================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error("");
    console.error("❌ SEED FAILED");
    console.error(err);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seed();