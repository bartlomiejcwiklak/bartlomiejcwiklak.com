import { useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <h1 className="text-4xl">Project not found</h1>
        <button onClick={() => navigate('/')} className="ml-4 underline">Go back</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-white text-black pt-32 md:pt-48 pb-[200px] px-6 md:px-12"
    >
      <div className="w-full mx-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-[75vh] md:h-auto md:aspect-[21/9] bg-gray-100 overflow-hidden mb-12"
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover border border-black"
          />
          <h1 className="absolute -bottom-8 md:-bottom-16 left-6 md:left-12 font-display font-black text-white text-6xl md:text-[12rem] tracking-tighter leading-[0.85] opacity-90 pointer-events-none z-10" style={{ WebkitTextStroke: '1px black' }}>
            {project.title}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-12 md:gap-24 mt-24 md:mt-48"
        >


          <div className="w-full max-w-6xl mx-auto border-t border-black pt-6 flex flex-col space-y-12 md:space-y-24 pb-24">
            <div className="text-xl md:text-3xl leading-relaxed font-bold">
              {project.description}
            </div>

            {project.content ? project.content.map((block, idx) => {
              const motionProps = {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-50px" },
                transition: { duration: 0.6, delay: 0.1 }
              };

              if (block.type === 'text') {
                return (
                  <motion.p key={idx} {...motionProps} className="text-base md:text-xl leading-relaxed font-normal opacity-80 max-w-3xl">
                    {block.value}
                  </motion.p>
                );
              }
              if (block.type === 'quote') {
                return (
                  <motion.div key={idx} {...motionProps} className="flex flex-col space-y-6">
                    <blockquote className="font-display font-black text-3xl md:text-5xl leading-[0.85] tracking-tighter">
                      "{block.value}"
                    </blockquote>
                    {block.author && (
                      <span className="text-xs md:text-sm font-bold opacity-50 uppercase tracking-widest flex items-center gap-4">
                        <div className="w-8 h-[2px] bg-current"></div>
                        {block.author}
                      </span>
                    )}
                  </motion.div>
                );
              }
              if (block.type === 'image') {
                return (
                  <motion.figure key={idx} {...motionProps} className="w-full">
                    <img src={block.url} alt={block.caption || 'Project image'} className="w-full h-auto object-cover border border-black" />
                    {block.caption && (
                      <figcaption className="mt-4 text-xs md:text-sm font-bold opacity-50 uppercase tracking-widest">
                        {block.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                );
              }
              if (block.type === 'gallery') {
                return (
                  <motion.div key={idx} {...motionProps} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                    {block.images.map((img, imgIdx) => (
                      <figure key={imgIdx} className="w-full h-full flex flex-col">
                        <img src={img.url} alt={img.caption || 'Gallery image'} className="w-full flex-1 object-cover border border-black" />
                        {img.caption && (
                          <figcaption className="mt-2 text-xs md:text-sm font-bold opacity-50 uppercase tracking-widest">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </motion.div>
                );
              }
              return null;
            }) : (
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base md:text-xl leading-relaxed font-normal opacity-80 max-w-3xl"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>


    </motion.div>
  );
};

export default ProjectDetails;
