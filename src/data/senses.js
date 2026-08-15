import earthIcon from "../assets/icons/earth.svg";
import airIcon from "../assets/icons/air.svg";
import fireIcon from "../assets/icons/fire.svg";
import waterIcon from "../assets/icons/water.svg";
import etherIcon from "../assets/icons/ether.svg";
import earthCenterImage from "../assets/images/senses/development-center-logo.png";
import airCenterImage from "../assets/images/senses/design-center-logo.png";
import fireCenterImage from "../assets/images/senses/construction-center-logo.png";
import waterCenterImage from "../assets/images/senses/operations-center-logo.png";
import etherCenterImage from "../assets/images/senses/practice-center-logo.png";
import earthBg from "../assets/images/senses/development-bg-image.webp";
import airBg from "../assets/images/senses/design-bg-image.webp";
import fireBg from "../assets/images/senses/construction-bg-image.webp";
import waterBg from "../assets/images/senses/operation-bg-image.webp";
import etherBg from "../assets/images/senses/practice-bg-image.webp";
import intelligenceBg from "../assets/images/senses/intelligence-image-bg.webp";

export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "HI", name: "Hindi" },
  { code: "ar", label: "AR", name: "Arabic" },
  { code: "es", label: "ES", name: "Spanish" },
];

export const RTL_LANGUAGES = new Set(["ar"]);

const senseAssets = [
  {
    key: "earth",
    icon: earthIcon,
    centerImage: earthCenterImage,
    bg: earthBg,
    accent: "#f5c400",
  },
  {
    key: "air",
    icon: airIcon,
    centerImage: airCenterImage,
    bg: airBg,
    accent: "#8b5cf6",
  },
  {
    key: "fire",
    icon: fireIcon,
    centerImage: fireCenterImage,
    bg: fireBg,
    accent: "#ef4444",
  },
  {
    key: "water",
    icon: waterIcon,
    centerImage: waterCenterImage,
    bg: waterBg,
    accent: "#22d3ee",
  },
  {
    key: "ether",
    icon: etherIcon,
    centerImage: etherCenterImage,
    bg: etherBg,
    accent: "#7ae3a9",
  },
];

const senseCopy = {
  en: {
    earth: {
      element: "Earth",
      title: "Development",
      sense: "Touch",
      description:
        "Grounding every project in market truth, feasibility, context, opportunity, and risk intelligence so decisions are rooted, stable, informed, resilient, and value-driven.",
    },
    air: {
      element: "Air",
      title: "Design & Engineering",
      sense: "Hearing",
      description:
        "The built environment is perceived through five senses, five faculties, each grasping one part of the whole. ARCEL is the sixth, the mind that coordinates them.",
    },
    fire: {
      element: "Fire",
      title: "Construction",
      sense: "Sight",
      description:
        "Powering execution on site with real-time insight, workflows, and resources that turn plans into safe, controlled, coordinated, accountable, precise, efficient action instead of chaos.",
    },
    water: {
      element: "Water",
      title: "Operations",
      sense: "Taste",
      description:
        "Sustaining assets over time by flowing intelligence through operations, maintenance, and performance so buildings stay alive, efficient, and responsive.",
    },
    ether: {
      element: "Ether",
      title: "Practice",
      sense: "Smell",
      description:
        "Expanding the practice of AEC itself—careers, firms, methods, and culture—by sharing frameworks, language, and pathways across the ecosystem.",
    },
  },
  hi: {
    earth: {
      element: "पृथ्वी",
      title: "विकास",
      sense: "स्पर्श",
      description:
        "हर परियोजना को बाज़ार की सच्चाई, व्यवहार्यता, संदर्भ, अवसर और जोखिम संबंधी बुद्धिमत्ता में आधार देकर निर्णयों को जड़ित, स्थिर, सूचित, लचीला और मूल्य-आधारित बनाना।",
    },
    air: {
      element: "वायु",
      title: "डिज़ाइन और इंजीनियरिंग",
      sense: "श्रवण",
      description:
        "निर्मित पर्यावरण को पाँच इंद्रियों, पाँच क्षमताओं के माध्यम से महसूस किया जाता है, जिनमें से हर एक संपूर्ण का केवल एक भाग समझती है। ARCEL छठी शक्ति है, वह बुद्धि जो इन्हें समन्वित करती है।",
    },
    fire: {
      element: "अग्नि",
      title: "निर्माण",
      sense: "दृष्टि",
      description:
        "साइट पर रियल-टाइम अंतर्दृष्टि, वर्कफ़्लो और संसाधनों के साथ निष्पादन को शक्ति देना, ताकि योजनाएँ अव्यवस्था के बजाय सुरक्षित, नियंत्रित, समन्वित, जवाबदेह, सटीक और कुशल कार्रवाई में बदलें।",
    },
    water: {
      element: "जल",
      title: "संचालन",
      sense: "स्वाद",
      description:
        "समय के साथ परिसंपत्तियों को बनाए रखते हुए संचालन, रखरखाव और प्रदर्शन के माध्यम से बुद्धिमत्ता का प्रवाह करना, ताकि भवन जीवंत, कुशल और उत्तरदायी बने रहें।",
    },
    ether: {
      element: "ईथर",
      title: "प्रैक्टिस",
      sense: "गंध",
      description:
        "पूरे AEC अभ्यास का विस्तार करना—करियर, फर्म, पद्धतियाँ और संस्कृति—ताकि पूरे पारिस्थितिकी तंत्र में फ़्रेमवर्क, भाषा और मार्ग साझा किए जा सकें।",
    },
  },
  ar: {
    earth: {
      element: "الأرض",
      title: "التطوير",
      sense: "اللمس",
      description:
        "ترسيخ كل مشروع في حقيقة السوق والجدوى والسياق والفرص وذكاء المخاطر، بحيث تكون القرارات راسخة ومستقرة ومستنيرة ومرنة وقائمة على القيمة.",
    },
    air: {
      element: "الهواء",
      title: "التصميم والهندسة",
      sense: "السمع",
      description:
        "تُدرَك البيئة المبنية عبر خمس حواس وخمس قدرات، تمسك كل واحدة منها بجزء من الكل. ARCEL هي الحاسة السادسة، العقل الذي ينسق بينها جميعاً.",
    },
    fire: {
      element: "النار",
      title: "الإنشاء",
      sense: "البصر",
      description:
        "تمكين التنفيذ في الموقع عبر الرؤى اللحظية وسير العمل والموارد التي تحول الخطط إلى عمل آمن ومنضبط ومنسق وخاضع للمساءلة ودقيق وفعّال بدلاً من الفوضى.",
    },
    water: {
      element: "الماء",
      title: "العمليات",
      sense: "التذوق",
      description:
        "استدامة الأصول عبر الزمن من خلال تدفق الذكاء في العمليات والصيانة والأداء، حتى تبقى المباني حية وفعالة وسريعة الاستجابة.",
    },
    ether: {
      element: "الأثير",
      title: "الممارسة",
      sense: "الشم",
      description:
        "توسيع ممارسة AEC نفسها، من الوظائف والشركات إلى الأساليب والثقافة، عبر مشاركة الأطر واللغة والمسارات على امتداد المنظومة.",
    },
  },
  es: {
    earth: {
      element: "Tierra",
      title: "Desarrollo",
      sense: "Tacto",
      description:
        "Anclar cada proyecto en la verdad del mercado, la viabilidad, el contexto, la oportunidad y la inteligencia de riesgo para que las decisiones sean firmes, estables, informadas, resilientes y guiadas por el valor.",
    },
    air: {
      element: "Aire",
      title: "Diseño e Ingeniería",
      sense: "Oído",
      description:
        "El entorno construido se percibe a través de cinco sentidos, cinco facultades, y cada una capta solo una parte del todo. ARCEL es la sexta, la mente que las coordina.",
    },
    fire: {
      element: "Fuego",
      title: "Construcción",
      sense: "Vista",
      description:
        "Impulsar la ejecución en obra con información en tiempo real, flujos de trabajo y recursos que conviertan los planes en una acción segura, controlada, coordinada, responsable, precisa y eficiente en lugar de caos.",
    },
    water: {
      element: "Agua",
      title: "Operaciones",
      sense: "Gusto",
      description:
        "Sostener los activos a lo largo del tiempo haciendo fluir inteligencia a través de operaciones, mantenimiento y desempeño para que los edificios sigan vivos, eficientes y receptivos.",
    },
    ether: {
      element: "Éter",
      title: "Práctica",
      sense: "Olfato",
      description:
        "Expandir la práctica misma de la AEC —carreras, firmas, métodos y cultura— compartiendo marcos, lenguaje y caminos en todo el ecosistema.",
    },
  },
};

export function getSenses(language = "en") {
  const copy = senseCopy[language] ?? senseCopy.en;
  return senseAssets.map((sense) => ({
    ...sense,
    ...copy[sense.key],
  }));
}

const finaleCopy = {
  en: {
    key: "intelligence",
    title: "ARCEL Intelligence",
    label: "THE SIX SENSES",
    description:
      "The built environment is perceived through five senses, five faculties, each grasping one part of the whole. ARCEL is the sixth, the mind that coordinates them.",
    bg: intelligenceBg,
  },
  hi: {
    key: "intelligence",
    title: "ARCEL Intelligence",
    label: "छठी इंद्रिय",
    description:
      "निर्मित पर्यावरण को पाँच इंद्रियों, पाँच क्षमताओं के माध्यम से महसूस किया जाता है, जिनमें से हर एक संपूर्ण का केवल एक भाग समझती है। ARCEL छठी शक्ति है, वह बुद्धि जो इन्हें समन्वित करती है।",
    bg: intelligenceBg,
  },
  ar: {
    key: "intelligence",
    title: "ARCEL Intelligence",
    label: "الحواس الست",
    description:
      "تُدرَك البيئة المبنية عبر خمس حواس وخمس قدرات، تمسك كل واحدة منها بجزء من الكل. ARCEL هي الحاسة السادسة، العقل الذي ينسق بينها جميعاً.",
    bg: intelligenceBg,
  },
  es: {
    key: "intelligence",
    title: "ARCEL Intelligence",
    label: "LOS SEIS SENTIDOS",
    description:
      "El entorno construido se percibe a través de cinco sentidos, cinco facultades, y cada una capta solo una parte del todo. ARCEL es la sexta, la mente que las coordina.",
    bg: intelligenceBg,
  },
};

export function getFinale(language = "en") {
  return finaleCopy[language] ?? finaleCopy.en;
}

export const senses = getSenses("en");
