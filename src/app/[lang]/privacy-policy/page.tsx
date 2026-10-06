import type { Metadata } from 'next';
import { TextPage } from '@/components/layout/text-page';
import { getAlternates } from '@/lib/i18n';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isPolish = params.lang !== 'en';

  return {
    title: isPolish ? 'Polityka prywatności' : 'Privacy Policy',
    description: isPolish
      ? 'Polityka prywatności strony bartlomiejcwiklak.com.'
      : 'Privacy policy of bartlomiejcwiklak.com.',
    alternates: getAlternates('/privacy-policy', isPolish ? 'pl' : 'en')
  };
}

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
