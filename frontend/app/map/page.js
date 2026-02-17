import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues with Leaflet
const AirQualityMap = dynamic(
  () => import('../../components/AirQualityMap'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div>
      <AirQualityMap />
    </div>
  );
}