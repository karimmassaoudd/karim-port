'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { 
  MdSave, MdArrowBack, MdImage, MdDelete, MdAdd, 
  MdHome, MdInfo, MdWarning, MdLightbulb, MdPalette,
  MdDraw, MdDesignServices, MdCode, MdPreview,
  MdTrendingUp, MdCheckCircle, MdPhone
} from 'react-icons/md';

const Toast = dynamic(() => import('@/components/Toast'), { ssr: false });

interface ProjectEditorProps {
  params: Promise<{ id: string }>;
}

// Navigation Item Component
function NavItem({ 
  icon, 
  label, 
  isActive, 
  isEnabled, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  isEnabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white shadow-lg shadow-[var(--accent)]/20 scale-[1.02]'
          : 'text-[var(--text)] hover:bg-[var(--surface)]/50 hover:shadow-md hover:scale-[1.01] hover:border-[var(--border)]'
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
      )}
      <span className={`relative z-10 transition-transform duration-200 ${isActive ? 'text-white scale-110' : 'text-[var(--accent)] group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className={`relative z-10 flex-1 text-sm font-semibold transition-all ${isActive ? 'text-white' : 'text-[var(--text)]'}`}>
        {label}
      </span>
      {isEnabled !== undefined && (
        <span className={`relative z-10 w-2 h-2 rounded-full transition-all ${
          isEnabled 
            ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' 
            : 'bg-gray-500/50'
        }`} />
      )}
    </button>
  );
}

export default function ProjectEditor({ params }: ProjectEditorProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    thumbnail: { url: '', alt: '' },
    technologies: [] as string[],
    status: 'draft' as 'draft' | 'published',
    featured: false,
    order: 0,
    sections: {
      hero: {
        enabled: true,
        title: '',
        tagline: '',
        heroImage: { url: '', alt: '', caption: '' },
        category: 'Web Development',
      },
      overview: {
        enabled: true,
        client: '',
        timeline: '',
        role: '',
        team: '',
        description: '',
        keyFeatures: [] as string[],
      },
      problemStatement: {
        enabled: false,
        heading: 'The Challenge',
        description: '',
        challenges: [] as string[],
        targetAudience: '',
        images: [] as any[],
      },
      solutions: {
        enabled: false,
        heading: 'The Solutions',
        description: '',
        solutions: [] as any[],
        images: [] as any[],
      },
      branding: {
        enabled: false,
        heading: 'Branding & Visual Direction',
        description: '',
        colorPalette: { primary: '', secondary: '' },
        typography: { primary: '', secondary: '' },
        logo: { url: '', alt: '', caption: '' },
        brandImages: [] as any[],
      },
      wireframes: {
        enabled: false,
        heading: 'Wireframes',
        description: '',
        wireframes: [] as any[],
      },
      uiuxDesign: {
        enabled: false,
        heading: 'UI/UX Design',
        description: '',
        designPrinciples: [] as string[],
        mockups: [] as any[],
        designNotes: '',
      },
      developmentProcess: {
        enabled: false,
        heading: 'Development Process',
        description: '',
        methodology: '',
        technicalChallenges: [] as string[],
        codeSnippets: [] as any[],
        images: [] as any[],
      },
      websitePreview: {
        enabled: false,
        heading: 'Final Website',
        description: '',
        liveUrl: '',
        githubUrl: '',
        screenshots: [] as any[],
        videoUrl: '',
      },
      resultsImpact: {
        enabled: false,
        heading: 'Results & Impact',
        description: '',
        metrics: [] as any[],
        testimonials: [] as any[],
        images: [] as any[],
      },
      conclusion: {
        enabled: false,
        heading: 'Conclusion',
        description: '',
        lessonsLearned: [] as string[],
        futureImprovements: [] as string[],
      },
      callToAction: {
        enabled: false,
        heading: "Let's Work Together",
        description: '',
        primaryButtonText: 'Contact Me',
        primaryButtonLink: '/contact',
        secondaryButtonText: '',
        secondaryButtonLink: '',
      },
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [resolvedParams.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects?id=${resolvedParams.id}`);
      const result = await response.json();
      if (result.success) {
        const data = result.data;
        
        // Migrate old colorPalette array to new object format
        if (data.sections?.branding?.colorPalette) {
          if (Array.isArray(data.sections.branding.colorPalette)) {
            data.sections.branding.colorPalette = { primary: '', secondary: '' };
          } else if (typeof data.sections.branding.colorPalette !== 'object') {
            data.sections.branding.colorPalette = { primary: '', secondary: '' };
          }
        }
        
        // Ensure heroImage exists
        if (!data.sections?.hero?.heroImage) {
          data.sections.hero.heroImage = { url: '', alt: '', caption: '' };
        }
        
        // Ensure logo exists
        if (!data.sections?.branding?.logo) {
          data.sections.branding.logo = { url: '', alt: '', caption: '' };
        }
        
        setFormData(data);
      } else {
        showMessage('error', 'Project not found');
        router.push('/admin/projects');
      }
    } catch (error) {
      showMessage('error', 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.shortDescription) {
      showMessage('error', 'Title and description are required');
      return;
    }

    try {
      setSaving(true);
      const method = isNew ? 'POST' : 'PUT';
      const body = isNew ? formData : { ...formData, id: resolvedParams.id };

      const response = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        showMessage('success', isNew ? 'Project created!' : 'Project updated!');
        if (isNew) {
          router.push(`/admin/projects/${result.data._id}`);
        }
      } else {
        showMessage('error', result.error || 'Failed to save project');
      }
    } catch (error) {
      showMessage('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/projects/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        // Update the appropriate field
        updateNestedField(field, { url: result.url, alt: file.name });
        showMessage('success', 'Image uploaded!');
      } else {
        showMessage('error', result.error || 'Upload failed');
      }
    } catch (error) {
      showMessage('error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateNestedField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newData;
    });
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addArrayItem = (path: string, defaultValue: any) => {
    const current = getNestedValue(path);
    updateNestedField(path, [...current, defaultValue]);
  };

  const removeArrayItem = (path: string, index: number) => {
    const current = getNestedValue(path);
    updateNestedField(path, current.filter((_: any, i: number) => i !== index));
  };

  const getNestedValue = (path: string) => {
    return path.split('.').reduce((obj, key) => obj[key], formData as any);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {message && <Toast message={message.text} type={message.type} onClose={() => setMessage(null)} />}

      {/* Vertical Sidebar Navigation */}
      <aside className="w-72 bg-gradient-to-b from-[var(--surface)] to-[var(--background)] border-r border-[var(--border)]/50 h-screen sticky top-0 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]/50 bg-[var(--surface)]/80 backdrop-blur-sm">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-200 hover:gap-3 mb-6 group"
          >
            <MdArrowBack size={20} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>
          <div className="bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-3 rounded-lg border border-[var(--accent)]/20">
            <h2 className="text-lg font-bold text-[var(--text)] truncate mb-1">
              {formData.title || 'Untitled Project'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isNew ? 'bg-blue-400' : 'bg-green-400'} animate-pulse`}></span>
              {isNew ? 'Creating new project' : 'Editing project'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <div className="space-y-2">
            <NavItem
              icon={<MdInfo size={18} />}
              label="Basic Info"
              isActive={activeTab === 'basic'}
              onClick={() => setActiveTab('basic')}
            />
            <div className="pt-4 pb-2 px-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent"></div>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  Case Study
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-[var(--border)] to-transparent"></div>
              </div>
            </div>
            <NavItem
              icon={<MdHome size={18} />}
              label="Hero"
              isActive={activeTab === 'hero'}
              isEnabled={formData.sections.hero.enabled}
              onClick={() => setActiveTab('hero')}
            />
            <NavItem
              icon={<MdInfo size={18} />}
              label="Overview"
              isActive={activeTab === 'overview'}
              isEnabled={formData.sections.overview.enabled}
              onClick={() => setActiveTab('overview')}
            />
            <NavItem
              icon={<MdWarning size={18} />}
              label="Problem"
              isActive={activeTab === 'problem'}
              isEnabled={formData.sections.problemStatement.enabled}
              onClick={() => setActiveTab('problem')}
            />
            <NavItem
              icon={<MdLightbulb size={18} />}
              label="Solutions"
              isActive={activeTab === 'solutions'}
              isEnabled={formData.sections.solutions.enabled}
              onClick={() => setActiveTab('solutions')}
            />
            <NavItem
              icon={<MdPalette size={18} />}
              label="Branding"
              isActive={activeTab === 'branding'}
              isEnabled={formData.sections.branding.enabled}
              onClick={() => setActiveTab('branding')}
            />
            <NavItem
              icon={<MdDraw size={18} />}
              label="Wireframes"
              isActive={activeTab === 'wireframes'}
              isEnabled={formData.sections.wireframes.enabled}
              onClick={() => setActiveTab('wireframes')}
            />
            <NavItem
              icon={<MdDesignServices size={18} />}
              label="UI/UX"
              isActive={activeTab === 'uiux'}
              isEnabled={formData.sections.uiuxDesign.enabled}
              onClick={() => setActiveTab('uiux')}
            />
            <NavItem
              icon={<MdCode size={18} />}
              label="Development"
              isActive={activeTab === 'development'}
              isEnabled={formData.sections.developmentProcess.enabled}
              onClick={() => setActiveTab('development')}
            />
            <NavItem
              icon={<MdPreview size={18} />}
              label="Preview"
              isActive={activeTab === 'preview'}
              isEnabled={formData.sections.websitePreview.enabled}
              onClick={() => setActiveTab('preview')}
            />
            <NavItem
              icon={<MdTrendingUp size={18} />}
              label="Results"
              isActive={activeTab === 'results'}
              isEnabled={formData.sections.resultsImpact.enabled}
              onClick={() => setActiveTab('results')}
            />
            <NavItem
              icon={<MdCheckCircle size={18} />}
              label="Conclusion"
              isActive={activeTab === 'conclusion'}
              isEnabled={formData.sections.conclusion.enabled}
              onClick={() => setActiveTab('conclusion')}
            />
            <NavItem
              icon={<MdPhone size={18} />}
              label="Call to Action"
              isActive={activeTab === 'cta'}
              isEnabled={formData.sections.callToAction.enabled}
              onClick={() => setActiveTab('cta')}
            />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)] to-[var(--surface)]/95 border-b border-[var(--border)]/50 backdrop-blur-xl shadow-lg">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-[var(--text)]">
                    {isNew ? 'Create Project' : 'Edit Project'}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    formData.status === 'published' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {formData.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-mono flex items-center gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  {formData.slug ? `/projects/${formData.slug}` : 'Set title to generate URL'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={formData.status === 'published' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateNestedField('status', formData.status === 'published' ? 'draft' : 'published')}
                className="min-w-[120px] font-medium"
              >
                {formData.status === 'published' ? '✓ Published' : '📝 Draft'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="min-w-[140px] bg-[var(--accent)] hover:bg-[var(--accent)]/90 font-medium shadow-lg"
              >
                <MdSave size={20} className="mr-2" />
                {saving ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--background)]">
          <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface)]/50 rounded-2xl border border-[var(--border)]/50 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <MdInfo size={22} className="text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text)]">Basic Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                    <span>Project Title</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, title: e.target.value }));
                      // Auto-generate slug
                      if (isNew) {
                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                        setFormData(prev => ({ ...prev, slug }));
                      }
                    }}
                    className="w-full px-5 py-3 bg-[var(--background)] border-2 border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 font-medium"
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    placeholder="my-awesome-project"
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    URL: /projects/{formData.slug || 'project-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)] h-24"
                    placeholder="Brief description for project cards and listings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Thumbnail Image
                  </label>
                  <div className="flex gap-4 items-start">
                    {formData.thumbnail.url && (
                      <img
                        src={formData.thumbnail.url}
                        alt="Thumbnail"
                        className="w-32 h-32 object-cover rounded-lg border border-[var(--border)]"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                        disabled={uploading}
                      >
                        <MdImage size={18} />
                        {uploading ? 'Uploading...' : 'Upload Thumbnail'}
                      </Button>
                      <input
                        type="text"
                        value={formData.thumbnail.alt}
                        onChange={(e) => updateNestedField('thumbnail.alt', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)] mt-2"
                        placeholder="Image alt text"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Technologies
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="tech-input"
                        className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        placeholder="React, TypeScript, etc."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                technologies: [...prev.technologies, input.value.trim()]
                              }));
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('tech-input') as HTMLInputElement;
                          if (input.value.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              technologies: [...prev.technologies, input.value.trim()]
                            }));
                            input.value = '';
                          }
                        }}
                      >
                        <MdAdd size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm flex items-center gap-2"
                        >
                          {tech}
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                technologies: prev.technologies.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[var(--text)]">Featured Project</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">Hero Section</h2>
                <button
                  onClick={() => updateNestedField('sections.hero.enabled', !formData.sections.hero.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.sections.hero.enabled
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {formData.sections.hero.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.hero.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.sections.hero.title}
                      onChange={(e) => updateNestedField('sections.hero.title', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Tagline</label>
                    <input
                      type="text"
                      value={formData.sections.hero.tagline}
                      onChange={(e) => updateNestedField('sections.hero.tagline', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.sections.hero.category}
                      onChange={(e) => updateNestedField('sections.hero.category', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Hero Image</label>
                    {formData.sections.hero.heroImage?.url && (
                      <img src={formData.sections.hero.heroImage.url} alt="Hero" className="w-full h-48 object-cover rounded-lg mb-2" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'sections.hero.heroImage')}
                      className="hidden"
                      id="hero-image"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById('hero-image')?.click()}
                      disabled={uploading}
                    >
                      <MdImage size={18} />
                      {uploading ? 'Uploading...' : 'Upload Hero Image'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overview Section Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">Project Overview</h2>
                <button
                  onClick={() => updateNestedField('sections.overview.enabled', !formData.sections.overview.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.sections.overview.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {formData.sections.overview.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.overview.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Client</label>
                      <input
                        type="text"
                        value={formData.sections.overview.client || ''}
                        onChange={(e) => updateNestedField('sections.overview.client', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Timeline</label>
                      <input
                        type="text"
                        value={formData.sections.overview.timeline || ''}
                        onChange={(e) => updateNestedField('sections.overview.timeline', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Role</label>
                      <input
                        type="text"
                        value={formData.sections.overview.role || ''}
                        onChange={(e) => updateNestedField('sections.overview.role', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Team</label>
                      <input
                        type="text"
                        value={formData.sections.overview.team || ''}
                        onChange={(e) => updateNestedField('sections.overview.team', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.overview.description}
                      onChange={(e) => updateNestedField('sections.overview.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Key Features</label>
                    {formData.sections.overview.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.sections.overview.keyFeatures];
                            newFeatures[idx] = e.target.value;
                            updateNestedField('sections.overview.keyFeatures', newFeatures);
                          }}
                          className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                        <button onClick={() => removeArrayItem('sections.overview.keyFeatures', idx)} className="text-red-400">
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('sections.overview.keyFeatures', '')}
                      className="flex items-center gap-2"
                    >
                      <MdAdd size={18} />
                      Add Feature
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Problem Statement Tab - simplified version */}
        {activeTab === 'problem' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">Problem Statement</h2>
                <button
                  onClick={() => updateNestedField('sections.problemStatement.enabled', !formData.sections.problemStatement.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    formData.sections.problemStatement.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {formData.sections.problemStatement.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.problemStatement.enabled && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.sections.problemStatement.heading}
                    onChange={(e) => updateNestedField('sections.problemStatement.heading', e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    placeholder="Section Heading"
                  />
                  <textarea
                    value={formData.sections.problemStatement.description}
                    onChange={(e) => updateNestedField('sections.problemStatement.description', e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                    placeholder="Describe the challenge..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other sections follow similar pattern - adding placeholders for brevity */}
        {activeTab === 'solutions' && (
          <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text)]">Solutions Section</h2>
              <button
                onClick={() => updateNestedField('sections.solutions.enabled', !formData.sections.solutions.enabled)}
                className={`px-3 py-1 rounded-lg text-sm ${formData.sections.solutions.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
              >
                {formData.sections.solutions.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            {formData.sections.solutions.enabled && (
              <textarea
                value={formData.sections.solutions.description}
                onChange={(e) => updateNestedField('sections.solutions.description', e.target.value)}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
              />
            )}
          </div>
        )}

        {/* Branding Section */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">BRANDING SECTION</h2>
                <button
                  onClick={() => updateNestedField('sections.branding.enabled', !formData.sections.branding.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.branding.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.branding.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.branding.enabled && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.branding.heading}
                      onChange={(e) => updateNestedField('sections.branding.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                      placeholder="Brand Identity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.branding.description}
                      onChange={(e) => updateNestedField('sections.branding.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32 focus:outline-none focus:border-[var(--accent)]"
                      placeholder="Describe the branding approach..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Logo</label>
                    {formData.sections.branding.logo?.url && (
                      <img src={formData.sections.branding.logo.url} alt="Logo" className="w-48 h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 p-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'sections.branding.logo')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      disabled={uploading}
                    >
                      <MdImage size={18} />
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.sections.branding.colorPalette?.primary || '#000000'}
                          onChange={(e) => updateNestedField('sections.branding.colorPalette.primary', e.target.value)}
                          className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.sections.branding.colorPalette?.primary || '#000000'}
                          onChange={(e) => updateNestedField('sections.branding.colorPalette.primary', e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.sections.branding.colorPalette?.secondary || '#000000'}
                          onChange={(e) => updateNestedField('sections.branding.colorPalette.secondary', e.target.value)}
                          className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.sections.branding.colorPalette?.secondary || '#000000'}
                          onChange={(e) => updateNestedField('sections.branding.colorPalette.secondary', e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Primary Font</label>
                      <input
                        type="text"
                        value={formData.sections.branding.typography?.primary || ''}
                        onChange={(e) => updateNestedField('sections.branding.typography.primary', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="Poppins, Inter..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Secondary Font</label>
                      <input
                        type="text"
                        value={formData.sections.branding.typography?.secondary || ''}
                        onChange={(e) => updateNestedField('sections.branding.typography.secondary', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="Roboto, Open Sans..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wireframes Section */}
        {activeTab === 'wireframes' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">WIREFRAMES SECTION</h2>
                <button
                  onClick={() => updateNestedField('sections.wireframes.enabled', !formData.sections.wireframes.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.wireframes.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.wireframes.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.wireframes.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.wireframes.heading}
                      onChange={(e) => updateNestedField('sections.wireframes.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Wireframes & Sketches"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.wireframes.description}
                      onChange={(e) => updateNestedField('sections.wireframes.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Describe the wireframing process..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Wireframe Images</label>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Add multiple wireframe screenshots</p>
                    
                    {/* Display existing wireframe images */}
                    {formData.sections.wireframes.wireframes?.map((image, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg">
                        <img src={image.url} alt={image.alt} className="w-20 h-20 object-cover rounded" />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => {
                            const newImages = [...(formData.sections.wireframes.wireframes || [])];
                            newImages[idx] = { ...newImages[idx], alt: e.target.value };
                            updateNestedField('sections.wireframes.wireframes', newImages);
                          }}
                          placeholder="Image description"
                          className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                        />
                        <button
                          onClick={() => {
                            const newImages = formData.sections.wireframes.wireframes?.filter((_, i) => i !== idx);
                            updateNestedField('sections.wireframes.wireframes', newImages);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload new wireframe image */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setUploading(true);
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);
                        
                        try {
                          const response = await fetch('/api/projects/upload-image', {
                            method: 'POST',
                            body: uploadFormData,
                          });
                          const result = await response.json();
                          
                          if (result.success) {
                            const currentImages = [...(formData.sections.wireframes.wireframes || [])];
                            currentImages.push({ url: result.url, alt: file.name });
                            updateNestedField('sections.wireframes.wireframes', currentImages);
                            showMessage('success', 'Image uploaded!');
                          } else {
                            showMessage('error', result.error || 'Upload failed');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          showMessage('error', 'Upload failed');
                        } finally {
                          setUploading(false);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="wireframe-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById('wireframe-upload')?.click()}
                      disabled={uploading}
                    >
                      <MdAdd size={18} />
                      {uploading ? 'Uploading...' : 'Add Wireframe Image'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UI/UX Section */}
        {activeTab === 'uiux' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">UI/UX DESIGN SECTION</h2>
                <button
                  onClick={() => updateNestedField('sections.uiuxDesign.enabled', !formData.sections.uiuxDesign.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.uiuxDesign.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.uiuxDesign.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.uiuxDesign.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.uiuxDesign.heading}
                      onChange={(e) => updateNestedField('sections.uiuxDesign.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="UI/UX Design"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.uiuxDesign.description}
                      onChange={(e) => updateNestedField('sections.uiuxDesign.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Describe the design decisions..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Design Tool</label>
                    <input
                      type="text"
                      value={formData.sections.uiuxDesign.designTool || ''}
                      onChange={(e) => updateNestedField('sections.uiuxDesign.designTool', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Figma, Adobe XD, Sketch..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Design Mockups</label>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Add UI/UX design screenshots</p>
                    
                    {/* Display existing mockups */}
                    {formData.sections.uiuxDesign.mockups?.map((mockup, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg">
                        <img src={mockup.url} alt={mockup.alt} className="w-20 h-20 object-cover rounded" />
                        <input
                          type="text"
                          value={mockup.alt}
                          onChange={(e) => {
                            const newMockups = [...(formData.sections.uiuxDesign.mockups || [])];
                            newMockups[idx] = { ...newMockups[idx], alt: e.target.value };
                            updateNestedField('sections.uiuxDesign.mockups', newMockups);
                          }}
                          placeholder="Mockup description"
                          className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                        />
                        <button
                          onClick={() => {
                            const newMockups = formData.sections.uiuxDesign.mockups?.filter((_, i) => i !== idx);
                            updateNestedField('sections.uiuxDesign.mockups', newMockups);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload new mockup */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          const response = await fetch('/api/projects/upload-image', {
                            method: 'POST',
                            body: formData,
                          });
                          const result = await response.json();
                          
                          if (result.success) {
                            const currentMockups = [...(formData.sections.uiuxDesign.mockups || [])];
                            currentMockups.push({ url: result.url, alt: file.name });
                            updateNestedField('sections.uiuxDesign.mockups', currentMockups);
                            showMessage('success', 'Mockup uploaded!');
                          }
                        } catch (error) {
                          showMessage('error', 'Upload failed');
                        } finally {
                          setUploading(false);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="mockup-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById('mockup-upload')?.click()}
                      disabled={uploading}
                    >
                      <MdAdd size={18} />
                      {uploading ? 'Uploading...' : 'Add Mockup'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Development Section */}
        {activeTab === 'development' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">DEVELOPMENT PROCESS</h2>
                <button
                  onClick={() => updateNestedField('sections.developmentProcess.enabled', !formData.sections.developmentProcess.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.developmentProcess.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.developmentProcess.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.developmentProcess.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.developmentProcess.heading}
                      onChange={(e) => updateNestedField('sections.developmentProcess.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Development Process"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.developmentProcess.description}
                      onChange={(e) => updateNestedField('sections.developmentProcess.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Describe the development approach..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Tech Stack</label>
                    {formData.sections.developmentProcess.techStack?.map((tech, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => {
                            const newStack = [...(formData.sections.developmentProcess.techStack || [])];
                            newStack[idx] = e.target.value;
                            updateNestedField('sections.developmentProcess.techStack', newStack);
                          }}
                          className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="React, Node.js..."
                        />
                        <button 
                          onClick={() => {
                            const newStack = formData.sections.developmentProcess.techStack?.filter((_, i) => i !== idx);
                            updateNestedField('sections.developmentProcess.techStack', newStack);
                          }}
                          className="text-red-400"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentStack = formData.sections.developmentProcess.techStack || [];
                        updateNestedField('sections.developmentProcess.techStack', [...currentStack, '']);
                      }}
                    >
                      <MdAdd size={18} />
                      Add Technology
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Website Preview Section */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">WEBSITE PREVIEW</h2>
                <button
                  onClick={() => updateNestedField('sections.websitePreview.enabled', !formData.sections.websitePreview.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.websitePreview.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.websitePreview.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.websitePreview.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.websitePreview.heading}
                      onChange={(e) => updateNestedField('sections.websitePreview.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Final Product"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.websitePreview.description}
                      onChange={(e) => updateNestedField('sections.websitePreview.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Showcase the final result..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Live URL</label>
                      <input
                        type="url"
                        value={formData.sections.websitePreview.liveUrl || ''}
                        onChange={(e) => updateNestedField('sections.websitePreview.liveUrl', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={formData.sections.websitePreview.githubUrl || ''}
                        onChange={(e) => updateNestedField('sections.websitePreview.githubUrl', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Screenshots</label>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Add website screenshots</p>
                    
                    {formData.sections.websitePreview.screenshots?.map((screenshot, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg">
                        <img src={screenshot.url} alt={screenshot.alt} className="w-20 h-20 object-cover rounded" />
                        <input
                          type="text"
                          value={screenshot.alt}
                          onChange={(e) => {
                            const newScreenshots = [...(formData.sections.websitePreview.screenshots || [])];
                            newScreenshots[idx] = { ...newScreenshots[idx], alt: e.target.value };
                            updateNestedField('sections.websitePreview.screenshots', newScreenshots);
                          }}
                          placeholder="Screenshot description"
                          className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                        />
                        <button
                          onClick={() => {
                            const newScreenshots = formData.sections.websitePreview.screenshots?.filter((_, i) => i !== idx);
                            updateNestedField('sections.websitePreview.screenshots', newScreenshots);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setUploading(true);
                        const fd = new FormData();
                        fd.append('file', file);
                        
                        try {
                          const response = await fetch('/api/projects/upload-image', {
                            method: 'POST',
                            body: fd,
                          });
                          const result = await response.json();
                          
                          if (result.success) {
                            const currentScreenshots = [...(formData.sections.websitePreview.screenshots || [])];
                            currentScreenshots.push({ url: result.url, alt: file.name });
                            updateNestedField('sections.websitePreview.screenshots', currentScreenshots);
                            showMessage('success', 'Screenshot uploaded!');
                          }
                        } catch (error) {
                          showMessage('error', 'Upload failed');
                        } finally {
                          setUploading(false);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById('screenshot-upload')?.click()}
                      disabled={uploading}
                    >
                      <MdAdd size={18} />
                      {uploading ? 'Uploading...' : 'Add Screenshot'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results & Impact Section */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">RESULTS & IMPACT</h2>
                <button
                  onClick={() => updateNestedField('sections.resultsImpact.enabled', !formData.sections.resultsImpact.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.resultsImpact.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.resultsImpact.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.resultsImpact.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.resultsImpact.heading}
                      onChange={(e) => updateNestedField('sections.resultsImpact.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Impact & Results"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.resultsImpact.description}
                      onChange={(e) => updateNestedField('sections.resultsImpact.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Describe the impact..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Metrics</label>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">Add key metrics (e.g., "50% increase in conversions")</p>
                    
                    {formData.sections.resultsImpact.metrics?.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => {
                            const newMetrics = [...(formData.sections.resultsImpact.metrics || [])];
                            newMetrics[idx] = { ...newMetrics[idx], value: e.target.value };
                            updateNestedField('sections.resultsImpact.metrics', newMetrics);
                          }}
                          placeholder="50%"
                          className="w-24 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => {
                            const newMetrics = [...(formData.sections.resultsImpact.metrics || [])];
                            newMetrics[idx] = { ...newMetrics[idx], label: e.target.value };
                            updateNestedField('sections.resultsImpact.metrics', newMetrics);
                          }}
                          placeholder="increase in conversions"
                          className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                        <button
                          onClick={() => {
                            const newMetrics = formData.sections.resultsImpact.metrics?.filter((_, i) => i !== idx);
                            updateNestedField('sections.resultsImpact.metrics', newMetrics);
                          }}
                          className="text-red-400 hover:text-red-500"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentMetrics = formData.sections.resultsImpact.metrics || [];
                        updateNestedField('sections.resultsImpact.metrics', [...currentMetrics, { value: '', label: '' }]);
                      }}
                    >
                      <MdAdd size={18} />
                      Add Metric
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conclusion Section */}
        {activeTab === 'conclusion' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">CONCLUSION</h2>
                <button
                  onClick={() => updateNestedField('sections.conclusion.enabled', !formData.sections.conclusion.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.conclusion.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.conclusion.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.conclusion.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.conclusion.heading}
                      onChange={(e) => updateNestedField('sections.conclusion.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Conclusion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.conclusion.description}
                      onChange={(e) => updateNestedField('sections.conclusion.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                      placeholder="Wrap up the case study..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Lessons Learned</label>
                    {formData.sections.conclusion.lessonsLearned?.map((lesson, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={lesson}
                          onChange={(e) => {
                            const newLessons = [...(formData.sections.conclusion.lessonsLearned || [])];
                            newLessons[idx] = e.target.value;
                            updateNestedField('sections.conclusion.lessonsLearned', newLessons);
                          }}
                          className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                        <button 
                          onClick={() => {
                            const newLessons = formData.sections.conclusion.lessonsLearned?.filter((_, i) => i !== idx);
                            updateNestedField('sections.conclusion.lessonsLearned', newLessons);
                          }}
                          className="text-red-400"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentLessons = formData.sections.conclusion.lessonsLearned || [];
                        updateNestedField('sections.conclusion.lessonsLearned', [...currentLessons, '']);
                      }}
                    >
                      <MdAdd size={18} />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {activeTab === 'cta' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">CALL TO ACTION</h2>
                <button
                  onClick={() => updateNestedField('sections.callToAction.enabled', !formData.sections.callToAction.enabled)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.callToAction.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                >
                  {formData.sections.callToAction.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              {formData.sections.callToAction.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Heading</label>
                    <input
                      type="text"
                      value={formData.sections.callToAction.heading}
                      onChange={(e) => updateNestedField('sections.callToAction.heading', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                      placeholder="Let's Work Together"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                    <textarea
                      value={formData.sections.callToAction.description}
                      onChange={(e) => updateNestedField('sections.callToAction.description', e.target.value)}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-24"
                      placeholder="Encourage visitors to take action..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Primary Button Text</label>
                      <input
                        type="text"
                        value={formData.sections.callToAction.primaryButtonText}
                        onChange={(e) => updateNestedField('sections.callToAction.primaryButtonText', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="Contact Me"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Primary Button Link</label>
                      <input
                        type="text"
                        value={formData.sections.callToAction.primaryButtonLink}
                        onChange={(e) => updateNestedField('sections.callToAction.primaryButtonLink', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Secondary Button Text (Optional)</label>
                      <input
                        type="text"
                        value={formData.sections.callToAction.secondaryButtonText || ''}
                        onChange={(e) => updateNestedField('sections.callToAction.secondaryButtonText', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="View More Projects"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">Secondary Button Link (Optional)</label>
                      <input
                        type="text"
                        value={formData.sections.callToAction.secondaryButtonLink || ''}
                        onChange={(e) => updateNestedField('sections.callToAction.secondaryButtonLink', e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        placeholder="/projects"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
