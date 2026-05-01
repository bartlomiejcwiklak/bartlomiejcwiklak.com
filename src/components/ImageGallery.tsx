import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
  title: string;
  description?: string;
  fullWidth?: boolean;
}

const GalleryImage = ({ src, index, fullWidth }: { src: string; index: number; fullWidth?: boolean }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.02, 0.98]);

  return (
    <div ref={ref} className={`relative w-full flex justify-center items-center mb-40 last:mb-0 ${fullWidth ? 'min-h-screen' : 'min-h-[40vh]'}`}>
      <motion.img
        src={src}
        alt={`Gallery image ${index + 1}`}
        style={{ scale }}
        className={`${fullWidth ? 'w-full h-auto' : 'max-w-full max-h-[90vh] w-auto h-auto object-contain shadow-2xl'}`}
      />
    </div>
  );
};

const ImageGallery = ({ images, onClose, title, description, fullWidth }: ImageGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl selection:bg-white selection:text-black"
    >
      {/* Header - Fixed relative to the viewport/overlay */}
      <div className="absolute top-0 left-0 right-0 z-[110] p-8 md:p-12 flex justify-between items-start pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2 max-w-sm md:max-w-md"
        >
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Project Gallery</span>
          <h2 className="text-xl md:text-3xl font-bold tracking-tighter uppercase leading-tight">{title}</h2>
          {description && (
            <p className="hidden md:block text-zinc-400 text-xs md:text-sm leading-relaxed mt-4 max-w-sm font-mono opacity-60">
              {description}
            </p>
          )}
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClose}
          className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors pointer-events-auto"
        >
          <X size={24} />
        </motion.button>
      </div>

      {/* Scrollable Content Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <div className={`mx-auto flex flex-col items-center py-40 md:py-60 ${fullWidth ? 'w-full' : 'max-w-6xl px-6'}`}>
          {images.map((src, index) => (
            <GalleryImage key={index} src={src} index={index} fullWidth={fullWidth} />
          ))}
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <button 
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-500 hover:text-white transition-colors pb-20"
            >
              End of Gallery / Close
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageGallery;
