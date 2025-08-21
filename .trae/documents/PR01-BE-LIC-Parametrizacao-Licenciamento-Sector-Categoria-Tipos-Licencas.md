# PR01-BE-LIC-Parametrização Licenciamento Sector - Categoria - Tipos de Licenças
## Sistema de Configuração de Licenciamento de Cabo Verde - Backend API

## 1. Visão Geral do Módulo

O módulo de **Parametrização de Licenciamento** é responsável pela gestão das três entidades fundamentais do sistema: **Setores**, **Categorias** e **Tipos de Licenças**. Este módulo fornece APIs REST completas para operações CRUD, suporte hierárquico para categorias, e integração com o sistema de opções para tipos de setores.

### 1.1 Objetivos
- Gerir setores económicos com classificação por tipos (via sistema de opções)
- Implementar estrutura hierárquica de categorias de atividades
- Configurar tipos de licenças com parâmetros avançados
- Fornecer APIs REST performantes com cache inteligente
- Garantir integridade referencial e validações de negócio
- Suportar internacionalização (pt-CV, en)
- Implementar auditoria completa de operações

### 1.2 Entidades Principais
- **T_SECTOR**: Setores económicos (Agricultura, Turismo, Indústria, etc.)
- **T_CATEGORY**: Categorias hierárquicas de atividades económicas
- **T_LICENSE_TYPE**: Tipos de licenças com configurações específicas

## 2. Modelo de Dados

### 2.1 Tabela T_SECTOR

```sql
CREATE TABLE t_sector (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sector_type_key VARCHAR(50) NOT NULL,  -- Referência para t_options (SECTOR_TYPE)
    code VARCHAR(20) UNIQUE NOT NULL,      -- Código único do setor
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,                        -- Configurações específicas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Índices
CREATE INDEX idx_sector_type ON t_sector(sector_type_key);
CREATE INDEX idx_sector_active ON t_sector(active);
CREATE INDEX idx_sector_code ON t_sector(code);
CREATE INDEX idx_sector_sort ON t_sector(sort_order NULLS LAST);
```

### 2.2 Tabela T_CATEGORY

```sql
CREATE TABLE t_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(30) UNIQUE NOT NULL,      -- Código hierárquico (ex: AGR.001, AGR.001.001)
    parent_id UUID REFERENCES t_category(id),
    sector_id UUID NOT NULL REFERENCES t_sector(id),
    level INTEGER NOT NULL DEFAULT 1,      -- Nível hierárquico (1=raiz, 2=sub, etc.)
    path VARCHAR(500),                     -- Caminho hierárquico completo
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Índices
CREATE INDEX idx_category_parent ON t_category(parent_id);
CREATE INDEX idx_category_sector ON t_category(sector_id);
CREATE INDEX idx_category_level ON t_category(level);
CREATE INDEX idx_category_path ON t_category USING GIN(to_tsvector('portuguese', path));
CREATE INDEX idx_category_active ON t_category(active);
CREATE INDEX idx_category_code ON t_category(code);
```

### 2.3 Tabela T_LICENSE_TYPE

```sql
CREATE TABLE t_license_type (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(30) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES t_category(id),
    
    -- Configurações de Licenciamento
    licensing_model_key VARCHAR(50) NOT NULL,  -- Referência para t_options (LICENSING_MODEL)
    validity_period INTEGER,                   -- Período de validade
    validity_unit_key VARCHAR(50),            -- Referência para t_options (VALIDITY_UNIT)
    renewable BOOLEAN DEFAULT TRUE,
    auto_renewal BOOLEAN DEFAULT FALSE,
    
    -- Configurações de Processo
    requires_inspection BOOLEAN DEFAULT FALSE,
    requires_public_consultation BOOLEAN DEFAULT FALSE,
    max_processing_days INTEGER,
    
    -- Configurações Financeiras
    has_fees BOOLEAN DEFAULT TRUE,
    base_fee DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'CVE',
    
    -- Status e Metadados
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,                           -- Configurações específicas adicionais
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Índices
CREATE INDEX idx_license_type_category ON t_license_type(category_id);
CREATE INDEX idx_license_type_model ON t_license_type(licensing_model_key);
CREATE INDEX idx_license_type_active ON t_license_type(active);
CREATE INDEX idx_license_type_code ON t_license_type(code);
CREATE INDEX idx_license_type_renewable ON t_license_type(renewable);
```

### 2.4 Dados Iniciais para Tipos de Setores

```sql
-- Inserir tipos de setores no sistema de opções
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('SECTOR_TYPE', 'PRIMARY', 'Setor Primário', 'pt-CV', 1, 'Agricultura, Pesca, Mineração'),
('SECTOR_TYPE', 'SECONDARY', 'Setor Secundário', 'pt-CV', 2, 'Indústria, Construção, Manufatura'),
('SECTOR_TYPE', 'TERTIARY', 'Setor Terciário', 'pt-CV', 3, 'Serviços, Comércio, Turismo'),
('SECTOR_TYPE', 'QUATERNARY', 'Setor Quaternário', 'pt-CV', 4, 'Tecnologia, Investigação, Consultoria');
```

## 3. Arquitetura DDD

### 3.1 Estrutura de Camadas

```
src/main/java/cv/gov/licensing/
├── domain/
│   ├── sector/
│   │   ├── Sector.java                    # Aggregate Root
│   │   ├── SectorId.java                  # Value Object
│   │   ├── SectorCode.java                # Value Object
│   │   ├── SectorType.java                # Value Object
│   │   ├── SectorRepository.java          # Repository Interface
│   │   └── SectorDomainService.java
│   ├── category/
│   │   ├── Category.java                  # Aggregate Root
│   │   ├── CategoryId.java                # Value Object
│   │   ├── CategoryCode.java              # Value Object
│   │   ├── CategoryPath.java              # Value Object
│   │   ├── CategoryRepository.java        # Repository Interface
│   │   └── CategoryDomainService.java
│   └── licensetype/
│       ├── LicenseType.java               # Aggregate Root
│       ├── LicenseTypeId.java             # Value Object
│       ├── LicenseTypeCode.java           # Value Object
│       ├── LicensingConfiguration.java    # Value Object
│       ├── FinancialConfiguration.java    # Value Object
│       ├── LicenseTypeRepository.java     # Repository Interface
│       └── LicenseTypeDomainService.java
├── application/
│   ├── sector/
│   │   ├── usecase/
│   │   │   ├── CreateSectorUseCase.java
│   │   │   ├── UpdateSectorUseCase.java
│   │   │   ├── DeleteSectorUseCase.java
│   │   │   ├── GetSectorUseCase.java
│   │   │   └── ListSectorsUseCase.java
│   │   └── service/
│   │       └── SectorApplicationService.java
│   ├── category/
│   │   ├── usecase/
│   │   │   ├── CreateCategoryUseCase.java
│   │   │   ├── UpdateCategoryUseCase.java
│   │   │   ├── DeleteCategoryUseCase.java
│   │   │   ├── GetCategoryTreeUseCase.java
│   │   │   └── MoveCategoryUseCase.java
│   │   └── service/
│   │       └── CategoryApplicationService.java
│   └── licensetype/
│       ├── usecase/
│       │   ├── CreateLicenseTypeUseCase.java
│       │   ├── UpdateLicenseTypeUseCase.java
│       │   ├── DeleteLicenseTypeUseCase.java
│       │   ├── GetLicenseTypeUseCase.java
│       │   └── ListLicenseTypesByCategoryUseCase.java
│       └── service/
│           └── LicenseTypeApplicationService.java
├── interfaces/
│   └── rest/
│       ├── SectorController.java
│       ├── CategoryController.java
│       ├── LicenseTypeController.java
│       └── dto/
│           ├── SectorResponse.java
│           ├── CategoryResponse.java
│           ├── LicenseTypeResponse.java
│           ├── CreateSectorRequest.java
│           ├── CreateCategoryRequest.java
│           └── CreateLicenseTypeRequest.java
└── infrastructure/
    ├── persistence/
    │   ├── SectorJpaEntity.java
    │   ├── CategoryJpaEntity.java
    │   ├── LicenseTypeJpaEntity.java
    │   ├── SectorJpaRepository.java
    │   ├── CategoryJpaRepository.java
    │   ├── LicenseTypeJpaRepository.java
    │   ├── SectorRepositoryAdapter.java
    │   ├── CategoryRepositoryAdapter.java
    │   └── LicenseTypeRepositoryAdapter.java
    └── cache/
        ├── SectorCacheService.java
        ├── CategoryCacheService.java
        └── LicenseTypeCacheService.java
```

### 3.2 Domain Layer - Entidades Principais

#### 3.2.1 Sector Aggregate

```java
@Entity
public class Sector {
    private SectorId id;
    private Name name;
    private Description description;
    private SectorCode code;
    private SectorType sectorType;
    private Boolean active;
    private Integer sortOrder;
    private Map<String, Object> metadata;
    private AuditInfo auditInfo;
    
    // Factory Method
    public static Sector create(Name name, SectorCode code, SectorType sectorType) {
        var sector = new Sector();
        sector.id = SectorId.generate();
        sector.name = Objects.requireNonNull(name, "Nome é obrigatório");
        sector.code = Objects.requireNonNull(code, "Código é obrigatório");
        sector.sectorType = Objects.requireNonNull(sectorType, "Tipo de setor é obrigatório");
        sector.active = true;
        sector.auditInfo = AuditInfo.create();
        return sector;
    }
    
    // Business Methods
    public void updateName(Name newName) {
        this.name = Objects.requireNonNull(newName, "Nome é obrigatório");
        this.auditInfo = this.auditInfo.update();
    }
    
    public void changeSectorType(SectorType newType) {
        this.sectorType = Objects.requireNonNull(newType, "Tipo de setor é obrigatório");
        this.auditInfo = this.auditInfo.update();
    }
    
    public void deactivate() {
        this.active = false;
        this.auditInfo = this.auditInfo.update();
    }
}
```

#### 3.2.2 Category Aggregate

```java
@Entity
public class Category {
    private CategoryId id;
    private Name name;
    private Description description;
    private CategoryCode code;
    private CategoryId parentId;
    private SectorId sectorId;
    private Integer level;
    private CategoryPath path;
    private Boolean active;
    private Integer sortOrder;
    private Map<String, Object> metadata;
    private AuditInfo auditInfo;
    
    // Factory Methods
    public static Category createRoot(Name name, CategoryCode code, SectorId sectorId) {
        var category = new Category();
        category.id = CategoryId.generate();
        category.name = Objects.requireNonNull(name, "Nome é obrigatório");
        category.code = Objects.requireNonNull(code, "Código é obrigatório");
        category.sectorId = Objects.requireNonNull(sectorId, "Setor é obrigatório");
        category.level = 1;
        category.path = CategoryPath.root(code);
        category.active = true;
        category.auditInfo = AuditInfo.create();
        return category;
    }
    
    public static Category createChild(Name name, CategoryCode code, 
                                     Category parent, SectorId sectorId) {
        var category = new Category();
        category.id = CategoryId.generate();
        category.name = Objects.requireNonNull(name, "Nome é obrigatório");
        category.code = Objects.requireNonNull(code, "Código é obrigatório");
        category.parentId = parent.getId();
        category.sectorId = Objects.requireNonNull(sectorId, "Setor é obrigatório");
        category.level = parent.getLevel() + 1;
        category.path = parent.getPath().append(code);
        category.active = true;
        category.auditInfo = AuditInfo.create();
        return category;
    }
    
    // Business Methods
    public boolean isRoot() {
        return parentId == null;
    }
    
    public boolean canHaveChildren() {
        return level < 5; // Máximo 5 níveis
    }
    
    public void moveTo(Category newParent) {
        if (newParent != null && !newParent.canHaveChildren()) {
            throw new BusinessRuleException("Categoria pai não pode ter mais filhos");
        }
        
        this.parentId = newParent != null ? newParent.getId() : null;
        this.level = newParent != null ? newParent.getLevel() + 1 : 1;
        this.path = newParent != null ? newParent.getPath().append(this.code) 
                                     : CategoryPath.root(this.code);
        this.auditInfo = this.auditInfo.update();
    }
}
```

#### 3.2.3 LicenseType Aggregate

```java
@Entity
public class LicenseType {
    private LicenseTypeId id;
    private Name name;
    private Description description;
    private LicenseTypeCode code;
    private CategoryId categoryId;
    private LicensingConfiguration licensingConfig;
    private FinancialConfiguration financialConfig;
    private Boolean active;
    private Integer sortOrder;
    private Map<String, Object> metadata;
    private AuditInfo auditInfo;
    
    // Factory Method
    public static LicenseType create(Name name, LicenseTypeCode code, 
                                   CategoryId categoryId, 
                                   LicensingConfiguration licensingConfig) {
        var licenseType = new LicenseType();
        licenseType.id = LicenseTypeId.generate();
        licenseType.name = Objects.requireNonNull(name, "Nome é obrigatório");
        licenseType.code = Objects.requireNonNull(code, "Código é obrigatório");
        licenseType.categoryId = Objects.requireNonNull(categoryId, "Categoria é obrigatória");
        licenseType.licensingConfig = Objects.requireNonNull(licensingConfig, 
                                                            "Configuração é obrigatória");
        licenseType.active = true;
        licenseType.auditInfo = AuditInfo.create();
        return licenseType;
    }
    
    // Business Methods
    public void updateLicensingConfiguration(LicensingConfiguration newConfig) {
        this.licensingConfig = Objects.requireNonNull(newConfig, 
                                                     "Configuração é obrigatória");
        this.auditInfo = this.auditInfo.update();
    }
    
    public void updateFinancialConfiguration(FinancialConfiguration newConfig) {
        this.financialConfig = newConfig;
        this.auditInfo = this.auditInfo.update();
    }
    
    public boolean isRenewable() {
        return licensingConfig.isRenewable();
    }
    
    public boolean requiresInspection() {
        return licensingConfig.requiresInspection();
    }
}
```

## 4. APIs REST

### 4.1 Sector Controller

#### GET /api/v1/sectors
Listar todos os setores.

**Parâmetros:**
- `sectorType` (query, opcional): Filtrar por tipo de setor
- `active` (query, opcional): Filtrar por status (default: true)
- `page` (query, opcional): Página (default: 0)
- `size` (query, opcional): Tamanho da página (default: 20)
- `sort` (query, opcional): Ordenação (ex: name,asc)

**Resposta:**
```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Agricultura",
      "description": "Setor agrícola e pecuário",
      "code": "AGR",
      "sectorType": {
        "key": "PRIMARY",
        "value": "Setor Primário"
      },
      "active": true,
      "sortOrder": 1,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 15,
    "totalPages": 1
  }
}
```

#### POST /api/v1/sectors
Criar novo setor.

**Request Body:**
```json
{
  "name": "Turismo",
  "description": "Setor de turismo e hotelaria",
  "code": "TUR",
  "sectorTypeKey": "TERTIARY",
  "sortOrder": 5,
  "metadata": {
    "seasonality": true,
    "regulatoryComplexity": "medium"
  }
}
```

#### PUT /api/v1/sectors/{id}
Atualizar setor existente.

#### DELETE /api/v1/sectors/{id}
Eliminar setor (soft delete).

#### GET /api/v1/sectors/{id}
Obter setor por ID.

### 4.2 Category Controller

#### GET /api/v1/categories/tree
Obter árvore hierárquica de categorias.

**Parâmetros:**
- `sectorId` (query, opcional): Filtrar por setor
- `maxLevel` (query, opcional): Nível máximo (default: 5)
- `includeInactive` (query, opcional): Incluir inativas (default: false)

**Resposta:**
```json
{
  "sectors": [
    {
      "sectorId": "123e4567-e89b-12d3-a456-426614174000",
      "sectorName": "Agricultura",
      "categories": [
        {
          "id": "456e7890-e89b-12d3-a456-426614174001",
          "name": "Agricultura Familiar",
          "code": "AGR.001",
          "level": 1,
          "path": "AGR.001",
          "children": [
            {
              "id": "789e0123-e89b-12d3-a456-426614174002",
              "name": "Cultivo de Cereais",
              "code": "AGR.001.001",
              "level": 2,
              "path": "AGR.001/AGR.001.001",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

#### POST /api/v1/categories
Criar nova categoria.

**Request Body:**
```json
{
  "name": "Aquacultura",
  "description": "Criação de organismos aquáticos",
  "code": "AGR.002",
  "parentId": null,
  "sectorId": "123e4567-e89b-12d3-a456-426614174000",
  "sortOrder": 2
}
```

#### PUT /api/v1/categories/{id}/move
Mover categoria na hierarquia.

**Request Body:**
```json
{
  "newParentId": "456e7890-e89b-12d3-a456-426614174001"
}
```

### 4.3 License Type Controller

#### GET /api/v1/license-types
Listar tipos de licenças.

**Parâmetros:**
- `categoryId` (query, opcional): Filtrar por categoria
- `licensingModel` (query, opcional): Filtrar por modelo de licenciamento
- `renewable` (query, opcional): Filtrar por renovável
- `active` (query, opcional): Filtrar por status

#### POST /api/v1/license-types
Criar novo tipo de licença.

**Request Body:**
```json
{
  "name": "Licença de Exploração Agrícola",
  "description": "Licença para exploração de atividades agrícolas",
  "code": "LEA-001",
  "categoryId": "456e7890-e89b-12d3-a456-426614174001",
  "licensingModelKey": "STANDARD",
  "validityPeriod": 24,
  "validityUnitKey": "MONTHS",
  "renewable": true,
  "autoRenewal": false,
  "requiresInspection": true,
  "requiresPublicConsultation": false,
  "maxProcessingDays": 60,
  "hasFees": true,
  "baseFee": 15000.00,
  "currencyCode": "CVE",
  "metadata": {
    "minimumLandArea": 1000,
    "environmentalImpact": "low"
  }
}
```

## 5. Validações e Regras de Negócio

### 5.1 Validações de Setor

```java
public class SectorDomainService {
    
    public void validateSectorCreation(Sector sector, SectorRepository repository) {
        // Validar unicidade do código
        if (repository.existsByCode(sector.getCode())) {
            throw new BusinessRuleException("Código de setor já existe: " + sector.getCode());
        }
        
        // Validar tipo de setor
        if (!isValidSectorType(sector.getSectorType())) {
            throw new BusinessRuleException("Tipo de setor inválido: " + sector.getSectorType());
        }
    }
    
    public void validateSectorDeletion(SectorId sectorId, CategoryRepository categoryRepository) {
        // Não permitir eliminar setor com categorias ativas
        if (categoryRepository.existsBySectorIdAndActiveTrue(sectorId)) {
            throw new BusinessRuleException("Não é possível eliminar setor com categorias ativas");
        }
    }
    
    private boolean isValidSectorType(SectorType sectorType) {
        // Validar contra opções disponíveis no sistema
        return Arrays.asList("PRIMARY", "SECONDARY", "TERTIARY", "QUATERNARY")
                    .contains(sectorType.getKey());
    }
}
```

### 5.2 Validações de Categoria

```java
public class CategoryDomainService {
    
    public void validateCategoryCreation(Category category, CategoryRepository repository) {
        // Validar unicidade do código
        if (repository.existsByCode(category.getCode())) {
            throw new BusinessRuleException("Código de categoria já existe: " + category.getCode());
        }
        
        // Validar hierarquia
        if (category.getParentId() != null) {
            Category parent = repository.findById(category.getParentId())
                .orElseThrow(() -> new BusinessRuleException("Categoria pai não encontrada"));
            
            if (!parent.canHaveChildren()) {
                throw new BusinessRuleException("Categoria pai não pode ter mais filhos");
            }
            
            if (!parent.getSectorId().equals(category.getSectorId())) {
                throw new BusinessRuleException("Categoria filha deve pertencer ao mesmo setor da pai");
            }
        }
        
        // Validar nível máximo
        if (category.getLevel() > 5) {
            throw new BusinessRuleException("Nível máximo de hierarquia é 5");
        }
    }
    
    public void validateCategoryMove(Category category, CategoryId newParentId, 
                                   CategoryRepository repository) {
        if (newParentId != null) {
            Category newParent = repository.findById(newParentId)
                .orElseThrow(() -> new BusinessRuleException("Nova categoria pai não encontrada"));
            
            // Não permitir mover para descendente (evitar ciclos)
            if (isDescendant(category.getId(), newParentId, repository)) {
                throw new BusinessRuleException("Não é possível mover categoria para um descendente");
            }
            
            // Validar nível resultante
            int newLevel = newParent.getLevel() + 1;
            int maxChildLevel = getMaxChildLevel(category.getId(), repository);
            if (newLevel + maxChildLevel > 5) {
                throw new BusinessRuleException("Movimento resultaria em hierarquia muito profunda");
            }
        }
    }
}
```

### 5.3 Validações de Tipo de Licença

```java
public class LicenseTypeDomainService {
    
    public void validateLicenseTypeCreation(LicenseType licenseType, 
                                          LicenseTypeRepository repository,
                                          CategoryRepository categoryRepository) {
        // Validar unicidade do código
        if (repository.existsByCode(licenseType.getCode())) {
            throw new BusinessRuleException("Código de tipo de licença já existe: " + 
                                          licenseType.getCode());
        }
        
        // Validar categoria existe e está ativa
        Category category = categoryRepository.findById(licenseType.getCategoryId())
            .orElseThrow(() -> new BusinessRuleException("Categoria não encontrada"));
        
        if (!category.isActive()) {
            throw new BusinessRuleException("Categoria deve estar ativa");
        }
        
        // Validar configuração de licenciamento
        validateLicensingConfiguration(licenseType.getLicensingConfig());
        
        // Validar configuração financeira
        if (licenseType.getFinancialConfig() != null) {
            validateFinancialConfiguration(licenseType.getFinancialConfig());
        }
    }
    
    private void validateLicensingConfiguration(LicensingConfiguration config) {
        // Validar modelo de licenciamento
        if (!isValidLicensingModel(config.getLicensingModelKey())) {
            throw new BusinessRuleException("Modelo de licenciamento inválido");
        }
        
        // Validar período de validade
        if (config.getValidityPeriod() != null && config.getValidityPeriod() <= 0) {
            throw new BusinessRuleException("Período de validade deve ser positivo");
        }
        
        // Validar prazo de processamento
        if (config.getMaxProcessingDays() != null && config.getMaxProcessingDays() <= 0) {
            throw new BusinessRuleException("Prazo de processamento deve ser positivo");
        }
    }
    
    private void validateFinancialConfiguration(FinancialConfiguration config) {
        if (config.getBaseFee() != null && config.getBaseFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Taxa base não pode ser negativa");
        }
    }
}
```

## 6. Cache e Performance

### 6.1 Estratégia de Cache

```java
@Service
@CacheConfig(cacheNames = {"sectors", "categories", "licenseTypes"})
public class LicensingCacheService {
    
    @Cacheable(value = "sectors", key = "'all_active'")
    public List<SectorResponse> getAllActiveSectors() {
        return sectorRepository.findByActiveTrue();
    }
    
    @Cacheable(value = "categories", key = "'tree_' + #sectorId")
    public CategoryTreeResponse getCategoryTree(UUID sectorId) {
        return categoryRepository.findTreeBySectorId(sectorId);
    }
    
    @Cacheable(value = "licenseTypes", key = "'by_category_' + #categoryId")
    public List<LicenseTypeResponse> getLicenseTypesByCategory(UUID categoryId) {
        return licenseTypeRepository.findByCategoryIdAndActiveTrue(categoryId);
    }
    
    @CacheEvict(value = "sectors", allEntries = true)
    public void evictSectorCache() {
        // Invalidar cache de setores
    }
    
    @CacheEvict(value = "categories", allEntries = true)
    public void evictCategoryCache() {
        // Invalidar cache de categorias
    }
    
    @CacheEvict(value = "licenseTypes", allEntries = true)
    public void evictLicenseTypeCache() {
        // Invalidar cache de tipos de licenças
    }
}
```

## 7. Segurança

### 7.1 Controlo de Acesso

```java
@Configuration
@EnableWebSecurity
public class LicensingSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
            // Consultas públicas
            .requestMatchers(HttpMethod.GET, "/api/v1/sectors").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/license-types").permitAll()
            
            // Operações administrativas
            .requestMatchers(HttpMethod.POST, "/api/v1/sectors").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/sectors/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/sectors/**").hasRole("ADMIN")
            
            .requestMatchers(HttpMethod.POST, "/api/v1/categories").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasRole("ADMIN")
            
            .requestMatchers(HttpMethod.POST, "/api/v1/license-types").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/v1/license-types/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/v1/license-types/**").hasRole("ADMIN")
            
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

## 8. Testes

### 8.1 Testes Unitários

```java
@ExtendWith(MockitoExtension.class)
class CreateSectorUseCaseTest {
    
    @Mock
    private SectorRepository sectorRepository;
    
    @Mock
    private SectorDomainService sectorDomainService;
    
    @InjectMocks
    private CreateSectorUseCase useCase;
    
    @Test
    void shouldCreateSectorSuccessfully() {
        // Given
        CreateSectorRequest request = CreateSectorRequest.builder()
            .name("Turismo")
            .code("TUR")
            .sectorTypeKey("TERTIARY")
            .build();
        
        Sector expectedSector = Sector.create(
            Name.of(request.getName()),
            SectorCode.of(request.getCode()),
            SectorType.of(request.getSectorTypeKey())
        );
        
        when(sectorRepository.save(any(Sector.class))).thenReturn(expectedSector);
        
        // When
        SectorResponse result = useCase.execute(request);
        
        // Then
        assertThat(result.getName()).isEqualTo("Turismo");
        assertThat(result.getCode()).isEqualTo("TUR");
        verify(sectorDomainService).validateSectorCreation(any(Sector.class), eq(sectorRepository));
        verify(sectorRepository).save(any(Sector.class));
    }
}
```

### 8.2 Testes de Integração

```java
@SpringBootTest
@Testcontainers
class SectorControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("licensing_test")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateSectorSuccessfully() {
        // Given
        CreateSectorRequest request = CreateSectorRequest.builder()
            .name("Indústria")
            .code("IND")
            .sectorTypeKey("SECONDARY")
            .description("Setor industrial")
            .build();
        
        // When
        ResponseEntity<SectorResponse> response = restTemplate.postForEntity(
            "/api/v1/sectors", request, SectorResponse.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getName()).isEqualTo("Indústria");
        assertThat(response.getBody().getCode()).isEqualTo("IND");
    }
}
```

## 9. Scripts de Migração

### 9.1 Flyway Migration Scripts

```sql
-- V003__create_licensing_tables.sql

-- Criar tabela de setores
CREATE TABLE t_sector (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sector_type_key VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Criar tabela de categorias
CREATE TABLE t_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(30) UNIQUE NOT NULL,
    parent_id UUID REFERENCES t_category(id),
    sector_id UUID NOT NULL REFERENCES t_sector(id),
    level INTEGER NOT NULL DEFAULT 1,
    path VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Criar tabela de tipos de licenças
CREATE TABLE t_license_type (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(30) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES t_category(id),
    licensing_model_key VARCHAR(50) NOT NULL,
    validity_period INTEGER,
    validity_unit_key VARCHAR(50),
    renewable BOOLEAN DEFAULT TRUE,
    auto_renewal BOOLEAN DEFAULT FALSE,
    requires_inspection BOOLEAN DEFAULT FALSE,
    requires_public_consultation BOOLEAN DEFAULT FALSE,
    max_processing_days INTEGER,
    has_fees BOOLEAN DEFAULT TRUE,
    base_fee DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'CVE',
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Criar índices
CREATE INDEX idx_sector_type ON t_sector(sector_type_key);
CREATE INDEX idx_sector_active ON t_sector(active);
CREATE INDEX idx_sector_code ON t_sector(code);
CREATE INDEX idx_sector_sort ON t_sector(sort_order NULLS LAST);

CREATE INDEX idx_category_parent ON t_category(parent_id);
CREATE INDEX idx_category_sector ON t_category(sector_id);
CREATE INDEX idx_category_level ON t_category(level);
CREATE INDEX idx_category_path ON t_category USING GIN(to_tsvector('portuguese', path));
CREATE INDEX idx_category_active ON t_category(active);
CREATE INDEX idx_category_code ON t_category(code);

CREATE INDEX idx_license_type_category ON t_license_type(category_id);
CREATE INDEX idx_license_type_model ON t_license_type(licensing_model_key);
CREATE INDEX idx_license_type_active ON t_license_type(active);
CREATE INDEX idx_license_type_code ON t_license_type(code);
CREATE INDEX idx_license_type_renewable ON t_license_type(renewable);
```

### 9.2 Dados Iniciais

```sql
-- V004__insert_licensing_initial_data.sql

-- Inserir tipos de setores
INSERT INTO t_options (ccode, ckey, cvalue, locale, sort_order, description) VALUES
('SECTOR_TYPE', 'PRIMARY', 'Setor Primário', 'pt-CV', 1, 'Agricultura, Pesca, Mineração'),
('SECTOR_TYPE', 'SECONDARY', 'Setor Secundário', 'pt-CV', 2, 'Indústria, Construção, Manufatura'),
('SECTOR_TYPE', 'TERTIARY', 'Setor Terciário', 'pt-CV', 3, 'Serviços, Comércio, Turismo'),
('SECTOR_TYPE', 'QUATERNARY', 'Setor Quaternário', 'pt-CV', 4, 'Tecnologia, Investigação, Consultoria');

-- Inserir setores iniciais
INSERT INTO t_sector (name, description, sector_type_key, code, sort_order) VALUES
('Agricultura', 'Setor agrícola e pecuário', 'PRIMARY', 'AGR', 1),
('Pesca', 'Setor pesqueiro e aquacultura', 'PRIMARY', 'PES', 2),
('Indústria', 'Setor industrial e manufatureiro', 'SECONDARY', 'IND', 3),
('Construção', 'Setor da construção civil', 'SECONDARY', 'CON', 4),
('Turismo', 'Setor de turismo e hotelaria', 'TERTIARY', 'TUR', 5),
('Comércio', 'Setor comercial e distribuição', 'TERTIARY', 'COM', 6),
('Tecnologia', 'Setor de tecnologia e inovação', 'QUATERNARY', 'TEC', 7);

-- Inserir categorias iniciais (exemplos)
INSERT INTO t_category (name, description, code, sector_id, level, path, sort_order)
SELECT 
    'Agricultura Familiar', 
    'Atividades de agricultura familiar', 
    'AGR.001', 
    s.id, 
    1, 
    'AGR.001', 
    1
FROM t_sector s WHERE s.code = 'AGR';

INSERT INTO t_category (name, description, code, sector_id, level, path, sort_order)
SELECT 
    'Hotelaria', 
    'Atividades hoteleiras e alojamento', 
    'TUR.001', 
    s.id, 
    1, 
    'TUR.001', 
    1
FROM t_sector s WHERE s.code = 'TUR';

-- Inserir tipos de licenças iniciais (exemplos)
INSERT INTO t_license_type (
    name, description, code, category_id, licensing_model_key, 
    validity_period, validity_unit_key, renewable, requires_inspection,
    max_processing_days, has_fees, base_fee
)
SELECT 
    'Licença de Exploração Agrícola',
    'Licença para exploração de atividades agrícolas familiares',
    'LEA-001',
    c.id,
    'STANDARD',
    24,
    'MONTHS',
    true,
    true,
    60,
    true,
    15000.00
FROM t_category c 
JOIN t_sector s ON c.sector_id = s.id 
WHERE s.code = 'AGR' AND c.code = 'AGR.001';

INSERT INTO t_license_type (
    name, description, code, category_id, licensing_model_key, 
    validity_period, validity_unit_key, renewable, requires_inspection,
    max_processing_days, has_fees, base_fee
)
SELECT 
    'Licença de Estabelecimento Hoteleiro',
    'Licença para funcionamento de estabelecimentos hoteleiros',
    'LEH-001',
    c.id,
    'COMPLEX',
    36,
    'MONTHS',
    true,
    true,
    90,
    true,
    50000.00
FROM t_category c 
JOIN t_sector s ON c.sector_id = s.id 
WHERE s.code = 'TUR' AND c.code = 'TUR.001';
```

## 10. Monitorização e Métricas

### 10.1 Métricas de Performance

```java
@Component
public class LicensingMetrics {
    
    private final Counter sectorRequestsCounter;
    private final Counter categoryRequestsCounter;
    private final Counter licenseTypeRequestsCounter;
    private final Timer sectorResponseTimer;
    private final Gauge activeSectorsGauge;
    
    public LicensingMetrics(MeterRegistry meterRegistry, SectorRepository sectorRepository) {
        this.sectorRequestsCounter = Counter.builder("licensing.sectors.requests.total")
            .description("Total number of sector requests")
            .register(meterRegistry);
            
        this.categoryRequestsCounter = Counter.builder("licensing.categories.requests.total")
            .description("Total number of category requests")
            .register(meterRegistry);
            
        this.licenseTypeRequestsCounter = Counter.builder("licensing.license_types.requests.total")
            .description("Total number of license type requests")
            .register(meterRegistry);
            
        this.sectorResponseTimer = Timer.builder("licensing.sectors.response.time")
            .description("Sector response time")
            .register(meterRegistry);
            
        this.activeSectorsGauge = Gauge.builder("licensing.sectors.active.count")
            .description("Number of active sectors")
            .register(meterRegistry, this, LicensingMetrics::getActiveSectorsCount);
    }
    
    public void incrementSectorRequests() {
        sectorRequestsCounter.increment();
    }
    
    public Timer.Sample startSectorTimer() {
        return Timer.start(sectorResponseTimer);
    }
    
    private double getActiveSectorsCount() {
        return sectorRepository.countByActiveTrue();
    }
}
```

## 11. Conclusão

Este documento especifica a implementação completa do módulo de parametrização de licenciamento, cobrindo:

- **Modelo de dados normalizado** com três entidades principais
- **Arquitetura DDD** com separação clara de responsabilidades
- **APIs REST** completas com operações CRUD
- **Validações robustas** e regras de negócio
- **Sistema de cache** para performance otimizada
- **Segurança** com controlo de acesso baseado em roles
- **Testes** unitários e de integração
- **Scripts de migração** e dados iniciais
- **Monitorização** com métricas de performance

A implementação segue as melhores práticas de desenvolvimento, garantindo escalabilidade, manutenibilidade e performance do sistema de licenciamento de Cabo Verde.