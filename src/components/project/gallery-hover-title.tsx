'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

// Shows the hovered project's title as large text next to the logo. The card under the cursor is
// hit-tested every frame, so the title also updates while the gallery scrolls beneath a still cursor.
// Only used with a mouse; touch devices keep the titles printed on the cards.
export function GalleryHoverTitle({ containerRef }: { containerRef: RefObject<HTMLElement> }) {
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
    // Sits 1rem right of the logo and is vertically centred on it. The logo (see FixedLogo) is 2.5rem tall (3rem on
    // md) with a 480:321 aspect ratio, placed at left 2rem / 4rem / 6rem and top 2.5rem / 4rem.
    <div
      ref={labelRef}
      aria-hidden="true"
      data-visible="false"
      className="pointer-events-none fixed left-[6.75rem] top-[calc(3.75rem+env(safe-area-inset-top))] z-[60] flex max-w-[calc(100vw-8.75rem)] -translate-y-1/2 whitespace-nowrap text-white opacity-0 transition-opacity duration-200 [paint-order:stroke_fill] data-[visible=true]:opacity-100 md:left-[9.5rem] md:top-[5.5rem] md:max-w-[calc(100vw-11.5rem)] lg:left-[11.5rem] lg:max-w-[calc(100vw-13.5rem)]"
    >
      {/* White text with a black outline, like the stroked logo, stays readable over any image. The outline is
          painted under the fill (paint-order) so it does not eat into the letters. */}
      <span ref={titleRef} className="text-[clamp(1.75rem,3vw,3rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em] [-webkit-text-stroke:0.16em_#0b0b0b]" />
    </div>
  );
}
