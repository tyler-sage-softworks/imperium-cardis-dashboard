import React, { useState, useEffect } from "react";
import {
  Sword,
  Shield,
  Scroll,
  Wheat,
  Crown,
  GitBranch,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Castle,
  Coins,
  Users,
  BookOpen,
  Zap,
  Heart,
  Target,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  List,
  Grid,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// === COLOR & FACTION DATA ===
const factionIconMap = {
  Gold: Coins,
  Red: Sword,
  Blue: Scroll,
  Green: Wheat,
  Purple: Crown,
};

const factionData = [
  {
    color: "Gold",
    name: "Treasury",
    resource: "Coin",
    playstyle: "Economic engine, mercenaries, trade routes",
    historical: "Venice, Carthage, Hanseatic League",
    hex: "#d4af37",
  },
  {
    color: "Red",
    name: "Iron",
    resource: "Manpower",
    playstyle: "Aggressive conquest, fast wins, raids",
    historical: "Rome, Mongols, Achaemenid Persia",
    hex: "#c41e3a",
  },
  {
    color: "Blue",
    name: "Scroll",
    resource: "Knowledge",
    playstyle: "Card advantage, technology, tutoring",
    historical: "Athens, Song China, Islamic Golden Age",
    hex: "#4a7ba7",
  },
  {
    color: "Green",
    name: "Grain",
    resource: "Population",
    playstyle: "Tall development, scaling, hand size",
    historical: "Egypt, Han China, Indus Valley",
    hex: "#2d5016",
  },
  {
    color: "Purple",
    name: "Myth",
    resource: "Influence",
    playstyle: "Control, denial, diplomacy, conversion",
    historical: "Byzantium, Papal States, Achaemenid Court",
    hex: "#6a4c93",
  },
];

const archetypeData = [
  {
    pairing: "Gold + Red",
    name: "Mercenary Empires",
    strategy:
      'Converts treasury surplus into immediate military momentum. Uses high coin output to bypass recruitment cooldowns, funding "pay-to-win" aggressive raids and hiring specialized mercenaries to close games early.',
  },
  {
    pairing: "Gold + Blue",
    name: "Trading Hubs",
    strategy:
      'An "information brokerage" style. Uses trade route wealth to fund expensive tutoring and card draw, essentially buying the specific technology or answers needed to maintain an economic monopoly.',
  },
  {
    pairing: "Gold + Green",
    name: "Industrial Conglomerates",
    strategy:
      'Synergizes high population with high taxation. Uses a massive citizen base to generate exponential gold, which is then reinvested into "tall" infrastructure and permanent resource-scaling buildings.',
  },
  {
    pairing: "Gold + Purple",
    name: "Mercantile Theocracies",
    strategy:
      'Focuses on the "soft power" of wealth. Uses influence and coin to bribe enemy units and deny opponents\' actions, effectively buying diplomatic immunity while slowly converting the map through economic subversion.',
  },
  {
    pairing: "Red + Blue",
    name: "Tactical Avant-Garde",
    strategy:
      'Combines aggressive conquest with high-tech utility. Uses card advantage to ensure a constant stream of combat tricks and "flash" units, allowing for surgical strikes that rely on superior intelligence rather than raw numbers.',
  },
  {
    pairing: "Red + Green",
    name: "Expansionist Hordes",
    strategy:
      'Pure biological scaling meets martial aggression. Uses rapid population growth to fuel an endless supply of cheap manpower, overwhelming opponents through sheer numbers and "snowballing" across the map.',
  },
  {
    pairing: "Red + Purple",
    name: "Iron Autocracies",
    strategy:
      "A blend of military might and psychological warfare. Uses aggression to seize territory while employing influence to force conversions and deny the enemy the ability to retreat or regroup.",
  },
  {
    pairing: "Blue + Green",
    name: "Evolutionary Sages",
    strategy:
      'Scales population to maximize hand size and card draw. Uses technological breakthroughs to protect and buff a "tall" civilization, turning a massive population into a collective engine for endgame victory conditions.',
  },
  {
    pairing: "Blue + Purple",
    name: "Shadow Bureaucracies",
    strategy:
      'The ultimate "Control" archetype. Focuses on tutoring specific denial tools and using diplomatic influence to "lock" the board. It wins by stalling the game until it can tutor a singular, game-ending mythic event.',
  },
  {
    pairing: "Green + Purple",
    name: "Ancestral Communes",
    strategy:
      'Combines population growth with spiritual/diplomatic conversion. Uses the sheer weight of its massive citizenry to exert cultural pressure, converting enemy units peacefully and scaling influence based on the size of the "flock."',
  },
];

const cityCards = [
  {
    id: "c1",
    city: "Rome",
    color: "Red",
    era: "Ancient",
    hp: 22,
    economy: 2,
    military: 4,
    civic: 1,
    bonus: "Units deployed here cost 1 less Manpower to field.",
    hex: "#c41e3a",
  },
  {
    id: "c2",
    city: "Alexandria",
    color: "Blue",
    era: "Ancient",
    hp: 16,
    economy: 2,
    military: 1,
    civic: 4,
    bonus: "Draw 1 card whenever any Blue card is played from this city.",
    hex: "#4a7ba7",
  },
  {
    id: "c3",
    city: "Venice",
    color: "Gold",
    era: "Medieval",
    hp: 15,
    economy: 4,
    military: 1,
    civic: 2,
    bonus: "Once per turn, convert 1 resource of any type into 2 Coin.",
    hex: "#d4af37",
  },
  {
    id: "c4",
    city: "Sparta",
    color: "Red",
    era: "Ancient",
    hp: 24,
    economy: 2,
    military: 4,
    civic: 1,
    bonus: "Military buildings here provide +1 Defense to garrisoned units.",
    hex: "#c41e3a",
  },
];

const buildingTiers = {
  "Tier 1: Normal": [
    {
      id: "b1",
      name: "Granary",
      slot: "Economy",
      color: "Green",
      cost: "1 Pop",
      effect: "+1 Grain per income.",
    },
    {
      id: "b2",
      name: "Local Market",
      slot: "Economy",
      color: "Gold",
      cost: "1 Coin",
      effect: "+1 Coin per income.",
    },
    {
      id: "b3",
      name: "Barracks",
      slot: "Military",
      color: "Red",
      cost: "1 Man",
      effect: "+1 Manpower per income.",
    },
    {
      id: "b4",
      name: "Agora",
      slot: "Civic",
      color: "Blue",
      cost: "1 Know",
      effect: "+1 Knowledge per income.",
    },
  ],
  "Tier 2: Special": [
    {
      id: "b5",
      name: "City Storehouse",
      slot: "Economy",
      color: "Green",
      cost: "2 Pop",
      effect: "+2 Grain per income.",
    },
    {
      id: "b6",
      name: "Regional Market",
      slot: "Economy",
      color: "Gold",
      cost: "2 Coin",
      effect: "+1 Coin per income. Draw 1 card during your Income Phase.",
    },
    {
      id: "b7",
      name: "Military Academy",
      slot: "Military",
      color: "Red",
      cost: "2 Man",
      effect: "+1 Manpower per income. Units you deploy cost 1 less Manpower.",
    },
    {
      id: "b8",
      name: "Scriptorium",
      slot: "Civic",
      color: "Blue",
      cost: "2 Know",
      effect: "+2 Knowledge per income.",
    },
  ],
  "Tier 3: Legendary": [
    {
      id: "b9",
      name: "The Colosseum",
      slot: "Military",
      color: "Red",
      cost: "4 Man + 2 Coin",
      effect:
        "+2 Manpower per income. All units garrisoned here gain +1 Attack.",
      cityReq: "Rome",
    },
    {
      id: "b10",
      name: "Library of Alexandria",
      slot: "Civic",
      color: "Blue",
      cost: "3 Know + 2 Pop",
      effect:
        "+1 Knowledge per income. Draw 2 cards at the start of each of your turns.",
      cityReq: "None",
    },
    {
      id: "b11",
      name: "The Grand Bazaar",
      slot: "Economy",
      color: "Gold",
      cost: "3 Coin + 1 Inf",
      effect:
        "+2 Coin per income. Opponents pay +1 extra resource to play Events.",
      cityReq: "None",
    },
    {
      id: "b12",
      name: "Hagia Sophia",
      slot: "Civic",
      color: "Purple",
      cost: "3 Inf + 2 Know",
      effect:
        "+2 Influence per income. Once per turn, convert 2 Influence into 1 of any resource.",
      cityReq: "Constantinople",
    },
  ],
};

// === MAIN APP COMPONENT ===
const ImperiumCardisHub = () => {
  const [activeTab, setActiveTab] = useState("codex");
  const [codexSection, setCodexSection] = useState("factions");
  const [selectedCity, setSelectedCity] = useState(cityCards[0]);
  const [buildingTier, setBuildingTier] = useState("Tier 1: Normal");
  const [commits, setCommits] = useState([]);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [editingCommit, setEditingCommit] = useState(null);
  const [commitViewMode, setCommitViewMode] = useState("timeline"); // 'timeline' or 'heatmap'
  const [playtestGroups, setPlaytestGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newComment, setNewComment] = useState({
    username: "",
    category: "Balance",
    impact: "Medium",
    comment: "",
  });
  const [versions, setVersions] = useState(["v0.1"]);
  const [version, setVersion] = useState("v0.1");
  const [newVersionName, setNewVersionName] = useState("");
  const [chronicleEntries, setChronicleEntries] = useState([]);
  const [newChronicleEntry, setNewChronicleEntry] = useState({
    version: "",
    title: "",
    items: [""],
  });
  const [commitActivity, setCommitActivity] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Ideas state
  const [ideas, setIdeas] = useState([]);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [newIdea, setNewIdea] = useState({
    submitter: "",
    title: "",
    description: "",
    category: "Gameplay",
  });
  const [ideaResponse, setIdeaResponse] = useState({
    status: "pending",
    response: "",
  });
  const [ideaCommentText, setIdeaCommentText] = useState("");

  // Card management state
  const [factions, setFactions] = useState(factionData);
  const [cities, setCities] = useState(cityCards);
  const [buildings, setBuildings] = useState(buildingTiers);
  const [units, setUnits] = useState([]);
  const [events, setEvents] = useState([]);

  // View modes
  const [factionViewMode, setFactionViewMode] = useState("grid");
  const [cityViewMode, setCityViewMode] = useState("grid");
  const [buildingViewMode, setBuildingViewMode] = useState("grid");
  const [unitViewMode, setUnitViewMode] = useState("grid");
  const [eventViewMode, setEventViewMode] = useState("grid");

  // Search & filter
  const [codexSearch, setCodexSearch] = useState("");
  const [codexColorFilter, setCodexColorFilter] = useState("All");

  // Rulebook
  const [rulebookSearch, setRulebookSearch] = useState("");
  const [expandedRules, setExpandedRules] = useState({});
  const toggleRule = (id) =>
    setExpandedRules((prev) => ({ ...prev, [id]: !prev[id] }));

  const defaultRulebookData = [
    {
      id: "overview",
      icon: "Castle",
      title: "Game Overview",
      color: "#d4af37",
      summary: "A 2–4 player grand strategy card game set across history.",
      rules: [
        {
          q: "What is Imperium Cardis?",
          a: "Imperium Cardis is a 2–4 player competitive card game where each player builds and defends a civilization across three historical eras — Ancient, Medieval, and Renaissance. Players draft city cards, construct buildings, deploy military units, and play historical events to outmaneuver their opponents.",
        },
        {
          q: "What is the goal?",
          a: "Reduce all opponent cities to 0 HP, or fulfill your civilization's unique Victory Condition before anyone else does.",
        },
        {
          q: "How many players?",
          a: "2–4 players. Games typically last 45–90 minutes depending on player count and experience.",
        },
        {
          q: "What do I need to play?",
          a: "Each player needs a City Card (or two for dual-faction play), a hand of cards drawn from a shared deck, and a pool of starting resources.",
        },
      ],
    },
    {
      id: "setup",
      icon: "Scroll",
      title: "Setup & Turn Structure",
      color: "#4a7ba7",
      summary: "How to begin a game and what happens each turn.",
      rules: [
        {
          q: "How do we set up?",
          a: "Each player selects or drafts 1–2 City Cards. Shuffle the shared card deck and deal each player a starting hand of 5 cards. Distribute starting resources based on your city's Economy, Military, and Civic slot totals.",
        },
        {
          q: "What are the phases of a turn?",
          a: "Each turn has four phases: (1) Income Phase, (2) Draw Phase, (3) Action Phase, (4) End Phase.",
        },
        {
          q: "What is the hand limit?",
          a: "The default hand limit is 7 cards. Some buildings and city bonuses can increase this.",
        },
        {
          q: "Who goes first?",
          a: "The player whose city has the highest Civic slot value goes first. Ties are broken by drawing a card — highest cost wins.",
        },
      ],
    },
    {
      id: "resources",
      icon: "Coins",
      title: "Resources",
      color: "#d4af37",
      summary: "The five resource types and how they are spent.",
      rules: [
        {
          q: "What are the five resources?",
          a: "Coin (Gold), Manpower (Red), Knowledge (Blue), Population (Green), Influence (Purple).",
        },
        {
          q: "How do I earn resources?",
          a: "During your Income Phase, collect resources equal to the total output of all buildings you have constructed. Your base income is 0.",
        },
        {
          q: "Can I store resources between turns?",
          a: "Yes. There is no resource cap by default. Resources carry over between turns.",
        },
        {
          q: "Can I trade resources with other players?",
          a: "Yes, during your Action Phase you may offer trades to other players.",
        },
      ],
    },
    {
      id: "cities",
      icon: "Castle",
      title: "Cities & Building Slots",
      color: "#2d5016",
      summary: "How cities work and how buildings are constructed.",
      rules: [
        {
          q: "What do the three slot types mean?",
          a: "Economy Slots hold economy buildings. Military Slots hold military buildings. Civic Slots hold civic buildings.",
        },
        {
          q: "How do I construct a building?",
          a: "During your Action Phase, pay the building's resource cost and place it in the appropriate slot. You may only construct one building per action.",
        },
        {
          q: "Can buildings be destroyed?",
          a: "Yes. Certain unit abilities, siege events, and combat outcomes can destroy buildings.",
        },
        {
          q: "What happens when my city reaches 0 HP?",
          a: "You are eliminated. All your units are removed from play.",
        },
      ],
    },
    {
      id: "combat",
      icon: "Sword",
      title: "Combat",
      color: "#c41e3a",
      summary: "How units attack, defend, and resolve combat.",
      rules: [
        {
          q: "How does attacking work?",
          a: "Declare an attack by choosing one of your deployed units and a target — either an opponent's unit or their city. The defender may block with one of their units.",
        },
        {
          q: "How is combat resolved?",
          a: "Both units deal their Attack value to each other simultaneously. A unit is destroyed when damage received equals or exceeds its Defense value.",
        },
        {
          q: "What are keywords?",
          a: "Raid — deals 1 damage to city even if blocked. Siege — double damage to buildings. First Strike — deals damage before the blocker.",
        },
        {
          q: "Can I attack with multiple units?",
          a: "Yes. Each unit may attack once per turn. Multiple attacks may be declared in a single Action Phase.",
        },
      ],
    },
    {
      id: "events",
      icon: "Zap",
      title: "Event Cards",
      color: "#6a4c93",
      summary: "Playing events and their timing rules.",
      rules: [
        {
          q: "What are the three event timings?",
          a: "Immediate — played during your Action Phase. Instant — played at any time. Reaction — played in response to a specific trigger.",
        },
        {
          q: "Can opponents respond to my events?",
          a: "Yes. After you play an Immediate event, each other player may play an Instant or Reaction card in response.",
        },
        {
          q: "What happens to events after they resolve?",
          a: "All event cards go to a shared discard pile. When the deck is exhausted, the discard pile is reshuffled.",
        },
      ],
    },
    {
      id: "leaders",
      icon: "Crown",
      title: "Leader Cards",
      color: "#d4af37",
      summary: "Special legendary characters with loyalty mechanics.",
      rules: [
        {
          q: "What is a Leader card?",
          a: "Leader cards represent famous historical figures. Each provides a powerful passive ability plus a once-per-game Signature Action.",
        },
        {
          q: "How does Loyalty work?",
          a: "Each leader has a Loyalty cost paid in Influence. If your Influence drops below the threshold, the leader may defect.",
        },
        {
          q: "Can I have multiple leaders?",
          a: "No. Each player may only have one active leader at a time.",
        },
      ],
    },
    {
      id: "victory",
      icon: "Star",
      title: "Victory Conditions",
      color: "#d4af37",
      summary: "Ways to win the game.",
      rules: [
        { q: "Military Victory", a: "Reduce all opponent cities to 0 HP." },
        {
          q: "Economic Victory",
          a: "Accumulate 50 Coin at the start of your Income Phase.",
        },
        {
          q: "Cultural Victory",
          a: "Convert 3 opponent units to your side using Influence-based conversion cards.",
        },
        {
          q: "Technological Victory",
          a: "Be the first to construct one building from each tier in all three slot types (9 buildings total).",
        },
      ],
    },
  ];

  const [rulebookData, setRulebookData] = useState(() => {
    const stored = localStorage.getItem("imperium_rulebook");
    return stored ? JSON.parse(stored) : defaultRulebookData;
  });

  // Rulebook edit state
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null); // { sectionId, ruleIdx, q, a } or null for new
  const [editingSection, setEditingSection] = useState(null); // section object or null for new
  const [newRuleQ, setNewRuleQ] = useState("");
  const [newRuleA, setNewRuleA] = useState("");
  const [newSection, setNewSection] = useState({
    title: "",
    summary: "",
    icon: "Scroll",
    color: "#d4af37",
  });

  useEffect(() => {
    localStorage.setItem("imperium_rulebook", JSON.stringify(rulebookData));
  }, [rulebookData]);

  const handleSaveRule = () => {
    if (!newRuleQ.trim() || !newRuleA.trim()) return;
    setRulebookData((prev) =>
      prev.map((section) => {
        if (section.id !== editingRule.sectionId) return section;
        const rules = [...section.rules];
        if (editingRule.ruleIdx === null) {
          rules.push({ q: newRuleQ, a: newRuleA });
        } else {
          rules[editingRule.ruleIdx] = { q: newRuleQ, a: newRuleA };
        }
        return { ...section, rules };
      })
    );
    setShowRuleModal(false);
    setEditingRule(null);
    setNewRuleQ("");
    setNewRuleA("");
  };

  const handleDeleteRule = (sectionId, ruleIdx) => {
    setRulebookData((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, rules: section.rules.filter((_, i) => i !== ruleIdx) }
          : section
      )
    );
  };

  const handleSaveSection = () => {
    if (!newSection.title.trim()) return;
    if (editingSection?.id) {
      setRulebookData((prev) =>
        prev.map((s) =>
          s.id === editingSection.id ? { ...s, ...newSection } : s
        )
      );
    } else {
      setRulebookData((prev) => [
        ...prev,
        { ...newSection, id: `section_${Date.now()}`, rules: [] },
      ]);
    }
    setShowSectionModal(false);
    setEditingSection(null);
    setNewSection({ title: "", summary: "", icon: "Scroll", color: "#d4af37" });
  };

  const handleDeleteSection = (sectionId) => {
    setRulebookData((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleOpenRuleEdit = (sectionId, ruleIdx = null, rule = null) => {
    setEditingRule({ sectionId, ruleIdx });
    setNewRuleQ(rule?.q || "");
    setNewRuleA(rule?.a || "");
    setShowRuleModal(true);
  };

  const handleOpenSectionEdit = (section = null) => {
    setEditingSection(section);
    setNewSection(
      section
        ? {
            title: section.title,
            summary: section.summary,
            icon: section.icon,
            color: section.color,
          }
        : { title: "", summary: "", icon: "Scroll", color: "#d4af37" }
    );
    setShowSectionModal(true);
  };

  // Edit modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [editCardType, setEditCardType] = useState(null);

  // Import/Export
  const [showImportExport, setShowImportExport] = useState(false);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load playtest groups from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("imperium_playtest_groups");
    if (stored) {
      const groups = JSON.parse(stored);
      setPlaytestGroups(groups);
      if (groups.length > 0) setSelectedGroup(groups[0]);
    }

    const storedVersions = localStorage.getItem("imperium_versions");
    if (storedVersions) {
      setVersions(JSON.parse(storedVersions));
    }

    const storedChronicle = localStorage.getItem("imperium_chronicle");
    if (storedChronicle) {
      setChronicleEntries(JSON.parse(storedChronicle));
    } else {
      // Default first entry
      const defaultEntry = {
        id: Date.now(),
        version: "Version 0.1",
        title: "Core Design Finalized",
        date: "April 2026",
        items: [
          "Established five-faction color identity system inspired by Magic: The Gathering",
          "Designed dual-city drafting system as foundational strategic layer",
          "Created 10 example city cards with unique bonuses and slot distributions",
          "Implemented three-tier building system (Normal, Special, Legendary)",
          "Defined combat resolution mechanics analogous to MtG attacking/blocking",
          "Established Leader card system with Loyalty mechanics and Signature Cards",
        ],
        status: "completed",
      };
      setChronicleEntries([defaultEntry]);
    }

    // Load ideas
    const storedIdeas = localStorage.getItem("imperium_ideas");
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas));
    }

    // Load card data
    const storedFactions = localStorage.getItem("imperium_factions");
    if (storedFactions) setFactions(JSON.parse(storedFactions));

    const storedCities = localStorage.getItem("imperium_cities");
    if (storedCities) {
      const parsedCities = JSON.parse(storedCities);
      // Add IDs if missing
      const citiesWithIds = parsedCities.map((city, index) => ({
        ...city,
        id: city.id || `c${index + 1}`,
      }));
      setCities(citiesWithIds);
      localStorage.setItem("imperium_cities", JSON.stringify(citiesWithIds));
    }

    const storedBuildings = localStorage.getItem("imperium_buildings");
    if (storedBuildings) {
      const parsedBuildings = JSON.parse(storedBuildings);
      // Add IDs if missing
      let buildingIdCounter = 1;
      const buildingsWithIds = {};
      Object.keys(parsedBuildings).forEach((tier) => {
        buildingsWithIds[tier] = parsedBuildings[tier].map((building) => ({
          ...building,
          id: building.id || `b${buildingIdCounter++}`,
        }));
      });
      setBuildings(buildingsWithIds);
      localStorage.setItem(
        "imperium_buildings",
        JSON.stringify(buildingsWithIds)
      );
    }

    const storedUnits = localStorage.getItem("imperium_units");
    if (storedUnits) {
      setUnits(JSON.parse(storedUnits));
    } else {
      // Default unit examples
      const defaultUnits = [
        {
          id: 1,
          name: "Levy Spearmen",
          color: "Red",
          cost: "1 Man",
          attack: 2,
          defense: 1,
          keywords: [],
          description: "Basic infantry unit",
          tier: "Common",
          image: "",
        },
        {
          id: 2,
          name: "Heavy Cavalry",
          color: "Red",
          cost: "3 Man",
          attack: 4,
          defense: 3,
          keywords: ["Raid"],
          description: "Elite mounted warriors",
          tier: "Uncommon",
          image: "",
        },
        {
          id: 3,
          name: "War Elephants",
          color: "Red/Green",
          cost: "4 Man + 2 Pop",
          attack: 5,
          defense: 4,
          keywords: ["Siege"],
          description: "Massive beasts of war",
          tier: "Legendary",
          image: "",
        },
      ];
      setUnits(defaultUnits);
    }

    const storedEvents = localStorage.getItem("imperium_events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Default event examples
      const defaultEvents = [
        {
          id: 1,
          name: "Black Death",
          color: "Gray",
          timing: "Immediate",
          cost: "2 Inf",
          effect:
            "All cities lose 3 HP. Players with no Civic buildings lose 5 HP instead.",
          description: "A devastating plague sweeps the land",
        },
        {
          id: 2,
          name: "Silk Road Established",
          color: "Gold",
          timing: "Immediate",
          cost: "3 Coin",
          effect:
            "Gain 4 Coin. Each opponent with a Trade building gains 1 Coin.",
          description: "New trade routes open prosperity",
        },
        {
          id: 3,
          name: "Ambush",
          color: "Red",
          timing: "Reaction",
          cost: "1 Man",
          effect: "The attacking unit loses 2 Attack until end of combat.",
          description: "Strike from the shadows",
        },
      ];
      setEvents(defaultEvents);
    }

    const storedCommits = localStorage.getItem("imperium_commits");
    if (storedCommits) {
      setCommits(JSON.parse(storedCommits));
    }
  }, []);

  // Save playtest groups to localStorage whenever they change
  useEffect(() => {
    if (playtestGroups.length > 0) {
      localStorage.setItem(
        "imperium_playtest_groups",
        JSON.stringify(playtestGroups)
      );
    }
  }, [playtestGroups]);

  // Save versions to localStorage
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem("imperium_versions", JSON.stringify(versions));
    }
  }, [versions]);

  // Save chronicle to localStorage
  useEffect(() => {
    if (chronicleEntries.length > 0) {
      localStorage.setItem(
        "imperium_chronicle",
        JSON.stringify(chronicleEntries)
      );
    }
  }, [chronicleEntries]);

  // Save ideas to localStorage
  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem("imperium_ideas", JSON.stringify(ideas));
    }
  }, [ideas]);

  // Save card data to localStorage
  useEffect(() => {
    if (factions.length > 0) {
      localStorage.setItem("imperium_factions", JSON.stringify(factions));
    }
  }, [factions]);

  useEffect(() => {
    if (cities.length > 0) {
      localStorage.setItem("imperium_cities", JSON.stringify(cities));
    }
  }, [cities]);

  useEffect(() => {
    if (Object.keys(buildings).length > 0) {
      localStorage.setItem("imperium_buildings", JSON.stringify(buildings));
    }
  }, [buildings]);

  useEffect(() => {
    if (units.length > 0) {
      localStorage.setItem("imperium_units", JSON.stringify(units));
    }
  }, [units]);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("imperium_events", JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (commits.length > 0) {
      localStorage.setItem("imperium_commits", JSON.stringify(commits));
    }
  }, [commits]);

  // GitHub API integration
  useEffect(() => {
    // Keyboard shortcuts for navigation
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            setActiveTab("codex");
            break;
          case "2":
            e.preventDefault();
            setActiveTab("github");
            break;
          case "3":
            e.preventDefault();
            setActiveTab("playtest");
            break;
          case "4":
            e.preventDefault();
            setActiveTab("chronicle");
            break;
          case "5":
            e.preventDefault();
            setActiveTab("ideas");
            break;
          case "6":
            e.preventDefault();
            setActiveTab("rulebook");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // GitHub API integration
  useEffect(() => {
    // DISABLED: GitHub API has CORS restrictions in React artifacts
    // To re-enable, you would need to use a CORS proxy or move this to a backend

    console.log("GitHub API fetching disabled due to CORS restrictions");
    setCommits([]);
    setCommitActivity([]);

    /* Original GitHub API code - disabled due to CORS
    // Fetch recent commits
    fetch('https://api.github.com/repos/tyler-sage-softworks/imperium-cardis/commits?per_page=5')
      .then(res => {
        console.log('GitHub API Response Status:', res.status);
        if (!res.ok) {
          throw new Error(`GitHub API returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('GitHub API Data:', data);
        if (Array.isArray(data) && data.length > 0) {
          const formattedCommits = data.map(commit => ({
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message.split('\n')[0],
            author: commit.commit.author.name,
            date: new Date(commit.commit.author.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })
          }));
          console.log('Formatted commits:', formattedCommits);
          setCommits(formattedCommits);
        } else {
          console.log('No commits found in response');
          setCommits([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch commits:', err);
        setCommits([]);
      });

    // Fetch commit activity for visualization (last 30 commits)
    fetch('https://api.github.com/repos/tyler-sage-softworks/imperium-cardis/commits?per_page=30')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Group commits by date
          const activityMap = {};
          data.forEach(commit => {
            const date = new Date(commit.commit.author.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            activityMap[date] = (activityMap[date] || 0) + 1;
          });
          
          const activity = Object.entries(activityMap)
            .map(([date, count]) => ({ date, count }))
            .reverse()
            .slice(-14); // Last 14 days with activity
          
          setCommitActivity(activity);
        }
      })
      .catch(err => {
        console.error('Failed to fetch commit activity:', err);
      });
    */
  }, []);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setPlaytestGroups([newGroup, ...playtestGroups]);
    setSelectedGroup(newGroup);
    setNewGroupName("");
    setShowNewGroupModal(false);
  };

  const handleSubmitComment = () => {
    if (
      !newComment.username.trim() ||
      !newComment.comment.trim() ||
      !selectedGroup
    )
      return;

    const comment = {
      id: Date.now(),
      ...newComment,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    const updatedGroups = playtestGroups.map((group) =>
      group.id === selectedGroup.id
        ? { ...group, comments: [comment, ...group.comments] }
        : group
    );

    setPlaytestGroups(updatedGroups);
    setSelectedGroup({
      ...selectedGroup,
      comments: [comment, ...selectedGroup.comments],
    });
    setNewComment({
      username: "",
      category: "Balance",
      impact: "Medium",
      comment: "",
    });
    setShowCommentModal(false);
  };

  const handleCreateVersion = () => {
    if (!newVersionName.trim()) return;
    setVersions([...versions, newVersionName]);
    setVersion(newVersionName);
    setNewVersionName("");
    setShowVersionModal(false);
  };

  const handleCreateChronicleEntry = () => {
    if (!newChronicleEntry.version.trim() || !newChronicleEntry.title.trim())
      return;

    const entry = {
      id: Date.now(),
      version: newChronicleEntry.version,
      title: newChronicleEntry.title,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      items: newChronicleEntry.items.filter((item) => item.trim()),
      status: "completed",
    };

    setChronicleEntries([entry, ...chronicleEntries]);
    setNewChronicleEntry({ version: "", title: "", items: [""] });
    setShowChronicleModal(false);
  };

  const addChronicleItem = () => {
    setNewChronicleEntry({
      ...newChronicleEntry,
      items: [...newChronicleEntry.items, ""],
    });
  };

  const updateChronicleItem = (index, value) => {
    const newItems = [...newChronicleEntry.items];
    newItems[index] = value;
    setNewChronicleEntry({ ...newChronicleEntry, items: newItems });
  };

  const removeChronicleItem = (index) => {
    setNewChronicleEntry({
      ...newChronicleEntry,
      items: newChronicleEntry.items.filter((_, i) => i !== index),
    });
  };

  // Idea handlers
  const handleSubmitIdea = () => {
    if (
      !newIdea.submitter.trim() ||
      !newIdea.title.trim() ||
      !newIdea.description.trim()
    )
      return;

    const idea = {
      id: Date.now(),
      ...newIdea,
      status: "pending",
      response: "",
      submittedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setIdeas([idea, ...ideas]);
    setNewIdea({
      submitter: "",
      title: "",
      description: "",
      category: "Gameplay",
    });
    setShowIdeaModal(false);
  };

  const handleOpenResponse = (idea) => {
    setSelectedIdea(idea);
    setIdeaResponse({
      status: idea.status || "pending",
      response: idea.response || "",
    });
    setShowResponseModal(true);
  };

  const handleSaveResponse = () => {
    if (!selectedIdea) return;

    const updatedIdeas = ideas.map((idea) =>
      idea.id === selectedIdea.id
        ? {
            ...idea,
            status: ideaResponse.status,
            response: ideaResponse.response,
          }
        : idea
    );

    setIdeas(updatedIdeas);
    setShowResponseModal(false);
    setSelectedIdea(null);
    setIdeaResponse({ status: "pending", response: "" });
  };

  const handleDeleteIdea = (ideaId) => {
    setIdeas(ideas.filter((idea) => idea.id !== ideaId));
  };

  const handleOpenComments = (idea) => {
    setSelectedIdea(idea);
    setShowCommentsModal(true);
  };

  const handleAddComment = () => {
    if (!ideaCommentText.trim()) return;

    const comment = {
      id: Date.now(),
      text: ideaCommentText,
      author: "Anonymous",
      timestamp: new Date().toLocaleString(),
    };

    setIdeas(
      ideas.map((idea) => {
        if (idea.id === selectedIdea.id) {
          return {
            ...idea,
            comments: [...(idea.comments || []), comment],
          };
        }
        return idea;
      })
    );

    setIdeaCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea.id === selectedIdea.id) {
          return {
            ...idea,
            comments: (idea.comments || []).filter((c) => c.id !== commentId),
          };
        }
        return idea;
      })
    );
  };

  // Utility function to get border style for single or dual-faction cards
  const getCardBorderStyle = (colorString) => {
    // Check if it's a dual-faction card (contains "/" or "+")
    if (colorString.includes("/") || colorString.includes("+")) {
      const colors = colorString.split(/[\/+]/).map((c) => c.trim());
      const color1Hex =
        factionData.find((f) => f.color === colors[0])?.hex || "#d4af37";
      const color2Hex =
        factionData.find((f) => f.color === colors[1])?.hex || "#d4af37";
      return {
        borderImage: `linear-gradient(to right, ${color1Hex} 50%, ${color2Hex} 50%)`,
        borderImageSlice: 1,
      };
    } else {
      // Single faction
      const factionHex =
        factionData.find((f) => f.color === colorString)?.hex || "#d4af37";
      return {
        borderColor: factionHex,
      };
    }
  };

  // Card CRUD operations
  const handleAddCard = (cardType) => {
    const newCard = getEmptyCard(cardType);
    setEditingCard(newCard);
    setEditCardType(cardType);
    setShowEditModal(true);
  };

  const handleEditCard = (card, cardType) => {
    setEditingCard({ ...card });
    setEditCardType(cardType);
    setShowEditModal(true);
  };

  const handleSaveCard = () => {
    if (!editingCard || !editCardType) return;

    switch (editCardType) {
      case "faction":
        if (editingCard.id) {
          setFactions(
            factions.map((f) => (f.id === editingCard.id ? editingCard : f))
          );
        } else {
          setFactions([...factions, { ...editingCard, id: Date.now() }]);
        }
        break;
      case "city":
        if (editingCard.id) {
          setCities(
            cities.map((c) => (c.id === editingCard.id ? editingCard : c))
          );
        } else {
          setCities([...cities, { ...editingCard, id: Date.now() }]);
        }
        break;
      case "building":
        const tier = editingCard.tier || "Tier 1: Normal";
        const updatedBuildings = { ...buildings };
        if (editingCard.id) {
          updatedBuildings[tier] = updatedBuildings[tier].map((b) =>
            b.id === editingCard.id ? editingCard : b
          );
        } else {
          if (!updatedBuildings[tier]) updatedBuildings[tier] = [];
          updatedBuildings[tier] = [
            ...updatedBuildings[tier],
            { ...editingCard, id: Date.now() },
          ];
        }
        setBuildings(updatedBuildings);
        break;
      case "unit":
        if (editingCard.id) {
          setUnits(
            units.map((u) => (u.id === editingCard.id ? editingCard : u))
          );
        } else {
          setUnits([...units, { ...editingCard, id: Date.now() }]);
        }
        break;
      case "event":
        if (editingCard.id) {
          setEvents(
            events.map((e) => (e.id === editingCard.id ? editingCard : e))
          );
        } else {
          setEvents([...events, { ...editingCard, id: Date.now() }]);
        }
        break;
    }

    setShowEditModal(false);
    setEditingCard(null);
    setEditCardType(null);
  };

  const handleDeleteCard = (cardId, cardType) => {
    console.log("DELETE CALLED:", { cardId, cardType });

    switch (cardType) {
      case "faction":
        console.log("Before delete - factions:", factions.length);
        setFactions(factions.filter((f) => f.id !== cardId));
        break;
      case "city":
        console.log("Before delete - cities:", cities.length);
        console.log("Deleting city with id:", cardId);
        console.log(
          "All city IDs:",
          cities.map((c) => c.id)
        );
        const newCities = cities.filter((c) => c.id !== cardId);
        console.log("After filter - cities:", newCities.length);
        setCities(newCities);
        break;
      case "building":
        console.log("Before delete - building tiers:", Object.keys(buildings));
        const updatedBuildings = { ...buildings };
        Object.keys(updatedBuildings).forEach((tier) => {
          console.log(`Tier ${tier} before:`, updatedBuildings[tier].length);
          updatedBuildings[tier] = updatedBuildings[tier].filter(
            (b) => b.id !== cardId
          );
          console.log(`Tier ${tier} after:`, updatedBuildings[tier].length);
        });
        setBuildings(updatedBuildings);
        break;
      case "unit":
        console.log("Before delete - units:", units.length);
        setUnits(units.filter((u) => u.id !== cardId));
        break;
      case "event":
        console.log("Before delete - events:", events.length);
        setEvents(events.filter((e) => e.id !== cardId));
        break;
    }
  };

  // Commit management functions
  const handleAddCommit = () => {
    setEditingCommit({
      title: "",
      description: "",
      category: "Feature", // Feature, Bugfix, Balance, Content, System
      impact: "Minor", // Minor, Moderate, Major
      changes: [],
      date: new Date().toISOString(),
    });
    setShowCommitModal(true);
  };

  const handleEditCommit = (commit) => {
    setEditingCommit(commit);
    setShowCommitModal(true);
  };

  const handleSaveCommit = () => {
    if (!editingCommit.title.trim()) {
      alert("Please enter a commit title");
      return;
    }

    if (editingCommit.id) {
      // Edit existing
      setCommits(
        commits.map((c) => (c.id === editingCommit.id ? editingCommit : c))
      );
    } else {
      // Add new
      setCommits([{ ...editingCommit, id: Date.now() }, ...commits]);
    }

    setShowCommitModal(false);
    setEditingCommit(null);
  };

  const handleDeleteCommit = (commitId) => {
    setCommits(commits.filter((c) => c.id !== commitId));
  };

  const getEmptyCard = (cardType) => {
    switch (cardType) {
      case "faction":
        return {
          name: "",
          color: "",
          resource: "",
          playstyle: "",
          historical: "",
          hex: "#ffffff",
          description: "",
        };
      case "city":
        return {
          city: "",
          color: "",
          era: "",
          hp: 20,
          economy: 3,
          military: 2,
          civic: 2,
          bonus: "",
          hex: "#ffffff",
          description: "",
        };
      case "building":
        return {
          name: "",
          slot: "Economy",
          color: "Gray",
          cost: "",
          effect: "",
          tier: "Tier 1: Normal",
          cityReq: "None",
          description: "",
        };
      case "unit":
        return {
          name: "",
          color: "",
          cost: "",
          attack: 0,
          defense: 0,
          keywords: [],
          description: "",
          tier: "Common",
          image: "",
        };
      case "event":
        return {
          name: "",
          color: "",
          timing: "Immediate",
          cost: "",
          effect: "",
          description: "",
        };
      default:
        return {};
    }
  };

  // Import/Export functions
  const handleExportCards = () => {
    const allData = {
      factions,
      cities,
      buildings,
      units,
      events,
      exportDate: new Date().toISOString(),
      version: version,
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `imperium-cardis-cards-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCards = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.factions) setFactions(imported.factions);
        if (imported.cities) setCities(imported.cities);
        if (imported.buildings) setBuildings(imported.buildings);
        if (imported.units) setUnits(imported.units);
        if (imported.events) setEvents(imported.events);
        alert("Cards imported successfully!");
      } catch (error) {
        alert("Error importing cards: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <style>{`
        body, html, #root {
          background-color: #1a1a1a !important;
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      <div
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Plain background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0, backgroundColor: "#0e0c09" }}
        />
        <div
          className="min-h-screen text-[#f5f5dc] font-serif"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Header */}
          <header className="relative border-b-2 border-[#d4af37] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Castle
                    className="w-12 h-12 text-white"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))",
                    }}
                  />
                  <div>
                    <h1
                      className="text-5xl font-bold text-white tracking-wider"
                      style={{ textShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}
                    >
                      IMPERIUM CARDIS
                    </h1>
                    <p
                      className="text-sm text-white tracking-widest mt-1 font-sans uppercase"
                      style={{ opacity: 0.9 }}
                    >
                      A Grand Strategy Card Game
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white uppercase tracking-wider font-sans font-bold">
                    Version {version}
                  </div>
                  <div className="text-xs text-gray-200 font-sans">
                    Godot 4.x Platform
                  </div>
                  <div className="text-[10px] text-gray-400 font-sans mt-2">
                    Ctrl+1-6: Quick Nav
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="bg-black/30 border-t border-[#d4af37]/30">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex gap-1">
                  {[
                    { id: "codex", label: "The Great Codex", icon: BookOpen },
                    { id: "github", label: "Development Log", icon: GitBranch },
                    {
                      id: "playtest",
                      label: "Playtest Dashboard",
                      icon: Target,
                    },
                    { id: "chronicle", label: "Chronicle", icon: Calendar },
                    {
                      id: "ideas",
                      label: "Ideas & Submissions",
                      icon: MessageSquare,
                    },
                    { id: "rulebook", label: "Rulebook", icon: Scroll },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-sans text-sm tracking-wide transition-all border-2
                    ${
                      activeTab === tab.id
                        ? "bg-[#d4af37]/20 text-white font-bold border-[#d4af37]"
                        : "text-white hover:bg-[#d4af37]/10 hover:text-[#d4af37] border-transparent"
                    }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main
            className="relative max-w-7xl mx-auto px-6 py-12 bg-[#1a1a1a]"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "codex" && (
                <motion.div
                  key="codex"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Codex Sub-Navigation */}
                  <div className="flex justify-between items-center mb-4 border-b border-[#d4af37]/30 pb-4">
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: "factions", label: "Faction Matrix" },
                        { id: "archetypes", label: "Archetype Explorer" },
                        { id: "cities", label: "City Cards" },
                        { id: "buildings", label: "Building Gallery" },
                        { id: "units", label: "Unit Cards" },
                        { id: "events", label: "Event Cards" },
                      ].map((section) => (
                        <button
                          key={section.id}
                          onClick={() => {
                            setCodexSection(section.id);
                            setCodexSearch("");
                            setCodexColorFilter("All");
                          }}
                          className={`px-4 py-2 font-sans text-sm tracking-wide transition-all border-2
                        ${
                          codexSection === section.id
                            ? "border-[#d4af37] bg-[#d4af37]/10 text-white font-bold"
                            : "border-transparent text-gray-200 hover:text-white hover:border-[#d4af37]/30"
                        }`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>

                    {/* Import/Export Controls */}
                    {codexSection !== "archetypes" && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportCards}
                          className="bg-[#2a2a2a] border-2 border-[#d4af37] text-white px-4 py-2 font-sans text-xs hover:bg-[#d4af37]/10 transition-colors font-semibold flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Export All
                        </button>
                        <label className="bg-[#2a2a2a] border-2 border-[#d4af37] text-white px-4 py-2 font-sans text-xs hover:bg-[#d4af37]/10 transition-colors font-semibold cursor-pointer flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Import
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportCards}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Search & Filter bar — shown for filterable sections */}
                  {!["archetypes", "factions"].includes(codexSection) && (
                    <div className="flex items-center gap-3 mb-8">
                      {/* Search input */}
                      <div className="relative flex-1 max-w-sm">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={codexSearch}
                          onChange={(e) => setCodexSearch(e.target.value)}
                          placeholder={`Search ${codexSection}...`}
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white pl-10 pr-4 py-2 font-sans text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                        {codexSearch && (
                          <button
                            onClick={() => setCodexSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-lg leading-none"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Color filter pills */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-sans mr-1">
                          Filter:
                        </span>
                        {[
                          "All",
                          "Gold",
                          "Red",
                          "Blue",
                          "Green",
                          "Purple",
                          "Gray",
                        ].map((color) => {
                          const hex = factionData.find(
                            (f) => f.color === color
                          )?.hex;
                          const isActive = codexColorFilter === color;
                          return (
                            <button
                              key={color}
                              onClick={() => setCodexColorFilter(color)}
                              title={color}
                              className="w-6 h-6 border-2 transition-all hover:scale-110"
                              style={{
                                backgroundColor:
                                  color === "All"
                                    ? isActive
                                      ? "#d4af37"
                                      : "#2a2a2a"
                                    : hex || "#6b7280",
                                borderColor: isActive
                                  ? "#ffffff"
                                  : "transparent",
                                opacity: isActive ? 1 : 0.5,
                              }}
                            >
                              {color === "All" && (
                                <span
                                  className="text-[9px] font-bold"
                                  style={{
                                    color: isActive ? "#000" : "#d4af37",
                                  }}
                                >
                                  ALL
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Faction Matrix */}
                  {codexSection === "factions" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#d4af37]" />
                        The Five Factions
                      </h2>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-8 bg-gradient-to-r from-[#d4af37]/10 to-transparent border-l-4 border-[#d4af37] p-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-white mb-2">
                            {cities.length}
                          </div>
                          <div className="text-xs text-white font-sans uppercase tracking-wide">
                            City Cards
                          </div>
                        </div>
                        <div className="text-center border-l border-r border-[#d4af37]/30">
                          <div className="text-5xl font-bold text-white mb-2">
                            {Object.values(buildings).flat().length}
                          </div>
                          <div className="text-xs text-white font-sans uppercase tracking-wide">
                            Building Cards
                          </div>
                        </div>
                        <div className="text-center border-r border-[#d4af37]/30">
                          <div className="text-5xl font-bold text-white mb-2">
                            {units.length}
                          </div>
                          <div className="text-xs text-white font-sans uppercase tracking-wide">
                            Unit Cards
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-white mb-2">
                            {events.length}
                          </div>
                          <div className="text-xs text-white font-sans uppercase tracking-wide">
                            Event Cards
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {factions.map((faction, index) => {
                          const FactionIcon =
                            factionIconMap[faction.color] || Shield;
                          return (
                            <motion.div
                              key={faction.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative bg-gradient-to-br from-black/60 to-black/40 border-2 p-6 hover:scale-[1.02] transition-transform"
                              style={{ borderColor: faction.hex }}
                            >
                              {/* Corner decorations */}
                              <div
                                className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
                                style={{ borderColor: faction.hex }}
                              />
                              <div
                                className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
                                style={{ borderColor: faction.hex }}
                              />
                              <div
                                className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
                                style={{ borderColor: faction.hex }}
                              />
                              <div
                                className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
                                style={{ borderColor: faction.hex }}
                              />

                              <div className="flex items-center gap-3 mb-4">
                                <FactionIcon
                                  className="w-10 h-10"
                                  style={{ color: faction.hex }}
                                />
                                <div>
                                  <h3
                                    className="text-xl font-bold"
                                    style={{ color: faction.hex }}
                                  >
                                    {faction.color}
                                  </h3>
                                  <p className="text-sm text-gray-300 font-sans">
                                    {faction.name}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2 font-sans text-sm">
                                <div className="flex items-start gap-2">
                                  <Coins
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                    style={{ color: faction.hex }}
                                  />
                                  <div>
                                    <span className="text-white font-bold">
                                      Resource:
                                    </span>
                                    <span className="ml-2 text-gray-100">
                                      {faction.resource}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Zap
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                    style={{ color: faction.hex }}
                                  />
                                  <div>
                                    <span className="text-white font-bold">
                                      Playstyle:
                                    </span>
                                    <p className="text-gray-100 mt-1">
                                      {faction.playstyle}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Castle
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                    style={{ color: faction.hex }}
                                  />
                                  <div>
                                    <span className="text-white font-bold">
                                      Historical:
                                    </span>
                                    <p className="text-gray-100 mt-1">
                                      {faction.historical}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {faction.description && (
                                <p className="text-gray-400 font-sans text-sm italic mt-4 pt-3 border-t border-gray-700">
                                  {faction.description}
                                </p>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Archetype Explorer */}
                  {codexSection === "archetypes" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Star className="w-8 h-8 text-[#d4af37]" />
                        Dual-Color Archetypes
                      </h2>
                      <p className="text-gray-300 mb-8 font-sans">
                        When you pair two different-colored cities, you unlock a
                        hybrid archetype with characteristic strategies.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {archetypeData.map((archetype, index) => {
                          const borderStyle = getCardBorderStyle(
                            archetype.pairing.replace(" + ", "/")
                          );
                          return (
                            <motion.div
                              key={archetype.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 p-6 hover:border-opacity-100 transition-all"
                              style={borderStyle}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-bold text-white">
                                    {archetype.name}
                                  </h3>
                                  <p className="text-sm text-gray-200 font-sans mt-1">
                                    {archetype.pairing}
                                  </p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                              </div>
                              <p className="text-gray-100 font-sans leading-relaxed">
                                {archetype.strategy}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* City Cards */}
                  {codexSection === "cities" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Castle className="w-8 h-8 text-[#d4af37]" />
                            City Cards
                          </h2>
                          {(codexSearch || codexColorFilter !== "All") && (
                            <p className="text-sm text-gray-400 font-sans mt-1">
                              {
                                cities.filter(
                                  (c) =>
                                    (!codexSearch ||
                                      c.city
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase()) ||
                                      c.bonus
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase())) &&
                                    (codexColorFilter === "All" ||
                                      c.color?.includes(codexColorFilter))
                                ).length
                              }{" "}
                              of {cities.length} shown
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddCard("city")}
                            className="bg-[#d4af37] px-4 py-2 font-sans text-sm font-bold hover:bg-[#f5f5dc] transition-colors"
                            style={{ color: "#ffffff" }}
                          >
                            + Add City
                          </button>
                          <div className="flex gap-1 bg-[#2a2a2a] border border-[#d4af37]/30 p-1">
                            <button
                              onClick={() => setCityViewMode("grid")}
                              className={`p-2 transition-colors ${
                                cityViewMode === "grid"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                              title="Grid View"
                            >
                              <Castle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCityViewMode("list")}
                              className={`p-2 transition-colors ${
                                cityViewMode === "list"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                              title="List View"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          cityViewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                        }
                      >
                        {cities
                          .filter((city) => {
                            const matchesSearch =
                              !codexSearch ||
                              city.city
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              city.bonus
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase());
                            const matchesColor =
                              codexColorFilter === "All" ||
                              city.color?.includes(codexColorFilter);
                            return matchesSearch && matchesColor;
                          })
                          .map((city, index) => {
                            const borderStyle = getCardBorderStyle(city.color);
                            return (
                              <motion.div
                                key={city.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative bg-gradient-to-br from-black/80 to-black/60 border-4 p-6 group hover:scale-105 transition-transform"
                                style={borderStyle}
                              >
                                {/* Edit/Delete buttons */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCard(city, "city");
                                    }}
                                    className="bg-blue-600 text-white p-1 hover:bg-blue-700 transition-colors"
                                    title="Edit"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCard(city.id, "city");
                                    }}
                                    className="bg-red-600 text-white p-1 hover:bg-red-700 transition-colors"
                                    title="Delete"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                      {city.city}
                                    </h3>
                                    <div className="flex items-center gap-2 font-sans text-xs">
                                      <span className="text-gray-200">
                                        {city.era}
                                      </span>
                                      <span className="text-[#d4af37]">•</span>
                                      <span className="text-gray-200">
                                        {city.color} Faction
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="text-2xl font-bold text-red-500">
                                      {city.hp}
                                    </span>
                                  </div>
                                </div>

                                {/* Slots */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  <div className="bg-green-900/20 border-2 border-green-700 p-2 text-center">
                                    <Coins className="w-4 h-4 mx-auto mb-1 text-green-400" />
                                    <div className="text-lg font-bold text-green-400">
                                      {city.economy}
                                    </div>
                                    <div className="text-[8px] text-gray-300 font-sans">
                                      Economy
                                    </div>
                                  </div>
                                  <div className="bg-red-900/20 border-2 border-red-700 p-2 text-center">
                                    <Sword className="w-4 h-4 mx-auto mb-1 text-red-400" />
                                    <div className="text-lg font-bold text-red-400">
                                      {city.military}
                                    </div>
                                    <div className="text-[8px] text-gray-300 font-sans">
                                      Military
                                    </div>
                                  </div>
                                  <div className="bg-blue-900/20 border-2 border-blue-700 p-2 text-center">
                                    <Crown className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                                    <div className="text-lg font-bold text-blue-400">
                                      {city.civic}
                                    </div>
                                    <div className="text-[8px] text-gray-300 font-sans">
                                      Civic
                                    </div>
                                  </div>
                                </div>

                                {/* City Bonus */}
                                <div className="bg-[#d4af37]/10 border-l-4 border-[#d4af37] p-3">
                                  <div className="text-[#d4af37] font-bold mb-1 font-sans text-xs">
                                    CITY BONUS
                                  </div>
                                  <p className="text-gray-100 font-sans text-sm">
                                    {city.bonus}
                                  </p>
                                </div>
                                {city.description && (
                                  <p className="text-gray-400 font-sans text-sm italic mt-3 pt-3 border-t border-gray-700">
                                    {city.description}
                                  </p>
                                )}
                              </motion.div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}

                  {/* Building Gallery */}
                  {codexSection === "buildings" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Castle className="w-8 h-8 text-[#d4af37]" />
                            Tiered Building Gallery
                          </h2>
                          {(codexSearch || codexColorFilter !== "All") && (
                            <p className="text-sm text-gray-400 font-sans mt-1">
                              {
                                (buildings[buildingTier] || []).filter(
                                  (b) =>
                                    (!codexSearch ||
                                      b.name
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase()) ||
                                      b.effect
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase())) &&
                                    (codexColorFilter === "All" ||
                                      b.color?.includes(codexColorFilter))
                                ).length
                              }{" "}
                              of {(buildings[buildingTier] || []).length} shown
                              in this tier
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddCard("building")}
                            className="bg-[#d4af37] px-4 py-2 font-sans text-sm font-bold hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                            style={{ color: "#ffffff" }}
                          >
                            <Castle className="w-4 h-4" />+ Add Building
                          </button>
                          <div className="flex gap-1 bg-[#2a2a2a] border border-[#d4af37]/30 p-1">
                            <button
                              onClick={() => setBuildingViewMode("grid")}
                              className={`p-2 transition-colors ${
                                buildingViewMode === "grid"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                              title="Grid View"
                            >
                              <Castle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setBuildingViewMode("list")}
                              className={`p-2 transition-colors ${
                                buildingViewMode === "list"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                              title="List View"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tier tabs */}
                      <div className="flex gap-2 mb-8">
                        {Object.keys(buildingTiers).map((tier) => (
                          <button
                            key={tier}
                            onClick={() => setBuildingTier(tier)}
                            className={`px-6 py-3 border-2 font-sans text-sm tracking-wide transition-all font-semibold
                          ${
                            buildingTier === tier
                              ? "border-[#d4af37] bg-[#d4af37]/10 text-white"
                              : "border-gray-600 text-gray-200 hover:border-[#d4af37]/50 hover:text-white"
                          }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>

                      {/* Building cards */}
                      <div
                        className={
                          buildingViewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {(buildings[buildingTier] || [])
                          .filter((building) => {
                            const matchesSearch =
                              !codexSearch ||
                              building.name
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              building.effect
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase());
                            const matchesColor =
                              codexColorFilter === "All" ||
                              building.color?.includes(codexColorFilter);
                            return matchesSearch && matchesColor;
                          })
                          .map((building, index) => {
                            const borderStyle = getCardBorderStyle(
                              building.color
                            );
                            return (
                              <motion.div
                                key={building.id || building.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 p-6 hover:border-opacity-100 transition-all relative group"
                                style={borderStyle}
                              >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCard(building, "building");
                                    }}
                                    className="bg-blue-600 text-white p-1 hover:bg-blue-700"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCard(building.id, "building");
                                    }}
                                    className="bg-red-600 text-white p-1 hover:bg-red-700"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-white">
                                      {building.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-sans text-gray-200">
                                        {building.slot} Slot
                                      </span>
                                      {building.cityReq &&
                                        building.cityReq !== "None" && (
                                          <>
                                            <span className="text-gray-500">
                                              •
                                            </span>
                                            <Lock className="w-3 h-3 text-red-500" />
                                            <span className="text-xs text-red-400 font-sans">
                                              Requires {building.cityReq}
                                            </span>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                  <div className="bg-[#d4af37]/20 px-3 py-1 border border-[#d4af37]">
                                    <span className="text-xs font-sans text-white font-bold">
                                      {building.cost}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-100 font-sans text-sm leading-relaxed">
                                  {building.effect}
                                </p>
                                {building.description && (
                                  <p className="text-gray-400 font-sans text-sm italic mt-3 pt-3 border-t border-gray-700">
                                    {building.description}
                                  </p>
                                )}
                              </motion.div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}

                  {/* Unit Cards */}
                  {codexSection === "units" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Sword className="w-8 h-8 text-[#d4af37]" />
                            Unit Cards
                          </h2>
                          {(codexSearch || codexColorFilter !== "All") && (
                            <p className="text-sm text-gray-400 font-sans mt-1">
                              {
                                units.filter(
                                  (u) =>
                                    (!codexSearch ||
                                      u.name
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase()) ||
                                      u.description
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase())) &&
                                    (codexColorFilter === "All" ||
                                      u.color?.includes(codexColorFilter))
                                ).length
                              }{" "}
                              of {units.length} shown
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddCard("unit")}
                            className="bg-[#d4af37] px-4 py-2 font-sans text-sm font-bold hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                            style={{ color: "#ffffff" }}
                          >
                            <Sword className="w-4 h-4" />+ Add Unit
                          </button>
                          <div className="flex gap-1 bg-[#2a2a2a] border border-[#d4af37]/30 p-1">
                            <button
                              onClick={() => setUnitViewMode("grid")}
                              className={`p-2 transition-colors ${
                                unitViewMode === "grid"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                            >
                              <Castle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setUnitViewMode("list")}
                              className={`p-2 transition-colors ${
                                unitViewMode === "list"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          unitViewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                        }
                      >
                        {units
                          .filter((unit) => {
                            const matchesSearch =
                              !codexSearch ||
                              unit.name
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              unit.description
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              (unit.keywords || []).some((k) =>
                                k
                                  .toLowerCase()
                                  .includes(codexSearch.toLowerCase())
                              );
                            const matchesColor =
                              codexColorFilter === "All" ||
                              unit.color?.includes(codexColorFilter);
                            return matchesSearch && matchesColor;
                          })
                          .map((unit, index) => {
                            const borderStyle = getCardBorderStyle(unit.color);
                            return (
                              <motion.div
                                key={unit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 p-6 hover:border-opacity-100 transition-all group"
                                style={borderStyle}
                              >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCard(unit, "unit");
                                    }}
                                    className="bg-blue-600 text-white p-1 hover:bg-blue-700"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCard(unit.id, "unit");
                                    }}
                                    className="bg-red-600 text-white p-1 hover:bg-red-700"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-white">
                                      {unit.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-sans text-white font-semibold">
                                        {unit.color}
                                      </span>
                                      <span className="text-gray-500">•</span>
                                      <span className="text-xs text-white font-sans font-bold">
                                        {unit.tier}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="bg-[#d4af37]/20 px-3 py-1 border border-[#d4af37]">
                                    <span className="text-xs font-sans text-white font-bold">
                                      {unit.cost}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Sword className="w-4 h-4 text-red-400" />
                                    <span className="text-red-400 font-bold">
                                      {unit.attack}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      ATK
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-400 font-bold">
                                      {unit.defense}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      DEF
                                    </span>
                                  </div>
                                </div>

                                {unit.keywords && unit.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {unit.keywords.map((keyword, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-[#d4af37]/30 text-white px-2 py-1 border border-[#d4af37] font-semibold"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <p className="text-gray-100 font-sans text-sm leading-relaxed">
                                  {unit.description}
                                </p>
                              </motion.div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}

                  {/* Event Cards */}
                  {codexSection === "events" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Zap className="w-8 h-8 text-[#d4af37]" />
                            Event Cards
                          </h2>
                          {(codexSearch || codexColorFilter !== "All") && (
                            <p className="text-sm text-gray-400 font-sans mt-1">
                              {
                                events.filter(
                                  (e) =>
                                    (!codexSearch ||
                                      e.name
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase()) ||
                                      e.effect
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase()) ||
                                      e.description
                                        ?.toLowerCase()
                                        .includes(codexSearch.toLowerCase())) &&
                                    (codexColorFilter === "All" ||
                                      e.color?.includes(codexColorFilter))
                                ).length
                              }{" "}
                              of {events.length} shown
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddCard("event")}
                            className="bg-[#d4af37] px-4 py-2 font-sans text-sm font-bold hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                            style={{ color: "#ffffff" }}
                          >
                            <Zap className="w-4 h-4" />+ Add Event
                          </button>
                          <div className="flex gap-1 bg-[#2a2a2a] border border-[#d4af37]/30 p-1">
                            <button
                              onClick={() => setEventViewMode("grid")}
                              className={`p-2 transition-colors ${
                                eventViewMode === "grid"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                            >
                              <Castle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEventViewMode("list")}
                              className={`p-2 transition-colors ${
                                eventViewMode === "list"
                                  ? "border-2 border-white text-white"
                                  : "text-white hover:text-[#d4af37]"
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          eventViewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {events
                          .filter((event) => {
                            const matchesSearch =
                              !codexSearch ||
                              event.name
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              event.effect
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase()) ||
                              event.description
                                ?.toLowerCase()
                                .includes(codexSearch.toLowerCase());
                            const matchesColor =
                              codexColorFilter === "All" ||
                              event.color?.includes(codexColorFilter);
                            return matchesSearch && matchesColor;
                          })
                          .map((event, index) => {
                            const borderStyle = getCardBorderStyle(event.color);
                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 p-6 hover:border-opacity-100 transition-all group"
                                style={borderStyle}
                              >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditCard(event, "event");
                                    }}
                                    className="bg-blue-600 text-white p-1 hover:bg-blue-700"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCard(event.id, "event");
                                    }}
                                    className="bg-red-600 text-white p-1 hover:bg-red-700"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-white">
                                      {event.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-sans text-white font-semibold">
                                        {event.color}
                                      </span>
                                      <span className="text-gray-500">•</span>
                                      <span
                                        className={`text-xs font-sans px-2 py-0.5 font-bold ${
                                          event.timing === "Instant"
                                            ? "bg-blue-900/30 text-blue-300 border border-blue-600"
                                            : event.timing === "Reaction"
                                            ? "bg-purple-900/30 text-purple-300 border border-purple-600"
                                            : "bg-green-900/30 text-green-300 border border-green-600"
                                        }`}
                                      >
                                        {event.timing}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="bg-[#d4af37]/20 px-3 py-1 border border-[#d4af37]">
                                    <span
                                      className="text-xs font-sans font-bold"
                                      style={{ color: "#ffffff" }}
                                    >
                                      {event.cost}
                                    </span>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <span
                                    className="text-xs font-bold font-sans uppercase"
                                    style={{ color: "#ffffff" }}
                                  >
                                    Effect:
                                  </span>
                                  <p className="text-gray-100 font-sans text-sm mt-1">
                                    {event.effect}
                                  </p>
                                </div>

                                <p className="text-gray-300 font-sans text-sm italic">
                                  {event.description}
                                </p>
                              </motion.div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Development Log */}
              {activeTab === "github" && (
                <motion.div
                  key="github"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <GitBranch className="w-8 h-8 text-[#d4af37]" />
                      Development Log
                    </h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleAddCommit}
                        className="bg-[#d4af37] px-6 py-3 font-sans text-sm font-bold hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                        style={{ color: "#ffffff" }}
                      >
                        <Plus className="w-4 h-4" />+ Add Update
                      </button>
                      <div className="flex gap-1 bg-[#2a2a2a] border border-[#d4af37]/30 p-1">
                        <button
                          onClick={() => setCommitViewMode("timeline")}
                          className={`p-2 transition-colors ${
                            commitViewMode === "timeline"
                              ? "border-2 border-white text-white"
                              : "text-white hover:text-[#d4af37]"
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCommitViewMode("heatmap")}
                          className={`p-2 transition-colors ${
                            commitViewMode === "heatmap"
                              ? "border-2 border-white text-white"
                              : "text-white hover:text-[#d4af37]"
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Timeline View */}
                  {commitViewMode === "timeline" && (
                    <div className="space-y-6">
                      {commits.length === 0 ? (
                        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37]/30 p-16 text-center">
                          <GitBranch className="w-16 h-16 mx-auto mb-4 text-[#d4af37]/50" />
                          <h3 className="text-xl font-bold text-white mb-2">
                            No Updates Yet
                          </h3>
                          <p className="text-gray-400 font-sans mb-6">
                            Start tracking your development progress by adding
                            your first update
                          </p>
                          <button
                            onClick={handleAddCommit}
                            className="bg-[#d4af37] px-8 py-3 font-sans font-bold hover:bg-[#f5f5dc] transition-colors"
                            style={{ color: "#ffffff" }}
                          >
                            Add First Update
                          </button>
                        </div>
                      ) : (
                        commits.map((commit, index) => {
                          const commitDate = new Date(commit.date);
                          const categoryColors = {
                            Feature: "border-blue-500 bg-blue-500/10",
                            Bugfix: "border-red-500 bg-red-500/10",
                            Balance: "border-purple-500 bg-purple-500/10",
                            Content: "border-green-500 bg-green-500/10",
                            System: "border-yellow-500 bg-yellow-500/10",
                          };
                          const impactBadges = {
                            Minor: "bg-gray-600 text-gray-200",
                            Moderate: "bg-blue-600 text-blue-100",
                            Major: "bg-red-600 text-red-100",
                          };

                          return (
                            <motion.div
                              key={commit.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-l-4 p-6 relative group ${
                                categoryColors[commit.category] ||
                                "border-[#d4af37] bg-[#d4af37]/10"
                              }`}
                            >
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCommit(commit);
                                  }}
                                  className="bg-blue-600 text-white p-1 hover:bg-blue-700"
                                >
                                  <BookOpen className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCommit(commit.id);
                                  }}
                                  className="bg-red-600 text-white p-1 hover:bg-red-700"
                                >
                                  ×
                                </button>
                              </div>

                              <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 text-center">
                                  <div className="text-2xl font-bold text-[#d4af37]">
                                    {commitDate.getDate()}
                                  </div>
                                  <div className="text-xs text-gray-400 uppercase">
                                    {commitDate.toLocaleDateString("en-US", {
                                      month: "short",
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {commitDate.getFullYear()}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-white">
                                      {commit.title}
                                    </h3>
                                    <span
                                      className={`text-xs px-2 py-1 font-sans font-bold ${
                                        impactBadges[commit.impact]
                                      }`}
                                    >
                                      {commit.impact}
                                    </span>
                                    <span className="text-xs px-2 py-1 border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] font-sans font-bold">
                                      {commit.category}
                                    </span>
                                  </div>

                                  {commit.description && (
                                    <p className="text-gray-300 font-sans text-sm mb-3 leading-relaxed">
                                      {commit.description}
                                    </p>
                                  )}

                                  {commit.changes &&
                                    commit.changes.length > 0 && (
                                      <div className="space-y-1">
                                        {commit.changes.map((change, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start gap-2 text-sm"
                                          >
                                            <Zap className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-200 font-sans">
                                              {change}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-sans">
                                      {commitDate.toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Heatmap View */}
                  {commitViewMode === "heatmap" && (
                    <div>
                      {commits.length === 0 ? (
                        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37]/30 p-16 text-center">
                          <Grid className="w-16 h-16 mx-auto mb-4 text-[#d4af37]/50" />
                          <h3 className="text-xl font-bold text-white mb-2">
                            No Activity Data
                          </h3>
                          <p className="text-gray-400 font-sans mb-6">
                            Add updates to see your development activity heatmap
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37] p-8">
                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#d4af37]" />
                            Development Activity
                          </h3>

                          {/* Generate heatmap data */}
                          {(() => {
                            const today = new Date();
                            const weeks = 26; // 6 months
                            const days = weeks * 7;
                            const startDate = new Date(today);
                            startDate.setDate(today.getDate() - days);

                            // Count commits per day
                            const activityMap = {};
                            commits.forEach((commit) => {
                              const date = new Date(
                                commit.date
                              ).toLocaleDateString();
                              activityMap[date] = (activityMap[date] || 0) + 1;
                            });

                            // Build grid
                            const grid = [];
                            for (let week = 0; week < weeks; week++) {
                              const weekData = [];
                              for (let day = 0; day < 7; day++) {
                                const currentDate = new Date(startDate);
                                currentDate.setDate(
                                  startDate.getDate() + week * 7 + day
                                );
                                const dateStr =
                                  currentDate.toLocaleDateString();
                                const count = activityMap[dateStr] || 0;
                                weekData.push({ date: currentDate, count });
                              }
                              grid.push(weekData);
                            }

                            const maxCount = Math.max(
                              ...Object.values(activityMap),
                              1
                            );

                            return (
                              <div className="overflow-x-auto">
                                <div className="inline-flex gap-1">
                                  {grid.map((week, weekIdx) => (
                                    <div
                                      key={weekIdx}
                                      className="flex flex-col gap-1"
                                    >
                                      {week.map((day, dayIdx) => {
                                        const intensity =
                                          day.count === 0
                                            ? 0
                                            : Math.ceil(
                                                (day.count / maxCount) * 4
                                              );
                                        const colorStyles = [
                                          {
                                            backgroundColor: "#1a1a2e",
                                            borderColor: "#16213e",
                                          },
                                          {
                                            backgroundColor: "#0f4c75",
                                            borderColor: "#1a5490",
                                          },
                                          {
                                            backgroundColor: "#3282b8",
                                            borderColor: "#4a9fd8",
                                          },
                                          {
                                            backgroundColor: "#ff6b35",
                                            borderColor: "#ff8c5a",
                                          },
                                          {
                                            backgroundColor: "#ffd700",
                                            borderColor: "#ffe44d",
                                          },
                                        ];

                                        return (
                                          <div
                                            key={dayIdx}
                                            className="w-3 h-3 border-2 relative group cursor-pointer transition-all hover:scale-150 hover:z-10"
                                            style={colorStyles[intensity]}
                                            title={`${day.date.toLocaleDateString()}: ${
                                              day.count
                                            } update${
                                              day.count !== 1 ? "s" : ""
                                            }`}
                                          >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-[#d4af37] px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                              {day.date.toLocaleDateString()}:{" "}
                                              {day.count} update
                                              {day.count !== 1 ? "s" : ""}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                                  <span className="font-sans">Less</span>
                                  <div className="flex gap-1">
                                    <div
                                      className="w-3 h-3 border-2"
                                      style={{
                                        backgroundColor: "#1a1a2e",
                                        borderColor: "#16213e",
                                      }}
                                    ></div>
                                    <div
                                      className="w-3 h-3 border-2"
                                      style={{
                                        backgroundColor: "#0f4c75",
                                        borderColor: "#1a5490",
                                      }}
                                    ></div>
                                    <div
                                      className="w-3 h-3 border-2"
                                      style={{
                                        backgroundColor: "#3282b8",
                                        borderColor: "#4a9fd8",
                                      }}
                                    ></div>
                                    <div
                                      className="w-3 h-3 border-2"
                                      style={{
                                        backgroundColor: "#ff6b35",
                                        borderColor: "#ff8c5a",
                                      }}
                                    ></div>
                                    <div
                                      className="w-3 h-3 border-2"
                                      style={{
                                        backgroundColor: "#ffd700",
                                        borderColor: "#ffe44d",
                                      }}
                                    ></div>
                                  </div>
                                  <span className="font-sans">More</span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Stats */}
                          <div className="mt-8 grid grid-cols-4 gap-4">
                            <div className="bg-black/20 border border-[#d4af37]/30 p-4 text-center">
                              <div className="text-3xl font-bold text-[#d4af37]">
                                {commits.length}
                              </div>
                              <div className="text-xs text-gray-400 font-sans uppercase mt-1">
                                Total Updates
                              </div>
                            </div>
                            <div className="bg-black/20 border border-[#d4af37]/30 p-4 text-center">
                              <div className="text-3xl font-bold text-[#d4af37]">
                                {
                                  commits.filter(
                                    (c) => c.category === "Feature"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-400 font-sans uppercase mt-1">
                                Features
                              </div>
                            </div>
                            <div className="bg-black/20 border border-[#d4af37]/30 p-4 text-center">
                              <div className="text-3xl font-bold text-[#d4af37]">
                                {
                                  commits.filter((c) => c.category === "Bugfix")
                                    .length
                                }
                              </div>
                              <div className="text-xs text-gray-400 font-sans uppercase mt-1">
                                Bugfixes
                              </div>
                            </div>
                            <div className="bg-black/20 border border-[#d4af37]/30 p-4 text-center">
                              <div className="text-3xl font-bold text-[#d4af37]">
                                {
                                  commits.filter((c) => c.impact === "Major")
                                    .length
                                }
                              </div>
                              <div className="text-xs text-gray-400 font-sans uppercase mt-1">
                                Major Changes
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Playtest Dashboard */}
              {activeTab === "playtest" && (
                <motion.div
                  key="playtest"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Target className="w-8 h-8 text-[#d4af37]" />
                    Playtest & Feedback Dashboard
                  </h2>

                  {/* Version Selector & Create Group Button */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="text-white font-sans font-semibold">
                        Current Version:
                      </label>
                      <select
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="border-2 border-[#d4af37] text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                        style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
                      >
                        {versions.map((v) => (
                          <option
                            key={v}
                            value={v}
                            style={{
                              backgroundColor: "#1a1a1a",
                              color: "#ffffff",
                            }}
                          >
                            {v}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowVersionModal(true)}
                        className="bg-[#2a2a2a] border-2 border-[#d4af37] text-white px-4 py-2 font-sans hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors font-semibold"
                      >
                        + Add Version
                      </button>
                    </div>
                    <button
                      onClick={() => setShowNewGroupModal(true)}
                      className="bg-[#d4af37] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                      style={{ color: "#ffffff" }}
                    >
                      <Users className="w-5 h-5" />
                      Create Playtest Group
                    </button>
                  </div>

                  {/* Playtest Groups */}
                  {playtestGroups.length === 0 ? (
                    <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37]/30 p-12 text-center">
                      <Target className="w-16 h-16 mx-auto mb-4 text-white" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        No Playtest Groups Yet
                      </h3>
                      <p className="text-gray-400 font-sans mb-6">
                        Create your first playtest group to start collecting
                        feedback
                      </p>
                      <button
                        onClick={() => setShowNewGroupModal(true)}
                        className="bg-[#d4af37] px-8 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors"
                        style={{ color: "#ffffff" }}
                      >
                        Create Group
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Group List */}
                      <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-lg font-bold text-[#d4af37] mb-4 font-sans">
                          Playtest Groups
                        </h3>
                        {playtestGroups.map((group) => (
                          <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group)}
                            className={`w-full text-left p-4 border-2 transition-all ${
                              selectedGroup?.id === group.id
                                ? "bg-[#d4af37]/10 border-[#d4af37]"
                                : "bg-[#2a2a2a] border-[#d4af37]/30 hover:border-[#d4af37]/60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-white">
                                {group.name}
                              </h4>
                              <span className="text-xs bg-[#d4af37] text-black px-2 py-1 rounded font-sans font-bold">
                                {group.comments.length}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-sans">
                              Created{" "}
                              {new Date(group.createdAt).toLocaleDateString()}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Selected Group Details */}
                      <div className="lg:col-span-2">
                        {selectedGroup ? (
                          <>
                            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37] p-6 mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="text-2xl font-bold text-white">
                                    {selectedGroup.name}
                                  </h3>
                                  <p className="text-sm text-gray-200 font-sans mt-1">
                                    {selectedGroup.comments.length} feedback
                                    comments
                                  </p>
                                </div>
                                <button
                                  onClick={() => setShowCommentModal(true)}
                                  className="bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                                >
                                  <MessageSquare className="w-5 h-5" />
                                  Add Comment
                                </button>
                              </div>
                            </div>

                            {/* Comments Feed */}
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                              {selectedGroup.comments.length === 0 ? (
                                <div className="bg-[#2a2a2a] border-2 border-dashed border-[#d4af37]/30 p-12 text-center">
                                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#d4af37]/30" />
                                  <p className="text-gray-300 font-sans">
                                    No comments yet. Be the first to share
                                    feedback!
                                  </p>
                                </div>
                              ) : (
                                selectedGroup.comments.map((comment, index) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-l-4 p-6"
                                    style={{
                                      borderColor:
                                        comment.category === "Bug"
                                          ? "#c41e3a"
                                          : comment.category === "Balance"
                                          ? "#d4af37"
                                          : "#4a7ba7",
                                    }}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold text-white font-sans">
                                          {comment.username}
                                        </span>
                                        <span
                                          className={`px-3 py-1 text-xs font-sans font-bold border ${
                                            comment.category === "Bug"
                                              ? "bg-red-900/20 border-red-700 text-red-400"
                                              : comment.category === "Balance"
                                              ? "bg-yellow-900/20 border-yellow-700 text-yellow-400"
                                              : "bg-blue-900/20 border-blue-700 text-blue-400"
                                          }`}
                                        >
                                          {comment.category}
                                        </span>
                                        <span
                                          className={`px-3 py-1 text-xs font-sans ${
                                            comment.impact === "Critical"
                                              ? "bg-red-500 text-white"
                                              : comment.impact === "High"
                                              ? "bg-orange-500 text-white"
                                              : comment.impact === "Medium"
                                              ? "bg-yellow-600 text-white"
                                              : "bg-gray-600 text-white"
                                          }`}
                                        >
                                          {comment.impact}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-400 font-sans">
                                        {comment.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-gray-100 font-sans">
                                      {comment.comment}
                                    </p>
                                  </motion.div>
                                ))
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="bg-[#2a2a2a] border-2 border-[#d4af37]/30 p-12 text-center">
                            <p className="text-gray-300 font-sans">
                              Select a playtest group to view feedback
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Ideas & Submissions */}
              {activeTab === "ideas" && (
                <motion.div
                  key="ideas"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-[#d4af37]" />
                        Ideas & Submissions
                      </h2>
                      <p className="text-gray-200 mt-2 font-sans">
                        Submit your ideas, suggestions, and recommendations for
                        Imperium Cardis
                      </p>
                    </div>
                    <button
                      onClick={() => setShowIdeaModal(true)}
                      className="px-6 py-3 font-bold font-sans tracking-wide flex items-center gap-2 transition-colors"
                      style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f5f5dc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#d4af37")
                      }
                    >
                      <MessageSquare className="w-5 h-5" />
                      Submit Idea
                    </button>
                  </div>

                  {/* Ideas Grid */}
                  {ideas.length === 0 ? (
                    <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#d4af37]/30 p-12 text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#d4af37]/30" />
                      <h3 className="text-xl font-bold text-gray-300 mb-2">
                        No Ideas Submitted Yet
                      </h3>
                      <p className="text-gray-400 font-sans mb-6">
                        Be the first to share your ideas for improving the game!
                      </p>
                      <button
                        onClick={() => setShowIdeaModal(true)}
                        className="px-8 py-3 font-bold font-sans tracking-wide transition-colors"
                        style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5dc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d4af37")
                        }
                      >
                        Submit Your First Idea
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ideas.map((idea, index) => (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 p-6 group hover:border-[#d4af37] transition-all"
                          style={{
                            borderColor:
                              idea.status === "approved"
                                ? "#2d5016"
                                : idea.status === "rejected"
                                ? "#c41e3a"
                                : "#d4af37",
                          }}
                        >
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteIdea(idea.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            ×
                          </button>

                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`px-3 py-1 text-xs font-sans font-bold border ${
                                idea.status === "approved"
                                  ? "bg-green-900/20 border-green-700 text-green-400"
                                  : idea.status === "rejected"
                                  ? "bg-red-900/20 border-red-700 text-red-400"
                                  : "bg-yellow-900/20 border-yellow-700 text-yellow-400"
                              }`}
                            >
                              {idea.status === "approved"
                                ? "✓ Approved"
                                : idea.status === "rejected"
                                ? "✗ Rejected"
                                : "◷ Pending"}
                            </span>
                            <span className="text-xs text-gray-400 font-sans">
                              {idea.submittedAt}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">
                            {idea.title}
                          </h3>

                          <div className="flex items-center gap-3 mb-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-200 font-sans">
                              {idea.submitter}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span
                              className={`text-xs font-sans px-2 py-0.5 ${
                                idea.category === "Gameplay"
                                  ? "bg-blue-900/30 text-blue-400 border border-blue-700"
                                  : idea.category === "Balance"
                                  ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
                                  : idea.category === "Theme"
                                  ? "bg-purple-900/30 text-purple-400 border border-purple-700"
                                  : "bg-gray-900/30 text-gray-400 border border-gray-700"
                              }`}
                            >
                              {idea.category}
                            </span>
                          </div>

                          <p className="text-gray-100 font-sans text-sm mb-4 leading-relaxed">
                            {idea.description}
                          </p>

                          {/* Response Section */}
                          {idea.response && (
                            <div className="bg-black/40 border-l-4 border-[#d4af37] p-3 mb-3">
                              <div className="text-[#d4af37] font-bold mb-1 font-sans text-xs">
                                RESPONSE
                              </div>
                              <p className="text-gray-200 font-sans text-sm">
                                {idea.response}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenResponse(idea)}
                              className="flex-1 bg-[#2a2a2a] border-2 border-[#d4af37] text-white px-4 py-2 font-sans text-sm hover:bg-[#d4af37]/10 transition-colors font-semibold"
                            >
                              {idea.status === "pending"
                                ? "Review & Respond"
                                : "Edit Response"}
                            </button>
                            <button
                              onClick={() => handleOpenComments(idea)}
                              className="bg-[#2a2a2a] border-2 border-[#d4af37] text-white px-4 py-2 font-sans text-sm hover:bg-[#d4af37]/10 transition-colors font-semibold flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {(idea.comments || []).length}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Chronicle (Patch Notes) */}
              {activeTab === "chronicle" && (
                <motion.div
                  key="chronicle"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-[#d4af37]" />
                        The Chronicle
                      </h2>
                      <p className="text-gray-200 mt-2 font-sans">
                        A timeline of updates and milestones in the development
                        of Imperium Cardis
                      </p>
                    </div>
                    <button
                      onClick={() => setShowChronicleModal(true)}
                      className="bg-[#d4af37] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors flex items-center gap-2"
                      style={{ color: "#ffffff" }}
                    >
                      <Calendar className="w-5 h-5" />
                      Add Update
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="relative mt-12">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#d4af37]/30" />

                    {/* Timeline entries */}
                    <div className="space-y-12">
                      {chronicleEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-20"
                        >
                          <div
                            className={`absolute left-4 top-0 w-8 h-8 border-4 border-[#1a1a1a] rounded-full flex items-center justify-center ${
                              entry.status === "completed"
                                ? "bg-[#d4af37]"
                                : "bg-gray-700"
                            }`}
                          >
                            {/* Circle only - no icon */}
                          </div>
                          <div
                            className={`bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 p-6 ${
                              entry.status === "completed"
                                ? "border-[#d4af37]"
                                : "border-gray-700 opacity-60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3
                                className={`text-2xl font-bold ${
                                  entry.status === "completed"
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                {entry.version}
                              </h3>
                              <span
                                className={`text-sm font-sans ${
                                  entry.status === "completed"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {entry.date}
                              </span>
                            </div>
                            <h4
                              className={`text-lg font-bold mb-3 ${
                                entry.status === "completed"
                                  ? "text-gray-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {entry.title}
                            </h4>
                            <ul
                              className={`space-y-2 font-sans ${
                                entry.status === "completed"
                                  ? "text-gray-200"
                                  : "text-gray-600"
                              }`}
                            >
                              {entry.items.map((item, itemIndex) => (
                                <li
                                  key={itemIndex}
                                  className="flex items-start gap-2"
                                >
                                  <span
                                    className={`mt-1 ${
                                      entry.status === "completed"
                                        ? "text-[#d4af37]"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rulebook */}
              {activeTab === "rulebook" &&
                (() => {
                  const iconMap = {
                    Castle,
                    Scroll,
                    Coins,
                    Sword,
                    Zap,
                    Crown,
                    Star,
                  };

                  const filtered = rulebookData
                    .map((section) => ({
                      ...section,
                      rules: section.rules.filter(
                        (r) =>
                          !rulebookSearch ||
                          r.q
                            .toLowerCase()
                            .includes(rulebookSearch.toLowerCase()) ||
                          r.a
                            .toLowerCase()
                            .includes(rulebookSearch.toLowerCase())
                      ),
                    }))
                    .filter(
                      (section) => !rulebookSearch || section.rules.length > 0
                    );

                  return (
                    <motion.div
                      key="rulebook"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Scroll className="w-8 h-8 text-[#d4af37]" />
                            Rulebook
                          </h2>
                          <p className="text-gray-400 font-sans mt-1">
                            Official rules reference for Imperium Cardis
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenSectionEdit(null)}
                            className="px-4 py-2 font-sans text-sm font-bold flex items-center gap-2 transition-colors"
                            style={{
                              backgroundColor: "#d4af37",
                              color: "#1a1a1a",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f5f5dc")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#d4af37")
                            }
                          >
                            <Plus className="w-4 h-4" /> Add Section
                          </button>
                          <button
                            onClick={() =>
                              setExpandedRules(
                                rulebookData.reduce(
                                  (acc, s) => ({ ...acc, [s.id]: true }),
                                  {}
                                )
                              )
                            }
                            className="text-xs font-sans text-[#d4af37] hover:text-white border border-[#d4af37]/30 px-3 py-1.5 hover:border-[#d4af37] transition-colors"
                          >
                            Expand All
                          </button>
                          <button
                            onClick={() => setExpandedRules({})}
                            className="text-xs font-sans text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 hover:border-gray-500 transition-colors"
                          >
                            Collapse All
                          </button>
                        </div>
                      </div>

                      {/* Search */}
                      <div className="relative mb-8">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={rulebookSearch}
                          onChange={(e) => setRulebookSearch(e.target.value)}
                          placeholder="Search rules... (e.g. 'combat', 'resources', 'victory')"
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white pl-12 pr-10 py-3 font-sans focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                        {rulebookSearch && (
                          <button
                            onClick={() => setRulebookSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xl"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {rulebookSearch && (
                        <p className="text-sm text-gray-400 font-sans mb-6">
                          {filtered.reduce((sum, s) => sum + s.rules.length, 0)}{" "}
                          result
                          {filtered.reduce(
                            (sum, s) => sum + s.rules.length,
                            0
                          ) !== 1
                            ? "s"
                            : ""}{" "}
                          found
                        </p>
                      )}

                      {/* Rule sections */}
                      <div className="space-y-4">
                        {filtered.map((section, sIdx) => {
                          const SectionIcon = iconMap[section.icon] || Scroll;
                          const isOpen = expandedRules[section.id] ?? false;
                          return (
                            <motion.div
                              key={section.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: sIdx * 0.05 }}
                              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 overflow-hidden"
                              style={{
                                borderColor: isOpen ? section.color : "#3a3a3a",
                              }}
                            >
                              {/* Section header */}
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleRule(section.id)}
                                  className="flex-1 flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className="w-10 h-10 flex items-center justify-center border-2"
                                      style={{
                                        borderColor: section.color,
                                        backgroundColor: section.color + "22",
                                      }}
                                    >
                                      <SectionIcon
                                        className="w-5 h-5"
                                        style={{ color: section.color }}
                                      />
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-white">
                                        {section.title}
                                      </div>
                                      <div className="text-xs text-gray-400 font-sans mt-0.5">
                                        {section.summary} ·{" "}
                                        {section.rules.length} rule
                                        {section.rules.length !== 1 ? "s" : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronDown
                                    className="w-5 h-5 text-gray-400 transition-transform flex-shrink-0 mr-3"
                                    style={{
                                      transform: isOpen
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    }}
                                  />
                                </button>
                                {/* Section edit/delete */}
                                {!rulebookSearch && (
                                  <div className="flex gap-1 pr-4 flex-shrink-0">
                                    <button
                                      onClick={() =>
                                        handleOpenRuleEdit(
                                          section.id,
                                          null,
                                          null
                                        )
                                      }
                                      className="text-[10px] font-sans font-bold px-2 py-1 transition-colors"
                                      style={{
                                        backgroundColor: "#d4af37",
                                        color: "#1a1a1a",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                          "#f5f5dc")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                          "#d4af37")
                                      }
                                      title="Add rule to this section"
                                    >
                                      + Rule
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleOpenSectionEdit(section)
                                      }
                                      className="bg-blue-700/60 text-white p-1.5 hover:bg-blue-600 transition-colors"
                                      title="Edit section"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteSection(section.id)
                                      }
                                      className="bg-red-700/60 text-white p-1.5 hover:bg-red-600 transition-colors"
                                      title="Delete section"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Rules list */}
                              {isOpen && (
                                <div className="border-t border-gray-700/50">
                                  {section.rules.map((rule, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className={`px-6 py-4 group flex items-start gap-3 ${
                                        rIdx < section.rules.length - 1
                                          ? "border-b border-gray-800"
                                          : ""
                                      }`}
                                    >
                                      <div
                                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                        style={{
                                          backgroundColor: section.color,
                                        }}
                                      />
                                      <div className="flex-1">
                                        <p className="text-white font-bold font-sans text-sm mb-1">
                                          {rule.q}
                                        </p>
                                        <p className="text-gray-300 font-sans text-sm leading-relaxed">
                                          {rule.a}
                                        </p>
                                      </div>
                                      {/* Rule edit/delete */}
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button
                                          onClick={() =>
                                            handleOpenRuleEdit(
                                              section.id,
                                              rIdx,
                                              rule
                                            )
                                          }
                                          className="bg-blue-700/60 text-white p-1.5 hover:bg-blue-600 transition-colors"
                                          title="Edit rule"
                                        >
                                          <BookOpen className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteRule(section.id, rIdx)
                                          }
                                          className="bg-red-700/60 text-white p-1.5 hover:bg-red-600 transition-colors"
                                          title="Delete rule"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  {/* Add rule inline button */}
                                  <div className="px-6 py-3 border-t border-gray-800/50">
                                    <button
                                      onClick={() =>
                                        handleOpenRuleEdit(
                                          section.id,
                                          null,
                                          null
                                        )
                                      }
                                      className="text-xs text-gray-500 hover:text-[#d4af37] font-sans transition-colors flex items-center gap-1"
                                    >
                                      <Plus className="w-3 h-3" /> Add rule to
                                      this section
                                    </button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}

                        {filtered.length === 0 && rulebookSearch && (
                          <div className="bg-[#2a2a2a] border-2 border-[#d4af37]/20 p-16 text-center">
                            <Scroll className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400 font-sans">
                              No rules found for "{rulebookSearch}"
                            </p>
                            <button
                              onClick={() => setRulebookSearch("")}
                              className="mt-4 text-[#d4af37] font-sans text-sm hover:underline"
                            >
                              Clear search
                            </button>
                          </div>
                        )}

                        {rulebookData.length === 0 && (
                          <div className="bg-[#2a2a2a] border-2 border-dashed border-[#d4af37]/30 p-16 text-center">
                            <Scroll className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-300 font-sans mb-4">
                              No rule sections yet.
                            </p>
                            <button
                              onClick={() => handleOpenSectionEdit(null)}
                              className="px-6 py-2 font-sans text-sm font-bold transition-colors"
                              style={{
                                backgroundColor: "#d4af37",
                                color: "#1a1a1a",
                              }}
                            >
                              Add First Section
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
          </main>

          {/* Modals */}
          {/* New Group Modal */}
          <AnimatePresence>
            {showNewGroupModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowNewGroupModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Create Playtest Group
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="e.g., Alpha Testers, Weekend Warriors, etc."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleCreateGroup}
                        disabled={!newGroupName.trim()}
                        className="flex-1 bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Group
                      </button>
                      <button
                        onClick={() => {
                          setShowNewGroupModal(false);
                          setNewGroupName("");
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Comment Modal */}
          <AnimatePresence>
            {showCommentModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCommentModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Add Feedback Comment
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Your Name / Username
                      </label>
                      <input
                        type="text"
                        value={newComment.username}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter your name or username"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                          Category
                        </label>
                        <select
                          value={newComment.category}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Balance">Balance</option>
                          <option value="Bug">Bug</option>
                          <option value="Suggestion">Suggestion</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                          Impact
                        </label>
                        <select
                          value={newComment.impact}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              impact: e.target.value,
                            })
                          }
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Comment
                      </label>
                      <textarea
                        value={newComment.comment}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Share your thoughts on balance, bugs, or suggestions..."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37] min-h-32 resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmitComment}
                        disabled={
                          !newComment.username.trim() ||
                          !newComment.comment.trim()
                        }
                        className="flex-1 bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Comment
                      </button>
                      <button
                        onClick={() => {
                          setShowCommentModal(false);
                          setNewComment({
                            username: "",
                            category: "Balance",
                            impact: "Medium",
                            comment: "",
                          });
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Version Modal */}
          <AnimatePresence>
            {showVersionModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowVersionModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Create New Version
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Version Name
                      </label>
                      <input
                        type="text"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        placeholder="e.g., v0.2, v1.0, etc."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleCreateVersion}
                        disabled={!newVersionName.trim()}
                        className="flex-1 bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Version
                      </button>
                      <button
                        onClick={() => {
                          setShowVersionModal(false);
                          setNewVersionName("");
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Universal Card Editor Modal */}
          <AnimatePresence>
            {showEditModal && editingCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => setShowEditModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1a1a] border-4 border-[#d4af37] p-8 w-full my-8"
                  style={{
                    backgroundColor: "rgba(26, 26, 26, 0.98)",
                    maxWidth: "900px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {editingCard.id ? "Edit" : "Create"}{" "}
                    {editCardType.charAt(0).toUpperCase() +
                      editCardType.slice(1)}
                  </h3>

                  <div className="flex gap-8">
                    {/* Left: Form fields */}
                    <div className="flex-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                      {editCardType === "faction" && (
                        <>
                          <input
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans"
                            placeholder="Color (e.g., Red, Blue)"
                            value={editingCard.color || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                color: e.target.value,
                              })
                            }
                          />
                          <input
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans"
                            placeholder="Name (e.g., Iron, Treasury)"
                            value={editingCard.name || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                name: e.target.value,
                              })
                            }
                          />
                          <input
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans"
                            placeholder="Resource (e.g., Manpower, Coin)"
                            value={editingCard.resource || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                resource: e.target.value,
                              })
                            }
                          />
                          <textarea
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans min-h-20"
                            placeholder="Playstyle"
                            value={editingCard.playstyle || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                playstyle: e.target.value,
                              })
                            }
                          />
                          <textarea
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans min-h-16"
                            placeholder="Historical (civilizations)"
                            value={editingCard.historical || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                historical: e.target.value,
                              })
                            }
                          />
                          <textarea
                            className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans min-h-16"
                            placeholder='Flavor Text (e.g., "Wealth is the sharpest sword.")'
                            value={editingCard.description || ""}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                description: e.target.value,
                              })
                            }
                          />
                          <div>
                            <label className="block text-gray-400 font-sans text-xs mb-1">
                              Faction Color
                            </label>
                            <input
                              type="color"
                              className="w-full h-12 bg-black/40 border-2 border-[#d4af37]/30 cursor-pointer"
                              value={editingCard.hex || "#d4af37"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  hex: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {editCardType === "city" && (
                        <>
                          <div className="relative">
                            <Castle className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="City Name"
                              value={editingCard.city || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  city: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Color(s) (e.g., Red or Red/Blue)"
                              value={editingCard.color || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Time Period (e.g., Ancient, Medieval)"
                              value={editingCard.era || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  era: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Heart className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                            <input
                              type="number"
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="HP"
                              value={editingCard.hp || 20}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  hp: parseInt(e.target.value) || 20,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-green-400 font-sans text-xs mb-1">
                                Economy Slots
                              </label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border-2 border-green-700/50 text-white px-3 py-2 font-sans"
                                value={editingCard.economy || 0}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    economy: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-red-400 font-sans text-xs mb-1">
                                Military Slots
                              </label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border-2 border-red-700/50 text-white px-3 py-2 font-sans"
                                value={editingCard.military || 0}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    military: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-blue-400 font-sans text-xs mb-1">
                                Civic Slots
                              </label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border-2 border-blue-700/50 text-white px-3 py-2 font-sans"
                                value={editingCard.civic || 0}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    civic: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <Star className="absolute left-3 top-3 w-5 h-5 text-[#d4af37]" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-20"
                              placeholder="City Bonus"
                              value={editingCard.bonus || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  bonus: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 font-sans text-xs mb-1">
                              Border Color
                            </label>
                            <input
                              type="color"
                              className="w-full h-10 bg-black/40 border-2 border-[#d4af37]/30 cursor-pointer"
                              value={editingCard.hex || "#d4af37"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  hex: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-16"
                              placeholder='Flavor Text (e.g., "Where the Tiber meets glory.")'
                              value={editingCard.description || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {editCardType === "building" && (
                        <>
                          <div className="relative">
                            <Castle className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Name"
                              value={editingCard.name || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <TrendingUp className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <select
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              value={editingCard.slot || "Economy"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  slot: e.target.value,
                                })
                              }
                            >
                              <option>Economy</option>
                              <option>Military</option>
                              <option>Civic</option>
                            </select>
                          </div>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Color (e.g., Red, Blue/Green)"
                              value={editingCard.color || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Coins className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Cost"
                              value={editingCard.cost || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  cost: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Star className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <select
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              value={editingCard.tier || "Tier 1: Normal"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  tier: e.target.value,
                                })
                              }
                            >
                              <option>Tier 1: Normal</option>
                              <option>Tier 2: Special</option>
                              <option>Tier 3: Legendary</option>
                            </select>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-red-400" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="City Requirement (or None)"
                              value={editingCard.cityReq || "None"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  cityReq: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Zap className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-20"
                              placeholder="Effect"
                              value={editingCard.effect || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  effect: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-16"
                              placeholder='Flavor Text (e.g., "Stone by stone, empires are built.")'
                              value={editingCard.description || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {editCardType === "unit" && (
                        <>
                          <div className="relative">
                            <Sword className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Name"
                              value={editingCard.name || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Color (e.g., Red, Blue/Green)"
                              value={editingCard.color || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Coins className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Cost (e.g., 3 Man)"
                              value={editingCard.cost || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  cost: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-red-400 font-sans text-xs mb-1">
                                Attack
                              </label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border-2 border-red-700/50 text-white px-3 py-2 font-sans"
                                value={editingCard.attack || 0}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    attack: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-blue-400 font-sans text-xs mb-1">
                                Defense
                              </label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border-2 border-blue-700/50 text-white px-3 py-2 font-sans"
                                value={editingCard.defense || 0}
                                onChange={(e) =>
                                  setEditingCard({
                                    ...editingCard,
                                    defense: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <Zap className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Keywords (comma-separated, e.g. Raid, Siege)"
                              value={(editingCard.keywords || []).join(", ")}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  keywords: e.target.value
                                    .split(",")
                                    .map((k) => k.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Star className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <select
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              value={editingCard.tier || "Common"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  tier: e.target.value,
                                })
                              }
                            >
                              <option>Common</option>
                              <option>Uncommon</option>
                              <option>Legendary</option>
                            </select>
                          </div>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-20"
                              placeholder="Description / Flavor Text"
                              value={editingCard.description || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <ExternalLink className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Image URL (optional)"
                              value={editingCard.image || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  image: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {editCardType === "event" && (
                        <>
                          <div className="relative">
                            <Zap className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Name"
                              value={editingCard.name || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Color"
                              value={editingCard.color || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  color: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <select
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              value={editingCard.timing || "Immediate"}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  timing: e.target.value,
                                })
                              }
                            >
                              <option>Immediate</option>
                              <option>Instant</option>
                              <option>Reaction</option>
                            </select>
                          </div>
                          <div className="relative">
                            <Coins className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <input
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                              placeholder="Cost"
                              value={editingCard.cost || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  cost: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <Star className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-20"
                              placeholder="Effect"
                              value={editingCard.effect || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  effect: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-white" />
                            <textarea
                              className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-16"
                              placeholder="Flavor Text / Description"
                              value={editingCard.description || ""}
                              onChange={(e) =>
                                setEditingCard({
                                  ...editingCard,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right: Live card preview */}
                    <div className="w-72 flex-shrink-0">
                      <div className="text-xs text-gray-500 font-sans uppercase tracking-widest mb-3 text-center">
                        Live Preview
                      </div>

                      {/* CITY PREVIEW */}
                      {editCardType === "city" &&
                        (() => {
                          const borderColor = editingCard.hex || "#d4af37";
                          return (
                            <div
                              className="relative rounded-none"
                              style={{
                                border: `4px solid ${borderColor}`,
                                background:
                                  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
                              }}
                            >
                              <div
                                className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
                                style={{ borderColor }}
                              />
                              <div
                                className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
                                style={{ borderColor }}
                              />
                              <div
                                className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
                                style={{ borderColor }}
                              />
                              <div
                                className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
                                style={{ borderColor }}
                              />
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="text-lg font-bold text-white leading-tight">
                                      {editingCard.city || "City Name"}
                                    </div>
                                    <div className="text-xs text-gray-400 font-sans mt-0.5">
                                      {editingCard.era || "Era"} ·{" "}
                                      {editingCard.color || "Faction"}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span className="text-lg font-bold text-red-400">
                                      {editingCard.hp || 20}
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mb-3">
                                  <div className="bg-green-900/30 border border-green-700 p-1.5 text-center">
                                    <Coins className="w-3 h-3 mx-auto mb-0.5 text-green-400" />
                                    <div className="text-sm font-bold text-green-400">
                                      {editingCard.economy || 0}
                                    </div>
                                    <div className="text-[8px] text-gray-400 font-sans">
                                      Eco
                                    </div>
                                  </div>
                                  <div className="bg-red-900/30 border border-red-700 p-1.5 text-center">
                                    <Sword className="w-3 h-3 mx-auto mb-0.5 text-red-400" />
                                    <div className="text-sm font-bold text-red-400">
                                      {editingCard.military || 0}
                                    </div>
                                    <div className="text-[8px] text-gray-400 font-sans">
                                      Mil
                                    </div>
                                  </div>
                                  <div className="bg-blue-900/30 border border-blue-700 p-1.5 text-center">
                                    <Crown className="w-3 h-3 mx-auto mb-0.5 text-blue-400" />
                                    <div className="text-sm font-bold text-blue-400">
                                      {editingCard.civic || 0}
                                    </div>
                                    <div className="text-[8px] text-gray-400 font-sans">
                                      Civic
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="border-l-2 pl-2 py-1"
                                  style={{ borderColor }}
                                >
                                  <div
                                    className="text-[9px] font-bold font-sans uppercase mb-0.5"
                                    style={{ color: borderColor }}
                                  >
                                    City Bonus
                                  </div>
                                  <p className="text-gray-200 font-sans text-[10px] leading-snug">
                                    {editingCard.bonus ||
                                      "No bonus defined yet."}
                                  </p>
                                </div>
                                {editingCard.description && (
                                  <p className="text-gray-500 font-sans text-[10px] italic mt-2 border-t border-gray-700 pt-2">
                                    {editingCard.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      {/* UNIT PREVIEW */}
                      {editCardType === "unit" &&
                        (() => {
                          const col = editingCard.color || "";
                          const factionHex =
                            factionData.find((f) => f.color === col)?.hex ||
                            "#d4af37";
                          const tierColors = {
                            Common: "#6b7280",
                            Uncommon: "#16a34a",
                            Legendary: "#d4af37",
                          };
                          const tierColor =
                            tierColors[editingCard.tier] || "#6b7280";
                          return (
                            <div
                              className="relative"
                              style={{
                                border: `4px solid ${factionHex}`,
                                background:
                                  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
                              }}
                            >
                              {/* Image area */}
                              <div
                                className="w-full h-28 bg-black/60 flex items-center justify-center border-b-2"
                                style={{ borderColor: factionHex }}
                              >
                                {editingCard.image ? (
                                  <img
                                    src={editingCard.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                      (e.target.style.display = "none")
                                    }
                                  />
                                ) : (
                                  <Sword
                                    className="w-12 h-12 opacity-20"
                                    style={{ color: factionHex }}
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-base font-bold text-white leading-tight">
                                    {editingCard.name || "Unit Name"}
                                  </div>
                                  <div
                                    className="text-[9px] font-bold font-sans px-1.5 py-0.5"
                                    style={{
                                      backgroundColor: tierColor + "33",
                                      color: tierColor,
                                      border: `1px solid ${tierColor}`,
                                    }}
                                  >
                                    {editingCard.tier || "Common"}
                                  </div>
                                </div>
                                <div className="text-[9px] text-gray-400 font-sans mb-2">
                                  {editingCard.color || "Faction"} ·{" "}
                                  {editingCard.cost || "Cost"}
                                </div>
                                <div className="flex gap-3 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Sword className="w-3 h-3 text-red-400" />
                                    <span className="text-red-400 font-bold text-sm">
                                      {editingCard.attack || 0}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-blue-400" />
                                    <span className="text-blue-400 font-bold text-sm">
                                      {editingCard.defense || 0}
                                    </span>
                                  </div>
                                </div>
                                {editingCard.keywords?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editingCard.keywords.map((k, i) => (
                                      <span
                                        key={i}
                                        className="text-[9px] px-1.5 py-0.5 font-bold font-sans"
                                        style={{
                                          backgroundColor: factionHex + "22",
                                          color: factionHex,
                                          border: `1px solid ${factionHex}`,
                                        }}
                                      >
                                        {k}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <p className="text-gray-300 font-sans text-[10px] italic leading-snug">
                                  {editingCard.description ||
                                    "No description yet."}
                                </p>
                              </div>
                            </div>
                          );
                        })()}

                      {/* BUILDING PREVIEW */}
                      {editCardType === "building" &&
                        (() => {
                          const col = editingCard.color || "";
                          const factionHex =
                            factionData.find(
                              (f) => f.color === col.split("/")[0].trim()
                            )?.hex || "#d4af37";
                          const slotColors = {
                            Economy: "#16a34a",
                            Military: "#c41e3a",
                            Civic: "#4a7ba7",
                          };
                          const slotColor =
                            slotColors[editingCard.slot] || "#d4af37";
                          return (
                            <div
                              className="relative"
                              style={{
                                border: `4px solid ${factionHex}`,
                                background:
                                  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
                              }}
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="text-base font-bold text-white">
                                      {editingCard.name || "Building Name"}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span
                                        className="text-[9px] font-bold font-sans px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: slotColor + "22",
                                          color: slotColor,
                                          border: `1px solid ${slotColor}`,
                                        }}
                                      >
                                        {editingCard.slot || "Slot"}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-sans">
                                        {editingCard.tier || "Tier 1"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-[9px] font-bold font-sans px-2 py-1 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]">
                                    {editingCard.cost || "Cost"}
                                  </div>
                                </div>
                                {editingCard.cityReq &&
                                  editingCard.cityReq !== "None" && (
                                    <div className="flex items-center gap-1 mb-2">
                                      <Lock className="w-3 h-3 text-red-400" />
                                      <span className="text-[9px] text-red-400 font-sans">
                                        Requires {editingCard.cityReq}
                                      </span>
                                    </div>
                                  )}
                                <div
                                  className="border-l-2 pl-2"
                                  style={{ borderColor: factionHex }}
                                >
                                  <p className="text-gray-200 font-sans text-[10px] leading-snug">
                                    {editingCard.effect ||
                                      "No effect defined yet."}
                                  </p>
                                </div>
                                {editingCard.description && (
                                  <p className="text-gray-500 font-sans text-[10px] italic mt-2 border-t border-gray-700 pt-2">
                                    {editingCard.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      {/* EVENT PREVIEW */}
                      {editCardType === "event" &&
                        (() => {
                          const col = editingCard.color || "";
                          const factionHex =
                            factionData.find((f) => f.color === col)?.hex ||
                            "#6b7280";
                          const timingStyles = {
                            Instant: {
                              bg: "#1e3a5f",
                              border: "#3b82f6",
                              text: "#93c5fd",
                            },
                            Reaction: {
                              bg: "#3b0764",
                              border: "#9333ea",
                              text: "#d8b4fe",
                            },
                            Immediate: {
                              bg: "#14401a",
                              border: "#16a34a",
                              text: "#86efac",
                            },
                          };
                          const ts =
                            timingStyles[editingCard.timing] ||
                            timingStyles["Immediate"];
                          return (
                            <div
                              className="relative"
                              style={{
                                border: `4px solid ${factionHex}`,
                                background:
                                  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
                              }}
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="text-base font-bold text-white leading-tight">
                                      {editingCard.name || "Event Name"}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span
                                        className="text-[9px] font-sans"
                                        style={{
                                          color: col ? factionHex : "#9ca3af",
                                        }}
                                      >
                                        {editingCard.color || "Color"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-[9px] font-bold font-sans px-2 py-1 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]">
                                    {editingCard.cost || "Cost"}
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <span
                                    className="inline-block text-[9px] font-bold font-sans px-2 py-0.5"
                                    style={{
                                      backgroundColor: ts.bg,
                                      border: `1px solid ${ts.border}`,
                                      color: ts.text,
                                    }}
                                  >
                                    {editingCard.timing || "Immediate"}
                                  </span>
                                </div>
                                <div
                                  className="border-l-2 pl-2 mb-2"
                                  style={{ borderColor: factionHex }}
                                >
                                  <div className="text-[9px] font-bold font-sans uppercase mb-0.5 text-[#d4af37]">
                                    Effect
                                  </div>
                                  <p className="text-gray-200 font-sans text-[10px] leading-snug">
                                    {editingCard.effect ||
                                      "No effect defined yet."}
                                  </p>
                                </div>
                                {editingCard.description && (
                                  <p className="text-gray-500 font-sans text-[10px] italic">
                                    {editingCard.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      {/* FACTION PREVIEW */}
                      {editCardType === "faction" &&
                        (() => {
                          const FactionIcon =
                            factionIconMap[editingCard.color] || Shield;
                          const hex = editingCard.hex || "#d4af37";
                          return (
                            <div
                              className="relative"
                              style={{
                                border: `4px solid ${hex}`,
                                background:
                                  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
                              }}
                            >
                              <div
                                className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
                                style={{ borderColor: hex }}
                              />
                              <div
                                className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
                                style={{ borderColor: hex }}
                              />
                              <div
                                className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
                                style={{ borderColor: hex }}
                              />
                              <div
                                className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
                                style={{ borderColor: hex }}
                              />
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <FactionIcon
                                    className="w-8 h-8"
                                    style={{ color: hex }}
                                  />
                                  <div>
                                    <div
                                      className="text-base font-bold"
                                      style={{ color: hex }}
                                    >
                                      {editingCard.color || "Color"}
                                    </div>
                                    <div className="text-xs text-gray-400 font-sans">
                                      {editingCard.name || "Name"}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-1.5 text-[10px] font-sans">
                                  <div>
                                    <span className="text-white font-bold">
                                      Resource:{" "}
                                    </span>
                                    <span className="text-gray-300">
                                      {editingCard.resource || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-white font-bold">
                                      Playstyle:{" "}
                                    </span>
                                    <span className="text-gray-300">
                                      {editingCard.playstyle || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-white font-bold">
                                      Historical:{" "}
                                    </span>
                                    <span className="text-gray-300">
                                      {editingCard.historical || "—"}
                                    </span>
                                  </div>
                                </div>
                                {editingCard.description && (
                                  <p className="text-gray-500 font-sans text-[10px] italic mt-2 border-t border-gray-700 pt-2">
                                    {editingCard.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      <p className="text-[10px] text-gray-600 font-sans text-center mt-3">
                        Updates as you type
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 mt-4 border-t border-[#d4af37]/20">
                    <button
                      onClick={handleSaveCard}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 font-bold font-sans hover:bg-blue-700 transition-colors"
                    >
                      Save{" "}
                      {editCardType
                        ? editCardType.charAt(0).toUpperCase() +
                          editCardType.slice(1)
                        : "Card"}
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-[#2a2a2a] border-2 border-gray-600 text-white px-6 py-3 font-bold font-sans hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Idea Modal */}
          <AnimatePresence>
            {showIdeaModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowIdeaModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Submit Your Idea
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newIdea.submitter}
                        onChange={(e) =>
                          setNewIdea({ ...newIdea, submitter: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Category
                      </label>
                      <select
                        value={newIdea.category}
                        onChange={(e) =>
                          setNewIdea({ ...newIdea, category: e.target.value })
                        }
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37]"
                      >
                        <option>Gameplay</option>
                        <option>Balance</option>
                        <option>Theme</option>
                        <option>UI/UX</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Idea Title
                      </label>
                      <input
                        type="text"
                        value={newIdea.title}
                        onChange={(e) =>
                          setNewIdea({ ...newIdea, title: e.target.value })
                        }
                        placeholder="Brief title for your idea"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Description
                      </label>
                      <textarea
                        value={newIdea.description}
                        onChange={(e) =>
                          setNewIdea({
                            ...newIdea,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe your idea in detail..."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37] min-h-32 resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmitIdea}
                        disabled={
                          !newIdea.submitter.trim() ||
                          !newIdea.title.trim() ||
                          !newIdea.description.trim()
                        }
                        className="flex-1 px-6 py-3 font-bold font-sans tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#d4af37", color: "#1a1a1a" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5dc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d4af37")
                        }
                      >
                        Submit Idea
                      </button>
                      <button
                        onClick={() => {
                          setShowIdeaModal(false);
                          setNewIdea({
                            submitter: "",
                            title: "",
                            description: "",
                            category: "Gameplay",
                          });
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response Modal */}
          <AnimatePresence>
            {showResponseModal && selectedIdea && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowResponseModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Review Idea
                  </h3>
                  <p className="text-gray-300 font-sans mb-6">
                    {selectedIdea.title}
                  </p>

                  <div className="bg-black/40 border-l-4 border-[#d4af37] p-4 mb-6">
                    <div className="text-[#d4af37] font-bold mb-2 font-sans text-xs">
                      ORIGINAL SUBMISSION
                    </div>
                    <p className="text-gray-200 font-sans text-sm">
                      {selectedIdea.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Status
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            setIdeaResponse({
                              ...ideaResponse,
                              status: "approved",
                            })
                          }
                          className={`flex-1 px-4 py-3 font-sans font-bold transition-all border-2 ${
                            ideaResponse.status === "approved"
                              ? "bg-green-900/20 border-green-700 text-green-400"
                              : "bg-black/40 border-gray-700 text-gray-400 hover:border-green-700"
                          }`}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() =>
                            setIdeaResponse({
                              ...ideaResponse,
                              status: "pending",
                            })
                          }
                          className={`flex-1 px-4 py-3 font-sans font-bold transition-all border-2 ${
                            ideaResponse.status === "pending"
                              ? "bg-yellow-900/20 border-yellow-700 text-yellow-400"
                              : "bg-black/40 border-gray-700 text-gray-400 hover:border-yellow-700"
                          }`}
                        >
                          ◷ Pending
                        </button>
                        <button
                          onClick={() =>
                            setIdeaResponse({
                              ...ideaResponse,
                              status: "rejected",
                            })
                          }
                          className={`flex-1 px-4 py-3 font-sans font-bold transition-all border-2 ${
                            ideaResponse.status === "rejected"
                              ? "bg-red-900/20 border-red-700 text-red-400"
                              : "bg-black/40 border-gray-700 text-gray-400 hover:border-red-700"
                          }`}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                        Your Response
                      </label>
                      <textarea
                        value={ideaResponse.response}
                        onChange={(e) =>
                          setIdeaResponse({
                            ...ideaResponse,
                            response: e.target.value,
                          })
                        }
                        placeholder="Provide feedback or reasoning for your decision..."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37] min-h-24 resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveResponse}
                        className="flex-1 bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors"
                      >
                        Save Response
                      </button>
                      <button
                        onClick={() => {
                          setShowResponseModal(false);
                          setSelectedIdea(null);
                          setIdeaResponse({ status: "pending", response: "" });
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Chronicle Entry Modal */}
          <AnimatePresence>
            {showChronicleModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => setShowChronicleModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full my-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Add Chronicle Entry
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                          Version
                        </label>
                        <input
                          type="text"
                          value={newChronicleEntry.version}
                          onChange={(e) =>
                            setNewChronicleEntry({
                              ...newChronicleEntry,
                              version: e.target.value,
                            })
                          }
                          placeholder="e.g., Version 0.2"
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-gray-200 font-sans text-sm mb-2 font-semibold">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newChronicleEntry.title}
                          onChange={(e) =>
                            setNewChronicleEntry({
                              ...newChronicleEntry,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g., Playtesting Phase"
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-gray-200 font-sans text-sm font-semibold">
                          Update Items
                        </label>
                        <button
                          onClick={addChronicleItem}
                          className="text-[#d4af37] hover:text-[#f5f5dc] text-sm font-sans"
                        >
                          + Add Item
                        </button>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {newChronicleEntry.items.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) =>
                                updateChronicleItem(index, e.target.value)
                              }
                              placeholder="Enter update item..."
                              className="flex-1 bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37]"
                            />
                            {newChronicleEntry.items.length > 1 && (
                              <button
                                onClick={() => removeChronicleItem(index)}
                                className="bg-red-900/20 border-2 border-red-700 text-red-400 px-3 hover:bg-red-900/40 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#d4af37]/10 border-l-4 border-[#d4af37] p-4">
                      <p className="text-sm text-gray-400 font-sans">
                        <strong className="text-[#d4af37]">Note:</strong> The
                        current date will be automatically added to this entry.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleCreateChronicleEntry}
                        disabled={
                          !newChronicleEntry.version.trim() ||
                          !newChronicleEntry.title.trim()
                        }
                        className="flex-1 bg-[#d4af37] text-[#1a1a1a] px-6 py-3 font-bold font-sans tracking-wide hover:bg-[#f5f5dc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Chronicle
                      </button>
                      <button
                        onClick={() => {
                          setShowChronicleModal(false);
                          setNewChronicleEntry({
                            version: "",
                            title: "",
                            items: [""],
                          });
                        }}
                        className="flex-1 bg-gray-700 text-gray-300 px-6 py-3 font-bold font-sans tracking-wide hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Top Button */}
          <AnimatePresence>
            {showBackToTop && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-8 right-8 bg-[#d4af37] text-black p-4 rounded-full shadow-lg hover:bg-[#f5f5dc] transition-colors z-50 border-2 border-black"
                title="Back to Top"
              >
                <ChevronRight className="w-6 h-6 transform -rotate-90" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="relative border-t-2 border-[#d4af37] mt-20 py-8 bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-400 font-sans text-sm">
                Imperium Cardis © 2026 | A Grand Strategy Card Game for Godot
                4.x
              </p>
              <p className="text-[#d4af37] font-sans text-xs mt-2">
                Designed with ⚔️ by the Council of Strategists
              </p>
            </div>
          </footer>

          {/* Custom scrollbar styles */}
          <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border: 1px solid #d4af37;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f5f5dc;
        }
      `}</style>

          {/* Commit Modal */}
          <AnimatePresence>
            {showCommitModal && editingCommit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => setShowCommitModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full my-8"
                  style={{ backgroundColor: "rgba(26, 26, 26, 0.98)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {editingCommit.id
                      ? "Edit Update"
                      : "Add Development Update"}
                  </h3>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="relative">
                      <Zap className="absolute left-3 top-3 w-5 h-5 text-white" />
                      <input
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                        placeholder="Update Title"
                        value={editingCommit.title || ""}
                        onChange={(e) =>
                          setEditingCommit({
                            ...editingCommit,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Star className="absolute left-3 top-3 w-5 h-5 text-white" />
                        <select
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                          value={editingCommit.category || "Feature"}
                          onChange={(e) =>
                            setEditingCommit({
                              ...editingCommit,
                              category: e.target.value,
                            })
                          }
                        >
                          <option>Feature</option>
                          <option>Bugfix</option>
                          <option>Balance</option>
                          <option>Content</option>
                          <option>System</option>
                        </select>
                      </div>

                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-3 w-5 h-5 text-white" />
                        <select
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans"
                          value={editingCommit.impact || "Minor"}
                          onChange={(e) =>
                            setEditingCommit({
                              ...editingCommit,
                              impact: e.target.value,
                            })
                          }
                        >
                          <option>Minor</option>
                          <option>Moderate</option>
                          <option>Major</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 w-5 h-5 text-white" />
                      <textarea
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-24"
                        placeholder="Description (optional)"
                        value={editingCommit.description || ""}
                        onChange={(e) =>
                          setEditingCommit({
                            ...editingCommit,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-white" />
                        <label className="text-white font-sans font-semibold">
                          Changes (one per line)
                        </label>
                      </div>
                      <textarea
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans min-h-32"
                        placeholder="- Added new feature X&#10;- Fixed bug in Y&#10;- Improved performance of Z"
                        value={(editingCommit.changes || []).join("\n")}
                        onChange={(e) => {
                          const changes = e.target.value
                            .split("\n")
                            .filter((line) => line.trim());
                          setEditingCommit({ ...editingCommit, changes });
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleSaveCommit}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 font-sans font-bold hover:bg-blue-700 transition-colors"
                    >
                      {editingCommit.id ? "Update" : "Save Update"}
                    </button>
                    <button
                      onClick={() => setShowCommitModal(false)}
                      className="flex-1 bg-gray-700 text-white px-6 py-3 font-sans font-bold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comments Modal */}
          <AnimatePresence>
            {showCommentsModal && selectedIdea && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => setShowCommentsModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-3xl w-full my-8"
                  style={{ backgroundColor: "rgba(26, 26, 26, 0.98)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Comments
                  </h3>
                  <p className="text-gray-400 font-sans text-sm mb-6">
                    {selectedIdea.title}
                  </p>

                  {/* Comments List */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {!selectedIdea.comments ||
                    selectedIdea.comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 font-sans">
                        No comments yet. Be the first to comment!
                      </div>
                    ) : (
                      selectedIdea.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-black/40 border-2 border-[#d4af37]/30 p-4 relative group"
                        >
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          >
                            ×
                          </button>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-[#d4af37]" />
                            <span className="text-white font-sans font-bold text-sm">
                              {comment.author}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-xs text-gray-400 font-sans">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-200 font-sans text-sm">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment */}
                  <div className="space-y-4">
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white" />
                      <textarea
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 pl-11 font-sans min-h-24"
                        placeholder="Write a comment..."
                        value={ideaCommentText}
                        onChange={(e) => setIdeaCommentText(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleAddComment}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 font-sans font-bold hover:bg-blue-700 transition-colors"
                      >
                        Post Comment
                      </button>
                      <button
                        onClick={() => {
                          setShowCommentsModal(false);
                          setIdeaCommentText("");
                        }}
                        className="flex-1 bg-gray-700 text-white px-6 py-3 font-sans font-bold hover:bg-gray-600 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Rule Modal */}
          <AnimatePresence>
            {showRuleModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowRuleModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-2xl w-full"
                  style={{ backgroundColor: "rgba(26,26,26,0.98)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {editingRule?.ruleIdx === null ? "Add Rule" : "Edit Rule"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                        Question / Heading
                      </label>
                      <input
                        type="text"
                        value={newRuleQ}
                        onChange={(e) => setNewRuleQ(e.target.value)}
                        placeholder="e.g. How does combat work?"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                        Answer / Rule Text
                      </label>
                      <textarea
                        value={newRuleA}
                        onChange={(e) => setNewRuleA(e.target.value)}
                        placeholder="Explain the rule in full..."
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37] min-h-36 resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveRule}
                        disabled={!newRuleQ.trim() || !newRuleA.trim()}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 font-bold font-sans hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Rule
                      </button>
                      <button
                        onClick={() => {
                          setShowRuleModal(false);
                          setNewRuleQ("");
                          setNewRuleA("");
                        }}
                        className="flex-1 bg-gray-700 text-white px-6 py-3 font-bold font-sans hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Section Modal */}
          <AnimatePresence>
            {showSectionModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSectionModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#1a1a1a] border-4 border-[#d4af37] p-8 max-w-lg w-full"
                  style={{ backgroundColor: "rgba(26,26,26,0.98)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {editingSection ? "Edit Section" : "Add Section"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={newSection.title}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g. Advanced Rules"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                        Summary
                      </label>
                      <input
                        type="text"
                        value={newSection.summary}
                        onChange={(e) =>
                          setNewSection({
                            ...newSection,
                            summary: e.target.value,
                          })
                        }
                        placeholder="Brief description shown when collapsed"
                        className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-3 font-sans focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                          Icon
                        </label>
                        <select
                          value={newSection.icon}
                          onChange={(e) =>
                            setNewSection({
                              ...newSection,
                              icon: e.target.value,
                            })
                          }
                          className="w-full bg-black/40 border-2 border-[#d4af37]/30 text-white px-4 py-2 font-sans focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Scroll">Scroll</option>
                          <option value="Castle">Castle</option>
                          <option value="Sword">Sword</option>
                          <option value="Coins">Coins</option>
                          <option value="Zap">Zap</option>
                          <option value="Crown">Crown</option>
                          <option value="Star">Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-sans text-sm mb-2 font-semibold">
                          Color
                        </label>
                        <input
                          type="color"
                          value={newSection.color}
                          onChange={(e) =>
                            setNewSection({
                              ...newSection,
                              color: e.target.value,
                            })
                          }
                          className="w-full h-10 bg-black/40 border-2 border-[#d4af37]/30 cursor-pointer"
                        />
                      </div>
                    </div>
                    {/* Preview */}
                    <div className="bg-black/30 border border-[#d4af37]/20 p-3 flex items-center gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center border-2 flex-shrink-0"
                        style={{
                          borderColor: newSection.color,
                          backgroundColor: newSection.color + "22",
                        }}
                      >
                        {(() => {
                          const I =
                            { Scroll, Castle, Sword, Coins, Zap, Crown, Star }[
                              newSection.icon
                            ] || Scroll;
                          return (
                            <I
                              className="w-4 h-4"
                              style={{ color: newSection.color }}
                            />
                          );
                        })()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {newSection.title || "Section Title"}
                        </div>
                        <div className="text-xs text-gray-400 font-sans">
                          {newSection.summary || "Summary text"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveSection}
                        disabled={!newSection.title.trim()}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 font-bold font-sans hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Section
                      </button>
                      <button
                        onClick={() => {
                          setShowSectionModal(false);
                          setEditingSection(null);
                        }}
                        className="flex-1 bg-gray-700 text-white px-6 py-3 font-bold font-sans hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>{" "}
        {/* end z-index content wrapper */}
      </div>{" "}
      {/* end outer background wrapper */}
    </>
  );
};

export default ImperiumCardisHub;
