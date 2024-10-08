mapboxgl.accessToken = mapToken;
//const Campground = JSON.parse(campground)
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);
