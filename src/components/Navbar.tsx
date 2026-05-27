import { useLayoutEffect, useState, useEffect } from 'react';
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
type MobileOverlayView = 'menu' | 'about';

const aboutBioParagraphs = [
  "Hi! My name is Bartek, I'm 22 and I'm a graphic and layout designer pursuing a bachelor's degree in Computer Science from Poland.",
  "I'm a 2nd year student of Computer Science at the International Faculty of Engineering at Lodz University of Technology. The courses I've taken include Algorithms and Data Structures, Programming and Data Structures in C, Object-Oriented Programming in C++, Java Fundamentals, Web Programming, Computer Networks, Databases, and more. Since I'm at the international faculty, I'm pursuing my degree entirely in English.",
  "I graduated from Zespol Szkol Elektronicznych im. Bohaterow Westerplatte in Radom in 2024, where I also specialized in Computer Science. During those years I learned the basics of programming in Pascal, C++, Java, and HTML/CSS/JS.",
  "I am primarily a graphic and layout designer. I've been creating visual media ever since I can remember. I have about 5 years of professional experience in graphic design. I have worked with clients from all across the world, creating visually compelling designs for various purposes, mostly advertising campaigns and social media posts. In my high school years, I was the editor-in-chief of the school magazine, responsible for its layout, typography, and overall visual design.",
  "Outside of graphic design, I do programming. I have experience with many programming stacks and languages - it's safe to say I don't have a preferred one. I've worked with C, C++, C#, Python, Java, Pascal, HTML, CSS, JavaScript, TypeScript, PHP, SQL, and many frameworks such as .NET, React, Node.js. I have experience with creating .NET Windows Forms applications, as well as Android apps with Android Studio. Right now I'm interested in creating web applications, such as the one you're currently viewing.",
  "As my personal hobby I do music production. I am proficient in both FL Studio and Ableton Live, and I play around with music in various genres. It's a great creative outlet for me. I've had some success with it, producing and selling music for underground artists.",
  "During my years in high school I also taught myself video editing: I know my ways around Vegas Pro, Premiere Pro and some basics of After Effects. I am yet to learn DaVinci Resolve, but I plan to do so in the future.",
  "In 2024 I got a Certificate of Advanced English from Cambridge University. This is an official C1 certificate, on which I scored 206 out of 210, which grants me the C2 CEFR level. This has been handy for me during my studies and while working with international clients.",
  "I'm always open to new projects and collaborations! If you'd like to discuss a potential partnership or just say hi, feel free to reach out.",
];

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
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectPage = location.pathname.startsWith('/project');
  const isAboutPage = location.pathname === '/about';
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileOverlayView, setMobileOverlayView] = useState<MobileOverlayView>('menu');
  const [isHidden, setIsHidden] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { scrollY } = useScroll();

  const isTopNav = (isProjectPage && !isAtBottom) || isAboutPage;
  const mobileActionState: MobileActionState = isMobileOpen
    ? (mobileOverlayView === 'about' ? 'back' : 'close')
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
  ];

  const handleMobileAction = () => {
    if (isMobileOpen) {
      if (mobileOverlayView === 'about') {
        setMobileOverlayView('menu');
        return;
      }

      setIsMobileOpen(false);
      setMobileOverlayView('menu');
      return;
    }

    if (isProjectPage || isAboutPage) {
      navigate('/');
      return;
    }

    setMobileOverlayView('menu');
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

            <AnimatePresence mode="wait" initial={false}>
              {mobileOverlayView === 'menu' ? (
                <motion.div
                  key="mobile-menu-view"
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
                        if (link.href === '/about') {
                          setMobileOverlayView('about');
                          return;
                        }

                        setIsMobileOpen(false);
                        setMobileOverlayView('menu');

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
              ) : (
                <motion.div
                  key="mobile-about-view"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex-1 overflow-y-auto no-scrollbar pt-10 pb-8"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="max-w-3xl">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="font-display font-black text-4xl tracking-tighter leading-[0.9] mb-8"
                    >
                      ABOUT ME
                    </motion.h2>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.06,
                            delayChildren: 0.05,
                          },
                        },
                      }}
                      className="space-y-5 text-sm leading-relaxed opacity-85"
                    >
                      {aboutBioParagraphs.map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
                          }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          "hidden md:grid fixed left-0 w-full z-[70] px-12 transition-colors duration-700 pointer-events-none",
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
          className="flex flex-col text-sm font-light overflow-hidden transition-colors duration-700 pointer-events-auto"
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
          className="flex flex-col text-sm font-light overflow-hidden transition-colors duration-700 pointer-events-auto"
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
