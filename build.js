// Baut alle Seiten mit gleicher Kopf- und Fußzeile.
// Start: node build.js  (im Ordner "Agentur Website")
// Inhalte der Seiten stehen unten in "seiten". Kopf und Fuß nur hier ändern.
const fs = require("fs"), path = require("path");

const nav = [
  ["angebot.html", "Angebot"],
  ["referenzen.html", "Referenzen"],
  ["ueber-uns.html", "Über uns"],
  ["index.html#kontakt", "Kontakt"],
  ["kundenzugang.html", "Kundenzugang"],
];

const kopf = `<header class="kopf">
  <a class="logo" href="index.html">[Logo]</a>
  <nav>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>
</header>`;

const fuss = `<footer class="fuss">
  <div class="innen raster r4">
    <div class="stapel"><div>[Firmenname]</div><div>[Kurzer Satz]</div></div>
    <div class="stapel"><div>Kontakt</div><div>[Telefon]</div><div>[E-Mail]</div><div>[Adresse]</div></div>
    <div class="stapel"><div>Seiten</div>${nav.map(([h, t]) => `<div><a href="${h}">${t}</a></div>`).join("")}</div>
    <div class="stapel"><div>[Social Media]</div><div>[Öffnungs- oder Erreichbarkeitszeiten]</div></div>
  </div>
  <div class="innen unten">
    <span>© [Jahr] [Firmenname]</span>
    <a href="impressum.html">Impressum</a>
    <a href="datenschutz.html">Datenschutz</a>
  </div>
</footer>`;

const seite = (titel, inhalt, skript = "") => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel} | [Firmenname]</title>
<meta name="description" content="[Platzhalter Beschreibung]">
<link rel="stylesheet" href="style.css">
</head>
<body>
${kopf}
<main>
${inhalt}
</main>
${fuss}
${skript ? `<script src="${skript}"></script>` : ""}
</body>
</html>
`;

const abschnitt = (etikett, inhalt, id = "") =>
  `<section class="abschnitt"${id ? ` id="${id}"` : ""}><div class="innen"><div class="etikett">${etikett}</div>${inhalt}</div></section>`;

const kopfSeite = (titel) => `<section class="seitenkopf"><h1>${titel}</h1><p>[Kurzer Untertitel]</p></section>`;

const kontaktformular = `<div class="raster r2">
  <form class="formular" onsubmit="event.preventDefault(); alert('Platzhalter: Formular wird später angebunden (z. B. Web3Forms).')">
    <div><label>Name</label><input required></div>
    <div><label>Firma</label><input></div>
    <div><label>E-Mail</label><input type="email" required></div>
    <div><label>Telefon</label><input type="tel"></div>
    <div><label>Worum geht es?</label><select><option>Neue Website</option><option>Bestehende Website überarbeiten</option><option>Sonstiges</option></select></div>
    <div><label>Nachricht</label><textarea></textarea></div>
    <div><label><input type="checkbox" required style="width:auto"> [Hinweis Datenschutz]</label></div>
    <div><button type="submit">[Absenden]</button></div>
  </form>
  <div class="stapel">
    <div class="box">[Direkt Termin buchen, z. B. Kalender-Tool]</div>
    <div class="box">[Telefon]</div>
    <div class="box">[E-Mail]</div>
    <div class="box">[Antwortzeit, z. B. innerhalb 24 Std.]</div>
  </div>
</div>`;

const seiten = {
  "index.html": seite("Start", `
<section class="hero">
  <div class="etikett">Hero</div>
  <h1>[Firmenname]</h1>
  <p>[Ein Satz, was wir machen]</p>
  <a class="knopf" href="#kontakt">[Termin vereinbaren]</a>
</section>
${abschnitt("Angebot kurz", `<h2>[Überschrift]</h2><div class="raster r3">
  <div class="box stapel"><div>[Leistung 1]</div><div>[Kurztext]</div></div>
  <div class="box stapel"><div>[Leistung 2]</div><div>[Kurztext]</div></div>
  <div class="box stapel"><div>[Leistung 3]</div><div>[Kurztext]</div></div>
</div><p style="margin-top:16px"><a href="angebot.html">[Zum Angebot]</a></p>`)}
${abschnitt("Referenzen Auswahl", `<h2>[Überschrift]</h2><div class="raster r3">
  <div class="stapel"><div class="bild">[Bild Referenz 1]</div><div>[Kundenname]</div></div>
  <div class="stapel"><div class="bild">[Bild Referenz 2]</div><div>[Kundenname]</div></div>
  <div class="stapel"><div class="bild">[Bild Referenz 3]</div><div>[Kundenname]</div></div>
</div><p style="margin-top:16px"><a href="referenzen.html">[Alle Referenzen]</a></p>`)}
${abschnitt("Ablauf", `<h2>[Überschrift]</h2><div class="raster r4">
  <div class="box">[Schritt 1: Erstgespräch]</div>
  <div class="box">[Schritt 2: Entwurf]</div>
  <div class="box">[Schritt 3: Umsetzung]</div>
  <div class="box">[Schritt 4: Online und Pflege]</div>
</div>`)}
${abschnitt("Über uns kurz", `<div class="raster r2">
  <div class="stapel"><div class="bild">[Foto Felix]</div><div>[Name, Rolle]</div></div>
  <div class="stapel"><div class="bild">[Foto Jonas]</div><div>[Name, Rolle]</div></div>
</div><p style="margin-top:16px"><a href="ueber-uns.html">[Mehr über uns]</a></p>`)}
${abschnitt("Stimmen von Kunden", `<div class="raster r2">
  <div class="box">[Zitat Kunde 1]</div>
  <div class="box">[Zitat Kunde 2]</div>
</div>`)}
${abschnitt("FAQ", `<div class="stapel">
  <details class="box"><summary>[Frage 1]</summary><p>[Antwort]</p></details>
  <details class="box"><summary>[Frage 2]</summary><p>[Antwort]</p></details>
  <details class="box"><summary>[Frage 3]</summary><p>[Antwort]</p></details>
</div>`)}
${abschnitt("Kontakt", `<h2>[Überschrift Kontakt]</h2>${kontaktformular}`, "kontakt")}
`),

  "angebot.html": seite("Angebot", `
${kopfSeite("Angebot")}
${abschnitt("Leistungen", `<div class="raster r3">
  <div class="box stapel"><div class="ph">[Icon]</div><div>[Website-Erstellung]</div><div>[Kurztext]</div></div>
  <div class="box stapel"><div class="ph">[Icon]</div><div>[SEO]</div><div>[Kurztext]</div></div>
  <div class="box stapel"><div class="ph">[Icon]</div><div>[Hosting und Pflege]</div><div>[Kurztext]</div></div>
</div>`)}
${abschnitt("Pakete und Preise", `<div class="raster r3">
  <div class="box stapel"><div>[Paket 1]</div><div>[Preis einmalig]</div><div>[Preis monatlich]</div><div class="ph">[Liste Leistungen]</div><a class="knopf" href="index.html#kontakt">[Anfragen]</a></div>
  <div class="box stapel"><div>[Paket 2]</div><div>[Preis einmalig]</div><div>[Preis monatlich]</div><div class="ph">[Liste Leistungen]</div><a class="knopf" href="index.html#kontakt">[Anfragen]</a></div>
  <div class="box stapel"><div>[Paket 3]</div><div>[Preis einmalig]</div><div>[Preis monatlich]</div><div class="ph">[Liste Leistungen]</div><a class="knopf" href="index.html#kontakt">[Anfragen]</a></div>
</div>`)}
${abschnitt("Pflege-Abo mit Stundenkontingent", `<div class="raster r2">
  <div class="box">[Erklärung: 1 Stunde pro Monat inklusive, sammelt sich bis maximal 3 Stunden]</div>
  <div class="box">[Was darüber hinausgeht: Stundensatz]</div>
</div>`)}
${abschnitt("Vergleichstabelle", `<div class="ph">[Tabelle: Pakete im Vergleich]</div>`)}
${abschnitt("Branchen", `<div class="raster r3">
  <div class="box">[Branche 1, z. B. Autohäuser]</div>
  <div class="box">[Branche 2, z. B. Handwerk]</div>
  <div class="box">[Branche 3]</div>
</div>`)}
${abschnitt("Abschluss", `<div class="ph">[Satz] <a class="knopf" href="index.html#kontakt">[Termin vereinbaren]</a></div>`)}
`),

  "referenzen.html": seite("Referenzen", `
${kopfSeite("Referenzen")}
${abschnitt("Filter", `<div class="raster r4"><div class="box">[Alle]</div><div class="box">[Branche A]</div><div class="box">[Branche B]</div><div class="box">[Branche C]</div></div>`)}
${abschnitt("Projekte", `<div class="raster r2">
  ${[1, 2, 3, 4].map((n) => `<div class="box stapel"><div class="bild">[Screenshot Projekt ${n}]</div><div>[Kundenname]</div><div>[Branche, Ort]</div><div>[Kurz: was wir gemacht haben]</div><a href="#">[Website ansehen]</a></div>`).join("\n  ")}
</div>`)}
${abschnitt("Abschluss", `<div class="ph">[Satz] <a class="knopf" href="index.html#kontakt">[Termin vereinbaren]</a></div>`)}
`),

  "ueber-uns.html": seite("Über uns", `
${kopfSeite("Über uns")}
${abschnitt("Wer wir sind", `<div class="raster r2"><div class="bild">[Teamfoto]</div><div class="ph">[Kurztext]</div></div>`)}
${abschnitt("Team", `<div class="raster r2">
  <div class="box stapel"><div class="bild">[Foto Felix]</div><div>[Felix Böse]</div><div>[Rolle]</div><div>[Kurztext]</div></div>
  <div class="box stapel"><div class="bild">[Foto Jonas]</div><div>[Jonas Strömich]</div><div>[Rolle]</div><div>[Kurztext]</div></div>
</div>`)}
${abschnitt("Was uns wichtig ist", `<div class="raster r3"><div class="box">[Punkt 1]</div><div class="box">[Punkt 2]</div><div class="box">[Punkt 3]</div></div>`)}
${abschnitt("Abschluss", `<div class="ph">[Satz] <a class="knopf" href="index.html#kontakt">[Termin vereinbaren]</a></div>`)}
`),

  "impressum.html": seite("Impressum", `
${kopfSeite("Impressum")}
${abschnitt("Rechtstext", `<div class="stapel">
  <div class="ph">[Angaben gemäß § 5 DDG: Name, Anschrift]</div>
  <div class="ph">[Kontakt: Telefon, E-Mail]</div>
  <div class="ph">[Rechtsform, Vertretung, Register, USt-IdNr. falls vorhanden]</div>
  <div class="ph">[Verantwortlich für den Inhalt]</div>
  <div class="ph">[Streitschlichtung]</div>
</div>`)}
`),

  "datenschutz.html": seite("Datenschutz", `
${kopfSeite("Datenschutzerklärung")}
${abschnitt("Rechtstext", `<div class="stapel">
  <div class="ph">[Verantwortliche Stelle]</div>
  <div class="ph">[Hosting]</div>
  <div class="ph">[Kontaktformular]</div>
  <div class="ph">[Terminbuchung]</div>
  <div class="ph">[Kundenportal und Login]</div>
  <div class="ph">[Rechte der Betroffenen]</div>
</div>`)}
`),

  "kundenzugang.html": seite("Kundenzugang", `
${kopfSeite("Kundenzugang")}
${abschnitt("Anmeldung", `<div class="raster r2">
  <form class="formular" id="login">
    <div><label>E-Mail</label><input type="email" id="login-email" required></div>
    <div><label>Passwort</label><input type="password" id="login-pw" required></div>
    <div><button type="submit">[Anmelden]</button></div>
    <div id="login-fehler" class="hinweis" hidden>E-Mail oder Passwort falsch.</div>
    <div><a href="#">[Passwort vergessen]</a></div>
  </form>
  <div class="stapel">
    <div class="hinweis">Nur Demo. Daten liegen im Browser (localStorage), nichts ist geschützt.<br>
      Kunde: kunde@test.de / kunde123<br>Admin: admin@test.de / admin123</div>
    <div class="ph">[Kurztext: was Kunden im Portal sehen]</div>
  </div>
</div>`)}
`, "portal.js"),

  "portal.html": seite("Kundenportal", `
<section class="seitenkopf"><h1>Kundenportal</h1><p id="p-firma">[Firma]</p><button id="abmelden">[Abmelden]</button></section>
${abschnitt("Stundenkonto", `<div class="raster r3">
  <div class="box stapel"><div>Verfügbare Stunden</div><div id="p-guthaben" style="font-size:32px"></div><div>von maximal 3</div></div>
  <div class="box stapel"><div>Nächste Gutschrift</div><div id="p-naechste"></div><div>+1 Stunde, solange unter 3</div></div>
  <div class="box stapel"><div>Mehraufwand diesen Monat</div><div id="p-mehr"></div><div>wird extra abgerechnet</div></div>
</div>`)}
${abschnitt("Änderungswunsch stellen", `<form class="formular" id="wunsch">
  <div><label>Titel</label><input id="w-titel" required></div>
  <div><label>Was soll geändert werden?</label><textarea id="w-text" required></textarea></div>
  <div><label>Dringlichkeit</label><select id="w-prio"><option>normal</option><option>dringend</option></select></div>
  <div><label>PDF anhängen (optional, max. 2 MB)</label><input type="file" id="w-pdf" accept="application/pdf,.pdf"></div>
  <div><button type="submit">[Absenden]</button></div>
</form>`)}
${abschnitt("Meine Anfragen", `<table><thead><tr><th>Datum</th><th>Titel</th><th>Anhang</th><th>Status</th><th>Stunden</th></tr></thead><tbody id="p-anfragen"></tbody></table>`)}
${abschnitt("Verlauf Stundenkonto", `<table><thead><tr><th>Datum</th><th>Vorgang</th><th>Stunden</th><th>davon Mehraufwand</th><th>Stand danach</th></tr></thead><tbody id="p-verlauf"></tbody></table>`)}
${abschnitt("Weitere Bereiche (später)", `<div class="raster r3">
  <div class="box">[Vertrag und Paket]</div>
  <div class="box">[Rechnungen als PDF]</div>
  <div class="box">[Website-Status: online, SSL, letzte Sicherung]</div>
  <div class="box">[Besucherzahlen]</div>
  <div class="box">[Domain und Laufzeit]</div>
  <div class="box">[Ansprechpartner und Termin buchen]</div>
</div>`)}
`, "portal.js"),

  "admin.html": seite("Admin", `
<section class="seitenkopf"><h1>Admin</h1><p>Felix und Jonas</p><button id="abmelden">[Abmelden]</button></section>
${abschnitt("Kunden", `<table><thead><tr><th>Firma</th><th>E-Mail</th><th>Guthaben</th><th>Offene Anfragen</th><th>Mehraufwand offen</th></tr></thead><tbody id="a-kunden"></tbody></table>`)}
${abschnitt("Offene Anfragen", `<table><thead><tr><th>Datum</th><th>Kunde</th><th>Titel</th><th>Anhang</th><th>Status</th><th>Erledigen</th></tr></thead><tbody id="a-anfragen"></tbody></table>`)}
${abschnitt("Stunden buchen", `<form class="formular" id="buchen">
  <div><label>Kunde</label><select id="b-kunde"></select></div>
  <div><label>Was wurde gemacht?</label><input id="b-text" required></div>
  <div><label>Stunden (Viertelstunden)</label><input type="number" id="b-std" min="0.25" step="0.25" value="1" required></div>
  <div><button type="submit">[Buchen]</button></div>
  <div class="hinweis">Zuerst wird das Guthaben verbraucht. Was darüber liegt, landet als Mehraufwand zur Abrechnung.</div>
</form>`)}
${abschnitt("Neuer Kundenzugang", `<form class="formular" id="neu">
  <div><label>Firma</label><input id="n-firma" required></div>
  <div><label>Ansprechpartner</label><input id="n-name"></div>
  <div><label>E-Mail (Login)</label><input type="email" id="n-email" required></div>
  <div><label>Startpasswort</label><input id="n-pw" required></div>
  <div><label>Startguthaben (Stunden)</label><input type="number" id="n-std" min="0" max="3" step="1" value="1"></div>
  <div><button type="submit">[Anlegen]</button></div>
</form>`)}
${abschnitt("Test-Werkzeuge", `<div class="stapel">
  <button id="monat">Monatswechsel simulieren (+1 Std. für alle, max. 3)</button>
  <button id="reset">Demo-Daten zurücksetzen</button>
</div>`)}
`, "portal.js"),
};

for (const [datei, html] of Object.entries(seiten)) fs.writeFileSync(path.join(__dirname, datei), html);
console.log("Gebaut:", Object.keys(seiten).join(", "));
