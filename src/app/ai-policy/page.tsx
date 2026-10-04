import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/legal-page';

export const metadata: Metadata = {
  title: 'Polityka AI',
  description: 'Jak Bartłomiej Ćwiklak korzysta z narzędzi AI w pracy projektowej i programistycznej.',
  alternates: {
    canonical: '/ai-policy'
  }
};

export default function AiPolicyPage() {
  return (
    <LegalPage
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
