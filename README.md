# CI2P — Step 2

Existing Vite / React / TypeScript presentation, with Three.js, React Three Fiber, Drei and GSAP ScrollTrigger. The five HTML chapters, copy and typography are preserved. All models are procedural; no GLB, external font or remote image is requested at runtime.

## Run and validate

```sh
npm install
npm run dev
npm run typecheck
npm run lint
node --experimental-strip-types --test src/components/Drone/droneMotion.test.mjs src/components/environments/workshopMotion.test.mjs
npm run build
```

## Scroll contract

`useScrollExperience` owns the 0–4 chapter progression; `droneMotion` maps it to an absolute 0–1 mechanical timeline. The main DroneModel exposes each named group through DroneHandle.parts. There is no frame-integrated mechanical animation: forward, backward and arbitrary scroll jumps produce identical component transforms.

- 0–15%: assembled; stopped propellers; subtle hero motion.
- 15–30%: battery, camera, arms and core separate. Motors and propellers translate with their arms.
- 30–62%: exploded hold; annotations fade in at 46–48% and out at 60–62%.
- 62–82%: core, arms, camera and battery return to their original transforms in sequence.
- 82–92%: absolute scroll-driven propeller rotation accelerates.
- 92–100%: controlled lift, forward translation and pitch, with a wider logistics composition.

Reduced motion removes autonomous hover, pointer response, rotor rotation and stabilization vibration. Mechanical positions and container deployment remain scroll-controlled. DPR is capped at 1.5; portrait camera framing is wider and contact shadows are omitted on small viewports. Repeated corrugations, tires and rack drones use instancing. Painted steel roughness uses a small deterministic procedural texture.

## Models and references

The industrial units use ISO-style framing, ribs, corner castings, open doors with locking bars, ventilation and interior practical lights. Assembly uses the existing rigid central core and two enclosed sliding rooms with opaque sand walls, opening service doors and a bright clean workshop based on production.jpeg: tiled surfaces, four manipulators, a conveyor, grey parts bins, LED panels and four simple technicians. Logistics uses a separate fixed-proportion 20ft ISO container. After the unchanged load path, side panels open at 45–58% and fold onto the roof. Twelve rack rows translate along their local X axes at 58–76%, with three drones per row. Two stowage heights keep the opposite rack systems separate. The 36th drone occupies a real rack slot, powers up at 84–91%, lifts vertically at 91–94%, then flies forward. Parked drones are baked from DroneModel into material-batched instances. All transforms remain absolute functions of local scroll. The generic truck has a custom extruded faceted cab, four axles, treaded tires, wheel arches, glazing, mirrors, lights and carrier rails.

These are presentation models, not validated engineering designs. Mechanical movements are illustrative. No weapon or payload is modeled. Future replacement filenames are in `public/models/README.md`. Reference-only project photos have clean filenames in `public/images`; web references are documented in `REFERENCE_NOTES.md` and are not embedded or downloaded into the app.

The separate Three.js bundle remains relatively large. Validation covers type checking, lint, production build, deterministic timeline tests and browser visual checks; no certified performance benchmark is claimed.

## Targeted correction references

The clean interior follows the supplied production.jpeg in the parent folder. The deployment layout follows WhatsApp Image 2026-09-08 at 12.05.33 (1).jpeg. Models and loading remain illustrative, not engineering specifications. Global Step 3 polish is deferred.


## Step 3 presentation pass

The validated mechanical timelines, truck geometry, expandable rooms and rack mechanisms are retained. Presentation changes include a non-blocking hero reveal, four desktop / three mobile engineering labels, matte materials, a 64px procedural studio environment rendered once, a subtle ground plane, balanced workshop LEDs and low-cost rotor persistence discs. No remote textures or postprocessing were added. The closing signature replaces the generic footer, and the portrait camera tracks the actual launch position.

Chapter masks derive from section position, including pinned states. Reloading restores the saved scroll position when session storage is available. Reduced motion disables intro transitions, hover, pointer motion, propeller persistence and rotor rotation. Desktop DPR remains capped at 1.5; mobile omits contact shadows. The Three.js chunk remains above Vite's advisory size threshold.
