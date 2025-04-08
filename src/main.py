from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import subprocess
import re
import urllib.parse
import requests
from datetime import datetime

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Répertoires
REPORTS_DIR = "reports"
HISTORY_FILE = os.path.join(REPORTS_DIR, "history.json")
os.makedirs(REPORTS_DIR, exist_ok=True)

# Fonctions
def run_nmap(target):
    try:
        result = subprocess.check_output(["nmap", "-T4", "-A", target], stderr=subprocess.STDOUT)
        return result.decode("latin-1")
    except subprocess.CalledProcessError as e:
        return f"[!] Erreur Nmap : {e.output.decode('latin-1')}"

def run_sqlmap(target):
    try:
        result = subprocess.check_output(
            ["python", "sqlmap/sqlmap.py", "-u", target, "--batch", "--crawl=1", "--level=1"],
            stderr=subprocess.STDOUT
        )
        return result.decode("latin-1")
    except subprocess.CalledProcessError as e:
        return f"[!] Erreur sqlmap : {e.output.decode('latin-1')}"

def detect_xss(target_url):
    try:
        parsed = urllib.parse.urlparse(target_url)
        query = urllib.parse.parse_qs(parsed.query)
        if not query:
            return "[XSS] Aucun paramètre GET trouvé dans l'URL."

        payloads = ['<script>alert(1)</script>', '"><svg/onload=alert(1)>', '<img src=x onerror=alert(1)>']
        for param in query:
            for payload in payloads:
                test_query = query.copy()
                test_query[param] = payload
                encoded = urllib.parse.urlencode(test_query, doseq=True)
                test_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', encoded, ''))
                try:
                    res = requests.get(test_url, timeout=5)
                    if payload in res.text:
                        return f"[XSS] VULNÉRABLE détecté sur : {test_url}"
                except:
                    continue
        return "[XSS] Aucun vecteur XSS détecté."
    except Exception as e:
        return f"[!] Erreur XSS : {str(e)}"

def determine_severity(nmap, sqlmap, xss):
    severity_score = 0
    if "XSS" in xss.upper():
        severity_score += 3
    if "sqlmap identified" in sqlmap.lower() or "parameter" in sqlmap.lower():
        severity_score += 5
    if "open" in nmap.lower() and "port" in nmap.lower():
        severity_score += 2

    if severity_score >= 7:
        return "🔴 Critique"
    elif severity_score >= 4:
        return "🟠 Modéré"
    elif severity_score > 0:
        return "🟡 Faible"
    else:
        return "✅ Aucun danger détecté"

def save_scan_history(url, filename, severity):
    history = []
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            history = json.load(f)
    history.append({
        "url": url,
        "report": filename,
        "severity": severity,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def generate_report(target_url, nmap_output, sqlmap_output, xss_output):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    name = datetime.now().strftime("%Y%m%d_%H%M")
    filename = f"rapport_shadowsec_{name}.txt"
    full_path = os.path.join(REPORTS_DIR, filename)
    severity = determine_severity(nmap_output, sqlmap_output, xss_output)

    content = f"""================== RAPPORT SHADOWSEC AI ==================

🕒 Date : {now}
🎯 Cible : {target_url}

------------------------------------------------------------
🔍 Résultat Nmap :
{nmap_output}

------------------------------------------------------------
💉 Vulnérabilités SQLi (sqlmap) :
{sqlmap_output}

------------------------------------------------------------
🔥 Résultat XSS :
{xss_output}

------------------------------------------------------------
⚠️ Niveau de dangerosité : {severity}

============================================================
⚠️ Rapport généré automatiquement. Usage réservé à des fins d'audit éthique uniquement.
"""
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

    save_scan_history(target_url, filename, severity)
    return filename

# ========== ROUTES API ==========

@app.post("/scan")
async def launch_scan(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        return {"message": "URL manquante."}

    domain = re.sub(r"https?://", "", url).split("/")[0]
    nmap_result = run_nmap(domain)
    sqlmap_result = run_sqlmap(url)
    xss_result = detect_xss(url)

    report_file = generate_report(url, nmap_result, sqlmap_result, xss_result)
    return {"message": "Scan terminé ! Rapport : " + report_file}

@app.get("/reports")
def list_reports():
    files = os.listdir(REPORTS_DIR)
    return [{"filename": f} for f in files if f.endswith(".txt")]

@app.get("/reports/{filename}")
def get_report(filename: str):
    file_path = os.path.join(REPORTS_DIR, filename)
    return FileResponse(file_path, media_type="text/plain", filename=filename)

@app.get("/history")
def get_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/summaries")
def get_report_summaries():
    summaries = []
    for file in os.listdir(REPORTS_DIR):
        if file.endswith(".txt"):
            summaries.append(parse_report_summary(file))
    return summaries

def parse_report_summary(filename):
    filepath = os.path.join(REPORTS_DIR, filename)
    if not os.path.exists(filepath):
        return {"summary": "Rapport introuvable."}

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    summary = []
    if "SQL INJECTION" in content.upper() or "sqlmap" in content.lower():
        summary.append("💉 SQLi détectée")
    if "XSS" in content.upper():
        summary.append("🔥 XSS détectée")
    if "nginx" in content.lower() or "apache" in content.lower():
        summary.append("🌐 Serveur Web détecté")
    if "PORT" in content.upper():
        summary.append("🔌 Ports ouverts détectés")
    
    return {
        "filename": filename,
        "summary": summary if summary else ["✅ Aucun danger critique détecté"]
    }
