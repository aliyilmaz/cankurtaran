## Lifeguard (Nature and Environmental Protection Mapping Project)

This project is developed to enable nature, urban, and monument protectors to make annotations on digital maps to report environmental issues and promote conservation efforts. Users can mark areas that need protection, report them to the relevant authorities, or try to find solutions themselves.

### What can be used to mark?

- Marking of Plant and Animal Population
- Marking of historical and archaeological remains
- Marking of disaster and environmental problems that threaten the settlements
- Marking of waste load causing environmental pollution
- Marking of areas to be protected
- Marking of Problems with City Planning
- Marking of problems related to the practices of local governments

### Features
The project includes the following mapping and annotation features:

- **Location Tracking:** Click the GPS icon to track your current location on the map.
- **Add Label:** By clicking the Text icon, you can create a textbox at the point clicked on the map. To remove the textbox, clear its content and press Enter or OK.
- **Create Polyline:** You can draw a polyline by connecting multiple points.
- **Create Polygon:** Draw a closed area (polygon) to mark protected zones.
- **Create Rectangle:** Draw rectangular areas and define boundaries.
- **Create Circle:** Draw circular areas by defining a radius.
- **Create Marker:** Place markers at specific points on the map.
- **Create CircleMarker:** Add circular markers to the map.

### Export and Import
- **Export as GeoJSON:** Export all your annotations and shapes as a GeoJSON file.
- **Import GeoJSON:** Import a previously exported GeoJSON file to visualize the annotations again on the map. Drag and leave are supported.

### Usage

**1. Map Display:** When the system is opened, the map will load automatically.

**2. Location Tracking:** Click the GPS icon to track your current location on the map. Continuous tracking of your location will be enabled.

**3. Annotations:**

- **Add Label:** By clicking the Text icon, a textbox is created at the clicked point on the map. To remove it, clear its content and press Enter or OK.
- **Polyline:** Connect multiple points to draw a polyline.
- **Polygon, Rectangle, Circle:** Select the relevant tool and draw the desired area.
- **Marker and CircleMarker:** These tools allow you to mark specific points on the map.

**4. Export and Import Data:**

**Export:** You can export your annotations as a GeoJSON file.

**Import:** You can import a previously exported GeoJSON file to visualize it again on the map.

### Technologies
This project is developed using the following technologies:

- **Leaflet.js:** Used for map visualization and interaction.
- **leaflet-gps-control:** A Leaflet plugin that allows users to track their GPS location on the map.
- **Leaflet Draw:** A Leaflet plugin used for drawing shapes (polyline, polygon, rectangle, circle) on the map.
- **TextBoxLabel:** A special tool used for labeling on the map. The Text icon allows users to add and edit text labels on the map.

### Contributing
If you'd like to contribute to this project, please follow these steps:

**1. Fork the repository.**

**2. Create a new branch** (``git checkout -b feature-name``).

**3. Commit your changes** (``git commit -am 'Added new feature'``).

**4. Push your changes** (``git push origin feature-name``).

**5. Create a pull request.**

### License
This project is licensed under the MIT License. For more information, please see the [LICENSE](LICENSE) file.