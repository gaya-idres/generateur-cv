# Générateur de CV

Petite application web pour créer un CV en remplissant un formulaire, avec aperçu en direct et export en PDF.

## Pourquoi ce projet

Dans le cadre de ma recherche de stage, j'avais envie d'un projet un peu plus concret qu'un CV classique. J'ai codé cet outil en HTML/CSS/JS, en m'aidant de l'IA pour déboguer et améliorer le code au fur et à mesure.

## Fonctionnalités

- Formulaire : infos personnelles, photo, profil, compétences
- Ajout de plusieurs formations (intitulé + année)
- Ajout de plusieurs expériences (poste + année + description)
- Aperçu du CV en temps réel
- Export en PDF
- Design responsive

## Technologies

HTML, CSS, JavaScript (vanilla), [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) pour l'export PDF.

## Utilisation

Ouvrir `index.html` dans un navigateur, remplir le formulaire, cliquer sur "Générer le CV", puis télécharger en PDF.

## Structure

```
index.html   -> formulaire et page
script.js    -> logique (formulaire, aperçu, export PDF)
style.css    -> mise en forme
```
