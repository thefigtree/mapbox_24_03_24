import mapboxgl from "mapbox-gl";
import Styles from "./map.module.css";
import { Component } from "react";
import React from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhlZmlndHJlZSIsImEiOiJjbHU2dGNqOXkxM3A5MmlueGt3a2t5eHg1In0.lMHvAH6DgMIU5iT6Z8rmxg";

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.lat,
      lng: props.lng,
      zoom: props.zoom,
      myMap: null,
    };

    this.loadMap = this.loadMap.bind(this);
    this.flyTo = this.flyTo.bind(this);
    this.mapContainer = React.createRef();
  }

  async loadMap() {
    const { lng, lat, zoom } = this.state;

    const mobileOrNot = window.matchMedia("(max-width: 800px)");
    const attractions = this.props.data;

    console.log("MOBILE ?", mobileOrNot.matches);

    const optimalZoom =
      mobileOrNot.matches && attractions.length > 1 ? 1.2 : zoom;

    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/hillodesign/clb95v8zd000v15nudmodao0i",
      center: [lng, lat],
      zoom: optimalZoom,
    });

    console.log(attractions);

    if (attractions.length > 1) {
      attractions.map((attraction) => {
        const long = attraction.lng;
        const lat = attraction.lat;

        const popup = new mapboxgl.Popup({
          anchor: "bottom-left",
          offset: 25,
          closeOnClick: true,
        }).setMaxWidth("360px").setHTML(`
                    <a href=${attraction.id}>
                        <h3> ${attraction.title} </h3>
                    </a>
                `);

        const marker = new mapboxgl.Marker({
          color: `black`,
          occludedOpacity: 0.1,
        })
          .setLngLat([long, lat])
          .setPopup(popup)
          .addTo(map);
      });
    } else {
      const long = attractions.lng;
      const lat = attractions.lat;

      const marker = new mapboxgl.Marker({
        color: `black`,
        occludedOpacity: 0.1,
      })
        .setLngLat([long, lat])
        .addTo(map);
    }

    this.setState({
      myMap: map,
    });
  }

  async flyTo(event) {
    const lng = event.target.dataset.lng;
    const lat = event.target.dataset.lat;

    console.log("Triggered", lng, lat, this.state.zoom);
    const map = this.state.myMap;
    map.flyTo({
      center: [lng, lat],
      zoom: 4,
    });
  }

  componentDidMount() {
    this.loadMap();
  }

  render() {
    return (
      <div>
        <span id="trigger" onClick={this.flyTo}></span>
        <div
          style={{
            width: `${this.props.width}`,
            height: `${this.props.height}`,
          }}
          className={Styles.map}
          ref={this.mapContainer}
        ></div>
      </div>
    );
  }
}
