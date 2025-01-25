# 🚀 Bun

[![Bun Version](https://img.shields.io/badge/Bun-1.0.0-FFDB1C?style=flat&logo=bun)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)


### Prerrequisitos

- Bun 1.0+ ([Instalación](https://bun.sh/docs/installation))

### Pasos Rápidos

1. **Clona el repositorio**:

```bash
git clone https://github.com/estefanoquiriconi/bun.git
cd bun
```

2. **Instala dependencias**:

```bash
bun install
```

3. **Inicia el servidor**:

```bash
bun start
# Servidor disponible en http://localhost:3000
```

### 🔍 Probar Endpoints Manualmente

#### 1. Crear una tarea

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{ "title": "Mi primera tarea" }'
```

#### 2. Listar todas las tareas

```bash
curl http://localhost:3000/tasks
```

### 🧪 Ejecutar Tests

```bash
bun test
```

## 📦 Persistencia de Datos

- Los datos se guardan automáticamente en un archivo **SQLite** (`tasks.db` en la raíz del proyecto).
