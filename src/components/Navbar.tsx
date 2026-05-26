import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Logo = () => (
  <>
    BARTŁOMIEJ<br />ĆWIKLAK.COM
  </>
);

const EMAIL = "contact@bartlomiejcwiklak.com";
const STUDIO_TEXT = "-";

const customTransition = { ease: [0.76, 0, 0.24, 1] as [number, number, number, number], duration: 0.8 };

const menuVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.1 + (i * 0.05) }
  })
};

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectPage = location.pathname.startsWith('/project');
  const isAboutPage = location.pathname === '/about';
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { scrollY } = useScroll();

  const isTopNav = (isProjectPage && !isAtBottom) || isAboutPage;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const atBottom = window.innerHeight + latest >= document.documentElement.scrollHeight - 50;
    setIsAtBottom(atBottom);

    if (isProjectPage && latest > 50 && !atBottom) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const navLinks = [
    { label: t('common.about'), href: '/about' },
    { label: t('common.linkedin'), href: 'https://www.linkedin.com/in/bartlomiejcwiklak/' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:hidden fixed top-0 left-0 w-full z-[70] p-6 flex justify-between items-start pointer-events-none"
      >
        <motion.div
          animate={{ opacity: isMobileOpen ? 0 : (isHidden ? 0 : 1), y: isHidden ? -100 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.h1
            layout="position"
            layoutId="logo"
            transition={{ layout: customTransition }}
            className={cn(
              "font-display font-black text-lg md:text-xl leading-none tracking-tighter pointer-events-auto cursor-pointer hover:text-transparent transition-colors duration-300",
              isProjectPage ? "text-black hover:text-stroke" : "text-white hover:text-stroke-white"
            )}
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <Logo />
          </motion.h1>
        </motion.div>

        {(isProjectPage || isAboutPage) ? (
          <button
            className={cn(
              "pointer-events-auto p-2 rounded-full cursor-pointer hover:bg-black hover:text-white transition-colors duration-300",
              isProjectPage ? "text-black bg-white" : "text-white hover:bg-white hover:text-black"
            )}
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          !isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(true)}
              className="pointer-events-auto p-2 text-white"
            >
              <Menu size={32} />
            </button>
          )
        )}
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[var(--bg-color)] transition-colors duration-800 text-white p-6 flex flex-col pointer-events-auto"
          >
            <div className="flex justify-between items-start">
              <motion.h1
                layout="position"
                layoutId="logo"
                transition={{ layout: customTransition }}
                className="font-display font-black text-lg md:text-xl leading-none tracking-tighter cursor-pointer text-white hover:text-stroke-white hover:text-transparent transition-colors duration-300"
                onClick={() => { 
                  if (location.pathname === '/') {
                    document.body.classList.toggle('theme-black');
                  } else {
                    navigate('/');
                  }
                  setIsMobileOpen(false); 
                }}
              >
                <Logo />
              </motion.h1>
              <button onClick={() => setIsMobileOpen(false)} className="p-2">
                <X size={32} />
              </button>
            </div>

            <motion.div 
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col justify-center items-start pl-2"
            >
              {navLinks.map((link, i) => (
                <motion.button
                  custom={i}
                  variants={itemVariants}
                  key={i}
                  className="mb-6 hover:opacity-70 transition-all duration-300 text-left flex items-center gap-2 cursor-pointer font-bold"
                  onClick={() => {
                    if (link.href.startsWith('http')) {
                      window.open(link.href, '_blank', 'noopener,noreferrer');
                    } else if (link.href !== '#') {
                      navigate(link.href);
                    }
                  }}
                >
                  <span className="text-xs opacity-50">0{i + 1}</span> {link.label}
                </motion.button>
              ))}

              <motion.div custom={navLinks.length} variants={itemVariants} className="mt-6 mb-6 flex flex-col font-sans text-sm font-light opacity-80">
                <span>{STUDIO_TEXT}</span>
                <span>{t('home.role')}</span>
              </motion.div>
              
              <motion.div custom={navLinks.length + 1} variants={itemVariants} className="flex flex-col font-sans text-sm font-light opacity-80">
                <span>{t('home.location')}</span>
                <a href={`mailto:${EMAIL}`} className="hover:opacity-70 transition-opacity font-bold">{EMAIL}</a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: isTopNav ? -20 : 20 }}
        animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? -100 : 0 }}
        transition={{
          default: { duration: 0.3, ease: "easeInOut" },
          layout: customTransition
        }}
        layout="position"
        className={cn(
          "hidden md:grid fixed left-0 w-full z-[70] px-12 transition-colors duration-700",
          isTopNav ? "top-0 pt-6" : "bottom-0 pb-12",
          isProjectPage ? "text-black" : "text-white"
        )}
        style={{
          gridTemplateColumns: "200px 250px auto",
          columnGap: "4rem",
          rowGap: isTopNav ? "0px" : "1.5rem",
          alignItems: "end",
        }}
      >
        {/* Logo Section */}
        <motion.div
          layout="position"
          transition={{ layout: customTransition }}
          className="cursor-pointer"
          onClick={() => {
            if (location.pathname === '/') {
              document.body.classList.toggle('theme-black');
            } else {
              navigate('/');
            }
          }}
          style={{
            gridColumn: "1",
            gridRow: "1",
          }}
        >
          <motion.h1
            layoutId="logo-desktop"
            layout="position"
            transition={{ layout: customTransition }}
            className={cn(
              "font-display font-black text-4xl md:text-5xl leading-none tracking-tighter origin-top-left transition-colors duration-700 hover:text-transparent",
              isProjectPage ? "text-black hover:text-stroke" : "text-white hover:text-stroke-white"
            )}
          >
            <Logo />
          </motion.h1>
        </motion.div>

        {/* Column 1 - Studio info */}
        <motion.div
          layout="position"
          style={{
            gridColumn: "1",
            gridRow: "2",
          }}
          animate={{
            opacity: isTopNav ? 0 : 1,
            height: isTopNav ? 0 : "auto",
          }}
          transition={{ duration: 0.5, layout: customTransition }}
          className="flex flex-col text-sm font-light overflow-hidden transition-colors duration-700"
        >
          <span className="opacity-70">{STUDIO_TEXT}</span>
          <span>{t('home.role')}</span>
        </motion.div>

        {/* Column 2 - Location info */}
        <motion.div
          layout="position"
          style={{
            gridColumn: "2",
            gridRow: "2",
          }}
          animate={{
            opacity: isTopNav ? 0 : 1,
            height: isTopNav ? 0 : "auto",
          }}
          transition={{ duration: 0.5, layout: customTransition }}
          className="flex flex-col text-sm font-light overflow-hidden transition-colors duration-700"
        >
          <span>{t('home.location')}</span>
          <a href={`mailto:${EMAIL}`} className="hover:opacity-70 transition-opacity w-fit font-bold">{EMAIL}</a>
        </motion.div>

        {/* Column 3 - Links */}
        <motion.div
          layout="position"
          transition={{ layout: customTransition }}
          style={{
            gridColumn: "3",
            gridRow: isTopNav ? "1" : "2",
          }}
          className="flex flex-col space-y-1 items-start justify-end text-sm font-light transition-colors duration-700"
        >
          {navLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => {
                if (link.href.startsWith('http')) {
                  window.open(link.href, '_blank', 'noopener,noreferrer');
                } else if (link.href !== '#') {
                  navigate(link.href);
                }
              }}
              className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer font-bold"
            >
              <span className="text-xs opacity-50">0{i + 1}</span> {link.label}
            </button>
          ))}
        </motion.div>
      </motion.nav>

      {/* Back button for desktop on Project or About Page */}
      {(isProjectPage || isAboutPage) && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ x: -5, opacity: 0.7 }}
          className={cn(
            "hidden md:flex fixed top-12 right-12 z-[70] cursor-pointer transition-opacity",
            isProjectPage ? "text-black" : "text-white"
          )}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={32} />
        </motion.button>
      )}
    </>
  );
};

export default Navbar;
