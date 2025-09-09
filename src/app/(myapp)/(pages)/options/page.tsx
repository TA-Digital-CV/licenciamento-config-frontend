'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import Optionslist from '@/components/optionslist';
import Link from 'next/link';

export default function PageOptionsconfigComponent() {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Parametrizações Base</h1>
        <Link
          href="/options/novo"
          className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Adicionar
        </Link>
      </div>
      <Optionslist />
    </div>
  );
}
