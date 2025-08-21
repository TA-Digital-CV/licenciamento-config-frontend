'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// removed unused import of use
import Link from 'next/link';
import LicenceTypeForm from '@/components/licencetypeform';

export default function PageEditarLicenceTypeComponent({ params } : { params: { id: string } } ) {
  const { id } = params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/parametrizacao?tab=licence-types" className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent">
          ← Voltar
        </Link>
        <h1 className="text-xl font-semibold">Editar Categoria</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <LicenceTypeForm id={id} />
      </div>
    </div>
  );
}