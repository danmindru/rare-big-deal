import { Showcase } from './Showcase';
import { picksIndex } from '@/data/picks/index';

const weightedBundles = [
  ...Array(3).fill('ai-apps.js'),
  ...Array(2).fill('mac-apps.js'),
  ...Array(2).fill('niche-apps.js'),
  ...picksIndex.filter(
    (bundle) =>
      !['ai-apps.js', 'mac-apps.js', 'niche-apps.js'].includes(bundle),
  ),
];

const getRandomBundle = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const randomIndex =
    (Math.floor(minutes / 20) + now.getHours()) % weightedBundles.length;
  return weightedBundles[randomIndex];
};

const loadBundle = async (bundleName: string) => {
  const m = await import(`@/data/picks/${bundleName}`);
  return m.default;
};

/**
 * Shows a random bundle from the picks index.
 * NB: currently disabled, used to be added to the top of the home page.
 */
export async function BundleShowcase({ className }: { className?: string }) {
  const bundleName = getRandomBundle();
  const bundle = await loadBundle(bundleName);

  if (!bundle) {
    return null;
  }

  return <Showcase className={className} bundle={bundle} />;
}

