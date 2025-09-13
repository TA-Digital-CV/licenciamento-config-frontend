/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { MutableRefObject, useState, useEffect } from 'react';
import {
  IGRPForm,
  IGRPInputNumber,
  IGRPSelect,
  IGRPSwitch,
  IGRPCard,
  IGRPCardHeader,
  IGRPCardTitle,
  IGRPCardDescription,
  IGRPCardContent,
  IGRPIcon,
  IGRPTooltipPrimitive,
  IGRPTooltipContentPrimitive,
  IGRPTooltipProviderPrimitive,
  IGRPTooltipTriggerPrimitive,
  IGRPButton,
} from '@igrp/igrp-framework-react-design-system';
import { z } from 'zod';
import { LicenseParameterRequestDTO } from '@/app/(myapp)/types/license-parameters.types';

export type Option = { value: string; label: string };

// Schema Zod para validação dos parâmetros de licença
export const licenseParameterSchema = z.object({
  licenseTypeId: z.string().min(1, 'ID do tipo de licença é obrigatório'),
  validityUnit: z.string().min(1, 'Unidade de validade é obrigatória'),
  validityPeriod: z.coerce.number().int().min(1, 'Período de validade deve ser maior que zero'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  provisionalValidity: z.coerce
    .number()
    .int()
    .min(0, 'Validade provisória deve ser maior ou igual a zero'),
  definitiveLicenseValidity: z.coerce
    .number()
    .int()
    .min(0, 'Validade definitiva deve ser maior ou igual a zero'),
  provisionalDefaultPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período padrão provisório deve ser maior ou igual a zero'),
  definitiveDefaultPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período padrão definitivo deve ser maior ou igual a zero'),
  provisionalRenewalPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período de renovação provisória deve ser maior ou igual a zero'),
  maxProvisonalRenewal: z.coerce
    .number()
    .int()
    .min(0, 'Máximo de renovações provisórias deve ser maior ou igual a zero'),
  definitiveRenewalPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período de renovação definitiva deve ser maior ou igual a zero'),
  definitiveRenewalDefaultPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período padrão de renovação definitiva deve ser maior ou igual a zero'),
  renewalDefaultPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período padrão de renovação deve ser maior ou igual a zero'),
  maxRenewalPeriod: z.coerce
    .number()
    .int()
    .min(0, 'Período máximo de renovação deve ser maior ou igual a zero'),
  vitalityFlag: z.boolean().default(false),
});

export type LicenseParameterFormData = z.infer<typeof licenseParameterSchema>;

type Props = {
  id: string;
  defaultValues: Partial<LicenseParameterRequestDTO>;
  licenceTypeDefaults?: {
    model?: string;
    validityPeriod?: number;
    validityUnit?: string;
  };
  submitting: boolean;
  onSubmit: (values: LicenseParameterFormData) => void | Promise<void>;
  formRef?: MutableRefObject<any | null> | null;
};

export default function GeneralForm({
  id,
  defaultValues,
  licenceTypeDefaults,
  submitting,
  onSubmit,
  formRef,
}: Props) {
  const [licensingModelOptions, setLicensingModelOptions] = useState<Option[]>([]);
  const [validityUnitOptions, setValidityUnitOptions] = useState<Option[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [finalDefaultValues, setFinalDefaultValues] =
    useState<Partial<LicenseParameterRequestDTO>>(defaultValues);

  // Carregar opções das constantes LICENSING_MODEL e VALIDITY_UNIT
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const response = await fetch('/api/options?codes=LICENSING_MODEL,VALIDITY_UNIT');
        const data = await response.json();

        if (data.success) {
          const licensingModels =
            data.data.LICENSING_MODEL?.map((item: any) => ({
              value: item.key,
              label: item.value,
            })) || [];

          const validityUnits =
            data.data.VALIDITY_UNIT?.map((item: any) => ({
              value: item.key,
              label: item.value,
            })) || [];

          setLicensingModelOptions(licensingModels);
          setValidityUnitOptions(validityUnits);
        }
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Implementar lógica de prioridade para valores iniciais
  useEffect(() => {
    const mergedDefaults = {
      ...defaultValues,
      // Se não existir valor em defaultValues (licence_parameter), usar licenceTypeDefaults
      model: defaultValues.model || licenceTypeDefaults?.model || '',
      validityPeriod: defaultValues.validityPeriod || licenceTypeDefaults?.validityPeriod || 0,
      validityUnit: defaultValues.validityUnit || licenceTypeDefaults?.validityUnit || '',
    };

    setFinalDefaultValues(mergedDefaults);
  }, [defaultValues, licenceTypeDefaults]);

  const handleReset = () => {
    if (formRef?.current) {
      formRef.current.reset();
    }
  };

  return (
    <IGRPTooltipProviderPrimitive>
      <div className="space-y-6 animate-in fade-in-0 duration-500">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <IGRPIcon name="settings" className="h-5 w-5 text-primary" iconName={''} />
            Parâmetros de Licença
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure os parâmetros específicos para este tipo de licença de forma organizada e
            intuitiva.
          </p>
        </div>

        <IGRPForm
          schema={licenseParameterSchema}
          defaultValues={finalDefaultValues}
          validationMode="onSubmit"
          onSubmit={onSubmit}
          resetAfterSubmit={false}
          formRef={formRef as any}
          className="space-y-6"
          key={`license-params-${id}-${JSON.stringify(finalDefaultValues)}`}
        >
          {/* Card: Configuração Básica */}
          <IGRPCard className="col-span-full shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
            <IGRPCardHeader>
              <IGRPCardTitle className="flex items-center gap-2 text-lg">
                <IGRPIcon name="file-text" className="h-5 w-5 text-primary" iconName={''} />
                Configuração Básica
                <IGRPTooltipPrimitive>
                  <IGRPTooltipTriggerPrimitive>
                    <IGRPIcon
                      name="help-circle"
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      iconName={''}
                    />
                  </IGRPTooltipTriggerPrimitive>
                  <IGRPTooltipContentPrimitive>
                    <p>Configure os parâmetros básicos do tipo de licença</p>
                  </IGRPTooltipContentPrimitive>
                </IGRPTooltipPrimitive>
              </IGRPCardTitle>
              <IGRPCardDescription>
                Configure o modelo de licenciamento e período de validade base
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <IGRPSelect
                  name="model"
                  label="Modelo de Licenciamento"
                  placeholder={isLoadingOptions ? 'Carregando...' : 'Selecione um modelo'}
                  options={licensingModelOptions}
                  required
                  disabled={isLoadingOptions}
                  className="focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
                />

                <IGRPInputNumber
                  name="validityPeriod"
                  label="Período de Validade"
                  placeholder="Ex: 12"
                  required
                  className="focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
                />

                <IGRPSelect
                  name="validityUnit"
                  label="Unidade de Validade"
                  placeholder={isLoadingOptions ? 'Carregando...' : 'Selecione a unidade'}
                  options={validityUnitOptions}
                  required
                  disabled={isLoadingOptions}
                  className="focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
                />
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Card: Configurações de Validade */}
          <IGRPCard className="col-span-full shadow-sm border-l-4 border-l-green-500 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
            <IGRPCardHeader>
              <IGRPCardTitle className="flex items-center gap-2 text-lg">
                <IGRPIcon name="calendar" className="h-5 w-5 text-blue-600" iconName={''} />
                Configurações de Validade
                <IGRPTooltipPrimitive>
                  <IGRPTooltipTriggerPrimitive>
                    <IGRPIcon
                      name="help-circle"
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      iconName={''}
                    />
                  </IGRPTooltipTriggerPrimitive>
                  <IGRPTooltipContentPrimitive>
                    <p>Configure as opções de renovação automática e períodos</p>
                  </IGRPTooltipContentPrimitive>
                </IGRPTooltipPrimitive>
              </IGRPCardTitle>
              <IGRPCardDescription>
                Defina os períodos de validade e configurações padrão para diferentes tipos de
                licença
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <IGRPInputNumber
                  name="provisionalValidity"
                  label="Validade Provisória (dias)"
                  placeholder="Ex: 30"
                />

                <IGRPInputNumber
                  name="definitiveLicenseValidity"
                  label="Validade Definitiva (dias)"
                  placeholder="Ex: 365"
                />

                <IGRPInputNumber
                  name="provisionalDefaultPeriod"
                  label="Período Padrão Provisório (dias)"
                  placeholder="Ex: 15"
                />

                <IGRPInputNumber
                  name="definitiveDefaultPeriod"
                  label="Período Padrão Definitivo (dias)"
                  placeholder="Ex: 30"
                />
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Card: Configurações de Renovação */}
          <IGRPCard className="col-span-full shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
            <IGRPCardHeader>
              <IGRPCardTitle className="flex items-center gap-2 text-lg">
                <IGRPIcon name="refresh-cw" className="h-5 w-5 text-green-600" iconName={''} />
                Configurações de Renovação
                <IGRPTooltipPrimitive>
                  <IGRPTooltipTriggerPrimitive>
                    <IGRPIcon
                      name="help-circle"
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      iconName={''}
                    />
                  </IGRPTooltipTriggerPrimitive>
                  <IGRPTooltipContentPrimitive>
                    <p>Configure os períodos e limites para renovação de licenças</p>
                  </IGRPTooltipContentPrimitive>
                </IGRPTooltipPrimitive>
              </IGRPCardTitle>
              <IGRPCardDescription>
                Defina os parâmetros para renovação de licenças provisórias e definitivas
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <IGRPInputNumber
                  name="provisionalRenewalPeriod"
                  label="Período Renovação Provisória (dias)"
                  placeholder="Ex: 30"
                />

                <IGRPInputNumber
                  name="maxProvisonalRenewal"
                  label="Máximo Renovações Provisórias"
                  placeholder="Ex: 3"
                />

                <IGRPInputNumber
                  name="definitiveRenewalPeriod"
                  label="Período Renovação Definitiva (dias)"
                  placeholder="Ex: 60"
                />

                <IGRPInputNumber
                  name="definitiveRenewalDefaultPeriod"
                  label="Período Padrão Renovação Definitiva (dias)"
                  placeholder="Ex: 45"
                />

                <IGRPInputNumber
                  name="renewalDefaultPeriod"
                  label="Período Padrão de Renovação (dias)"
                  placeholder="Ex: 30"
                />

                <IGRPInputNumber
                  name="maxRenewalPeriod"
                  label="Período Máximo de Renovação (dias)"
                  placeholder="Ex: 90"
                />
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Card: Configurações Adicionais */}
          <IGRPCard className="col-span-full shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-300 hover:scale-[1.01] relative">
            {submitting && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IGRPIcon name="loader-2" className="h-5 w-5 animate-spin" iconName={''} />
                  <span>Processando...</span>
                </div>
              </div>
            )}
            <IGRPCardHeader>
              <IGRPCardTitle className="flex items-center gap-2 text-lg">
                <IGRPIcon name="toggle-left" className="h-5 w-5 text-purple-600" iconName={''} />
                Configurações Adicionais
                <IGRPTooltipPrimitive>
                  <IGRPTooltipTriggerPrimitive>
                    <IGRPIcon
                      name="help-circle"
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      iconName={''}
                    />
                  </IGRPTooltipTriggerPrimitive>
                  <IGRPTooltipContentPrimitive>
                    <p>Configure opções especiais e flags do sistema</p>
                  </IGRPTooltipContentPrimitive>
                </IGRPTooltipPrimitive>
              </IGRPCardTitle>
              <IGRPCardDescription>
                Ative ou desative funcionalidades especiais para este tipo de licença
              </IGRPCardDescription>
            </IGRPCardHeader>
            <IGRPCardContent>
              <div className="grid grid-cols-1 gap-4">
                <IGRPSwitch name="vitalityFlag" label="Flag de Vitalidade" />
              </div>
            </IGRPCardContent>
          </IGRPCard>

          {/* Ações do Formulário */}
          <div className="col-span-full">
            <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2">
                <IGRPIcon name="info" className="h-4 w-4 text-blue-600" iconName={''} />
                <span className="text-sm text-muted-foreground">
                  Certifique-se de que todos os campos obrigatórios (*) estão preenchidos
                </span>
              </div>
              <div className="flex justify-between items-center">
                <IGRPButton
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Tem certeza que deseja limpar todos os campos? Esta ação não pode ser desfeita.',
                      )
                    ) {
                      // Reset form logic would go here
                      window.location.reload();
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Limpar formulário"
                >
                  <IGRPIcon name="rotate-ccw" className="h-4 w-4 mr-2" iconName={''} />
                  Limpar Tudo
                </IGRPButton>

                <div className="flex space-x-4">
                  <IGRPButton
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={submitting}
                    aria-label="Cancelar alterações"
                  >
                    Cancelar
                  </IGRPButton>
                  <IGRPButton
                    type="submit"
                    disabled={submitting}
                    aria-label={submitting ? 'Salvando parâmetros' : 'Salvar parâmetros da licença'}
                    className="min-w-[140px] transition-all duration-200 hover:shadow-md"
                  >
                    {submitting ? (
                      <>
                        <IGRPIcon
                          name="loader-2"
                          className="h-4 w-4 mr-2 animate-spin"
                          iconName={''}
                        />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <IGRPIcon name="save" className="h-4 w-4 mr-2" iconName={''} />
                        Salvar Parâmetros
                      </>
                    )}
                  </IGRPButton>
                </div>
              </div>
            </div>
          </div>
        </IGRPForm>
      </div>
    </IGRPTooltipProviderPrimitive>
  );
}
