# 🚀 ProofChain — Deploy Guide (Monad Testnet)

> **Tiempo estimado: ~5 minutos**

---

## Prerequisitos

- Node.js 18+ instalado
- Wallet con MON en Monad Testnet
- Git configurado

---

## Paso 1 — Consigue MON del faucet

Ve a **https://faucet.monad.xyz** y solicita MON de testnet para tu wallet.

> Necesitarás al menos ~0.05 MON para cubrir el gas de los 3 contratos + 2 transacciones de configuración.

---

## Paso 2 — Configura tu Private Key

En la carpeta `proofchain-mvp/`, crea un archivo `.env`:

```bash
cd proofchain-mvp
cp .env.example .env   # si existe, o crea uno nuevo
```

Edita `.env` y agrega:

```env
PRIVATE_KEY=0xTU_PRIVATE_KEY_AQUI
```

> ⚠️ **NUNCA subas tu `.env` a GitHub.** Está en `.gitignore` por seguridad.

---

## Paso 3 — Instala dependencias

```bash
npm install
```

---

## Paso 4 — Compila los contratos

```bash
npx hardhat compile
```

Deberías ver: `Compiled X Solidity files successfully`

> Si ya compilaste antes (hay carpeta `artifacts/`), puedes saltar este paso.

---

## Paso 5 — Despliega a Monad Testnet

```bash
npx hardhat run scripts/deploy.js --network monadTestnet
```

### Qué hace el script de deploy (en orden):

1. **ProofToken** — Deploy del token ERC-20 `$PROOF`
2. **ProofNFT** — Deploy del NFT soulbound `PROOF-XP`
3. **ProofRegistry** — Deploy del contrato principal (recibe las addresses del Token y NFT)
4. `proofToken.setMinter(registryAddress)` — Autoriza al Registry a mintear tokens
5. `proofNFT.setRegistry(registryAddress)` — Autoriza al Registry a mintear NFTs

### Output esperado:

```
Deploying ProofChain contracts...

ProofToken deployed to:    0xAAA...
ProofNFT deployed to:      0xBBB...
ProofRegistry deployed to: 0xCCC...

ProofToken minter set to ProofRegistry
ProofNFT registry set to ProofRegistry

--- Deployment Summary ---
ProofToken:     0xAAA...
ProofNFT:       0xBBB...
ProofRegistry:  0xCCC...
--------------------------
```

---

## Paso 6 — Guarda las addresses

Una vez desplegado, **copia las 3 addresses** del output y guárdalas en un archivo:

```bash
# Crea un archivo con las addresses desplegadas
cat > deployed-addresses.json << 'EOF'
{
  "network": "monadTestnet",
  "chainId": 10143,
  "contracts": {
    "ProofToken": "0xAAA...",
    "ProofNFT": "0xBBB...",
    "ProofRegistry": "0xCCC..."
  }
}
EOF
```

Reemplaza los `0xAAA...` con las addresses reales del output.

---

## Paso 7 — Verifica en el explorer

Puedes ver tus contratos en el explorador de Monad Testnet:

```
https://testnet.monadexplorer.com/address/0xTU_REGISTRY_ADDRESS
```

---

## Paso 8 — Actualiza el frontend (si aplica)

Si el proyecto tiene un frontend, actualiza las addresses en el archivo de configuración:

```bash
# Ejemplo: src/config/contracts.ts o similar
PROOF_TOKEN_ADDRESS=0xAAA...
PROOF_NFT_ADDRESS=0xBBB...
PROOF_REGISTRY_ADDRESS=0xCCC...
```

---

## Arquitectura de contratos

```
ProofToken ($PROOF)
  └── ERC-20, solo el Registry puede mintear

ProofNFT (PROOF-XP)
  └── ERC-721 Soulbound, solo el Registry puede mintear

ProofRegistry (contrato principal)
  ├── registerExperience(company, university, title, desc, hours)
  ├── signAsStudent(experienceId)
  ├── signAsCompany(experienceId)
  ├── signAsUniversity(experienceId)
  └── Al completarse las 3 firmas → mint NFT + 500 $PROOF al estudiante
```

---

## Flujo de uso post-deploy

1. **Estudiante** llama `registerExperience()` → crea la experiencia con status `Pending`
2. **Empresa** llama `signAsCompany(id)` → status pasa a `InProgress`
3. **Universidad** llama `signAsUniversity(id)` → continúa en `InProgress`
4. **Estudiante** llama `signAsStudent(id)` → si todos firmaron → `Completed`
   - Se mintea automáticamente 1 NFT soulbound al estudiante
   - Se mintean 500 `$PROOF` tokens al estudiante

---

## Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| `insufficient funds` | No hay MON | Ve al faucet: https://faucet.monad.xyz |
| `private key not found` | `.env` mal configurado | Verifica que `PRIVATE_KEY` empieza con `0x` |
| `network not found` | Nombre de red incorrecto | Usa exactamente `--network monadTestnet` |
| `nonce too low` | Transacción stuck | Espera unos segundos y reintenta |
| `contract not verified` | Normal en testnet | Puedes ignorar o usar `hardhat-verify` |

---

## Red: Monad Testnet

| Campo | Valor |
|-------|-------|
| Network Name | Monad Testnet |
| RPC URL | https://testnet-rpc.monad.xyz |
| Chain ID | 10143 |
| Symbol | MON |
| Faucet | https://faucet.monad.xyz |
| Explorer | https://testnet.monadexplorer.com |

---

_Generated for ProofChain Hackathon — good luck! 🏆_
