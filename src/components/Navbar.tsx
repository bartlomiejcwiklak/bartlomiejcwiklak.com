import { useLayoutEffect, useState, useEffect, useRef } from 'react';
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

type MobileActionState = 'menu' | 'close' | 'back';


const iconMap = {
  menu: Menu,
  close: X,
  back: ArrowLeft,
} as const;

const MobileActionIcon = ({ state }: { state: MobileActionState }) => {
  const Icon = iconMap[state];

  return (
    <div className="grid h-8 w-8 place-items-center text-current" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, rotate: -35, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          <Icon size={28} strokeWidth={2.25} />
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

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
  const { t, i18n } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'pl' ? 'en' : 'pl');
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectPage = location.pathname.startsWith('/project');
  const isAboutPage = location.pathname === '/about';
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { scrollY } = useScroll();
  const prevHiddenRef = useRef(false);
  useEffect(() => { prevHiddenRef.current = isHidden; });
  const layoutDuration = (prevHiddenRef.current && !isHidden) ? 0 : 0.8;

  const isTopNav = (isProjectPage && !isAtBottom) || isAboutPage;
  const mobileActionState: MobileActionState = isMobileOpen
    ? 'close'
    : ((isProjectPage || isAboutPage) ? 'back' : 'menu');

  useLayoutEffect(() => {
    setIsAtBottom(false);
    setIsHidden(false);
  }, [isProjectPage, location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

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
    { label: t('common.instagram'), href: 'https://www.instagram.com/bartlomiejcwiklak/' },
  ];

  const handleMobileAction = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
      return;
    }

    if (isProjectPage || isAboutPage) {
      navigate('/');
      return;
    }

    setIsMobileOpen(true);
  };

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

        <motion.button
          whileTap={{ scale: 0.94 }}
          aria-label={
            mobileActionState === 'close'
              ? 'Close menu'
              : mobileActionState === 'back'
                ? 'Go back'
                : 'Open menu'
          }
          onClick={handleMobileAction}
          className={cn(
            "pointer-events-auto h-11 w-11 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300",
            mobileActionState === 'back'
              ? (isProjectPage ? "text-black bg-white hover:bg-black hover:text-white" : "text-white hover:bg-white hover:text-black")
              : "text-white hover:bg-white/15"
          )}
        >
          <MobileActionIcon state={mobileActionState} />
        </motion.button>
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
            <div className="flex justify-start items-start">
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
                  className="mb-6 hover:opacity-70 transition-all duration-300 text-left flex items-center gap-2 cursor-pointer font-bold whitespace-nowrap"
                  onClick={() => {
                    setIsMobileOpen(false);
                    if (link.href.startsWith('http')) {
                      window.open(link.href, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(link.href);
                    }
                  }}
                >
                  <span className="text-xs opacity-50 shrink-0">0{i + 1}</span>
                  <span>{link.label}</span>
                </motion.button>
              ))}

              <motion.div custom={navLinks.length} variants={itemVariants} className="mt-6 mb-2">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <span className={i18n.language !== 'pl' ? 'opacity-100' : 'opacity-30'}>EN</span>
                  <span className="opacity-30">·</span>
                  <span className={i18n.language === 'pl' ? 'opacity-100' : 'opacity-30'}>PL</span>
                </button>
              </motion.div>

              <motion.div custom={navLinks.length + 1} variants={itemVariants} className="mt-4 mb-6 flex flex-col font-sans text-sm font-light opacity-80">
                <span>{STUDIO_TEXT}</span>
                <span>{t('home.role')}</span>
              </motion.div>

              <motion.div custom={navLinks.length + 2} variants={itemVariants} className="flex flex-col font-sans text-sm font-light opacity-80">
                <span>{t('home.location')}</span>
                <a href={`mailto:${EMAIL}`} className="hover:opacity-70 transition-opacity font-bold">{EMAIL}</a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <motion.nav
        layout="position"
        initial={{ opacity: 0, y: isTopNav ? -20 : 20 }}
        animate={{
          opacity: isHidden ? 0 : 1,
          y: isHidden ? -100 : 0,
          rowGap: isTopNav ? 0 : 24,
          paddingTop: isTopNav ? 24 : 0,
          paddingBottom: isTopNav ? 0 : 48,
        }}
        transition={{
          default: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          rowGap: { duration: layoutDuration, ease: [0.76, 0, 0.24, 1] },
          paddingTop: { duration: layoutDuration, ease: [0.76, 0, 0.24, 1] },
          paddingBottom: { duration: layoutDuration, ease: [0.76, 0, 0.24, 1] },
          layout: { duration: layoutDuration, ease: [0.76, 0, 0.24, 1] },
        }}
        className={cn(
          "hidden md:grid fixed left-0 w-full z-[70] px-12 transition-colors duration-700 pointer-events-none",
          isTopNav ? "top-0" : "bottom-0",
          isProjectPage ? "text-black" : "text-white"
        )}
        style={{
          gridTemplateColumns: "200px 250px auto",
          columnGap: "4rem",
          alignItems: "end",
        }}
      >
        {/* Logo Section */}
        <div
          className="cursor-pointer pointer-events-auto"
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
          <h1
            className={cn(
              "font-display font-black text-4xl md:text-5xl leading-none tracking-tighter origin-top-left transition-colors duration-700 hover:text-transparent",
              isProjectPage ? "text-black hover:text-stroke" : "text-white hover:text-stroke-white"
            )}
          >
            <Logo />
          </h1>
        </div>

        {/* Column 1 - Studio info */}
        <motion.div
          style={{ gridColumn: "1", gridRow: "2" }}
          animate={{ opacity: isTopNav ? 0 : 1, y: isTopNav ? 6 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex flex-col text-sm font-light transition-colors duration-700",
            isTopNav ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity mb-0.5"
          >
            <span className={i18n.language !== 'pl' ? 'opacity-100' : 'opacity-30'}>EN</span>
            <span className="opacity-30 mx-0.5">·</span>
            <span className={i18n.language === 'pl' ? 'opacity-100' : 'opacity-30'}>PL</span>
          </button>
          <span>{t('home.role')}</span>
        </motion.div>

        {/* Column 2 - Location info */}
        <motion.div
          style={{ gridColumn: "2", gridRow: "2" }}
          animate={{ opacity: isTopNav ? 0 : 1, y: isTopNav ? 6 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: isTopNav ? 0 : 0.07 }}
          className={cn(
            "flex flex-col text-sm font-light transition-colors duration-700",
            isTopNav ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          <span>{t('home.location')}</span>
          <a href={`mailto:${EMAIL}`} className="hover:opacity-70 transition-opacity w-fit font-bold">{EMAIL}</a>
        </motion.div>

        {/* Column 3 - Links */}
        <motion.div
          layout="position"
          transition={{ layout: { duration: layoutDuration, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            gridColumn: "3",
            gridRow: isTopNav ? "1" : "2",
          }}
          className="flex flex-col space-y-1 items-start justify-end text-sm font-light transition-colors duration-700 pointer-events-auto"
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
