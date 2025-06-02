"use client";
import { useEffect, useState } from "react";
import { Link as LinkScroll, scroller } from "react-scroll";
import Image from "next/image";
import logo1 from "../../../assets/logo1.jpg";
import logo2 from "../../../assets/logo2.jpg";
import logo3 from "../../../assets/logo3.jpg";

const menuItems = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "about",
    label: "About",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "project",
    label: "Projects",
  },
  {
    id: "contact",
    label: "Contact",
  },
];

function CreateMenus({ activeLink, getMenuItems, setActiveLink, isMobile = false, closeMobileMenu }) {
  if (isMobile) {
    return getMenuItems.map((item) => (
      <li key={item.id} className="w-full">
        <LinkScroll
          activeClass="active"
          to={item.id}
          spy={true}
          smooth={true}
          duration={1000}
          onSetActive={() => setActiveLink(item.id)}
          onClick={() => closeMobileMenu && closeMobileMenu()}
          className="w-full block px-6 py-4 text-lg border-b border-gray-200 hover:bg-gray-100 text-left cursor-pointer text-[#000] font-bold hover:text-green1-main transition-colors duration-300"
        >
          {item.label}
        </LinkScroll>
      </li>
    ));
  }

  return getMenuItems.map((item) => (
    <LinkScroll
      key={item.id}
      activeClass="active"
      to={item.id}
      spy={true}
      smooth={true}
      duration={1000}
      onSetActive={() => setActiveLink(item.id)}
      className={`px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative
        ${
          activeLink === item.id
            ? "text-green1-main animation-active shadow-green1-main"
            : "text-[#000] font-bold hover:text-green1-main"
        }
      `}
    >
      {item.label}
    </LinkScroll>
  ));
}

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [scrollActive, setScrollActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            <div className="cursor-pointer flex gap-2 sm:gap-3 md:gap-4 items-center">
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
            </div>
          </div>

          {/* Desktop Menu - Show on large screens */}
          <ul className="hidden xl:flex col-start-4 col-end-8 text-[#000] items-center">
            <CreateMenus
              setActiveLink={setActiveLink}
              activeLink={activeLink}
              getMenuItems={menuItems}
              isMobile={false}
            />
          </ul>

          {/* Tablet Menu - Show on medium to large screens */}
          <ul className="hidden lg:flex xl:hidden col-start-3 col-end-9 text-[#000] items-center justify-center">
            <CreateMenus
              setActiveLink={setActiveLink}
              activeLink={activeLink}
              getMenuItems={menuItems}
              isMobile={false}
            />
          </ul>

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
            <nav className="py-4">
              <ul className="flex flex-col">
                <CreateMenus
                  setActiveLink={setActiveLink}
                  activeLink={activeLink}
                  getMenuItems={menuItems}
                  isMobile={true}
                  closeMobileMenu={closeMobileMenu}
                />
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}