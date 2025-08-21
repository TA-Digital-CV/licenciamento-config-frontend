'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@igrp/igrp-framework-react-design-system'
import Sectorlist from '@/components/sectorlist'
import Categorylist from '@/components/categorylist'
import LicenceTypelist from '@/components/licencetypelist'

export default function PageLicenciamentoParametrizacao() {
  const TABS = [
    { id: 'sectors', label: 'Sectors' },
    { id: 'categories', label: 'Categories' },
    { id: 'licence-types', label: 'Licence Types' },
  ] as const

  type TabId = typeof TABS[number]['id']
  const [active, setActive] = useState<TabId>('sectors')

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Parametrização de Licenciamento</h1>
        <div className="flex items-center gap-2">
          {/* Exemplo de ação contextual (pode variar por tab) */}
          {active === 'sectors' && (
            <Link href="/parametrizacao/sectors/novo" className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Adicionar Setor
            </Link>
          )}
          {active === 'categories' && (
            <Link href="/parametrizacao/category/novo" className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Adicionar Categoria
            </Link>
          )}
          {active === 'licence-types' && (
            
            <Link href="/parametrizacao/licence-type/novo" className="inline-flex items-center rounded border px-3 py-1.5 text-sm hover:bg-accent">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Adicionar Tipo de Licença
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Parametrização de Licenciamento" className="border-b">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                'px-3 py-2 text-sm border-b-2 -mb-px',
                active === tab.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-4">
        <section
          id="panel-sectors"
          role="tabpanel"
          aria-labelledby="tab-sectors"
          hidden={active !== 'sectors'}
        >
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold mb-2">Sectors</h2>
            <div className="mb-4 text-sm text-muted-foreground">
              Gestão de setores económicos e respetivos tipos.
            </div>
            <div>
              <Sectorlist />
            </div>
          </div>
        </section>

        <section
          id="panel-categories"
          role="tabpanel"
          aria-labelledby="tab-categories"
          hidden={active !== 'categories'}
        >
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold mb-2">Categories</h2>
            <div className="mb-4 text-sm text-muted-foreground">
              Estrutura hierárquica de categorias por setor.
            </div>
            <div>
              <Categorylist />
            </div>
          </div>
        </section>

        <section
          id="panel-licence-types"
          role="tabpanel"
          aria-labelledby="tab-licence-types"
          hidden={active !== 'licence-types'}
        >
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-base font-semibold mb-2">Tipos de Licenças</h2>
            <div className="mb-4 text-sm text-muted-foreground">
              Configuração dos tipos de licenças com parâmetros avançados.
            </div>
            <div>
              <LicenceTypelist />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}