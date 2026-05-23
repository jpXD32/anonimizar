# Anonimizador v3.2 - System Status ✅

**Last Updated:** May 23, 2026 - 01:17:41

## Current Status: HEALTHY & OPERATIONAL

### Services
- ✅ **Backend (Flask)**: http://localhost:5000 - Running
  - Health Check: `/api/health` → `{"status":"ok"}`
  - Timeout: 10 minutes (600 seconds)
  - Max file size: 50 MB
  
- ✅ **Frontend (Next.js)**: http://localhost:3000 - Ready
  - Framework: React 18 with Next.js 14.2
  - State: Zustand
  - Mode selector: Fully integrated

### Processing Verified
- **Test File**: Final.xlsx (10.82 MB, 16,063 rows × 7 columns)
- **Last Run**: 01:17:41 → 200 OK
- **Processing Time**: ~66 seconds
- **Result**: Successfully anonymized, cached for download

### 4 Improvements Implemented ✅

#### 1. Complex Address Detection
- Carreteras (highways): "Carretera a Melipilla, km 15"
- Hijuelas/Parcelas: "Hijuela 45-A"
- GPS Coordinates: "-33.437, -70.673"
- Caminos complejos: "Camino hacia Los Molles, km 8.5"
- **Status**: Active in `anonymizer.py`

#### 2. Additional Names
- **Mapuche**: llaipén, huenupillan, quilapan, reuque, etc.
- **Foreign**: john, james, pierre, jacques, louis, etc.
- **Local slang**: pelao, gordo, flaco, chino, rubio, negro
- **Compound names**: José María, Juan Carlos (both parts detected)
- **Status**: Active in `common_names` list

#### 3. Confidence Mode System
- **Conservative (95%)**: Maximum precision, minimum false positives
- **Standard (90%)**: Recommended balance (default)
- **Aggressive (80%)**: Maximum detection, may include false positives
- **Implementation**: `DataAnonymizer(confidence_mode='standard'|'conservative'|'aggressive')`
- **Status**: Fully integrated in backend

#### 4. UI Mode Selector
- **Component**: ColumnSelector.tsx shows 3 radio buttons
- **Icons**: 🛡️ Conservador | ⚖️ Estándar | 🔍 Agresivo
- **State**: Zustand `store.confidenceMode`
- **Flow**: User selects → Stored in state → Sent to API → Used by anonymizer
- **Display**: Results page shows which mode was used
- **Status**: Fully implemented and functional

### Response Handling (Large Files)
When processing files > 5,000 rows:
- ✅ Full file cached in `/tmp/` with UUID
- ✅ Preview (100 rows) returned in JSON response
- ✅ `result_download_id` provided for full file download
- ✅ All statistics & mappings included
- ✅ No size limit issues (16K rows handled perfectly)

### Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| MAX_FILE_SIZE | 50 MB | Upload limit |
| MAX_ROWS | 100,000 | Max rows per file |
| MAX_COLUMNS | 200 | Max columns per file |
| MAX_CELLS | 2,000,000 | Total cells limit |
| MAX_JSON_RESPONSE_ROWS | 25,000 | Inline response limit |
| MAX_INLINE_RESPONSE_ROWS | 5,000 | Cache trigger threshold |
| PREVIEW_RESPONSE_ROWS | 100 | Preview rows when cached |
| PROCESSING_TIMEOUT | 600 sec | Request timeout |
| RESULT_TTL | 3600 sec | Cache lifetime |

### CORS Configuration
Allowed origins for requests:
- `http://localhost:3000-3007`
- `http://127.0.0.1:3000-3007`

*(Automatically accepts ports 3000-3007 in case of port conflicts)*

### Startup
```bash
# Windows batch (recommended)
./start-services-smart.bat

# Or manual
# Terminal 1: Backend
cd backend
python -u app.py

# Terminal 2: Frontend
npm run dev
```

### Testing the Full Pipeline
1. **Visit**: http://localhost:3000
2. **Upload**: Final.xlsx (or any CSV/Excel)
3. **Select columns**: Choose which to anonymize
4. **Pick mode**: Select confidence level (🛡️/⚖️/🔍)
5. **Process**: Click "Comenzar anonimización"
6. **Download**: Get results in CSV, Excel, or JSON mappings

### Logs
- Backend stdout: `C:\Proyectos\anonimizar\backend\backend-debug.out.log`
- Backend errors: `C:\Proyectos\anonimizar\backend\backend-debug.err.log`
- Both captured with full verbosity (-u flag)

### Known Limitations
- Files > 5,000 rows return preview only (full cached for download)
- Mappings require `save_mappings=true` flag (default)
- Cache expires after 1 hour of inactivity
- NLP disabled for performance (use_nlp=False)

### Next Steps
✅ System is ready for production use. All 4 improvements are stable and tested.

To improve detection further, consider:
- Adding more institution names (hospitals, universities, agencies)
- Expanding location lists (neighborhoods, landmarks)
- Adding document type detection (passport, visa, license)
- Implementing word frequency analysis for better context matching
