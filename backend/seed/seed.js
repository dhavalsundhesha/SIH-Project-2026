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
        specialPower:
          "Unlock hidden locations on the India map.",
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
        heritage:
          "Amber Fort, Jaisalmer Fort, Mehrangarh Fort",
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
        heritage:
          "Rani ki Vav, Dholavira, Gir National Park",
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
        heritage:
          "Alleppey Backwaters, Padmanabhaswamy Temple",
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
        heritage:
          "Brihadeeswarar Temple, Mahabalipuram",
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
        heritage:
          "Taj Mahal, Sarnath, Varanasi Ghats",
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
        heritage:
          "Ajanta and Ellora Caves, Gateway of India",
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
        heritage:
          "Victoria Memorial, Sundarbans",
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
        heritage:
          "Golden Temple, Jallianwala Bagh",
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
        heritage:
          "Konark Sun Temple, Jagannath Temple Puri",
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
    // QUIZ
    // ==========================================

    console.log("Seeding sample quiz...");

    await Quiz.create({
      title: "Indus Valley Civilization Basics",
      relatedState: bySlugState["Gujarat"],
      difficulty: "easy",
      xpReward: 30,

      questions: [
        {
          prompt:
            "Which of these is a major Indus Valley Civilization site in modern-day India?",

          options: [
            "Dholavira",
            "Athens",
            "Rome",
            "Thebes",
          ],

          correctIndex: 0,

          explanation:
            "Dholavira is one of the major Harappan archaeological sites located in present-day Gujarat.",
        },

        {
          prompt:
            "What material was the famous Dancing Girl statue made from?",

          options: [
            "Gold",
            "Bronze",
            "Marble",
            "Clay",
          ],

          correctIndex: 1,

          explanation:
            "The Dancing Girl is a bronze figurine created using the lost-wax casting technique.",
        },

        {
          prompt:
            "The Great Bath, a key structure of the Indus Valley Civilization, was found at:",

          options: [
            "Lothal",
            "Mohenjo-daro",
            "Kalibangan",
            "Rakhigarhi",
          ],

          correctIndex: 1,

          explanation:
            "The Great Bath is one of the most famous structures discovered at Mohenjo-daro.",
        },
      ],
    });

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
        description:
          "Explore your first state on the India map.",
        icon: "🥾",
        criteria: "Explore 1 state",
      },

      {
        name: "Artifact Hunter",
        description:
          "Collect your first historical artifact.",
        icon: "🔍",
        criteria: "Collect 1 artifact",
      },

      {
        name: "Quiz Whiz",
        description:
          "Score 100% on any quiz.",
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
    console.log("Quiz      : 1");
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