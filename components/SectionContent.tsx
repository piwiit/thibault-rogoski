import React from 'react';

export default function SectionTerrassement() {
  return (
    <ul className="list-disc pl-6 space-y-1 marker:text-primary">
      <li className="text-neutral-50 font-bold">Excavation</li>
      <li className="text-neutral-50 font-bold">Fondation tranchée</li>
      <li className="text-neutral-50 font-bold">Béton lavé</li>
    </ul>
  );
}

export function SectionVRD() {
  return (
    <ul className="list-disc pl-6 space-y-1 marker:text-primary">
      <li className="text-neutral-50 font-bold">Voirie et réseaux divers</li>
      <li className="text-neutral-50 font-bold">Assainissement</li>
      <li className="text-neutral-50 font-bold">Canalisation</li>
      <li className="text-neutral-50 font-bold">Réseaux secs</li>
    </ul>
  );
}

export function SectionEntretien() {
  return (
    <ul className="list-disc pl-6 space-y-1 marker:text-primary">
      <li className="text-neutral-50 font-bold">Tonte</li>
      <li className="text-neutral-50 font-bold">Taille</li>
      <li className="text-neutral-50 font-bold">Désherbage</li>
      <li className="text-neutral-50 font-bold">Soins des plantations</li>
    </ul>
  );
}
