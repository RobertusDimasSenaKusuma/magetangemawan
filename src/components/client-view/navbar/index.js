"use client";
import { useEffect, useState } from "react";
import { Link as LinkScroll, scroller } from "react-scroll";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import logo1 from "../../../assets/logo1.jpg";
import logo2 from "../../../assets/logo_kkn.jpg";
import logo3 from "../../../assets/logo3.jpg";

const menuItems = [
  {
    id: "home",
    label: "Beranda",
    isPage: false,
  
  },
  {
    id: "about",
    label: "Tentang Desa",
    isPage: false, // section scroll di homepage
    hasDropdown: true,
    dropdownItems: [
      {
        id: "about",
        label: "profil desa",
        isPage: false, // section scroll di homepage
      },
      {
        id: "prasarana",
        label: "Prasarana",
        isPage: true,
        href: "/prasarana"
      },
      {
        id: "kegiatan",
        label: "Kegiatan",
        isPage: true,
        href: "/kegiatan",
      },
      {
        id: "lembaga",
        label: "Lembaga",
        isPage: true,
        href: "/lembaga",
      },
    ],
  },
  {
    id: "experience",
    label: "Potensi Desa",
    isPage: false, // section scroll di homepage
  },
  {
    id: "project",
    label: "Artikel / Berita",
    isPage: false, // section scroll di homepage
 },
 
];

function CreateMenus({ activeLink, getMenuItems, setActiveLink, isMobile = false, closeMobileMenu, currentPath }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleClick = (item, isFromDropdown = false) => {
    if (item.isPage) {
      // Navigasi ke halaman lain
      router.push(item.href);
      setActiveLink(item.id);
    } else {
      // Scroll ke section (hanya jika di homepage)
      if (currentPath === "/") {
        // Langsung scroll jika sudah di homepage
        scroller.scrollTo(item.id, {
          duration: 1000,
          smooth: true,
          offset: -80, // Offset untuk navbar fixed
        });
        setActiveLink(item.id);
      } else {
        // Redirect ke homepage lalu scroll
        router.push(`/#${item.id}`);
        setActiveLink(item.id);
      }
    }
    
    if (closeMobileMenu) closeMobileMenu();
    setDropdownOpen(null);
  };

  const handleMainMenuClick = (item) => {
    // Untuk menu utama dengan dropdown, jangan langsung navigate
    // Hanya buka dropdown atau tidak melakukan apa-apa
    if (item.hasDropdown && !isMobile) {
      // Untuk desktop, dropdown sudah dihandle oleh hover
      return;
    } else if (item.hasDropdown && isMobile) {
      // Untuk mobile, toggle dropdown
      handleDropdownToggle(item.id);
    } else {
      // Menu biasa tanpa dropdown
      handleClick(item);
    }
  };

  const handleDropdownToggle = (itemId) => {
    if (isMobile) {
      setDropdownOpen(dropdownOpen === itemId ? null : itemId);
    }
  };

  const handleMouseEnter = (itemId) => {
    if (!isMobile) {
      setDropdownOpen(itemId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setDropdownOpen(null);
    }
  };

  if (isMobile) {
    return getMenuItems.map((item) => (
      <li key={item.id} className="w-full">
        {item.hasDropdown ? (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleMainMenuClick(item)}
                className="flex-1 block px-6 py-4 text-lg border-b border-gray-200 hover:bg-gray-100 text-left cursor-pointer text-[#000] font-bold hover:text-green1-main transition-colors duration-300"
              >
                {item.label}
              </button>
              <button
                onClick={() => handleDropdownToggle(item.id)}
                className="px-4 py-4 border-b border-gray-200 hover:bg-gray-100 text-[#000] transition-colors duration-300"
              >
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    dropdownOpen === item.id ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {dropdownOpen === item.id && (
              <ul className="bg-white shadow-sm border-t border-gray-100">
                {item.dropdownItems.map((dropdownItem) => (
                  <li key={dropdownItem.id}>
                    <button
                      onClick={() => handleClick(dropdownItem)}
                      className="w-full block px-12 py-3 text-base border-b border-gray-100 hover:bg-gray-50 text-left cursor-pointer text-gray-700 hover:text-green1-main transition-colors duration-300"
                    >
                      {dropdownItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <button
            onClick={() => handleMainMenuClick(item)}
            className="w-full block px-6 py-4 text-lg border-b border-gray-200 hover:bg-gray-100 text-left cursor-pointer text-[#000] font-bold hover:text-green1-main transition-colors duration-300"
          >
            {item.label}
          </button>
        )}
      </li>
    ));
  }

  return getMenuItems.map((item) => (
    <div 
      key={item.id} 
      className="relative"
      onMouseEnter={() => handleMouseEnter(item.id)}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => handleMainMenuClick(item)}
        className={`px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative flex items-center gap-1
          ${
            activeLink === item.id || (item.hasDropdown && item.dropdownItems?.some(subItem => activeLink === subItem.id))
              ? "text-green1-main animation-active shadow-green1-main"
              : "text-[#000] font-bold hover:text-green1-main"
          }
        `}
      >
        {item.label}
        {item.hasDropdown && (
          <svg 
            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
              dropdownOpen === item.id ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {item.hasDropdown && dropdownOpen === item.id && (
        <div 
          className="absolute top-full left-0 mt-1 w-48 bg-white-500 rounded-md shadow-lg border border-gray-200 py-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {item.dropdownItems.map((dropdownItem) => (
            <button
              key={dropdownItem.id}
              onClick={() => handleClick(dropdownItem)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                activeLink === dropdownItem.id 
                  ? "text-green1-main bg-green-50" 
                  : "text-gray-700 hover:text-green1-main"
              }`}
            >
              {dropdownItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  ));
}

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [scrollActive, setScrollActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Set active link berdasarkan current path
  useEffect(() => {
    if (pathname === "/") {
      setActiveLink("home");
    } else if (pathname === "/profil-desa") {
      setActiveLink("about");
    } else if (pathname === "/prasarana") {
      setActiveLink("prasarana");
    } else if (pathname === "/kegiatan") {
      setActiveLink("kegiatan");
    } else if (pathname === "/lembaga") {
      setActiveLink("lembaga");
    } else if (pathname === "/potensi") {
      setActiveLink("potensi");
    } else {
      // Set berdasarkan path lainnya
      const currentItem = menuItems.find(item => item.href === pathname);
      if (currentItem) {
        setActiveLink(currentItem.id);
      }
    }
  }, [pathname]);

  // Handle scroll untuk homepage sections
  useEffect(() => {
    if (pathname !== "/") return; // Hanya aktif di homepage

    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
      
      // PERBAIKAN: Tambahkan "project" ke dalam array sections
      const sections = ["home", "about", "experience", "project"];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      let currentSection = "home"; // Default to home
      
      // Jika di atas 100px dari top, anggap masih di home
      if (scrollPosition < 100) {
        currentSection = "home";
      }
  
      else {
        // Cari section mana yang paling dekat dengan tengah viewport
        let closestSection = "home";
        let closestDistance = Infinity;
        
        sections.forEach((sectionId) => {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Hitung jarak dari center element ke center viewport
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const distance = Math.abs(elementCenter - viewportCenter);
            
            // Jika element visible dan lebih dekat ke center
            if (rect.top < windowHeight && rect.bottom > 0 && distance < closestDistance) {
              closestDistance = distance;
              closestSection = sectionId;
            }
          }
        });
        
        currentSection = closestSection;
      }
      
      setActiveLink(currentSection);
    };

    // Throttle scroll event untuk performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    handleScroll(); // Run once on mount
    
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [pathname]);

  // Handle hash pada URL (untuk direct link ke section)
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      setTimeout(() => {
        scroller.scrollTo(hash, {
          duration: 1000,
          smooth: true,
          offset: -80, // Offset untuk navbar fixed
        });
        setActiveLink(hash);
      }, 100);
    }
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-30 bg-white-500 transition-all ${
          scrollActive ? "shadow-md pt-0" : "pt-4"
        }`}
      >
        <nav className="max-w-screen-xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto grid grid-flow-col py-2 sm:py-3 md:py-4">
          <div className="col-start-1 col-end-2 flex items-center">
            <Link href="/" className="cursor-pointer flex gap-2 sm:gap-3 md:gap-4 items-center">
              {/* Logo 1 */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px] flex justify-center items-center rounded-[8px] overflow-hidden">
                <Image
                  src={logo2}
                  alt="logo1"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Logo 2 */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-[55px] lg:h-[55px] flex justify-center items-center rounded-[8px] overflow-hidden">
                <Image
                  src={logo1}
                  alt="logo2"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              
              {/* Logo 3 */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px] flex justify-center items-center rounded-[8px] overflow-hidden">
                <Image
                  src={logo3}
                  alt="logo3"
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu - Show on large screens */}
          <div className="hidden xl:flex col-start-4 col-end-8 text-[#000] items-center">
            <CreateMenus
              setActiveLink={setActiveLink}
              activeLink={activeLink}
              getMenuItems={menuItems}
              isMobile={false}
              currentPath={pathname}
            />
          </div>

          {/* Tablet Menu - Show on medium to large screens */}
          <div className="hidden lg:flex xl:hidden col-start-3 col-end-9 text-[#000] items-center justify-center">
            <CreateMenus
              setActiveLink={setActiveLink}
              activeLink={activeLink}
              getMenuItems={menuItems}
              isMobile={false}
              currentPath={pathname}
            />
          </div>

          {/* Mobile Hamburger Menu Button - Hide on large screens */}
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center lg:hidden">
            <button
              className="flex flex-col justify-center items-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 space-y-1 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span 
                className={`block w-5 sm:w-6 md:w-7 h-0.5 bg-[#000] transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span 
                className={`block w-5 sm:w-6 md:w-7 h-0.5 bg-[#000] transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span 
                className={`block w-5 sm:w-6 md:w-7 h-0.5 bg-[#000] transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-container fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white-500 shadow-lg transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="py-4 overflow-y-auto">
              <ul className="flex flex-col">
                <CreateMenus
                  setActiveLink={setActiveLink}
                  activeLink={activeLink}
                  getMenuItems={menuItems}
                  isMobile={true}
                  closeMobileMenu={closeMobileMenu}
                  currentPath={pathname}
                />
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}