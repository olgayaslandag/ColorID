# Agent Model Tanımı Güncelleme Planı

## Mevcut Durum
Config dosyasında (.opencode/config.yaml) proje için model tercihi "qwen3-coder-plus" olarak belirlenmiş. Ancak bazı agent yapılandırma dosyalarında hâlâ "qwen-2.5-coder-32b-instruct" tanımı kullanılmakta. Bu durum proje standartları açısından uyumsuzluktur.

## Güncellenmesi Gereken Dosyalar

### 1. Senior Database Architect
- Dosya: .opencode/agents/senior_database_architect.md
- Geçerli model: qwen/qwen-2.5-coder-32b-instruct  
- Hedef model: qwen3-coder-plus

### 2. Senior Backend Architect
- Dosya: .opencode/agents/senior_backend_architect.md
- Geçerli model: qwen/qwen-2.5-coder-32b-instruct
- Hedef model: qwen3-coder-plus

### 3. Senior API HTTP Architect
- Dosya: .opencode/agents/senior_api_http_architect.md
- Geçerli model: qwen/qwen-2.5-coder-32b-instruct
- Hedef model: qwen3-coder-plus

### 4. Senior Frontend Blade Architect
- Dosya: .opencode/agents/senior_frontend_blade_architect.md
- Geçerli model: qwen-2.5-coder-32b-instruct (yukarıdaki gibi ama "/qwen" eksik olabilir)
- Hedef model: qwen3-coder-plus

### 5. Frontend Inertia Architect
- Dosya: .opencode/agents/frontend_inertia_architect.md
- Geçerli model: qwen-2.5-coder-32b-instruct
- Hedef model: qwen3-coder-plus

### 6. Senior DevOps Architect
- Dosya: .opencode/agents/senior_devops_architect.md
- Geçerli model: qwen-2.5-coder-32b-instruct
- Hedef model: qwen3-coder-plus

### 7. Code Refiner
- Dosya: .opencode/agents/code_refiner.md
- Geçerli model: qwen-2.5-coder-32b-instruct
- Hedef model: qwen3-coder-plus

## Not
Senior Test Architect dosyası (.opencode/agents/senior_test_architect.md) zaten doğru şekilde qwen3-coder-plus modelini kullanmakta.

## Görevler
Bu plan doğrultusunda, uygun izinlere sahip bir geliştirici aşağıdaki değişiklikleri yapabilir:
- Yukarıda listelenen dosyalarda "model:" satırındaki değeri uygun şekilde güncellemek
- Dosyaların diğer bölümlerinde herhangi bir değişiklik yapılmasına gerek yoktur