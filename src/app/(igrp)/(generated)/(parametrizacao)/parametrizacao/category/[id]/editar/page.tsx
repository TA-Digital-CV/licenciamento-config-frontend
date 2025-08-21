'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// removed unused import of use
import Link from 'next/link';
import CategoryForm from '@/components/categoryform';

export default function PageEditarCategoryComponent({ params } : { params: { id: string } } ) {
  const { id } = params;
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/parametrizacao?tab=categories"

            className="inline-flex items-center rounded border px-2 py-1 text-sm hover:bg-accent"
          >
            ← Voltar
          </Link>
          <h1 className="text-xl font-semibold">Editar Categoria</h1>
        </div>
      </div>
      <CategoryForm id={id} />
    </div>
  );
}