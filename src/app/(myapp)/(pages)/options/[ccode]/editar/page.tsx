'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import { use } from 'react';
import Link from 'next/link';
import Optionform from '@/components/optionform';

export default function PageEditaroptionByCodeComponent({ params }: { params: Promise<{ ccode: string }> }) {
  const { ccode } = use(params);
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/options"
            className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-semibold">Editar Parametrização - {ccode}</h1>
        </div>
      </div>
      <Optionform ccode={ccode} mode="edit" />
    </div>
  );
}