'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import LicenceTypeForm from '@/components/licencetypeform';
import Link from 'next/link';

export default function PageNovoLicenceTypeComponent() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/parametrizacao"
            className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-semibold">Novo Tipo de Licença</h1>
        </div>
      </div>
      <LicenceTypeForm />
    </div>
  );
}