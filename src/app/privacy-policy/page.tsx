import type { Metadata } from 'next';
import { TextPage } from '@/components/layout/text-page';

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description: 'Polityka prywatności strony bartlomiejcwiklak.com.',
  alternates: {
    canonical: '/privacy-policy'
  }
};

export default function PrivacyPolicyPage() {
  return (
    <TextPage
      titleKey="privacyTitle"
      sections={[
        { titleKey: 'privacyH1', paragraphKeys: ['privacyP1'] },
        { titleKey: 'privacyH2', paragraphKeys: ['privacyP2'] },
        { titleKey: 'privacyH3', paragraphKeys: ['privacyP3'] },
        { titleKey: 'privacyH4', paragraphKeys: ['privacyP4'] }
      ]}
    />
  );
}
