import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 w-full h-[100dvh] bg-[var(--bg-color)] transition-colors duration-800 text-white pt-32 md:pt-48 pb-24 md:pb-16 px-6 md:px-12 z-[60] overflow-y-auto overscroll-y-contain"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="w-full max-w-6xl mx-auto mt-20">
        <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.8] mb-12">
          ABOUT ME
        </h1>
        <div className="md:hidden mb-10">
          <a
            href="/resume.pdf"
            download
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100"
          >
            DOWNLOAD RESUME
          </a>
        </div>
        <div className="text-base md:text-xl leading-relaxed font-normal opacity-80 space-y-8">
          <p>
            Hi! My name is Bartek, I'm 22 and I'm a graphic and layout designer pursuing a bachelor's degree in Computer Science from Poland.
          </p>
          <p>
            I'm a 2nd year student of Computer Science at the International Faculty of Engineering at Lodz University of Technology. The courses I've taken include Algorithms and Data Structures, Programming and Data Structures in C, Object-Oriented Programming in C++, Java Fundamentals, Web Programming, Computer Networks, Databases, and more. Since I'm at the international faculty, I'm pursuing my degree entirely in English.
          </p>
          <p>
            I graduated from Zespol Szkol Elektronicznych im. Bohaterow Westerplatte in Radom in 2024, where I also specialized in Computer Science. During those years I learned the basics of programming in Pascal, C++, Java, and HTML/CSS/JS.
          </p>
          <p>
            I am primarily a graphic and layout designer. I've been creating visual media ever since I can remember. I have about 5 years of professional experience in graphic design. I have worked with clients from all across the world, creating visually compelling designs for various purposes, mostly advertising campaigns and social media posts. In my high school years, I was the editor-in-chief of the school magazine, responsible for its layout, typography, and overall visual design.
          </p>
          <p>
            Outside of graphic design, I do programming. I have experience with many programming stacks and languages - it's safe to say I don't have a preferred one. I've worked with C, C++, C#, Python, Java, Pascal, HTML, CSS, JavaScript, TypeScript, PHP, SQL, and many frameworks such as .NET, React, Node.js. I have experience with creating .NET Windows Forms applications, as well as Android apps with Android Studio. Right now I'm interested in creating web applications, such as the one you're currently viewing.
          </p>
          <p>
            As my personal hobby I do music production. I am proficient in both FL Studio and Ableton Live, and I play around with music in various genres. It's a great creative outlet for me. I've had some success with it, producing and selling music for underground artists.
          </p>
          <p>
            During my years in high school I also taught myself video editing: I know my ways around Vegas Pro, Premiere Pro and some basics of After Effects. I am yet to learn DaVinci Resolve, but I plan to do so in the future.
          </p>
          <p>
            In 2024 I got a Certificate of Advanced English from Cambridge University. This is an official C1 certificate, on which I scored 206 out of 210, which grants me the C2 CEFR level. This has been handy for me during my studies and while working with international clients.
          </p>
          <p>
            I'm always open to new projects and collaborations! If you'd like to discuss a potential partnership or just say hi, feel free to reach out.
          </p>

          <div className="hidden pt-8 md:block">
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
