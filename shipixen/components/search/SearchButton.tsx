import { KBarButton } from '@shipixen/pliny/search/KBarButton';
import { siteConfig } from '@/data/config/site.settings';
import { SearchIcon } from 'lucide-react';

const SearchButton = () => {
  if (siteConfig.search) {
    return (
      <KBarButton aria-label="Search">
        <SearchIcon className="w-4 h-4 md:w-6 md:h-6" />
      </KBarButton>
    );
  }
};

export default SearchButton;
