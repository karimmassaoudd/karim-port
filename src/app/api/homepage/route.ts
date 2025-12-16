import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HomePage from '@/models/HomePage';

// GET - Fetch homepage content
export async function GET() {
  try {
    await dbConnect();
    
    let homePage = await HomePage.findOne();
    
    // Default footer data
    const defaultFooter = {
      ownerName: 'Karim Massaoud',
      ownerTitle: 'Web Developer',
      ownerInitial: 'K',
      ownerAvatarUrl: '',
      email: 'karimmassoud668@gmail.com',
      phone: '0616537940',
      location: '',
      copyrightText: '© 2024 Portfolio Admin',
      socialLinks: [
        { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', isVisible: true },
        { id: 2, platform: 'GitHub', url: 'https://github.com', icon: 'github', isVisible: true },
      ],
    };
    
    // If no data exists, create default data
    if (!homePage) {
      homePage = await HomePage.create({
        hero: {
          mainTitle: 'PORTFOLIO',
          subtitle: 'KARIM MASSAOUD',
          primaryButtonText: 'VIEW PROJECTS',
          primaryButtonLink: '#projects',
          secondaryButtonText: 'GET IN TOUCH',
          secondaryButtonLink: '#contact',
        },
        bio: {
          bioText: "I'm Karim Massaoud, a media and design student focused on front-end development. I create clean, responsive, and visually engaging digital experiences that combine creativity with functionality.",
          maxWords: 35,
        },
        about: {
          sectionLabel: 'About',
          heading: 'CREATIVE DEVELOPMENT',
          mainText: "I'm Karim Massaoud, a media and design student with a strong focus on front-end development. I enjoy creating clean, responsive, and visually engaging digital experiences that combine creativity with functionality. <br />My goal is to grow into a professional front-end developer, turning ideas into impactful designs that connect with people. <br />",
          phoneNumber: '0616537940',
          email: 'karimmassoud668@gmail.com',
          linkedinUrl: 'https://linkedin.com/in/your-profile',
          profileCardName: 'Karim Massoud',
          profileCardTitle: 'Creative Developer',
          profileCardHandle: 'karimmassaoud',
          profileCardAvatarUrl: '/assets/image 4.png',
        },
        userExperience: {
          sectionLabel: 'User Experience',
          heading: 'THE HUMAN SIDE OF DIGITAL DESIGN',
          items: [
            {
              id: 1,
              title: 'Understanding Users',
              description: 'Discover what truly matters to users through empathy and observation.',
              fullDescription: 'Plan and conduct interviews, gather meaningful insights, and synthesize findings to uncover real user needs. By understanding motivations and pain points, we guide design decisions that result in intuitive and impactful digital experiences.',
            },
            {
              id: 2,
              title: 'User research & interviews',
              description: 'Turn raw data into actionable design insights.',
              fullDescription: 'Analyze user feedback, patterns, and behaviors to identify opportunities for improvement. Research findings become the foundation for design choices that enhance usability, clarity, and engagement.',
            },
            {
              id: 3,
              title: 'Prototyping & Testing',
              description: 'Transform ideas into tangible experiences.',
              fullDescription: 'Build interactive prototypes to visualize concepts and gather user feedback early. Testing and iteration ensure designs are functional, accessible, and aligned with user expectations.',
            },
            {
              id: 4,
              title: 'Delivering Meaningful Design',
              description: 'Create designs that connect with people.',
              fullDescription: 'Apply human-centered principles to craft experiences that not only look good but also solve real problems. Every design decision is driven by empathy, usability, and measurable value..',
            },
          ],
        },
        footer: defaultFooter,
      });
    } else if (!homePage.footer || !homePage.footer.ownerName) {
      // If document exists but has no footer or footer is incomplete, add it
      homePage = await HomePage.findOneAndUpdate(
        {},
        { $set: { footer: defaultFooter } },
        { new: true }
      );
    }
    
    return NextResponse.json({ success: true, data: homePage });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

// PUT - Update homepage content
export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    let homePage = await HomePage.findOne();
    
    if (!homePage) {
      // Create new if doesn't exist
      homePage = await HomePage.create(body);
    } else {
      // Update existing - use $set to merge data properly
      homePage = await HomePage.findOneAndUpdate(
        {},
        { $set: body },
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({ success: true, data: homePage });
  } catch (error) {
    console.error('Error updating homepage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}
