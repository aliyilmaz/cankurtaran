# Leaflet GPS Control

This is a custom Leaflet control to track the user's GPS location on a map. It allows users to toggle the location tracking feature on and off, and the map will automatically update and center on the user's location. The marker representing the user's location will animate by growing and shrinking.

## Features
- Toggle location tracking on/off.
- GPS location updates.
- Animated marker (growing and shrinking effect).
- Map re-centering based on the updated GPS coordinates.
- Customizable button title.

## Requirements
- [Leaflet.js](https://leafletjs.com/) (v1.x+)

## Installation

### 1. Include Leaflet.js and Leaflet CSS

Ensure that you include the Leaflet.js library in your HTML. You can use a CDN or download it manually.

```html
<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
```

### 2. Include the GPS Location Control Files
You should include the custom CSS and JavaScript files in your project. Make sure both ``leaflet-gps-control.css`` and ``leaflet-gps-control.js`` are in the same directory as your HTML file.

```html
<!-- Include the GPS Location Control CSS -->
<link rel="stylesheet" href="leaflet-gps-control.css" />

<!-- Include the GPS Location Control JS -->
<script src="leaflet-gps-control.js"></script>
```

## Usage
### 1. Create a Map
Create a basic Leaflet map where the GPS location control will be added.
```html
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

### 2. Add the GPS Location Control
Add the custom GPS location control to your map. The control will be positioned at the top right corner by default.
```html
L.control.gpsLocation({ 
    position: 'topright',  // Position of the control button
    title: 'Start GPS Tracking'  // Title that appears when the user hovers over the button
}).addTo(map);
```

### 3. Add a Map Container in HTML
Ensure that your HTML contains a container for the map.
```html
<div id="map"></div>
```
## How It Works
- The **GPS Location Control** will appear as a button on the map.
- When clicked, the button will toggle location tracking on and off.
- When tracking is active, the browser's geolocation API will continuously update the user's position.
- The map will automatically recenter on the user's current location.
- The marker representing the user's location will animate by growing and shrinking.

## Customization
### Change the Button Position
The position of the GPS tracking button can be customized using the ``position`` option when creating the control. It can be set to one of the following values:
- ``'topleft'``
- ``'topright'``
- ``'bottomleft'``
- ``'bottomright'``

Example:
```javascript
L.control.gpsLocation({ position: 'bottomright' }).addTo(map);
```

### Change the Marker Size or Animation
You can adjust the size of the animated marker by modifying the ``width`` and ``height`` properties in the CSS, or change the ``@keyframes`` animation to control how the marker grows and shrinks.

```css
.animated-marker .marker {
    width: 30px;  /* Adjust size */
    height: 30px;  /* Adjust size */
    animation: growShrink 1s ease-in-out infinite;
}
```
### Set a Custom Title for the Button
You can customize the ``title`` of the GPS tracking button. The ``title`` is the text that appears as a tooltip when the user hovers over the button.

Example:
```javascript
L.control.gpsLocation({
    position: 'topright', 
    title: 'Click to Start Location Tracking'  // Custom title for the button
}).addTo(map);
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Feel free to fork the repository and contribute by opening issues or creating pull requests.