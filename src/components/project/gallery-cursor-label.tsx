'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

const CURSOR_OFFSET = 18;
const EDGE_MARGIN = 16;
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

// Shows the hovered project's title as large text that follows the cursor. It flips to the other
// side of the cursor near the right and bottom edges of the window. The card under the cursor is hit-tested
// every frame, so the label also updates while the gallery scrolls beneath a still cursor.
// Only used with a mouse; touch devices keep the titles printed on the cards.
export function GalleryCursorLabel({ containerRef }: { containerRef: RefObject<HTMLElement> }) {
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const label = labelRef.current;

    if (!container || !label || !window.matchMedia(FINE_POINTER_QUERY).matches) {
      return;
    }

    let pointerX = 0;
    let pointerY = 0;
    let isInside = false;
    let frame: number | null = null;
    let currentId: string | null = null;
    let currentCard: HTMLElement | null = null;

    // Marks the card under the cursor for the hover styling. CSS :hover can't be used: browsers don't
    // re-evaluate it while the gallery moves under a still cursor, so it sticks to cards that scrolled away.
    const setHoveredCard = (card: HTMLElement | null) => {
      if (card === currentCard) {
        return;
      }

      if (currentCard) {
        delete currentCard.dataset.hovered;
      }

      card?.setAttribute('data-hovered', 'true');
      currentCard = card;
    };

    const hide = () => {
      currentId = null;
      setHoveredCard(null);
      label.dataset.visible = 'false';
    };

    const update = () => {
      frame = null;

      if (!isInside) {
        return;
      }

      const card = document.elementFromPoint(pointerX, pointerY)?.closest<HTMLElement>('[data-project-id]');

      if (!card || !container.contains(card)) {
        hide();
      } else {
        setHoveredCard(card);

        if (card.dataset.projectId !== currentId) {
          currentId = card.dataset.projectId ?? null;
          titleRef.current!.textContent = card.dataset.projectTitle ?? '';
        }

        const { width, height } = label.getBoundingClientRect();
        const fitsRight = pointerX + CURSOR_OFFSET + width <= window.innerWidth - EDGE_MARGIN;
        const fitsBelow = pointerY + CURSOR_OFFSET + height <= window.innerHeight - EDGE_MARGIN;
        const x = fitsRight ? pointerX + CURSOR_OFFSET : pointerX - CURSOR_OFFSET - width;
        const y = fitsBelow ? pointerY + CURSOR_OFFSET : pointerY - CURSOR_OFFSET - height;

        label.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
        label.dataset.visible = 'true';
      }

      // Keep checking while the pointer is inside: the gallery keeps moving under a still cursor.
      frame = window.requestAnimationFrame(update);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      isInside = true;

      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const handlePointerLeave = () => {
      isInside = false;
      hide();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      setHoveredCard(null);
    };
  }, [containerRef]);

  return (
    <div
      ref={labelRef}
      aria-hidden="true"
      data-visible="false"
      className="pointer-events-none fixed left-0 top-0 z-[60] flex whitespace-nowrap text-white opacity-0 transition-opacity duration-200 [paint-order:stroke_fill] data-[visible=true]:opacity-100"
    >
      {/* White text with a black outline, like the stroked logo, stays readable over any image. The outline is
          painted under the fill (paint-order) so it does not eat into the letters. */}
      <span ref={titleRef} className="text-[clamp(1.75rem,3vw,3rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em] [-webkit-text-stroke:0.16em_#0b0b0b]" />
    </div>
  );
}
