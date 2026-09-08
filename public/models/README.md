# Future model slots

Optional replacement assets: `drone.glb`, `injection-machine.glb`, `assembly-container.glb`, `storage-container.glb`, `truck.glb`.

No GLB is loaded or required in step 1. Replace the procedural implementation at the existing DroneModel / environment boundary. Preserve the named drone groups and exposed DroneHandle.parts contract. Units in the procedural scene are presentation units, not engineering measurements; the drone proportions reference an approximately 45 × 40 cm footprint.
