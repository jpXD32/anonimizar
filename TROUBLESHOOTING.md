# Troubleshooting Guide - Common Issues & Solutions

## Symptom: "Failed to fetch" / CORS Error

### What it means:
Frontend cannot reach backend API

### Solution (in order):

**1. Check Backend is Running**
```bash
# Windows - Open new terminal
curl http://localhost:5000/api/health

# Expected: {"status":"ok","message":"Backend API running"}
```

**2. Check Port 5000 is Available**
```bash
# Windows PowerShell
netstat -ano | findstr ":5000"

# If something occupies 5000, kill it
taskkill /PID <PID> /F

# Then restart backend
cd C:\Proyectos\anonimizar\backend
python -u app.py
```

**3. Check Frontend Can See Backend**
```bash
# From localhost:3000 browser console (F12)
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

**4. Verify CORS Configuration**
Edit `C:\Proyectos\anonimizar\backend\app.py` line 20-25:
```python
ALLOWED_ORIGINS = os.environ.get(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:3001,...'  # Must include your frontend port
)
```

If frontend is on different port (3001, 3002, etc.), restart backend.

---

## Symptom: "Error anonymizing file"

### Cause 1: File too large

**Check:**
- File size > 50 MB?
- Rows > 100,000?
- Columns > 200?

**Solution:**
- Split file into smaller chunks
- Contact support for larger limits

**View settings:**
```python
# In backend/app.py
MAX_FILE_SIZE = 50 * 1024 * 1024      # 50 MB
MAX_ROWS = 100000
MAX_COLUMNS = 200
```

### Cause 2: Processing timeout

**What happened:**
- File took > 10 minutes to process
- Request aborted

**Solution:**
1. Try with fewer rows first (test smaller subset)
2. Increase timeout:
   ```bash
   # Set environment variable before starting
   set PROCESSING_TIMEOUT_SECONDS=1200  # 20 minutes
   python -u backend/app.py
   ```

### Cause 3: Invalid file format

**Check:**
- Is it actually Excel/CSV?
- Not corrupted?

**Test:**
```bash
# Windows PowerShell
python -c "import pandas as pd; pd.read_excel('C:\path\to\file.xlsx')"

# If no error, file is readable
```

### Cause 4: Memory issue

**Symptom:**
- Works for small files, fails for large ones
- No clear error message

**Solution:**
```bash
# Check available RAM
# Then restart to clear memory
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Then restart both services
start-services-smart.bat
```

---

## Symptom: "Port X is already in use"

### Quick Fix:
```bash
# Use the smart startup script (auto-detects free port)
start-services-smart.bat
```

### Manual Fix:

**Find what's using the port:**
```bash
# Windows
netstat -ano | findstr ":3000"
# Get PID from last column

# Kill the process
taskkill /PID 12345 /F
```

**Or choose different port:**
```bash
# Frontend
set PORT=3001
npm run dev

# Backend (already customizable)
set PORT=5001
python app.py
```

---

## Symptom: Mode selector not visible

### Check 1: Frontend loaded correctly?
- Open http://localhost:3000
- No JavaScript errors (F12 > Console)
- See file upload page?

### Check 2: Can you reach Step 2?
- Upload file
- Can you see "Configura la anonimización"?

### Check 3: Clear browser cache
```bash
# Chrome: Ctrl+Shift+Del → Clear all
# Or in DevTools: Right-click refresh → Empty cache and hard refresh
```

### Check 4: Frontend redeployed?
```bash
# Terminal at frontend/
npm run dev

# Or rebuild
npm run build
npm start
```

---

## Symptom: Results show "Error downloading result"

### Cause 1: Cache expired
- File in cache > 1 hour old
- Solution: Process again

### Cause 2: File path issue
```bash
# Check temp directory has space
# Windows
dir %TEMP%

# Should see files like: anonymized-<UUID>.xlsx
```

### Cause 3: Permissions issue
```bash
# Check temp directory is writable
# Usually C:\Users\<username>\AppData\Local\Temp\

# Or change in code (backend/app.py line 29):
UPLOAD_FOLDER = tempfile.gettempdir()  # Change path here
```

---

## Symptom: Anonymization misses sensitive data

### Solution 1: Use Aggressive mode
- Change confidence to 🔍 Aggressive (80%)
- Re-process file
- Should catch more data

### Solution 2: Add custom patterns
Edit `C:\Proyectos\anonimizar\anonymizer.py`:

**To add a new name:**
```python
# Around line 71
common_names = {
    'first_names': [
        # ... existing ...
        'yourname',  # Add here
    ]
}
```

**To add address pattern:**
```python
# Around line 203 in _compile_patterns()
'address': [
    # ... existing patterns ...
    r'your_new_pattern_here',  # Add pattern
]
```

Then restart backend:
```bash
taskkill /F /IM python.exe
python -u backend\app.py
```

---

## Symptom: File uploads but preview doesn't show

### Check:
1. File actually uploaded? (Check temp folder)
2. Columns detected? (Should see list)
3. Data preview? (Should see 10 rows)

### Debug:
```bash
# Check browser console (F12)
# Look for error details

# Check backend logs
tail -50 backend/backend-debug.out.log

# Should see: "[ANON] Procesando columna: <name>"
```

---

## Symptom: Slow processing / UI freezes

### This is expected
- Large files take time
- Progress bar updates every second
- Don't close tab or wait > 10 minutes

### Check backend status:
```bash
# Keep backend logs visible
tail -f backend/backend-debug.out.log

# Should see: "[ANON] <column> : X/Y filas" every 25 rows
```

### Optimize:
1. Process fewer rows (test with 5,000 first)
2. Process fewer columns (most important ones)
3. Use Standard mode instead of Aggressive

---

## Symptom: "Invalid columns: X, Y, Z"

### Cause:
Column names don't match exactly

### Solution:
1. Check column names in preview
2. Use exact names (case-sensitive)
3. Some columns might be auto-generated by Excel (blanks, numbers)

### Debug:
```bash
# Python
import pandas as pd
df = pd.read_excel('file.xlsx')
print(df.columns.tolist())
# Copy exact names from output
```

---

## Symptom: Mappings not saved

### Check Settings:
- "Save mappings" toggle enabled?
- Checkbox checked before processing?

### If still missing:
```python
# In backend/app.py line 256
mappings = anonymizer.mappings if save_mappings else {}
#         This controls whether mappings are returned
```

Ensure `save_mappings=true` in the API call.

---

## Symptom: System crashes when processing

### Immediate:
```bash
# Kill all processes
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Clear temp files
del C:\Users\<username>\AppData\Local\Temp\anonymized-*.xlsx

# Restart everything
start-services-smart.bat
```

### Prevent future crashes:
1. Use smaller files (test in chunks)
2. Increase available RAM (close other apps)
3. Monitor backend logs in real-time
4. Set up automatic restarts (see section below)

---

## Auto-Restart on Crash (Windows)

Create `C:\Proyectos\anonimizar\auto-restart.bat`:

```batch
@echo off
:loop
echo Starting services...
start-services-smart.bat
echo Services stopped. Waiting 5 seconds before restart...
timeout /t 5
goto loop
```

Then run it once - it will auto-restart on crash.

---

## View Detailed Logs

**Real-time backend output:**
```bash
# Terminal at project root
tail -f backend/backend-debug.out.log
```

**All logs in one view:**
```bash
# See all files modified today
dir /T:W backend/*.log
```

**Search for errors:**
```bash
# Find any exception in logs
grep -i "error\|exception\|traceback" backend/backend-debug.out.log
```

---

## Get Help

### Check these first:
1. ✅ Backend running? (`curl http://localhost:5000/api/health`)
2. ✅ Frontend accessible? (http://localhost:3000)
3. ✅ Right file format? (CSV or Excel)
4. ✅ Browser console errors? (F12)
5. ✅ Backend logs? (see above)

### If still stuck:
1. Provide:
   - Exact error message
   - File name & size
   - Backend log excerpt
   - Browser console errors

2. Restart everything clean:
   ```bash
   taskkill /F /IM python.exe
   taskkill /F /IM node.exe
   start-services-smart.bat
   ```

3. Try with a smaller test file first
