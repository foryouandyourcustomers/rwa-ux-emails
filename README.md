# Componenten Library

Die Library dient als **Single Source of Thruth** zwischen UI/UX Entwicker:innen und App Entwickler:innen. Hier abgebildete Elemente sind mit den UX Designer:innen, Marketer:innen und Produktentwickler:innen abgestimmt.

Entstehen neue Componenten oder müssen bestehende getestet und geupdated werden, so dient die Library auch dazu eine Versionierung sicher zu stellen.

In der Library sind drei Arten von Elementen zu finden:

- **Layouts** - Zusammengesetzte Elemente (Emails, Seiten)
- **Componenten** - Einzelelemnte (Sections, Buttons)
- **HTML Gerüst** - nicht-sichtbares HTML, CSS für alle Elemente, ggf. JavaScript Logik

⚡ Die Elemente der Emails werden in das **HTML-Gerüst** eingebettet. NUR darin funktionieren diese. 

----------------------

# Browser App

Mit der Browser-App auf [rwa-emails.netlify.app](https://rwa-emails.netlify.app) können Templates getestet und geteilt werden. Hier eine Einführung zur Nutzung:

## Layouts

In der **Layout-Preview Ansicht** werden aus einer bestehende Liste an Componenten Layouts dargestellt. Diese dienen in erster Linie der Entwicklung im Kontext mit anderen Componenten. Es wird empfohlen Componenten in eigenen Templates in der Ziel Engine zu stecken. (Velocity, Handlebars, React, Svelte, Angular, etc.)

⚡ Tipp: Zum Testen empfiehlt es sich die ganze HTML Seiten inkl. Layouts in [Litmus](https://www.litmus.com) oder [Postdrop](https://app.postdrop.io/) zu kopieren. Dort können diverse Email Clients getestet  oder einzelne Emails verschickt werden. Insbesondere für die Testung von Print-Optionen ist letzteres sehr zu empfehlen. 

### Layout speichern

`Save` speichert eine JSON Datei der akutellen Ansicht auf dem Computer. 

Um ein Layout zu persistieren, kann das die `layout.json` umbenannt und im Repository im Ordner `presets` eingecheckt werden. 

### Layout laden

Um ein Layout zu laden, reicht es die gewüschte JSON Datei ins **Layout-Preview** (links) per Drag&Drop zu ziehen. Ein Layout besteht jediglich aus einer geordneten Liste an Componenten-Referenzen.

## HTML-Gerüst

Das HTML-Gerüst kann mit "HTML" angezeigt werden. 

`<!-- Add your components here -->`  

Dieser Kommentar signalisiert wo die Componenten und das eigentliche Layout hingehören. 

⚡ Bei Emails unbedingt zu beachten: 

Mit jedem Update einer einzelnen Componente, muss das komplette HTML Gerüst geupdated werden. Dies liegt daran, dass keine externen CSS Dateien in Email-Clients geladen werden können. CSS Regeln können ausschliesslich im Kopf der Datei Componenten übergreifend definiert sein.

## Componenten

### Componente auswählen 

Componenten können auf zwei Arten ausgewählt werden.

1. Mit der Auswahl aus dem `Select component ...` Dropdown in der rechten Aktionsleiste rechts oben.

2. Mit einen Klick auf die Componenten in **Layout-Preview** (links)

### Componente zum Layout hinzufügen

Ein ausgewählte Componente kann mit dem `<`-Button oder der `←` Pfeiltaste zum bestehenden Layout hinzugefügt werden. Danach erscheint diese im **Layout-Preview**.

### Componenten Löschen/Reihenfolge ändern

Mit den `🗑️` Button oder der `Delete` oder `Backspace`-Taste können Componenten aus dem Layout entfernt werden.

------------------------------------------------------------------

## Als UI/UX Entwickler:in

### Componenten

#### Neue Componente anlegen

#### Componente updaten

#### Componente entfernen

## Als App Entwickler:in

### Componenten
