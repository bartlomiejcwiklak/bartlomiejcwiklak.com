import { useLayoutEffect, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';

const blockMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55 }
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const project = projects.find(p => p.id === id);

  const [lightbox, setLightbox] = useState<{ src: string; caption?: string } | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <h1 className="text-4xl">Project not found</h1>
        <button onClick={() => navigate('/')} className="ml-4 underline">Go back</button>
      </div>
    );
  }

  const isPolish = i18n.language === 'pl';
  const description = isPolish && project.pl?.description ? project.pl.description : project.description;
  const content = isPolish && project.pl?.content ? project.pl.content : project.content;
  const category = t(`categories.${project.category}`, project.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-white text-black pt-32 md:pt-48 pb-[100px]"
    >
      <div className="w-full mx-auto">

        {/* Hero image */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full h-[75vh] md:h-auto md:aspect-[21/9] bg-gray-100 overflow-hidden"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 pointer-events-none" />
          <h1
            className="absolute -bottom-8 md:-bottom-16 left-6 md:left-12 font-display font-black text-white text-6xl md:text-[12rem] tracking-tighter leading-[0.85] pointer-events-none z-10"
            style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}
          >
            {project.title}
          </h1>
        </motion.div>

        {/* Content area */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 md:mt-48"
        >

          {/* Metadata strip */}
          <div className="border-t border-b border-black px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-[0.18em] opacity-40">
              {category}
            </span>
            <span className="text-xs font-sans tabular-nums opacity-40">
              {project.year}
            </span>
          </div>

          {/* Description */}
          <div className="px-6 md:px-12 max-w-5xl mx-auto pt-10 md:pt-14 pb-12 md:pb-16">
            <p className="text-xl md:text-3xl leading-relaxed font-bold">
              {description}
            </p>
          </div>

          {/* Content blocks */}
          <div className="flex flex-col gap-14 md:gap-20 pb-32 md:pb-48">
            {content ? content.map((block, idx) => {

              if (block.type === 'text') {
                return (
                  <motion.div key={idx} {...blockMotion} className="px-6 md:px-12 max-w-5xl mx-auto w-full">
                    <p className="text-base md:text-lg leading-relaxed opacity-60 max-w-2xl">
                      {block.value}
                    </p>
                  </motion.div>
                );
              }

              if (block.type === 'quote') {
                return (
                  <motion.div key={idx} {...blockMotion} className="w-full bg-black text-white px-6 md:px-12 py-14 md:py-20">
                    <div className="max-w-5xl mx-auto">
                      <blockquote className="font-display font-black text-3xl md:text-5xl leading-[0.9] tracking-tighter mb-8">
                        "{block.value}"
                      </blockquote>
                      {block.author && (
                        <span className="text-xs font-bold opacity-50 uppercase tracking-widest flex items-center gap-4">
                          <div className="w-8 h-[2px] bg-current shrink-0" />
                          {block.link ? (
                            <a href={block.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity underline underline-offset-4">
                              {block.author}
                            </a>
                          ) : block.author}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              }

              if (block.type === 'image') {
                return (
                  <motion.figure key={idx} {...blockMotion} className="px-6 md:px-12 max-w-5xl mx-auto w-full">
                    <img
                      src={block.url}
                      alt={block.caption || 'Project image'}
                      className="w-full h-auto object-cover cursor-zoom-in"
                      onClick={() => setLightbox({ src: block.url, caption: block.caption })}
                    />
                    {block.caption && (
                      <figcaption className="mt-3 text-[10px] md:text-xs font-sans opacity-40 uppercase tracking-widest">
                        {block.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                );
              }

              if (block.type === 'gallery') {
                return (
                  <motion.div key={idx} {...blockMotion} className="px-6 md:px-12 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {block.images.map((img, imgIdx) => (
                      <figure key={imgIdx} className="w-full flex flex-col">
                        <img
                          src={img.url}
                          alt={img.caption || 'Gallery image'}
                          className="w-full h-full object-cover cursor-zoom-in"
                          onClick={() => setLightbox({ src: img.url, caption: img.caption })}
                        />
                        {img.caption && (
                          <figcaption className="mt-2 text-[10px] md:text-xs font-sans opacity-40 uppercase tracking-widest">
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
              <motion.div {...blockMotion} className="px-6 md:px-12 max-w-5xl mx-auto w-full">
                <p className="text-base md:text-lg leading-relaxed opacity-60 max-w-2xl">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </motion.div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightbox.src}
              alt={lightbox.caption || ''}
              className="max-w-full max-h-full object-contain select-none"
              onClick={() => setLightbox(null)}
            />
            {lightbox.caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-widest font-sans whitespace-nowrap">
                {lightbox.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProjectDetails;
