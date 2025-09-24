import { useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";

export default function LocateButton() {
  const map = useMap() as LeafletMap;
  return (
    <button
      onClick={() => {
        map.locate().on("locationfound", (e: any) => {
          map.flyTo(e.latlng, 14, { duration: 0.75 });
        });
      }}
      className="absolute bottom-5 right-5 z-[1000] rounded-2xl bg-white/90 px-3 py-2 text-sm font-semibold shadow-md hover:bg-white"
    >
      Locate me
    </button>
  );
}
