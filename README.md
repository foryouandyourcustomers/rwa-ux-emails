# Componenten Library

Die Library dient als **Single Source of Thruth** zwischen UI/UX Entwicker:innen und App Entwickler:innen. Hier abgebildete Elemente sind mit den UX Designer:innen, Marketer:innen und Produktentwickler:innen abgestimmt.

Entstehen neue Componenten oder müssen bestehende getestet und geupdated werden, so dient die Library auch dazu eine Versionierung sicher zu stellen.

In der Library sind drei Arten von Elementen zu finden:

- **Layouts** - Zusammengesetzte Elemente (Emails, Seiten)
- **Componenten** - Einzelelemnte (Sections, Buttons)
- **HTML Gerüst** - nicht-sichtbares HTML, CSS für alle Elemente, ggf. JavaScript Logik

⚡ Die Elemente der Emails werden in das **HTML-Gerüst** eingebettet. NUR darin funktionieren diese.

---

# Browser App

Mit der Browser-App auf [rwa-emails.netlify.app](https://rwa-emails.netlify.app) können Templates getestet und geteilt werden. Hier eine Einführung zur Nutzung:

## Layouts

In der **Layout-Preview Ansicht** werden aus einer bestehende Liste an Componenten Layouts dargestellt. Diese dienen in erster Linie der Entwicklung im Kontext mit anderen Componenten. Es wird empfohlen Componenten in eigenen Templates in der Ziel Engine zu stecken. (Velocity, Handlebars, React, Svelte, Angular, etc.)

⚡ Tipp: Zum Testen empfiehlt es sich die ganze HTML Seiten inkl. Layouts in [Litmus](https://www.litmus.com) oder [Postdrop](https://app.postdrop.io/) zu kopieren. Dort können diverse Email Clients getestet oder einzelne Emails verschickt werden. Insbesondere für die Testung von Print-Optionen ist letzteres sehr zu empfehlen.

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

### Componenten Löschen

Mit den `🗑️` Button oder der `Delete` oder `Backspace`-Taste können Componenten aus dem Layout entfernt werden.

### Reihenfolge ändern

Die ausgewählte Componente kann mit den Pfeiltasten bzw. mit den Buttons in der **Layout-Preview** Ansicht oben bzw. unten verschieben verschoben werden.

Ebenfalls ist die Reihenfolge mit Drag&Drop anpassbar.

---

## Zu beachten als UI/UX Entwickler:in

### Componenten

Alle Componenten befinden sich in `index.html` jeweils in einem `HTMLTemplateElement`-Tag. Dieser hat die zwingenden Attribute `data-template-id`, `data-template-version` und der CSS Klasse `component`.

- `data-template-id` ist der Name der Componente ("ProductItem") der von allen am Design und Dev Prozess beteiligten Personen abgestimmt wurde.
- `data-brand` versteckt markenspezifische Komponenten im Auswahlmenu. Gilt eine Komponente universal so kann diese Property frei gelassen werden.
- `data-template-version` wird von der Frontent-Entwickler:in nach dem SEM Versioning 2.0 gepflegt.
- `class="component"` dient nur der Funktionalität des Editors und kann ignoriert werden, ist aber bindend.

Innerhalb des Template-Tag beginnt die Componente Root. Die ist bereits eine notwendige Klasse des Design Systems. Dadurch werden die Componenten von einander mit Abstand getrennt, bsplw. Der primäre Klassenname entspricht dem `ComponentName`. Die definitionen werden im Datei Kopf innerhalb von `<style data-styles-partial="design-system"></style>` definiert.

#### Neue Componente anlegen

##### 1. Das grobe Gerüst in den Body kopieren.

```html
<template
  data-template-id="ComponentName"
  data-brand="Lagerhaus"
  data-template-version="1.1.0"
  class="component"
>
  <div class="ComponentName componentRoot">
    <!-- My Markdown -->
  </div>
</template>
```
##### 2. Stylen

Es gibt eine Reihe von Utility Klassen aus dem Design System bereits wie beispielsweise: `grey-500`,`font-sm`,`font-md`,`font-md`, `signal-500`, `p-0`, `normal`, `italic`, etc. Da die Klassen im Code View in inline-styles convertiert werden, sind keine Deep Matches als selektoren gestattet. Die CSSStyleDirectives werden als Style Attribute an das jeweilige Element gehängt.

###### Bespiel

```html
<h2 class="font-md m-0 primary-500">Text</h2>
```

konvertiert zu:

```html
<h2
  class="font-md m-0 primary-500"
  style="font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; color: rgb(67, 69, 68); margin: 0px;"
></h2>
```

Die ursprünglichen Klassennamen sind zur vereinfachten Lesebarkeit auf expliziten Wunsch des Backends erhalten geblieben.

💣 Hinweis `rgb()` wird von einigen Emailclients nicht unterstützt. Derzeit besteht keine Möglichkeit diese in HEX zu konvertieren. Eine Konvertierungsfunktion ist jedoch angelegt und bereit für die notwendige Implementierung.

##### 3. Testen auf Email Clients
Es empfiehlt sich während der Entwicklung [Litmus](https://www.litmus.com) und/oder [Postdrop](https://app.postdrop.io/) zu verwenden. Bebachte auch die Druckansicht zu prüfen, da es hier oft zu unerwarteten Überraschungen kommt. 

#### Componente updaten

Nach dem SEM Versioning bitte die Version updaten und dann Dev und Design Team informieren.

#### Componente entfernen

Das `HTMLTemplateElement` einfach aus der `index.html` löschen.

---

## Zu beachten als App Entwickler:in

### Componenten

Hast du bereits eine Layout Datein `layout.json`fuer das benötigte Email, so kannst du dies mit Drag und Drop laden. Derzeit sind Layouts nicht versioniert. Es gilt als Source of Reference der Priority Guide in Figma.
Durch Auswahl einer Componente im Layout oder im Drop&Down wird das HTML der Komponente angezeigt unten rechts im Screen.

Mit `Copy`wird der Quelltext in die Zwischenablage kopiert.
