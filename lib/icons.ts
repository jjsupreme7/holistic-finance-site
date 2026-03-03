import {
  Users,
  TrendingUp,
  Heart,
  GraduationCap,
  ClipboardList,
  CircleCheckBig,
  UserCheck,
  Trophy,
  Shield,
  ScrollText,
  Home,
  DollarSign,
  Calendar,
  Star,
  ShoppingCart,
  Wallet,
  BarChart3,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Video,
  Clock,
  BookOpen,
  Coffee,
  Notebook,
  Shirt,
  Flame,
  Backpack,
  Bell,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // Pillars
  family: Users,
  finance: TrendingUp,
  health: Heart,

  // Credentials
  experience: GraduationCap,
  licensed: ClipboardList,
  certified: CircleCheckBig,
  "family-first": UserCheck,
  partner: UserCheck,
  "wa-licensed": ClipboardList,
  hipaa: Shield,

  // Services
  retirement: Trophy,
  education: GraduationCap,
  "financial-services": BarChart3,
  "family-planning": Users,
  insurance: Shield,
  estate: ScrollText,
  mortgage: Home,
  "life-insurance": Heart,
  "health-insurance": Stethoscope,

  // Stats
  "families-served": Users,
  years: Calendar,
  savings: DollarSign,
  satisfaction: Star,

  // Coming Soon
  courses: BookOpen,
  shop: ShoppingCart,

  // Contact
  phone: Phone,
  email: Mail,
  office: MapPin,
  zoom: Video,
  hours: Clock,

  // Courses
  budgeting: Wallet,

  // Products
  tshirt: Shirt,
  mug: Coffee,
  journal: Notebook,
  hoodie: Shirt,
  candle: Flame,
  tote: Backpack,

  // Misc
  bell: Bell,
};

export type IconName = keyof typeof ICON_MAP;
