'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  MdDashboard, 
  MdHome,
  MdMessage, 
  MdSettings, 
  MdLogout,
  MdAccountBox
} from 'react-icons/md';

// Lazy load AdminThemeToggle to reduce initial bundle
const AdminThemeToggle = dynamic(() => import('@/components/AdminThemeToggle'), {
  ssr: false,
});

interface FooterData {
  ownerName: string;
  ownerTitle: string;
  ownerInitial: string;
  ownerAvatarUrl: string;
  email: string;
  phone: string;
  location: string;
  copyrightText: string;
  socialLinks: {
    id: number;
    platform: string;
    url: string;
    icon: string;
    isVisible: boolean;
  }[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarTextsRef = useRef<HTMLDivElement[]>([]);
  const [footerData, setFooterData] = useState<FooterData>({
    ownerName: 'Karim Massaoud',
    ownerTitle: 'Web Developer',
    ownerInitial: 'K',
    ownerAvatarUrl: '',
    email: 'contact@example.com',
    phone: '+1234567890',
    location: '',
    copyrightText: '© 2024 Portfolio Admin',
    socialLinks: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch footer data
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/homepage');
        if (response.ok) {
          const result = await response.json();
          if (result.data?.footer) {
            setFooterData(result.data.footer);
          }
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };
    fetchFooterData();
  }, []);

  // Removed GSAP animations to fix rendering issues
  // useEffect(() => {
  //   Content now renders immediately without animation delays
  // }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: MdDashboard,
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: MdMessage,
    },
    {
      name: 'Footer',
      path: '/admin/footer',
      icon: MdAccountBox,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: MdSettings,
    },
  ];

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full backdrop-blur-xl bg-white/80 dark:bg-[var(--card)]/80 shadow-2xl border-r border-white/20 dark:border-white/10 z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center px-4 border-b border-white/20 dark:border-white/10">
          <button
            onClick={handleSidebarToggle}
            className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group"
            aria-label="Toggle Sidebar"
          >
            <svg 
              className="menu-icon w-5 h-5 text-white"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <h4 className="sidebar-text font-secondary font-bold text-xs text-headline">Dashboard</h4>
              <p className="sidebar-text text-[10px] font-secondary text-gray-600 dark:text-gray-300">Portfolio Admin</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[var(--accent)]/10 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm'
                    : 'text-headline hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                {sidebarOpen && (
                  <span className="sidebar-text font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-white/20 dark:border-white/10">
          {/* Footer Info Section */}
          {sidebarOpen && (
            <div className="sidebar-text p-4">
              <div className="flex items-center gap-3 mb-3">
                {footerData.ownerAvatarUrl ? (
                  <img 
                    src={footerData.ownerAvatarUrl} 
                    alt={footerData.ownerName}
                    className="w-8 h-8 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {footerData.ownerInitial}
                  </div>
                )}
                <div>
                  <p className="text-xs font-secondary font-semibold text-headline">{footerData.ownerName}</p>
                  <p className="text-[10px] font-secondary text-gray-500 dark:text-gray-400">{footerData.ownerTitle}</p>
                </div>
              </div>
              
              {/* Contact & Social Links */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {footerData.email && (
                  <a href={`mailto:${footerData.email}`} className="w-7 h-7 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors" title="Email">
                    <svg className="w-3.5 h-3.5 text-headline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
                {footerData.phone && (
                  <a href={`tel:${footerData.phone}`} className="w-7 h-7 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors" title="Phone">
                    <svg className="w-3.5 h-3.5 text-headline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                )}
                {footerData.socialLinks.filter(link => link.isVisible).map((link) => (
                  <a 
                    key={link.id}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors" 
                    title={link.platform}
                  >
                    {link.icon === 'linkedin' && (
                      <svg className="w-3.5 h-3.5 text-headline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    )}
                    {link.icon === 'github' && (
                      <svg className="w-3.5 h-3.5 text-headline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                    {link.icon === 'twitter' && (
                      <svg className="w-3.5 h-3.5 text-headline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )}
                    {link.icon === 'instagram' && (
                      <svg className="w-3.5 h-3.5 text-headline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {(link.icon === 'link' || !['linkedin', 'github', 'twitter', 'instagram'].includes(link.icon)) && (
                      <svg className="w-3.5 h-3.5 text-headline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
              
              <p className="text-[9px] font-secondary text-gray-400 dark:text-gray-500">{footerData.copyrightText}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="p-4 pt-0 space-y-2">
            {sidebarOpen && <div className="border-t border-white/20 dark:border-white/10 mb-2"></div>}
            <Link
              href="/"
              target="_blank"
              className="nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-headline hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              <MdHome className="text-xl" />
              {sidebarOpen && <span className="sidebar-text font-medium whitespace-nowrap">View Site</span>}
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/auth' })}
              className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 backdrop-blur-sm transition-all duration-200"
            >
              <MdLogout className="text-xl" />
              {sidebarOpen && <span className="sidebar-text font-medium whitespace-nowrap">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        ref={contentRef}
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 backdrop-blur-xl bg-white/80 dark:bg-[var(--card)]/80 shadow-sm border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <h5 className="text-base font-secondary font-bold text-headline">
                {menuItems.find(item => item.path === pathname)?.name || 'Dashboard'}
              </h5>
              <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">
                Manage your portfolio content
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <AdminThemeToggle />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-secondary font-medium text-gray-900 dark:text-white">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
