'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import SectorForm from '@/components/sectorform';
import Link from 'next/link';

export default function PageNovoSectorComponent() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/parametrizacao?tab=sectors"
            className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-semibold">Novo Setor</h1>
        </div>
      </div>
      <SectorForm />
    </div>
  );
}
