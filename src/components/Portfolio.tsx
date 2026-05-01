import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Code, Image as ImageIcon } from 'lucide-react';
import ImageGallery from './ImageGallery';

const Github = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { projects, categories } from '../data/projects';
import type { Project } from '../data/projects';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = parseInt(a.year || '0');
    const yearB = parseInt(b.year || '0');
    return yearB - yearA;
  });

  const filteredProjects = activeCategory === 'All'
    ? sortedProjects
    : sortedProjects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-transparent text-white px-8 py-20 md:px-12 md:py-32 font-sans overflow-y-auto">
      {/* Navigation */}
      <div className="fixed bottom-8 left-8 md:bottom-12 md:left-12 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeIn", delay: 0.4 }}
        >
          <Link
            to="/"
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white hover:text-zinc-400 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-16 md:mb-24 px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            PORTFOLIO
          </h1>
          <p className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-[0.2em] max-w-xs">
            Selected works and experiments
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeIn", delay: 0.1 }}
        className="max-w-4xl mx-auto mb-12 overflow-x-auto"
      >
        <div className="flex gap-8 border-b border-white/10 pb-4 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-mono text-[10px] md:text-xs uppercase tracking-widest transition-all relative ${activeCategory === category ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                }`}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-white"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-20"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center"
            >
              {/* Image Container */}
              <div className="relative w-full md:w-2/5 aspect-video md:aspect-[4/3] overflow-hidden bg-zinc-900 shrink-0">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener"
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener"
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.gallery && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <ImageIcon size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{project.category}</span>
                    {project.year && (
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{project.year}</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{project.title}</h3>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-mono opacity-70">
                  {project.description}
                </p>

                <div className="flex gap-4 mt-2">
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" rel="noopener" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Live Demo</a>
                  )}
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Source Code</a>
                  )}
                  {project.gallery && (
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                    >
                      Gallery
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Image Gallery Overlay */}
      <AnimatePresence>
        {selectedProject && selectedProject.gallery && (
          <ImageGallery 
            images={selectedProject.gallery} 
            title={selectedProject.title} 
            description={selectedProject.description}
            fullWidth={selectedProject.galleryFullWidth === 1}
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
