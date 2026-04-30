import { motion, type Variants } from 'framer-motion';
import HeroBackground from './HeroBackground';
import GlitchText from './GlitchText';

const Hero = () => {
  const name1 = "bartlomiej";
  const name2 = "cwiklak";

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 100,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen md:min-h-[120vh] flex flex-col justify-center px-4 md:px-12 overflow-hidden py-20">
      <HeroBackground />

      <div className="relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2 md:gap-0"
        >
          <motion.div variants={child} className="flex flex-wrap overflow-hidden">
            <GlitchText
              text={name1}
              className="text-[14vw] sm:text-[12vw] md:text-[15vw] leading-[0.8] font-serif tracking-tighter"
            />
          </motion.div>
          <motion.div variants={child} className="flex flex-wrap overflow-hidden ml-0 md:ml-[10vw]">
            <GlitchText
              text={name2}
              className="text-[14vw] sm:text-[12vw] md:text-[15vw] leading-[0.8] font-serif tracking-tighter text-outline"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-16 max-w-xl"
        >
          <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-500 mb-4 md:mb-6">
            // GRAPHIC DESIGNER & WEB DEVELOPER
          </p>
          <p className="text-lg md:text-2xl text-zinc-300 leading-relaxed font-light">
            Pushing the boundaries of the digital landscape through experimental design and precision engineering.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
