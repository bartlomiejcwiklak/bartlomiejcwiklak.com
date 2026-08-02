import { useLayoutEffect, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';

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
  const isPolish = i18n.language === 'pl';
  const description = project
    ? (isPolish && project.pl?.description ? project.pl.description : project.description)
    : t('project.notFound');

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  usePageMeta({
    title: project ? `${project.title} | Bartlomiej Cwiklak` : `Project Not Found | Bartlomiej Cwiklak`,
    description,
    path: project ? `/project/${project.id}` : '/project/not-found',
    lang: i18n.language,
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <h1 className="text-4xl">{t('project.notFound')}</h1>
        <button onClick={() => navigate('/')} className="ml-4 underline">{t('project.goBack')}</button>
      </div>
    );
  }

  const content = isPolish && project.pl?.content ? project.pl.content : project.content;
  const category = t(`categories.${project.category}`, project.category);
  const hasContent = Boolean(content?.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white text-black"
    >

      {/* HERO — full screen, title only */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-32 md:pt-44 pb-10 md:pb-14">
        <div className="flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-sans uppercase tracking-[0.18em] opacity-40"
          >
            {category}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-sans tabular-nums opacity-40"
          >
            {project.year}
          </motion.span>
        </div>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-display font-black text-black leading-[0.85] tracking-tighter text-[15vw]"
        >
          {project.title}
        </motion.h1>
      </section>

      {/* COVER IMAGE — full screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="h-screen w-full overflow-hidden"
      >
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8 }}
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* CONTENT */}
      <div>
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
            {hasContent ? (content ?? []).map((block, idx) => {

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
                  <motion.div key={idx} {...blockMotion} className="w-full bg-black text-white py-14 md:py-20">
                    <div className="max-w-5xl mx-auto px-6 md:px-12">
                      <blockquote className="font-display font-black text-3xl md:text-5xl leading-[1.1] tracking-tighter mb-8">
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
                      loading="lazy"
                      decoding="async"
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
                          loading="lazy"
                          decoding="async"
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
                  {t('project.comingSoon')}
                </p>
              </motion.div>
            )}
          </div>

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
