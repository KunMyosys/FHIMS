import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface FavoriteItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (path: string) => void;
  toggleFavorite: (item: FavoriteItem) => void; // ✅ Added this
  isFavorite: (path: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('fhims-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem('fhims-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Add a favorite
  const addFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.path === item.path)) return prev;
      return [...prev, item];
    });
  };

  // ✅ Remove a favorite
  const removeFavorite = (path: string) => {
    setFavorites(prev => prev.filter(fav => fav.path !== path));
  };

  // ✅ Check if something is favorite
  const isFavorite = (path: string) => {
    return favorites.some(fav => fav.path === path);
  };

  // ✅ Toggle favorite (used in DashboardLayout)
  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.path)) {
      removeFavorite(item.path);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
