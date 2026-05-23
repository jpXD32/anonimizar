# ⚡ Quick Start Checklist

## 1️⃣ Startup (2 minutes)

- [ ] Open **2 separate terminals** (PowerShell or Command Prompt)

**Terminal 1 - Backend:**
```bash
cd C:\Proyectos\anonimizar\backend
python -u app.py
```
Wait for: `Running on http://127.0.0.1:5000`

**Terminal 2 - Frontend:**
```bash
cd C:\Proyectos\anonimizar\frontend
npm run dev
```
Wait for: `http://localhost:3000`

Or use the quick start script:
```bash
# Single command starts both
start-services-smart.bat
```

---

## 2️⃣ Verify System is Running (30 seconds)

Open your browser and check these URLs:

- [ ] **Backend**: http://localhost:5000/api/health
  - Should show: `{"status":"ok"}`

- [ ] **Frontend**: http://localhost:3000
  - Should show: File upload page

---

## 3️⃣ Your First Anonymization (5 minutes)

**Step 1: Get a Test File**
- Use provided: `Final.xlsx` (16K rows, fully tested)
- Or any CSV/Excel file

**Step 2: Upload & Configure**
1. Click "Sube tu archivo"
2. Select file
3. See columns and data preview ✓
4. Click "Siguiente" (next)

**Step 3: Choose Columns & Mode**
1. Select columns to anonymize (or "Anonimizar todo")
2. **Pick confidence mode:**
   - 🛡️ Conservative (95%) - Max precision
   - ⚖️ Standard (90%) - **Recommended** ⭐
   - 🔍 Aggressive (80%) - Max coverage
3. Click "Comenzar anonimización"

**Step 4: Download Results** (when ready - typically 1-2 minutes)
1. See progress bar
2. Get statistics (persons, locations, emails, etc.)
3. Choose download format:
   - CSV
   - Excel
   - JSON (mappings)

---

## 4️⃣ Features You Have (4 Improvements)

✅ **Complex Address Detection**
- Carreteras: "Carretera a Melipilla, km 15"
- Hijuelas: "Hijuela 45-A"
- GPS: "-33.437, -70.673"

✅ **Additional Names** 
- Mapuche: Quilapan, Llaipén, Huenupillan
- Foreign: John, James, Pierre, Jacques
- Slang: Pelao, Gordo, Flaco, Chino

✅ **Confidence Modes**
- Conservative (95%): Precision first
- Standard (90%): Best balance
- Aggressive (80%): Coverage first

✅ **Mode Selector in UI**
- Choose before processing
- See results by mode
- Reprocess with different modes

---

## 5️⃣ Next Steps

### To Learn More:
- **About modes**: Read [CONFIDENCE_MODES_GUIDE.md](CONFIDENCE_MODES_GUIDE.md)
- **Current status**: Read [SYSTEM_STATUS.md](SYSTEM_STATUS.md)
- **If something breaks**: Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### To Improve Detection:
1. Try Aggressive mode (🔍)
2. Review results
3. Add custom patterns (see Troubleshooting)

### To Add Custom Data Types:
Edit `anonymizer.py` to add:
- Company names
- Document IDs  
- Custom locations
- Industry-specific data

---

## 🆘 Quick Troubleshooting

### "Failed to fetch"
```bash
# Check backend
curl http://localhost:5000/api/health

# If not running, start it:
cd backend && python -u app.py
```

### "Port X already in use"
```bash
# Use smart startup (auto-finds free port)
start-services-smart.bat

# Or manually kill old process
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

### "Error anonymizing file"
- File > 50 MB? (reduce size)
- Taking > 10 min? (normal for 16K+ rows, be patient)
- Check logs: `backend/backend-debug.out.log`

### Mode selector not visible
- Refresh browser: Ctrl+F5 (hard refresh)
- Clear cache: Ctrl+Shift+Del
- Restart frontend: `npm run dev`

---

## 📊 File Size Expectations

| Rows | Columns | Size | Process Time |
|------|---------|------|--------------|
| 100 | 2 | 10 KB | <1 sec |
| 1,000 | 5 | 100 KB | 2 sec |
| 5,000 | 7 | 500 KB | 5 sec |
| 16,000 | 7 | 10 MB | 60-70 sec ⭐ |
| 100,000 | 20 | 50 MB | ~5-10 min |

**Best practice**: Start small, test modes, then scale up.

---

## 📋 Confidence Mode Cheat Sheet

```
Legal/Compliance?        → 🛡️ Conservative (95%)
Regular use?             → ⚖️ Standard (90%) ⭐
Privacy-critical?        → 🔍 Aggressive (80%)
First time?              → ⚖️ Standard (90%)
Unsure?                  → ⚖️ Standard (90%)
Missing data detected?   → 🔍 Aggressive (80%)
Too many false matches?  → 🛡️ Conservative (95%)
```

---

## ✨ Pro Tips

1. **Test first**: Start with small file, Standard mode
2. **Compare modes**: Process same file 2x with different modes
3. **Batch processing**: Split large files, process separately
4. **Keep originals**: Always keep unencrypted backup
5. **Verify results**: Spot-check anonymized preview
6. **Save mappings**: Keep JSON mappings with encrypted file

---

## 🎯 Success Criteria

After first run, you should see:

- ✅ File uploaded successfully
- ✅ Columns detected and displayed
- ✅ Can select mode (3 buttons visible)
- ✅ Processing shows progress bar
- ✅ Results show statistics (persons, locations, etc.)
- ✅ Download buttons work (CSV, Excel, JSON)
- ✅ File ready for use

---

## 🚀 You're Ready!

Visit **http://localhost:3000** and start anonymizing.

For detailed guides, see docs linked at top of this page.

**Questions?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
