"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Navigation,
  Calendar,
  Info,
  Heart,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

interface HealthUnit {
  id: string;
  name: string;
  address: string;
  location: any;
  distance?: string;
  duration?: string;
  openNow?: boolean;
  rating?: number;
  phoneNumber?: string;
  website?: string;
  photos?: any[];
  types?: string[];
}

interface HealthUnitDetailsProps {
  unit: HealthUnit;
  onClose: () => void;
}

export default function HealthUnitDetails({
  unit,
  onClose,
}: HealthUnitDetailsProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [photoIndex, setPhotoIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatType = (type: string) => {
    const typeMap: Record<string, string> = {
      hospital: "Hospital",
      health: "Saúde",
      doctor: "Médico",
      pharmacy: "Farmácia",
      physiotherapist: "Fisioterapeuta",
      dentist: "Dentista",
      health_clinic: "Clínica de Saúde",
      medical_clinic: "Clínica Médica",
      emergency_clinic: "Clínica de Emergência",
      emergency_room: "Sala de Emergência",
      clinic: "Clínica",
      point_of_interest: "Ponto de Interesse",
      establishment: "Estabelecimento",
    };

    return typeMap[type] || type.replace(/_/g, " ");
  };

  const getPhotoUrl = (photo: any | undefined) => {
    if (!photo) {
      return "/placeholder.svg?height=300&width=400";
    }

    try {
      if (typeof photo.getUrl === "function") {
        const url = photo.getUrl({ maxWidth: 400, maxHeight: 300 });
        return url;
      } else if (
        photo.html_attributions &&
        photo.html_attributions.length > 0
      ) {
        if (typeof photo.getUrl === "function") {
          return photo.getUrl({ maxWidth: 400, maxHeight: 300 });
        }
      } else if (typeof photo === "string") {
        return photo;
      } else {
        const url =
          photo.getUrl && photo.getUrl({ maxWidth: 400, maxHeight: 300 });
        if (url) {
          return url;
        }
      }
    } catch (error) {
      console.error("Error getting photo URL:", error);
    }

    return "/placeholder.svg?height=300&width=400";
  };

  const navigatePhotos = (direction: number) => {
    if (!unit.photos || unit.photos.length === 0) return;

    let newIndex = photoIndex + direction;
    if (newIndex < 0) newIndex = unit.photos.length - 1;
    if (newIndex >= unit.photos.length) newIndex = 0;

    setPhotoIndex(newIndex);
  };

  const openDirections = () => {
    if (!unit.location) return;

    try {
      const lat =
        typeof unit.location.lat === "function"
          ? unit.location.lat()
          : unit.location.lat;
      const lng =
        typeof unit.location.lng === "function"
          ? unit.location.lng()
          : unit.location.lng;
      const destination = `${lat},${lng}`;
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${unit.id}`,
        "_blank",
      );
    } catch (error) {
      console.error("Error opening directions:", error);
    }
  };

  return (
    <div className="bg-card flex flex-col h-96 animate-fadeIn p-4 md:px-2 border-t md:border-t-0">
      <CardHeader className="flex flex-row items-start justify-between py-2 pb-2 border-b flex-shrink-0">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg text-foreground truncate">
            {unit.name}
          </CardTitle>
          <CardDescription className="flex items-start gap-1 mt-0.5 text-xs">
            <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="truncate">{unit.address}</span>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0 -mr-1 h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
      </CardHeader>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col flex-1"
        >
          <div className="py-2 pt-2 flex-shrink-0">
            <TabsList className="w-full justify-start h-8">
              <TabsTrigger
                value="info"
                className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 ease-in-out text-xs h-6"
              >
                <Info className="h-3 w-3" />
                Informações
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 ease-in-out text-xs h-6"
              >
                <Calendar className="h-3 w-3" />
                Fotos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden min-h-0 h-[160px]">
            <TabsContent
              value="info"
              className="data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 h-full"
            >
              <ScrollArea className="h-full">
                <div className="py-2 space-y-2 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">
                        Distância
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Navigation className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">
                          {unit.distance || "Não disponível"}
                        </span>
                      </div>
                    </div>

                    {unit.rating !== undefined && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Avaliação
                        </div>
                        <div className="flex items-center gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round(unit.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400 dark:text-yellow-300 dark:fill-yellow-300"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          <span className="text-xs ml-1 text-foreground">
                            {unit.rating}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">
                        Website
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={unit.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline max-w-[120px] truncate"
                        >
                          {unit.website || "Não disponivel"}
                        </a>
                      </div>
                    </div>

                    {unit.types && unit.types.length > 0 && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Tipo
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {unit.types
                            .filter(
                              (type) =>
                                ![
                                  "point_of_interest",
                                  "establishment",
                                ].includes(type),
                            )
                            .slice(0, 2)
                            .map((type, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-[10px] px-1 py-0 h-4"
                              >
                                {formatType(type)}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">
                        Tempo estimado
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">
                          {unit.duration || "Não disponível"}
                        </span>
                      </div>
                    </div>

                    {unit.openNow !== undefined && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Status
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={unit.openNow ? "outline" : "secondary"}
                            className={`text-[10px] px-1 py-0 h-4 ${unit.openNow ? "text-green-600" : ""}`}
                          >
                            {unit.openNow ? "Aberto" : "Fechado"}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {unit.phoneNumber && (
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Telefone
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={`tel:${unit.phoneNumber}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {unit.phoneNumber}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="photos"
              className="data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-2 h-full"
            >
              <ScrollArea className="h-full">
                <div className="py-2 flex items-center justify-center h-full">
                  {unit.photos &&
                  Array.isArray(unit.photos) &&
                  unit.photos.length > 0 ? (
                    <div className="relative rounded-lg overflow-hidden h-[160px] w-full max-w-sm mx-auto">
                      <img
                        src={getPhotoUrl(unit.photos[photoIndex])}
                        alt={`${unit.name} - foto ${photoIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=300&width=400";
                        }}
                      />

                      {unit.photos.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5">
                          {unit.photos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPhotoIndex(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                i === photoIndex ? "bg-white" : "bg-white/50"
                              }`}
                              aria-label={`Ver foto ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {unit.photos.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white rounded-full p-0.5 h-6 w-6"
                            onClick={() => navigatePhotos(-1)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/40 text-white rounded-full p-0.5 h-6 w-6"
                            onClick={() => navigatePhotos(1)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-28 w-full max-w-sm mx-auto text-muted-foreground rounded-lg bg-muted/20 border-2 border-dashed border-muted">
                      <Info className="h-6 w-6 mb-1 opacity-30" />
                      <p className="text-xs font-medium">
                        Nenhuma foto disponível
                      </p>
                      <p className="text-[10px] mt-0.5">
                        Esta unidade não possui fotos
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
        <div className="pt-2 pb-2 bg-card flex-shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isFavorite(unit.id) ? "default" : "outline"}
              onClick={() => {
                const isFav = toggleFavorite({
                  id: unit.id,
                  name: unit.name,
                  address: unit.address,
                  location: unit.location,
                  rating: unit.rating,
                  phoneNumber: unit.phoneNumber,
                  website: unit.website,
                  types: unit.types,
                });
                toast({
                  title: isFav
                    ? "Adicionado aos favoritos"
                    : "Removido dos favoritos",
                  description: isFav
                    ? `${unit.name} foi adicionado à sua lista de favoritos`
                    : `${unit.name} foi removido da sua lista de favoritos`,
                });
              }}
              className="flex-1 h-8 text-xs"
            >
              <Heart
                className={`h-3 w-3 mr-1 ${
                  isFavorite(unit.id) ? "fill-current text-red-500" : ""
                }`}
              />
              {isFavorite(unit.id) ? "Favoritado" : "Favoritar"}
            </Button>
            <Button onClick={openDirections} className="flex-1 h-8 text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              Como chegar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
