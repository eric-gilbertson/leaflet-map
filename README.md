                             PowWow Energy Display

0) Introduction
This project implements the Powwow energy display app implemented with React
and Bootstrap. It was created using yarn & create-react-app. It contains 
the following objects:

   - EnergyList - pure component which implements ranch energy consumption
   - ProjectEdit - hybred component that allows modification of project name and ranches
   - ProjectDB - stores project and ranch state & persists to localstorage

Note that the project also contains the actions & reducers needed to store state
in a Redux store but these functions are not currently being used.

The project can be invoked using runit.sh. Once started the interface can be
accessed at http://localhost:3000.

1) TODOS:
   - Implement Redux based state
   - Create name edit and ranch list components
   - Make ProjectEdit a pure container component
   - Add sorting to the energy list table
   - Add unit tests
   - Add build script


Mapping demo using Leaflet, React and Django
