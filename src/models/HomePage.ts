import { model, models, Schema } from "mongoose";

export interface IExperienceItem {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
}

// Reference to Project model instead of embedding full data
export interface IProjectReference {
  projectId: string; // MongoDB ObjectId as string
  order: number; // Display order on homepage
  isVisible: boolean;
}

export interface IHeroSection {
  mainTitle: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface IAboutSection {
  sectionLabel: string;
  heading: string;
  mainText: string;
  phoneNumber: string;
  email: string;
  linkedinUrl: string;
  profileCardName: string;
  profileCardTitle: string;
  profileCardHandle: string;
  profileCardAvatarUrl: string;
}

export interface IBioSection {
  bioText: string;
  maxWords: number;
}

export interface IUserExperienceSection {
  sectionLabel: string;
  heading: string;
  items: IExperienceItem[];
}

export interface ISocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
}

export interface IFooterSection {
  ownerName: string;
  ownerTitle: string;
  ownerInitial: string;
  ownerAvatarUrl: string;
  email: string;
  phone: string;
  location: string;
  copyrightText: string;
  socialLinks: ISocialLink[];
}

export interface IHomePage {
  hero: IHeroSection;
  bio: IBioSection;
  about: IAboutSection;
  userExperience: IUserExperienceSection;
  featuredProjects: IProjectReference[]; // Changed from projects array
  footer: IFooterSection;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceItemSchema = new Schema<IExperienceItem>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
});

const ProjectReferenceSchema = new Schema<IProjectReference>({
  projectId: { type: Schema.Types.ObjectId as any, required: true, ref: "Project" },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
});

const HeroSectionSchema = new Schema<IHeroSection>({
  mainTitle: { type: String, required: true, default: "PORTFOLIO" },
  subtitle: { type: String, required: true, default: "KARIM MASSAOUD" },
  primaryButtonText: { type: String, required: true, default: "VIEW PROJECTS" },
  primaryButtonLink: { type: String, required: true, default: "#projects" },
  secondaryButtonText: {
    type: String,
    required: true,
    default: "GET IN TOUCH",
  },
  secondaryButtonLink: { type: String, required: true, default: "#contact" },
});

const BioSectionSchema = new Schema<IBioSection>({
  bioText: {
    type: String,
    required: true,
    default:
      "I'm Karim Massaoud, a media and design student focused on front-end development. I create clean, responsive, and visually engaging digital experiences that combine creativity with functionality.",
  },
  maxWords: { type: Number, required: true, default: 35 },
});

const AboutSectionSchema = new Schema<IAboutSection>({
  sectionLabel: { type: String, required: true, default: "About" },
  heading: { type: String, required: true, default: "CREATIVE DEVELOPMENT" },
  mainText: {
    type: String,
    required: true,
    default:
      "I'm Karim Massaoud, a media and design student with a strong focus on front-end development. I enjoy creating clean, responsive, and visually engaging digital experiences that combine creativity with functionality. <br />My goal is to grow into a professional front-end developer, turning ideas into impactful designs that connect with people. <br />",
  },
  phoneNumber: { type: String, required: true, default: "0616537940" },
  email: { type: String, required: true, default: "karimmassoud668@gmail.com" },
  linkedinUrl: {
    type: String,
    required: true,
    default: "https://linkedin.com/in/your-profile",
  },
  profileCardName: { type: String, required: true, default: "Karim Massoud" },
  profileCardTitle: {
    type: String,
    required: true,
    default: "Creative Developer",
  },
  profileCardHandle: { type: String, required: true, default: "karimmassaoud" },
  profileCardAvatarUrl: {
    type: String,
    required: true,
    default: "/assets/image 4.png",
  },
});

const UserExperienceSectionSchema = new Schema<IUserExperienceSection>({
  sectionLabel: { type: String, required: true, default: "User Experience" },
  heading: {
    type: String,
    required: true,
    default: "THE HUMAN SIDE OF DIGITAL DESIGN",
  },
  items: { type: [ExperienceItemSchema], required: true },
});

const SocialLinkSchema = new Schema<ISocialLink>({
  id: { type: Number, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
});

const FooterSectionSchema = new Schema<IFooterSection>({
  ownerName: { type: String, required: true, default: "Karim Massaoud" },
  ownerTitle: { type: String, required: true, default: "Web Developer" },
  ownerInitial: { type: String, required: true, default: "K" },
  ownerAvatarUrl: { type: String, default: "" },
  email: { type: String, required: true, default: "contact@example.com" },
  phone: { type: String, required: true, default: "+1234567890" },
  location: { type: String, default: "" },
  copyrightText: {
    type: String,
    required: true,
    default: "© 2024 Portfolio Admin",
  },
  socialLinks: {
    type: [SocialLinkSchema],
    default: [
      {
        id: 1,
        platform: "LinkedIn",
        url: "https://linkedin.com",
        icon: "linkedin",
        isVisible: true,
      },
      {
        id: 2,
        platform: "GitHub",
        url: "https://github.com",
        icon: "github",
        isVisible: true,
      },
    ],
  },
});

const HomePageSchema = new Schema<IHomePage>(
  {
    hero: { type: HeroSectionSchema, required: true },
    bio: { type: BioSectionSchema, required: true },
    about: { type: AboutSectionSchema, required: true },
    userExperience: { type: UserExperienceSectionSchema, required: true },
    featuredProjects: { type: [ProjectReferenceSchema], default: [] },
    footer: { type: FooterSectionSchema, required: true },
  },
  {
    timestamps: true,
  },
);

const HomePage =
  models.HomePage || model<IHomePage>("HomePage", HomePageSchema);

export default HomePage;
