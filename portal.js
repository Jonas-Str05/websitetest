// Kundenportal als reine Demo im Browser. Alle Daten liegen im localStorage.
// Später ersetzt durch echte Anmeldung und Datenbank (z. B. Supabase).
(() => {
  const KEY = "agentur-demo-v1", SKEY = "agentur-sitzung", MAX = 3;
  const $ = (id) => document.getElementById(id);
  const heute = () => new Date().toISOString().slice(0, 10);
  const monat = (d = new Date()) => d.toISOString().slice(0, 7);
  const std = (n) => (Math.round(n * 100) / 100).toLocaleString("de-DE") + " Std.";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const startdaten = () => ({
    admins: [{ email: "admin@test.de", pw: "admin123", name: "Admin" }],
    letzterMonat: monat(),
    kunden: [{
      id: "k1", firma: "Musterfirma GmbH", name: "Max Muster", email: "kunde@test.de", pw: "kunde123",
      guthaben: 2,
      verlauf: [
        { datum: "2026-10-01", text: "Monatliche Freistunde", std: 1, mehr: 0, stand: 2 },
        { datum: "2026-10-14", text: "Öffnungszeiten geändert", std: -0.5, mehr: 0, stand: 1.5 },
        { datum: "2026-11-01", text: "Monatliche Freistunde", std: 1, mehr: 0, stand: 2.5 },
        { datum: "2026-11-10", text: "Neues Teamfoto eingebaut", std: -0.5, mehr: 0, stand: 2 },
      ],
      anfragen: [{ id: "a1", datum: "2026-11-20", titel: "Weihnachtsöffnungszeiten", text: "Bitte vom 24.12. bis 1.1. geschlossen eintragen.", prio: "normal", status: "offen", std: null }],
    }],
  });

  const laden = () => { try { return JSON.parse(localStorage.getItem(KEY)) || startdaten(); } catch { return startdaten(); } };
  const speichern = (d) => {
    try { localStorage.setItem(KEY, JSON.stringify(d)); return true; }
    catch { alert("Speicher voll. In der Demo passen nur wenige PDFs in den Browser."); return false; }
  };

  // PDF-Anhang: nur PDF, höchstens 2 MB. In der Demo als Data-URL gespeichert.
  const MAXPDF = 2 * 1024 * 1024;
  const pdfLesen = (datei) => new Promise((ok, fehler) => {
    if (!datei) return ok(null);
    if (datei.type !== "application/pdf" && !/\.pdf$/i.test(datei.name)) return fehler("Bitte nur PDF-Dateien anhängen.");
    if (datei.size > MAXPDF) return fehler("Das PDF ist größer als 2 MB.");
    const r = new FileReader();
    r.onload = () => ok({ name: datei.name, groesse: datei.size, daten: r.result });
    r.onerror = () => fehler("PDF konnte nicht gelesen werden.");
    r.readAsDataURL(datei);
  });
  const anhangZelle = (k, a) => a.anhang
    ? `<button type="button" data-pdf="${k.id}|${a.id}">${esc(a.anhang.name)}</button> (${Math.ceil(a.anhang.groesse / 1024)} KB)`
    : "";
  const pdfOeffnen = (anhang) => {
    const bin = atob(anhang.daten.split(",")[1]), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  let daten = laden();

  // Monatliche Gutschrift: pro neuem Monat +1 Stunde, gedeckelt bei MAX.
  function gutschreiben(k) {
    if (k.guthaben >= MAX) { k.verlauf.push({ datum: heute(), text: "Freistunde verfallen (Maximum 3 erreicht)", std: 0, mehr: 0, stand: k.guthaben }); return; }
    k.guthaben = Math.min(MAX, k.guthaben + 1);
    k.verlauf.push({ datum: heute(), text: "Monatliche Freistunde", std: 1, mehr: 0, stand: k.guthaben });
  }
  function monateNachholen() {
    const [j1, m1] = daten.letzterMonat.split("-").map(Number), [j2, m2] = monat().split("-").map(Number);
    const n = (j2 - j1) * 12 + (m2 - m1);
    for (let i = 0; i < n; i++) daten.kunden.forEach(gutschreiben);
    if (n > 0) { daten.letzterMonat = monat(); speichern(daten); }
  }
  monateNachholen();

  // Stunden abziehen: erst Guthaben, Rest als Mehraufwand.
  function buchen(k, text, h) {
    const gedeckt = Math.min(k.guthaben, h), mehr = h - gedeckt;
    k.guthaben = Math.round((k.guthaben - gedeckt) * 100) / 100;
    k.verlauf.push({ datum: heute(), text, std: -h, mehr, stand: k.guthaben });
    return mehr;
  }
  const mehrDiesenMonat = (k) => k.verlauf.filter((v) => v.datum.startsWith(monat())).reduce((s, v) => s + (v.mehr || 0), 0);

  const sitzung = () => { try { return JSON.parse(sessionStorage.getItem(SKEY)); } catch { return null; } };
  const seite = location.pathname.split("/").pop() || "index.html";

  // Anmeldung
  if ($("login")) {
    const s = sitzung();
    if (s) location.href = s.rolle === "admin" ? "admin.html" : "portal.html";
    $("login").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("login-email").value.trim().toLowerCase(), pw = $("login-pw").value;
      const a = daten.admins.find((x) => x.email === email && x.pw === pw);
      const k = daten.kunden.find((x) => x.email === email && x.pw === pw);
      if (a) { sessionStorage.setItem(SKEY, JSON.stringify({ rolle: "admin" })); location.href = "admin.html"; }
      else if (k) { sessionStorage.setItem(SKEY, JSON.stringify({ rolle: "kunde", id: k.id })); location.href = "portal.html"; }
      else $("login-fehler").hidden = false;
    });
    return;
  }

  const s = sitzung();
  const erlaubt = (seite === "admin.html" && s?.rolle === "admin") || (seite === "portal.html" && s?.rolle === "kunde");
  if (!erlaubt) { location.href = "kundenzugang.html"; return; }
  $("abmelden").onclick = () => { sessionStorage.removeItem(SKEY); location.href = "kundenzugang.html"; };

  // Kundenportal
  if (seite === "portal.html") {
    const k = () => daten.kunden.find((x) => x.id === s.id);
    const zeigen = () => {
      const kd = k();
      $("p-firma").textContent = kd.firma;
      $("p-guthaben").textContent = std(kd.guthaben);
      const n = new Date(); n.setMonth(n.getMonth() + 1, 1);
      $("p-naechste").textContent = n.toLocaleDateString("de-DE");
      $("p-mehr").textContent = std(mehrDiesenMonat(kd));
      $("p-anfragen").innerHTML = kd.anfragen.length ? kd.anfragen.slice().reverse().map((a) =>
        `<tr><td>${a.datum}</td><td>${esc(a.titel)}</td><td>${anhangZelle(kd, a)}</td><td>${a.status}</td><td>${a.std == null ? "" : std(a.std)}</td></tr>`).join("")
        : `<tr><td colspan="5" class="leer">Noch keine Anfragen</td></tr>`;
      $("p-verlauf").innerHTML = kd.verlauf.slice().reverse().map((v) =>
        `<tr><td>${v.datum}</td><td>${esc(v.text)}</td><td>${v.std > 0 ? "+" : ""}${std(v.std)}</td><td>${v.mehr ? std(v.mehr) : ""}</td><td>${std(v.stand)}</td></tr>`).join("");
    };
    $("wunsch").addEventListener("submit", async (e) => {
      e.preventDefault();
      let anhang;
      try { anhang = await pdfLesen($("w-pdf").files[0]); } catch (f) { return alert(f); }
      const neu = { id: "a" + Date.now(), datum: heute(), titel: $("w-titel").value, text: $("w-text").value, prio: $("w-prio").value, status: "offen", std: null, anhang };
      k().anfragen.push(neu);
      if (!speichern(daten)) { k().anfragen.pop(); return; }
      e.target.reset(); zeigen();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.dataset.pdf) return;
      const aid = e.target.dataset.pdf.split("|")[1];
      pdfOeffnen(k().anfragen.find((x) => x.id === aid).anhang);
    });
    zeigen();
  }

  // Admin
  if (seite === "admin.html") {
    const zeigen = () => {
      $("a-kunden").innerHTML = daten.kunden.map((k) =>
        `<tr><td>${esc(k.firma)}</td><td>${esc(k.email)}</td><td>${std(k.guthaben)}</td><td>${k.anfragen.filter((a) => a.status !== "erledigt").length}</td><td>${std(mehrDiesenMonat(k))}</td></tr>`).join("");
      $("b-kunde").innerHTML = daten.kunden.map((k) => `<option value="${k.id}">${esc(k.firma)}</option>`).join("");
      const offen = daten.kunden.flatMap((k) => k.anfragen.filter((a) => a.status !== "erledigt").map((a) => ({ k, a })));
      $("a-anfragen").innerHTML = offen.length ? offen.map(({ k, a }) =>
        `<tr><td>${a.datum}</td><td>${esc(k.firma)}</td><td>${esc(a.titel)}<br><small>${esc(a.text)}</small>${a.prio === "dringend" ? "<br>[dringend]" : ""}</td>
        <td>${anhangZelle(k, a)}</td>
        <td><select data-status="${k.id}|${a.id}"><option ${a.status === "offen" ? "selected" : ""}>offen</option><option ${a.status === "in Arbeit" ? "selected" : ""}>in Arbeit</option></select></td>
        <td><input type="number" min="0.25" step="0.25" value="0.5" style="width:80px" id="h-${a.id}"> <button data-fertig="${k.id}|${a.id}">erledigt</button></td></tr>`).join("")
        : `<tr><td colspan="6" class="leer">Keine offenen Anfragen</td></tr>`;
    };
    const finde = (ref) => { const [kid, aid] = ref.split("|"); const k = daten.kunden.find((x) => x.id === kid); return { k, a: k.anfragen.find((x) => x.id === aid) }; };
    document.addEventListener("change", (e) => {
      if (!e.target.dataset.status) return;
      finde(e.target.dataset.status).a.status = e.target.value; speichern(daten); zeigen();
    });
    document.addEventListener("click", (e) => {
      if (e.target.dataset.pdf) return pdfOeffnen(finde(e.target.dataset.pdf).a.anhang);
      if (!e.target.dataset.fertig) return;
      const { k, a } = finde(e.target.dataset.fertig), h = parseFloat($("h-" + a.id).value) || 0;
      const mehr = buchen(k, "Anfrage: " + a.titel, h);
      a.status = "erledigt"; a.std = h; speichern(daten); zeigen();
      if (mehr > 0) alert(`${std(mehr)} Mehraufwand für ${k.firma}, bitte abrechnen.`);
    });
    $("buchen").addEventListener("submit", (e) => {
      e.preventDefault();
      const k = daten.kunden.find((x) => x.id === $("b-kunde").value);
      const mehr = buchen(k, $("b-text").value, parseFloat($("b-std").value));
      speichern(daten); $("b-text").value = ""; zeigen();
      if (mehr > 0) alert(`${std(mehr)} Mehraufwand für ${k.firma}, bitte abrechnen.`);
    });
    $("neu").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("n-email").value.trim().toLowerCase();
      if (daten.kunden.some((k) => k.email === email) || daten.admins.some((a) => a.email === email)) return alert("E-Mail gibt es schon.");
      const g = Math.min(MAX, Math.max(0, parseInt($("n-std").value) || 0));
      daten.kunden.push({ id: "k" + Date.now(), firma: $("n-firma").value, name: $("n-name").value, email, pw: $("n-pw").value, guthaben: g,
        verlauf: [{ datum: heute(), text: "Zugang angelegt, Startguthaben", std: g, mehr: 0, stand: g }], anfragen: [] });
      speichern(daten); e.target.reset(); zeigen();
    });
    $("monat").onclick = () => { daten.kunden.forEach(gutschreiben); speichern(daten); zeigen(); };
    $("reset").onclick = () => { if (confirm("Alle Demo-Daten zurücksetzen?")) { daten = startdaten(); speichern(daten); zeigen(); } };
    zeigen();
  }
})();
