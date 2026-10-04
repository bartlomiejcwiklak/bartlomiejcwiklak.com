import type { Metadata } from 'next';
import { TextPage } from '@/components/layout/text-page';

export const metadata: Metadata = {
  title: 'Polityka AI',
  description: 'Jak Bartłomiej Ćwiklak korzysta z narzędzi AI w pracy projektowej i programistycznej.',
  alternates: {
    canonical: '/ai-policy'
  }
};

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
