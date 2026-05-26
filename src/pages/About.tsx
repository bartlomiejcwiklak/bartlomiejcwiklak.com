import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 w-full min-h-screen bg-[var(--bg-color)] transition-colors duration-800 text-white pt-32 md:pt-48 px-6 md:px-12 z-[60] overflow-y-auto"
    >
      <div className="w-full max-w-6xl mx-auto mt-20">
        <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.8] mb-12">
          ABOUT ME
        </h1>
        <div className="text-base md:text-xl leading-relaxed font-normal opacity-80 space-y-8">
          <p>
            Hi, I'm Bartłomiej. I combine a technical mindset with a strong sense of aesthetics.
          </p>
          <p>
            I'm a Computer Science student at Lodz University of Technology, working as a freelance Web Developer and Graphic Designer.
          </p>
          <p>
            I specialize in building fast, modern websites with clean code and minimalist interfaces. Beyond tech and design, I work as an online English teacher, helping others overcome language barriers. I strongly believe that in both code and design, less is always more.
          </p>

          <div className="pt-8">
            <a 
              href="/resume.pdf" 
              download 
              className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 hover:bg-gray-100 transition-all duration-300"
            >
              DOWNLOAD RESUME
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
