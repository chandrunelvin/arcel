import earthIcon from "../assets/icons/earth.svg";
import airIcon from "../assets/icons/air.svg";
import fireIcon from "../assets/icons/fire.svg";
import waterIcon from "../assets/icons/water.svg";
import etherIcon from "../assets/icons/ether.svg";

// Center logo/artwork shown in the gallery + detail views for each sense.
// Placeholders for now — swap the files in src/assets/images/senses/
// (keep the same filenames below) with the real per-category artwork and
// it'll update here automatically.
import earthCenterImage from "../assets/images/senses/development-center-logo.png";
import airCenterImage from "../assets/images/senses/design-center-logo.png";
import fireCenterImage from "../assets/images/senses/construction-center-logo.png";
import waterCenterImage from "../assets/images/senses/operations-center-logo.png";
import etherCenterImage from "../assets/images/senses/practice-center-logo.png";

// Background photo per section, named after its title (same convention as
// the center-logo files above). Swap the files in src/assets/images/senses/
// (same filenames) with the real per-category photography to update here.
import earthBg from "../assets/images/senses/development-bg-image.webp";
import airBg from "../assets/images/senses/design-bg-image.webp";
import fireBg from "../assets/images/senses/construction-bg-image.webp";
import waterBg from "../assets/images/senses/operation-bg-image.webp";
import etherBg from "../assets/images/senses/practice-bg-image.webp";

export const senses = [
  {
    key: "earth",
    element: "Earth",
    title: "Development",
    sense: "Touch",
    icon: earthIcon,
    centerImage: earthCenterImage,
    bg: earthBg,
    accent: "#f5c400",
    description:
      "Grounding every project in market truth, feasibility, context, opportunity, and risk intelligence so decisions are rooted, stable, informed, resilient, and value-driven.",
  },
  {
    key: "air",
    element: "Air",
    title: "Design & Engineering",
    sense: "Hearing",
    icon: airIcon,
    centerImage: airCenterImage,
    bg: airBg,
    accent: "#8b5cf6",
    description:
      "The built environment is perceived through five senses, five faculties, each grasping one part of the whole. ARCEL is the sixth, the mind that coordinates them.",
  },
  {
    key: "fire",
    element: "Fire",
    title: "Construction",
    sense: "Sight",
    icon: fireIcon,
    centerImage: fireCenterImage,
    bg: fireBg,
    accent: "#ef4444",
    description:
      "Powering execution on site with real-time insight, workflows, and resources that turn plans into safe, controlled, coordinated, accountable, precise, efficient action instead of chaos.",
  },
  {
    key: "water",
    element: "Water",
    title: "Operations",
    sense: "Taste",
    icon: waterIcon,
    centerImage: waterCenterImage,
    bg: waterBg,
    accent: "#22d3ee",
    description:
      "Sustaining assets over time by flowing intelligence through operations, maintenance, and performance so buildings stay alive, efficient, and responsive.",
  },
  {
    key: "ether",
    element: "Ether",
    title: "Practice",
    sense: "Smell",
    icon: etherIcon,
    centerImage: etherCenterImage,
    bg: etherBg,
    accent: "#7ae3a9",
    description:
      "Expanding the practice of AEC itself—careers, firms, methods, and culture—by sharing frameworks, language, and pathways across the ecosystem.",
  },
];
