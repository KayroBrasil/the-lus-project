"use client";

import { useState, useEffect } from "react";

export interface FavoriteUnit {
  id: string;
  name: string;
  address: string;
  location: any;
  rating?: number;
  phoneNumber?: string;
  website?: string;
  types?: string[];
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const userFavorites = localStorage.getItem(`favorites_${user.email}`);
        if (userFavorites) {
          setFavorites(JSON.parse(userFavorites));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = (newFavorites: FavoriteUnit[]) => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        localStorage.setItem(
          `favorites_${user.email}`,
          JSON.stringify(newFavorites),
        );
      }
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  };

  const addFavorite = (unit: Omit<FavoriteUnit, "addedAt">) => {
    const newFavorite: FavoriteUnit = {
      ...unit,
      addedAt: new Date().toISOString(),
    };
    const newFavorites = [...favorites, newFavorite];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    return true;
  };

  const removeFavorite = (unitId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== unitId);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    return true;
  };

  const isFavorite = (unitId: string) => {
    return favorites.some((fav) => fav.id === unitId);
  };

  const toggleFavorite = (unit: Omit<FavoriteUnit, "addedAt">) => {
    if (isFavorite(unit.id)) {
      removeFavorite(unit.id);
      return false;
    } else {
      addFavorite(unit);
      return true;
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
}
