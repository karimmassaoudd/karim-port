import { model, models, Schema } from "mongoose";

// Image interface for sections that support multiple images
export interface IProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

// Hero Section
export interface IHeroSection {
  enabled: boolean;
  title: string;
  tagline: string;
  heroImage: IProjectImage;
  category: string;
}

// Project Overview Section
export interface IProjectOverviewSection {
  enabled: boolean;
  role?: string;
  type?: string;
  highlights?: string[];
  image?: IProjectImage;
  // Legacy fields (keeping for backward compatibility)
  client?: string;
  timeline?: string;
  team?: string;
  description?: string;
  keyFeatures?: string[];
  overviewImage?: IProjectImage;
  subsections?: {
    title: string;
    content: string;
    image?: IProjectImage;
  }[];
}

// Problem Statement Section
export interface IProblemStatementSection {
  enabled: boolean;
  heading: string;
  description: string;
  challenges: string[];
  targetAudience?: string;
  images?: IProjectImage[];
}

// Solutions Section
export interface ISolutionsSection {
  enabled: boolean;
  heading: string;
  description: string;
  solutions: {
    title: string;
    description: string;
    icon?: string;
  }[];
  images?: IProjectImage[];
}

// Branding Section
export interface IBrandingSection {
  enabled: boolean;
  heading: string;
  description: string;
  colorPalette?: {
    primary?: string;
    secondary?: string;
  };
  typography?: {
    primary: string;
    secondary: string;
  };
  logo?: IProjectImage;
  brandImages?: IProjectImage[];
}

// Wireframes Section
export interface IWireframesSection {
  enabled: boolean;
  heading: string;
  description: string;
  wireframes: IProjectImage[];
}

// UI/UX Design Section
export interface IUIUXDesignSection {
  enabled: boolean;
  heading: string;
  description: string;
  designPrinciples?: string[];
  mockups: IProjectImage[];
  designNotes?: string;
}

// Development Process Section
export interface IDevelopmentProcessSection {
  enabled: boolean;
  heading: string;
  description: string;
  methodology?: string;
  technicalChallenges?: string[];
  codeSnippets?: {
    language: string;
    code: string;
    description: string;
  }[];
  images?: IProjectImage[];
}

// Final Website Preview Section
export interface IWebsitePreviewSection {
  enabled: boolean;
  heading: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  screenshots: IProjectImage[];
  videoUrl?: string;
}

// Results & Impact Section
export interface IResultsImpactSection {
  enabled: boolean;
  heading: string;
  description: string;
  metrics?: {
    label: string;
    value: string;
    description?: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }[];
  images?: IProjectImage[];
}

// Conclusion Section
export interface IConclusionSection {
  enabled: boolean;
  heading: string;
  description: string;
  lessonsLearned?: string[];
  futureImprovements?: string[];
}

// Call to Action Section
export interface ICallToActionSection {
  enabled: boolean;
  heading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

// Hover Exploration Section (Travel World style)
export interface IHoverExplorationSection {
  enabled: boolean;
  heading: string;
  description?: string;
  tiles: {
    title: string;
    subtitle: string;
    image: IProjectImage;
  }[];
}

// Quote/Process Section (Travel World "Supporting band with quote + cards")
export interface IQuoteProcessSection {
  enabled: boolean;
  quote: string;
  processCards: {
    title: string;
    icon?: string;
    items: string[];
  }[];
  images?: IProjectImage[];
}

// Themes Section (Carousel/Slider)
export interface IThemesSection {
  enabled: boolean;
  heading: string;
  description?: string;
  themes: {
    title: string;
    images: IProjectImage[]; // Array of images with full metadata
  }[];
}

// Special Offers Section (Pricing/Offers)
export interface ISpecialOffersSection {
  enabled: boolean;
  heading: string;
  description?: string;
  offers: {
    title?: string;
    subtitle?: string;
    description?: string;
    originalPrice?: string;
    discountedPrice?: string;
    discountBadge?: string;
    buttonText?: string;
    buttonLink?: string;
  }[];
}

// Main Project Interface
export interface IProject {
  // Basic Info
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: IProjectImage;
  technologies: string[];
  status: "draft" | "published";
  featured: boolean;
  order: number;

  // Case Study Sections
  sections: {
    hero: IHeroSection;
    overview: IProjectOverviewSection;
    hoverExploration: IHoverExplorationSection;
    problemStatement: IProblemStatementSection;
    solutions: ISolutionsSection;
    quoteProcess: IQuoteProcessSection;
    branding: IBrandingSection;
    wireframes: IWireframesSection;
    uiuxDesign: IUIUXDesignSection;
    themes: IThemesSection;
    developmentProcess: IDevelopmentProcessSection;
    specialOffers: ISpecialOffersSection;
    websitePreview: IWebsitePreviewSection;
    resultsImpact: IResultsImpactSection;
    conclusion: IConclusionSection;
    callToAction: ICallToActionSection;
  };

  // Section Order (custom ordering of sections)
  sectionOrder?: string[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const ProjectImageSchema = new Schema<IProjectImage>({
  url: { type: String, required: false },
  alt: { type: String, required: false },
  caption: { type: String },
});

const HeroSectionSchema = new Schema<IHeroSection>({
  enabled: { type: Boolean, default: true },
  title: { type: String, required: false },
  tagline: { type: String, required: false },
  heroImage: { type: ProjectImageSchema, required: false },
  category: { type: String, required: false },
});

const ProjectOverviewSectionSchema = new Schema<IProjectOverviewSection>({
  enabled: { type: Boolean, default: true },
  role: { type: String },
  type: { type: String, default: undefined },  // 'type' is reserved in Mongoose, must be explicit
  highlights: { type: [String], default: [] },
  image: ProjectImageSchema,  // Embedded subdocument
  // Legacy fields
  client: { type: String },
  timeline: { type: String },
  team: { type: String },
  description: { type: String, required: false },
  keyFeatures: { type: [String], default: [] },
  overviewImage: ProjectImageSchema,  // Embedded subdocument
  subsections: [
    {
      title: { type: String },
      content: { type: String },
      image: ProjectImageSchema,
    },
  ],
}, { strict: false });

const ProblemStatementSectionSchema = new Schema<IProblemStatementSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "The Challenge" },
  description: { type: String },
  challenges: { type: [String], default: [] },
  targetAudience: { type: String },
  images: { type: [ProjectImageSchema], default: [] },
});

const SolutionsSectionSchema = new Schema<ISolutionsSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "The Solutions" },
  description: { type: String },
  solutions: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String },
    },
  ],
  images: { type: [ProjectImageSchema], default: [] },
});

const BrandingSectionSchema = new Schema<IBrandingSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Branding & Visual Direction" },
  description: { type: String },
  colorPalette: {
    primary: { type: String },
    secondary: { type: String },
  },
  typography: {
    primary: { type: String },
    secondary: { type: String },
  },
  logo: { type: ProjectImageSchema },
  brandImages: { type: [ProjectImageSchema], default: [] },
});

const WireframesSectionSchema = new Schema<IWireframesSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Wireframes" },
  description: { type: String },
  wireframes: { type: [ProjectImageSchema], default: [] },
});

const UIUXDesignSectionSchema = new Schema<IUIUXDesignSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "UI/UX Design" },
  description: { type: String },
  designPrinciples: { type: [String], default: [] },
  mockups: { type: [ProjectImageSchema], default: [] },
  designNotes: { type: String },
});

const DevelopmentProcessSectionSchema = new Schema<IDevelopmentProcessSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Development Process" },
  description: { type: String },
  methodology: { type: String },
  technicalChallenges: { type: [String], default: [] },
  codeSnippets: [
    {
      language: { type: String },
      code: { type: String },
      description: { type: String },
    },
  ],
  images: { type: [ProjectImageSchema], default: [] },
});

const WebsitePreviewSectionSchema = new Schema<IWebsitePreviewSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Final Website" },
  description: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String },
  screenshots: { type: [ProjectImageSchema], default: [] },
  videoUrl: { type: String },
});

const ResultsImpactSectionSchema = new Schema<IResultsImpactSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Results & Impact" },
  description: { type: String },
  metrics: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
      description: { type: String },
    },
  ],
  testimonials: [
    {
      quote: { type: String, required: true },
      author: { type: String, required: true },
      role: { type: String, required: true },
      avatar: { type: String },
    },
  ],
  images: { type: [ProjectImageSchema], default: [] },
});

const ConclusionSectionSchema = new Schema<IConclusionSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Conclusion" },
  description: { type: String },
  lessonsLearned: { type: [String], default: [] },
  futureImprovements: { type: [String], default: [] },
});

const CallToActionSectionSchema = new Schema<ICallToActionSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Let's Work Together" },
  description: { type: String },
  primaryButtonText: { type: String, default: "Contact Me" },
  primaryButtonLink: { type: String, default: "/contact" },
  secondaryButtonText: { type: String },
  secondaryButtonLink: { type: String },
});

const HoverExplorationSectionSchema = new Schema<IHoverExplorationSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Explore by hovering" },
  description: { type: String },
  tiles: [
    {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: { type: ProjectImageSchema, required: true },
    },
  ],
});

const QuoteProcessSectionSchema = new Schema<IQuoteProcessSection>({
  enabled: { type: Boolean, default: false },
  quote: { type: String },
  processCards: [
    {
      title: { type: String, required: true },
      icon: { type: String },
      items: { type: [String], default: [] },
    },
  ],
  images: { type: [ProjectImageSchema], default: [] },
});

const ThemesSectionSchema = new Schema<IThemesSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Themes" },
  description: { type: String },
  themes: [
    {
      title: { type: String, required: true },
      images: { type: [ProjectImageSchema], default: [] },
    },
  ],
});

const SpecialOffersSectionSchema = new Schema<ISpecialOffersSection>({
  enabled: { type: Boolean, default: false },
  heading: { type: String, default: "Special Offers" },
  description: { type: String },
  offers: [
    {
      title: { type: String },
      subtitle: { type: String },
      description: { type: String },
      originalPrice: { type: String },
      discountedPrice: { type: String },
      discountBadge: { type: String },
      buttonText: { type: String, default: "Book Now" },
      buttonLink: { type: String },
    },
  ],
});

// Main Project Schema
const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    thumbnail: { type: ProjectImageSchema, required: false },
    technologies: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    sections: {
      hero: { type: HeroSectionSchema, required: true },
      overview: { type: ProjectOverviewSectionSchema, required: true },
      hoverExploration: { type: HoverExplorationSectionSchema },
      problemStatement: { type: ProblemStatementSectionSchema },
      solutions: { type: SolutionsSectionSchema },
      quoteProcess: { type: QuoteProcessSectionSchema },
      branding: { type: BrandingSectionSchema },
      wireframes: { type: WireframesSectionSchema },
      uiuxDesign: { type: UIUXDesignSectionSchema },
      themes: { type: ThemesSectionSchema },
      developmentProcess: { type: DevelopmentProcessSectionSchema },
      specialOffers: { type: SpecialOffersSectionSchema },
      websitePreview: { type: WebsitePreviewSectionSchema },
      resultsImpact: { type: ResultsImpactSectionSchema },
      conclusion: { type: ConclusionSectionSchema },
      callToAction: { type: CallToActionSectionSchema },
    },

    // Custom section order
    sectionOrder: {
      type: [String],
      default: [
        "hero",
        "hoverExploration",
        "overview",
        "quoteProcess",
        "problemStatement",
        "solutions",
        "themes",
        "branding",
        "wireframes",
        "uiuxDesign",
        "specialOffers",
        "developmentProcess",
        "websitePreview",
        "resultsImpact",
        "conclusion",
        "callToAction",
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to clean up empty image objects
ProjectSchema.pre("save", function () {
  // Clean up logo if it's empty
  if (
    this.sections?.branding?.logo &&
    (!this.sections.branding.logo.url || this.sections.branding.logo.url === "")
  ) {
    this.sections.branding.logo = undefined as any;
  }

  // Clean up heroImage if it's empty
  if (
    this.sections?.hero?.heroImage &&
    (!this.sections.hero.heroImage.url ||
      this.sections.hero.heroImage.url === "")
  ) {
    this.sections.hero.heroImage = undefined as any;
  }

  // Clean up thumbnail if it's empty
  if (this.thumbnail && (!this.thumbnail.url || this.thumbnail.url === "")) {
    this.thumbnail = undefined as any;
  }
});

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
