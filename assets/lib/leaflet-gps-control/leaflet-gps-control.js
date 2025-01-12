L.Control.GpsLocation = L.Control.extend({
    options: {
        position: 'topleft',
        title: '',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        if (!this.options.title || this.options.title === undefined || this.options.title === null) {
            this.options.title = 'Location tracking';
        }
    },

    onAdd: function (map) {
        this._map = map;

        // Create the button container
        this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        this._button = L.DomUtil.create('a', '', this._container);
        this._button.href = '#';
        this._button.title = this.options.title;

        // Add the SVG icon to the button
        this._icon = L.DomUtil.create('div', '', this._button);
        this._icon.innerHTML = `
            <svg style="margin: 7px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair" viewBox="0 0 16 16">
                <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
            </svg>
        `;
        this._icon.style.width = '24px';
        this._icon.style.height = '24px';

        // Add event listener to toggle tracking when the button is clicked
        L.DomEvent.on(this._button, 'click', this._toggleTracking, this);

        return this._container;
    },

    _toggleTracking: function (e) {
        e.preventDefault();

        // Toggle the location tracking feature
        if (this._tracking) {
            this._stopTracking();
        } else {
            this._startTracking();
        }
    },

    _startTracking: function () {
        if (this._tracking) return;

        this._tracking = true;
        this._button.style.color = 'rgb(22 149 55)';  // Change button color when tracking is active

        // Start location tracking if geolocation is available
        if (navigator.geolocation) {
            this._watchId = navigator.geolocation.watchPosition(this._onLocationUpdate.bind(this), this._onLocationError.bind(this), {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 5000
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    },

    _stopTracking: function () {
        if (!this._tracking) return;

        this._tracking = false;
        this._button.style.color = '';  // Reset button color when tracking is stopped

        // Stop location tracking
        if (this._watchId) {
            navigator.geolocation.clearWatch(this._watchId);
            this._watchId = null;
        }

        // Remove the location marker from the map
        if (this._marker) {
            this._map.removeLayer(this._marker);
            this._marker = null;
        }
    },

    _onLocationUpdate: function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // Create or update the location marker with CSS animation
        if (!this._marker) {
            // Create a marker using divIcon to apply CSS animation
            this._marker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'animated-marker',  // CSS class for animation
                    html: '<div class="marker"></div>',  // Div element for the marker
                    iconSize: [24, 24]  // Set the size of the marker
                })
            }).addTo(this._map);
        } else {
            this._marker.setLatLng([lat, lon]);
        }

        // Re-center the map to the updated location
        this._map.setView([lat, lon], this._map.getZoom());
    },

    _onLocationError: function (error) {
        console.error(error.message);
        alert('Could not get location. Please allow location access or make sure your location services are enabled.');
    }
});

// Add the control to the map
L.control.gpsLocation = function (options) {
    return new L.Control.GpsLocation(options);
};
