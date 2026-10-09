// Hand-written parts of the dataset: model assumptions and simple reference scales.
module.exports = {
  heights: [
    { label: 'Basketball hoop', m: 3.05, src: { url: 'https://en.wikipedia.org/wiki/Basketball', title: 'Basketball (10 ft rim)' } },
    { label: 'Statue of Liberty, ground to torch', short: 'Statue of Liberty', m: 93, src: { url: 'https://en.wikipedia.org/wiki/Statue_of_Liberty', title: 'Statue of Liberty' } },
    { label: 'Eiffel Tower', m: 330, src: { url: 'https://en.wikipedia.org/wiki/Eiffel_Tower', title: 'Eiffel Tower' } },
    { label: 'Burj Khalifa', m: 828, src: { url: 'https://en.wikipedia.org/wiki/Burj_Khalifa', title: 'Burj Khalifa' } },
    { label: 'Mount Everest', m: 8849, src: { url: 'https://en.wikipedia.org/wiki/Mount_Everest', title: 'Mount Everest (2020 survey, 8,848.86 m)' } },
    { label: 'Edge of space (Kármán line)', short: 'Edge of space', m: 100e3, src: { url: 'https://en.wikipedia.org/wiki/K%C3%A1rm%C3%A1n_line', title: 'Kármán line' } },
    { label: 'Space station orbit', m: 420e3, src: { url: 'https://en.wikipedia.org/wiki/International_Space_Station', title: 'International Space Station' } },
    { label: 'The Moon', m: 384400e3, src: { url: 'https://en.wikipedia.org/wiki/Moon', title: 'Moon (mean distance)' } },
  ],
  assumptions: [
    { t: 'Strength means force', d: 'The dial sets the heaviest weight Rex can hold up. That times g is his maximum force. Every other move uses a share of it.' },
    { t: 'Only Rex is indestructible', d: 'The ground, the objects and the air follow real material limits. Rex never breaks, tires, or overheats.' },
    { t: 'Newton’s third law stays on', d: 'Every push pushes him back. He stays put only as far as friction, the ground’s bearing strength, or dug-in claws allow. “Bolted to the planet” and “Comic ground” switch those limits off.' },
    { t: 'Two muscle models, one calibration', d: 'At record-human strength (511 kg deadlift) both reproduce the shot put record (23.56 m), the fastest pitch (47.3 m/s), elite punch speed (~10 m/s) and Bolt’s top speed. Real muscle follows the Hill force–velocity curve (a/F₀ = 0.25), so limb speed tops out. Comic mode keeps the same share of strength at any speed, so speed grows with the square root of strength.' },
    { t: 'Size', d: 'Height rescales mass (same density), areas and limb strokes. Real-muscle limb speeds scale with height, as if Rex kept the same muscle at every size; real large animals have slower muscle, so a real-muscle kaiju is probably too fast.' },
    { t: 'Pushes are one-dimensional', d: 'A throw, punch or jump is a straight push over a fixed stroke (1.6 m shove, 2.2 m overarm throw, 0.7 m punch, 0.5 m leg drive). Heavy throws hold the object up against gravity as well as pushing it.' },
    { t: 'Relativity is built in', d: 'Speeds come from momentum, so nothing passes light speed. Above 1% of light speed the sim stops tracking flight: the air ahead is shock-heated into plasma and the object becomes a fireball.' },
    { t: 'Air', d: 'Exponential atmosphere, drag coefficient that rises past the sound barrier, no lift, no wind, non-rotating round Earth; above 150 km the arc is solved exactly. Heating is reported with an equilibrium-air estimate, not modelled: real thrown objects would melt or burn at the speeds shown.' },
    { t: 'Ground', d: 'Typical ultimate bearing capacities; real sites vary by 2–3×. Sand and gravel get stronger under wider feet. A fast-moving foot also has to shove the ground’s mass aside (resistance ρv² per unit area), which is why a hard enough push still launches him off soft ground and why stomp holes stay shallow.' },
    { t: 'Blasts, quakes and craters are upper bounds', d: 'Blast radii use the Kinney–Graham curve for TNT, as if all the energy became a blast. Quake magnitudes assume 1 part in 10,000 of the energy becomes shaking (real range 10⁻⁵ to 10⁻³: read ±1 magnitude). Craters use asteroid-impact scaling, which overstates small craters in rock or concrete.' },
    { t: 'Rex’s body', d: '2 m and 180 kg by default. Segment masses from Dempster’s tables (hand 0.6%, forearm 1.6%, foot 1.45%, shank 4.65% of body mass). Foot contact 450 cm² each and palm 150 cm² are assumptions for a big three-toed dinosaur.' },
  ],
};
