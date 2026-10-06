import type { Metadata } from 'next';
import { TextPage } from '@/components/layout/text-page';
import { getAlternates } from '@/lib/i18n';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isPolish = params.lang !== 'en';

  return {
    title: isPolish ? 'Polityka AI' : 'AI Policy',
    description: isPolish
      ? 'Jak Bartłomiej Ćwiklak korzysta z narzędzi AI w pracy projektowej i programistycznej.'
      : 'How Bartłomiej Ćwiklak uses AI tools in design and development work.',
    alternates: getAlternates('/ai-policy', isPolish ? 'pl' : 'en')
  };
}

export default function AiPolicyPage() {
  return (
    <TextPage
      titleKey="aiPolicy"
      subtitleKey="aiTitle"
      introKey="aiIntro"
      sections={[
        { titleKey: 'aiHumanTitle', paragraphKeys: ['aiHumanP1', 'aiHumanP2', 'aiHumanP3'] },
        { titleKey: 'aiCopilotTitle', paragraphKeys: ['aiCopilotP1', 'aiCopilotP2', 'aiCopilotP3', 'aiCopilotP4'] }
      ]}
    />
  );
}
