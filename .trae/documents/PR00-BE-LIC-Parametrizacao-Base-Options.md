# Especificação Técnica e Funcional - Parametrização Base
## Sistema de Configuração de Licenciamento de Cabo Verde

## 1. Visão Geral do Módulo

O módulo de **Parametrização Base** é um componente fundamental do sistema que permite a gestão dinâmica de opções e configurações através de uma estrutura flexível baseada em códigos e chaves. Este módulo centraliza todas as parametrizações auxiliares do sistema, como estados de licenças, tipos de entidades, classificações, entre outros.

### 1.1 Objetivos
- Centralizar parametrizações do sistema numa estrutura única e flexível
- Permitir gestão dinâmica de opções sem alterações de código
- Suportar internacionalização (i18n) das opções
- Fornecer APIs REST para consulta e gestão das parametrizações
- Integrar com a arquitetura DDD existente do sistema
- Garantir performance através de cache inteligente

### 1.2 Casos de Uso Principais
- **Consulta de Opções**: Obter lista de opções por código (ex: estados de licença)
- **Gestão Administrativa**: CRUD completo de parametrizações
- **Suporte Multilíngue**: Opções em diferentes idiomas
- **Cache Dinâmico**: Performance otimizada para consultas frequentes

## 2. Modelo de Dados

### 2.1 Estrutura da Tabela t_options

```sql
CREATE TABLE t_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ccode VARCHAR(50) NOT NULL,           -- Código do conjunto de opções
    ckey VARCHAR(50) NOT NULL,            -- Chave da opção específica
    cvalue VARCHAR(255) NOT NULL,         -- Valor/Label da opção
    locale VARCHAR(10) DEFAULT 'pt-CV',   -- Idioma (pt-CV, en, etc.)
    sort_order INTEGER,                   -- Ordem de apresentação
    active BOOLEAN DEFAULT TRUE,          -- Status ativo/inativo
    metadata JSONB,                       -- Metadados adicionais
    description TEXT,                     -- Descrição detalhada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Índices para performance
CREATE UNIQUE INDEX idx_options_unique ON t_options(ccode, ckey, locale);
CREATE INDEX idx_options_ccode ON t_options(ccode);
CREATE INDEX idx_options_active ON t_options(active);
CREATE INDEX idx_options_sort ON t_options(ccode, sort_order NULLS LAST, ckey);
```

### 2.2 Exemplos de Dados

```sql
-- Estados de Licenças
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order) VALUES
('LICENSE_STATUS', 'DRAFT', 'Rascunho', 'pt-CV', 1),
('LICENSE_STATUS', 'PENDING', 'Pendente', 'pt-CV', 2),
('LICENSE_STATUS', 'APPROVED', 'Aprovada', 'pt-CV', 3),
('LICENSE_STATUS', 'REJECTED', 'Rejeitada', 'pt-CV', 4),
('LICENSE_STATUS', 'EXPIRED', 'Expirada', 'pt-CV', 5);

-- Tipos de Entidades Reguladoras
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order) VALUES
('ENTITY_TYPE', 'MINISTRY', 'Ministério', 'pt-CV', 1),
('ENTITY_TYPE', 'AGENCY', 'Agência', 'pt-CV', 2),
('ENTITY_TYPE', 'INSPECTION', 'Inspeção', 'pt-CV', 3),
('ENTITY_TYPE', 'MUNICIPALITY', 'Câmara Municipal', 'pt-CV', 4);

-- Modelos de Licenciamento
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, metadata) VALUES
('LICENSING_MODEL', 'SIMPLE', 'Licenciamento Simples', 'pt-CV', 1, '{"duration_days": 30}'),
('LICENSING_MODEL', 'COMPLEX', 'Licenciamento Complexo', 'pt-CV', 2, '{"duration_days": 90}'),
('LICENSING_MODEL', 'AUTOMATIC', 'Licenciamento Automático', 'pt-CV', 3, '{"duration_days": 1}');
```

## 3. Arquitetura DDD

### 3.1 Estrutura de Camadas

```
src/main/java/cv/gov/licensing/
├── domain/
│   └── parameterization/
│       ├── Option.java                    # Aggregate Root
│       ├── OptionId.java                  # Value Object
│       ├── OptionCode.java                # Value Object
│       ├── OptionKey.java                 # Value Object
│       ├── OptionValue.java               # Value Object
│       ├── Locale.java                    # Value Object
│       ├── OptionRepository.java          # Repository Interface
│       └── ParameterizationDomainService.java
├── application/
│   └── parameterization/
│       ├── usecase/
│       │   ├── GetOptionsByCodeUseCase.java
│       │   ├── GetOptionsByCodesUseCase.java
│       │   ├── CreateOptionUseCase.java
│       │   ├── UpdateOptionUseCase.java
│       │   └── DeleteOptionUseCase.java
│       ├── service/
│       │   └── ParameterizationApplicationService.java
│       └── port/
│           ├── in/
│           │   └── ParameterizationUseCasePort.java
│           └── out/
│               ├── OptionRepositoryPort.java
│               └── OptionCachePort.java
├── interfaces/
│   └── rest/
│       ├── ParameterizationController.java
│       └── dto/
│           ├── OptionResponse.java
│           ├── OptionSetResponse.java
│           ├── CreateOptionRequest.java
│           └── UpdateOptionRequest.java
└── infrastructure/
    ├── persistence/
    │   ├── OptionJpaEntity.java
    │   ├── OptionJpaRepository.java
    │   └── OptionRepositoryAdapter.java
    └── cache/
        └── OptionCacheService.java
```

### 3.2 Domain Layer - Entidades e Value Objects

```java
// Option.java - Aggregate Root
@Entity
public class Option {
    private OptionId id;
    private OptionCode code;
    private OptionKey key;
    private OptionValue value;
    private Locale locale;
    private Integer sortOrder;
    private Boolean active;
    private String description;
    private Map<String, Object> metadata;
    private AuditInfo auditInfo;
    
    // Factory Method
    public static Option create(OptionCode code, OptionKey key, 
                               OptionValue value, Locale locale) {
        var option = new Option();
        option.id = OptionId.generate();
        option.code = Objects.requireNonNull(code, "Código é obrigatório");
        option.key = Objects.requireNonNull(key, "Chave é obrigatória");
        option.value = Objects.requireNonNull(value, "Valor é obrigatório");
        option.locale = locale != null ? locale : Locale.defaultLocale();
        option.active = true;
        option.auditInfo = AuditInfo.create();
        return option;
    }
    
    // Business Methods
    public void updateValue(OptionValue newValue) {
        this.value = Objects.requireNonNull(newValue, "Valor é obrigatório");
        this.auditInfo = this.auditInfo.update();
    }
    
    public void deactivate() {
        this.active = false;
        this.auditInfo = this.auditInfo.update();
    }
    
    public boolean isActive() {
        return Boolean.TRUE.equals(this.active);
    }
}

// OptionCode.java - Value Object
public class OptionCode {
    private final String value;
    
    private OptionCode(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Código não pode ser vazio");
        }
        if (value.length() > 50) {
            throw new IllegalArgumentException("Código não pode ter mais de 50 caracteres");
        }
        this.value = value.toUpperCase().trim();
    }
    
    public static OptionCode of(String value) {
        return new OptionCode(value);
    }
    
    public String getValue() {
        return value;
    }
}
```

## 4. APIs REST

### 4.1 Endpoints de Consulta (Públicos)

#### GET /api/v1/options/{ccode}
Obter todas as opções de um código específico.

**Parâmetros:**
- `ccode` (path): Código do conjunto de opções
- `locale` (query, opcional): Idioma (default: pt-CV)
- `format` (query, opcional): Formato da resposta (list|map, default: list)
- `includeInactive` (query, opcional): Incluir opções inativas (default: false)

**Resposta (format=list):**
```json
{
  "code": "LICENSE_STATUS",
  "locale": "pt-CV",
  "items": [
    {
      "key": "DRAFT",
      "value": "Rascunho",
      "sortOrder": 1,
      "metadata": null
    },
    {
      "key": "PENDING",
      "value": "Pendente",
      "sortOrder": 2,
      "metadata": null
    }
  ]
}
```

**Resposta (format=map):**
```json
{
  "code": "LICENSE_STATUS",
  "locale": "pt-CV",
  "items": {
    "DRAFT": "Rascunho",
    "PENDING": "Pendente",
    "APPROVED": "Aprovada"
  }
}
```

#### GET /api/v1/options
Obter múltiplos conjuntos de opções numa única chamada.

**Parâmetros:**
- `codes` (query): Lista de códigos separados por vírgula
- `locale` (query, opcional): Idioma (default: pt-CV)
- `format` (query, opcional): Formato da resposta (list|map, default: list)

**Resposta:**
```json
{
  "locale": "pt-CV",
  "optionSets": {
    "LICENSE_STATUS": {
      "code": "LICENSE_STATUS",
      "items": [
        {"key": "DRAFT", "value": "Rascunho", "sortOrder": 1}
      ]
    },
    "ENTITY_TYPE": {
      "code": "ENTITY_TYPE",
      "items": [
        {"key": "MINISTRY", "value": "Ministério", "sortOrder": 1}
      ]
    }
  }
}
```

### 4.2 Endpoints de Gestão (Administrativos)

#### POST /api/v1/options/admin
Criar nova opção.

**Request Body:**
```json
{
  "code": "LICENSE_STATUS",
  "key": "SUSPENDED",
  "value": "Suspensa",
  "locale": "pt-CV",
  "sortOrder": 6,
  "description": "Licença temporariamente suspensa",
  "metadata": {
    "canReactivate": true,
    "suspensionDays": 30
  }
}
```

#### PUT /api/v1/options/admin/{id}
Atualizar opção existente.

#### DELETE /api/v1/options/admin/{id}
Eliminar opção (soft delete - marca como inativa).

#### GET /api/v1/options/admin
Listar todas as opções com filtros avançados e paginação.

**Parâmetros:**
- `code` (query, opcional): Filtrar por código
- `locale` (query, opcional): Filtrar por idioma
- `active` (query, opcional): Filtrar por status
- `page` (query, opcional): Página (default: 0)
- `size` (query, opcional): Tamanho da página (default: 20)
- `sort` (query, opcional): Ordenação (ex: code,asc)

## 5. Casos de Uso Detalhados

### 5.1 UC001 - Consultar Opções por Código

**Ator:** Sistema/Frontend
**Pré-condições:** Código de opções existe no sistema
**Fluxo Principal:**
1. Sistema solicita opções para um código específico
2. Sistema verifica cache para o código e locale
3. Se não existe em cache, consulta base de dados
4. Filtra opções ativas e ordena por sort_order
5. Armazena resultado em cache
6. Retorna lista de opções formatada

**Fluxos Alternativos:**
- 2a. Código não existe: retorna lista vazia
- 3a. Erro de base de dados: retorna erro 500

### 5.2 UC002 - Gerir Opções (CRUD Administrativo)

**Ator:** Administrador do Sistema
**Pré-condições:** Utilizador autenticado com role ADMIN
**Fluxo Principal:**
1. Administrador acede à interface de gestão
2. Sistema apresenta lista de opções com filtros
3. Administrador seleciona ação (criar/editar/eliminar)
4. Sistema valida dados e regras de negócio
5. Sistema persiste alterações
6. Sistema invalida cache relacionado
7. Sistema confirma operação

**Regras de Negócio:**
- Não permitir duplicação de (code, key, locale)
- Validar formato dos códigos (alfanumérico, maiúsculas)
- Manter auditoria de todas as alterações
- Soft delete para preservar histórico

## 6. Validações e Regras de Negócio

### 6.1 Validações de Domínio

```java
// Validações na entidade Option
public class Option {
    private void validateUniqueConstraint(OptionCode code, OptionKey key, Locale locale) {
        // Validação de unicidade será feita no repositório
    }
    
    private void validateCodeFormat(OptionCode code) {
        String value = code.getValue();
        if (!value.matches("^[A-Z][A-Z0-9_]*$")) {
            throw new BusinessRuleException(
                "Código deve começar com letra e conter apenas letras maiúsculas, números e underscore"
            );
        }
    }
    
    private void validateKeyFormat(OptionKey key) {
        String value = key.getValue();
        if (!value.matches("^[A-Z][A-Z0-9_]*$")) {
            throw new BusinessRuleException(
                "Chave deve começar com letra e conter apenas letras maiúsculas, números e underscore"
            );
        }
    }
}
```

### 6.2 Regras de Negócio

1. **Unicidade**: Combinação (code, key, locale) deve ser única
2. **Formato de Códigos**: Apenas letras maiúsculas, números e underscore
3. **Locales Suportados**: pt-CV (padrão), en, pt-PT
4. **Soft Delete**: Opções eliminadas ficam marcadas como inativas
5. **Auditoria**: Todas as operações devem ser auditadas
6. **Cache**: Invalidação automática em alterações

## 7. Cache e Performance

### 7.1 Estratégia de Cache

```java
@Service
@CacheConfig(cacheNames = "options")
public class OptionCacheService {
    
    @Cacheable(key = "#code + '_' + #locale")
    public List<OptionResponse> getOptionsByCode(String code, String locale) {
        return optionRepository.findByCodeAndLocaleAndActiveTrue(code, locale);
    }
    
    @CacheEvict(key = "#code + '_' + #locale")
    public void evictCache(String code, String locale) {
        // Cache invalidation
    }
    
    @CacheEvict(allEntries = true)
    public void evictAllCache() {
        // Clear all cache
    }
}
```

### 7.2 Configuração de Cache

```yaml
# application.yml
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=1000,expireAfterWrite=1h
    cache-names:
      - options
```

## 8. Segurança

### 8.1 Controlo de Acesso

- **Consulta (GET)**: Acesso público (sem autenticação)
- **Gestão (POST/PUT/DELETE)**: Requer autenticação JWT + role ADMIN
- **Auditoria**: Todas as operações administrativas são auditadas

### 8.2 Configuração de Segurança

```java
@Configuration
@EnableWebSecurity
public class ParameterizationSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
            .requestMatchers(HttpMethod.GET, "/api/v1/options/**").permitAll()
            .requestMatchers("/api/v1/options/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

## 9. Testes

### 9.1 Testes Unitários

```java
@ExtendWith(MockitoExtension.class)
class GetOptionsByCodeUseCaseTest {
    
    @Mock
    private OptionRepositoryPort optionRepository;
    
    @Mock
    private OptionCachePort optionCache;
    
    @InjectMocks
    private GetOptionsByCodeUseCase useCase;
    
    @Test
    void shouldReturnOptionsWhenCodeExists() {
        // Given
        String code = "LICENSE_STATUS";
        String locale = "pt-CV";
        List<Option> options = createSampleOptions();
        
        when(optionCache.getOptionsByCode(code, locale))
            .thenReturn(Optional.empty());
        when(optionRepository.findByCodeAndLocaleAndActiveTrue(code, locale))
            .thenReturn(options);
        
        // When
        OptionSetResponse result = useCase.execute(code, locale, "list", false);
        
        // Then
        assertThat(result.getCode()).isEqualTo(code);
        assertThat(result.getItems()).hasSize(3);
        verify(optionCache).cacheOptions(code, locale, any());
    }
}
```

### 9.2 Testes de Integração

```java
@SpringBootTest
@Testcontainers
class ParameterizationControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("licensing_test")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldReturnOptionsWhenValidCodeProvided() {
        // Given
        String code = "LICENSE_STATUS";
        
        // When
        ResponseEntity<OptionSetResponse> response = restTemplate.getForEntity(
            "/api/v1/options/" + code, OptionSetResponse.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getCode()).isEqualTo(code);
        assertThat(response.getBody().getItems()).isNotEmpty();
    }
}
```

## 10. Migração e Dados Iniciais

### 10.1 Script de Migração Flyway

```sql
-- V001__create_options_table.sql
CREATE TABLE t_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ccode VARCHAR(50) NOT NULL,
    ckey VARCHAR(50) NOT NULL,
    cvalue VARCHAR(255) NOT NULL,
    locale VARCHAR(10) DEFAULT 'pt-CV',
    sort_order INTEGER,
    active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE UNIQUE INDEX idx_options_unique ON t_options(ccode, ckey, locale);
CREATE INDEX idx_options_ccode ON t_options(ccode);
CREATE INDEX idx_options_active ON t_options(active);
CREATE INDEX idx_options_sort ON t_options(ccode, sort_order NULLS LAST, ckey);
```

### 10.2 Dados Iniciais

```sql
-- V002__insert_initial_options.sql

-- Estados de Licenças
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('LICENSE_STATUS', 'DRAFT', 'Rascunho', 'pt-CV', 1, 'Licença em fase de preparação'),
('LICENSE_STATUS', 'PENDING', 'Pendente', 'pt-CV', 2, 'Licença submetida para análise'),
('LICENSE_STATUS', 'UNDER_REVIEW', 'Em Análise', 'pt-CV', 3, 'Licença em processo de avaliação'),
('LICENSE_STATUS', 'APPROVED', 'Aprovada', 'pt-CV', 4, 'Licença aprovada e ativa'),
('LICENSE_STATUS', 'REJECTED', 'Rejeitada', 'pt-CV', 5, 'Licença rejeitada'),
('LICENSE_STATUS', 'SUSPENDED', 'Suspensa', 'pt-CV', 6, 'Licença temporariamente suspensa'),
('LICENSE_STATUS', 'EXPIRED', 'Expirada', 'pt-CV', 7, 'Licença expirada'),
('LICENSE_STATUS', 'CANCELLED', 'Cancelada', 'pt-CV', 8, 'Licença cancelada pelo titular');

-- Tipos de Entidades Reguladoras
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('ENTITY_TYPE', 'MINISTRY', 'Ministério', 'pt-CV', 1, 'Ministério do governo'),
('ENTITY_TYPE', 'AGENCY', 'Agência', 'pt-CV', 2, 'Agência reguladora'),
('ENTITY_TYPE', 'INSPECTION', 'Inspeção', 'pt-CV', 3, 'Órgão de inspeção'),
('ENTITY_TYPE', 'MUNICIPALITY', 'Câmara Municipal', 'pt-CV', 4, 'Autoridade municipal'),
('ENTITY_TYPE', 'INSTITUTE', 'Instituto', 'pt-CV', 5, 'Instituto público');

-- Modelos de Licenciamento
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description, metadata) VALUES
('LICENSING_MODEL', 'SIMPLE', 'Licenciamento Simples', 'pt-CV', 1, 'Processo simplificado', '{"duration_days": 30, "complexity": "low"}'),
('LICENSING_MODEL', 'STANDARD', 'Licenciamento Padrão', 'pt-CV', 2, 'Processo padrão', '{"duration_days": 60, "complexity": "medium"}'),
('LICENSING_MODEL', 'COMPLEX', 'Licenciamento Complexo', 'pt-CV', 3, 'Processo complexo', '{"duration_days": 90, "complexity": "high"}'),
('LICENSING_MODEL', 'AUTOMATIC', 'Licenciamento Automático', 'pt-CV', 4, 'Aprovação automática', '{"duration_days": 1, "complexity": "none"}');

-- Unidades de Validade
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('VALIDITY_UNIT', 'DAYS', 'Dias', 'pt-CV', 1, 'Validade em dias'),
('VALIDITY_UNIT', 'MONTHS', 'Meses', 'pt-CV', 2, 'Validade em meses'),
('VALIDITY_UNIT', 'YEARS', 'Anos', 'pt-CV', 3, 'Validade em anos'),
('VALIDITY_UNIT', 'INDEFINITE', 'Indefinida', 'pt-CV', 4, 'Sem prazo de validade');

-- Tipos de Infração
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('INFRACTION_TYPE', 'MINOR', 'Leve', 'pt-CV', 1, 'Infração de natureza leve'),
('INFRACTION_TYPE', 'SERIOUS', 'Grave', 'pt-CV', 2, 'Infração de natureza grave'),
('INFRACTION_TYPE', 'VERY_SERIOUS', 'Muito Grave', 'pt-CV', 3, 'Infração de natureza muito grave');
```

## 11. Monitorização e Métricas

### 11.1 Métricas de Performance

```java
@Component
public class ParameterizationMetrics {
    
    private final Counter optionRequestsCounter;
    private final Timer optionRequestsTimer;
    private final Gauge cacheHitRatio;
    
    public ParameterizationMetrics(MeterRegistry meterRegistry) {
        this.optionRequestsCounter = Counter.builder("options.requests.total")
            .description("Total number of option requests")
            .tag("module", "parameterization")
            .register(meterRegistry);
            
        this.optionRequestsTimer = Timer.builder("options.requests.duration")
            .description("Option request duration")
            .register(meterRegistry);
            
        this.cacheHitRatio = Gauge.builder("options.cache.hit.ratio")
            .description("Cache hit ratio for options")
            .register(meterRegistry, this, ParameterizationMetrics::getCacheHitRatio);
    }
    
    public void recordRequest(String code, String locale) {
        optionRequestsCounter.increment(
            Tags.of("code", code, "locale", locale)
        );
    }
    
    private double getCacheHitRatio() {
        // Implementar lógica de cálculo do cache hit ratio
        return 0.85; // Exemplo
    }
}
```

### 11.2 Health Checks

```java
@Component
public class ParameterizationHealthIndicator implements HealthIndicator {
    
    private final OptionRepository optionRepository;
    
    @Override
    public Health health() {
        try {
            long totalOptions = optionRepository.count();
            long activeOptions = optionRepository.countByActiveTrue();
            
            return Health.up()
                .withDetail("totalOptions", totalOptions)
                .withDetail("activeOptions", activeOptions)
                .withDetail("inactiveOptions", totalOptions - activeOptions)
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}
```

## 12. Documentação da API

### 12.1 Configuração OpenAPI

```java
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Parametrização Base API",
        version = "1.0",
        description = "API para gestão de parametrizações do sistema de licenciamento"
    )
)
public class ParameterizationOpenApiConfig {
    
    @Bean
    public GroupedOpenApi parameterizationApi() {
        return GroupedOpenApi.builder()
            .group("parameterization")
            .pathsToMatch("/api/v1/options/**")
            .build();
    }
}
```

### 12.2 Anotações nos Controllers

```java
@RestController
@RequestMapping("/api/v1/options")
@Tag(name = "Parametrização", description = "Gestão de opções e parametrizações do sistema")
public class ParameterizationController {
    
    @GetMapping("/{code}")
    @Operation(
        summary = "Obter opções por código",
        description = "Retorna todas as opções ativas para um código específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Opções encontradas"),
        @ApiResponse(responseCode = "404", description = "Código não encontrado")
    })
    public ResponseEntity<OptionSetResponse> getOptionsByCode(
        @Parameter(description = "Código do conjunto de opções", example = "LICENSE_STATUS")
        @PathVariable String code,
        
        @Parameter(description = "Idioma das opções", example = "pt-CV")
        @RequestParam(defaultValue = "pt-CV") String locale,
        
        @Parameter(description = "Formato da resposta", example = "list")
        @RequestParam(defaultValue = "list") String format
    ) {
        // Implementação
    }
}
```

## 13. Considerações de Implementação

### 13.1 Fases de Desenvolvimento

1. **Fase 1** (1 semana): Modelo de dados e migração
2. **Fase 2** (1 semana): Domain layer e use cases
3. **Fase 3** (1 semana): APIs REST e cache
4. **Fase 4** (0.5 semana): Testes e documentação
5. **Fase 5** (0.5 semana): Integração e deploy

### 13.2 Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|----------|
| Performance de consultas | Alto | Implementar cache eficiente |
| Crescimento descontrolado de dados | Médio | Implementar soft delete e arquivamento |
| Inconsistência de dados | Alto | Validações rigorosas e transações |
| Falha de cache | Médio | Fallback para base de dados |

### 13.3 Métricas de Sucesso

- **Performance**: Tempo de resposta < 100ms para consultas em cache
- **Disponibilidade**: 99.9% uptime
- **Cache Hit Ratio**: > 80%
- **Cobertura de Testes**: > 90%
- **Tempo de Deploy**: < 5 minutos

## 14. Conclusão

O módulo de Parametrização Base fornece uma solução robusta e flexível para gestão de opções dinâmicas no sistema de licenciamento. A arquitetura DDD garante separação de responsabilidades, enquanto o cache otimiza a performance. A API REST bem documentada facilita a integração com o frontend e outros sistemas.

A implementação seguirá as melhores práticas de desenvolvimento, incluindo testes automatizados, monitorização e documentação completa, garantindo um módulo confiável e de fácil manutenção.