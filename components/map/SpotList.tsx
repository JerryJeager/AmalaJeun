"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  UtensilsCrossed,
  List,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AmalaSpotNew } from "@/types/type";

interface SpotsListSheetProps {
  spots: AmalaSpotNew[];
  onSpotSelect?: (spot: AmalaSpotNew) => void;
}

export function SpotsListSheet({ spots, onSpotSelect }: SpotsListSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return spots;

    const query = searchQuery.toLowerCase();
    return spots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(query) ||
        spot.address.toLowerCase().includes(query) ||
        spot.added_by.toLowerCase().includes(query)
    );
  }, [spots, searchQuery]);

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleSpotClick = (spot: AmalaSpotNew) => {
    onSpotSelect?.(spot);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className=" shadow-lg bg-transparent hover:bg-primary hover:text-white"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Open spots list</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-xl font-semibold">Amala Spots</SheetTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search spots by name, address, or added by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredSpots.length} spot{filteredSpots.length !== 1 ? "s" : ""}{" "}
              found
            </span>
            <span>{spots.filter((s) => s.verified).length} verified</span>
          </div>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 px-6 h-[70vh]">
          <div className="space-y-4 py-4">
            {filteredSpots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No spots found matching your search.</p>
              </div>
            ) : (
              filteredSpots.map((spot) => (
                <Card
                  key={spot.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSpotClick(spot)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium text-balance">
                        {spot.name}
                      </CardTitle>
                      <div className="flex gap-1 ml-2">
                        {spot.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {spot.dine_in && (
                          <Badge variant="outline" className="text-xs">
                            <UtensilsCrossed className="h-3 w-3 mr-1" />
                            Dine-in
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-pretty">{spot.address}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(spot.opening_time)} -{" "}
                          {formatTime(spot.closing_time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatPrice(spot.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      {spot.added_by && <span>Added by {spot.added_by}</span>}
                      <span>
                        Source:{" "}
                        {spot.source == "user" ? spot.source : "AI/Scrapper"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
