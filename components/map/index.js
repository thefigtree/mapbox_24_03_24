import mapboxgl from "mapbox-gl";
import Styles from "./map.module.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlZmlndHJlZSIsImEiOiJjbHU2dGNqOXkxM3A5MmlueGt3a2t5eHg1In0.lMHvAH6DgMIU5iT6Z8rmxg";

export default function Map() {
  return (
    <div>
      <div className={Styles.map}></div>
    </div>
  );
}
