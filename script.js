document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("cv-form");
  const preview = document.getElementById("cv-preview");
  const photoInput = document.getElementById("photo");
  const nbExperiencesInput = document.getElementById("nb-experiences");
  const experienceContainer = document.getElementById("experience-container");
  const nbFormationsInput = document.getElementById("nb-formations");
  const formationContainer = document.getElementById("formation-container");
  const downloadBtn = document.getElementById("download-pdf");

  let photoSrc = "";

  // 🛡️ Échappement HTML pour éviter les injections (XSS)
  function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // 📸 Gestion de la photo
  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        photoSrc = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // 🧱 Génération dynamique des champs d'expérience
  // BUG FIX #1 : on conserve les valeurs déjà saisies quand on change le nombre de blocs
  function createExperienceFields(count) {
    // Sauvegarder les valeurs actuelles avant de reconstruire le DOM
    const existingValues = [];
    const currentBlocks = experienceContainer.querySelectorAll(".experience-block");
    currentBlocks.forEach((block, i) => {
      const poste = document.getElementById(`poste-${i}`);
      const desc = document.getElementById(`desc-${i}`);
      const annee = document.getElementById(`annee-${i}`);
      existingValues.push({
        poste: poste ? poste.value : "",
        desc: desc ? desc.value : "",
        annee: annee ? annee.value : "",
      });
    });

    experienceContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("experience-block");

      const previous = existingValues[i] || { poste: "", desc: "", annee: "" };

      const posteLabel = document.createElement("label");
      posteLabel.setAttribute("for", `poste-${i}`);
      posteLabel.textContent = `Poste #${i + 1} :`;

      const posteInput = document.createElement("input");
      posteInput.type = "text";
      posteInput.id = `poste-${i}`;
      posteInput.placeholder = "Intitulé du poste";
      posteInput.value = previous.poste;

      const anneeLabel = document.createElement("label");
      anneeLabel.setAttribute("for", `annee-${i}`);
      anneeLabel.textContent = "Année(s) :";

      const anneeInput = document.createElement("input");
      anneeInput.type = "text";
      anneeInput.id = `annee-${i}`;
      anneeInput.placeholder = "Ex : 2022 - 2024";
      anneeInput.value = previous.annee;

      const descLabel = document.createElement("label");
      descLabel.setAttribute("for", `desc-${i}`);
      descLabel.textContent = "Description :";

      const descTextarea = document.createElement("textarea");
      descTextarea.id = `desc-${i}`;
      descTextarea.placeholder = "Description de l'expérience";
      descTextarea.value = previous.desc;

      wrapper.appendChild(posteLabel);
      wrapper.appendChild(posteInput);
      wrapper.appendChild(anneeLabel);
      wrapper.appendChild(anneeInput);
      wrapper.appendChild(descLabel);
      wrapper.appendChild(descTextarea);
      experienceContainer.appendChild(wrapper);
    }
  }

  // Initialiser à 1 expérience
  createExperienceFields(1);

  // BUG FIX #13 : gestion des valeurs vides / NaN / hors bornes sur le nombre d'expériences
  nbExperiencesInput.addEventListener("input", () => {
    let count = parseInt(nbExperiencesInput.value, 10);
    if (isNaN(count)) return; // on attend que l'utilisateur finisse de taper
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    createExperienceFields(count);
  });

  // Si l'utilisateur laisse le champ vide ou invalide en quittant le champ, on remet une valeur correcte
  nbExperiencesInput.addEventListener("blur", () => {
    let count = parseInt(nbExperiencesInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 10) count = 10;
    nbExperiencesInput.value = count;
    createExperienceFields(count);
  });

  // 🎓 Génération dynamique des champs de formation (même logique que les expériences)
  function createFormationFields(count) {
    const existingValues = [];
    const currentBlocks = formationContainer.querySelectorAll(".formation-block");
    currentBlocks.forEach((block, i) => {
      const intitule = document.getElementById(`formation-intitule-${i}`);
      const annee = document.getElementById(`formation-annee-${i}`);
      existingValues.push({
        intitule: intitule ? intitule.value : "",
        annee: annee ? annee.value : "",
      });
    });

    formationContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("formation-block");

      const previous = existingValues[i] || { intitule: "", annee: "" };

      const intituleLabel = document.createElement("label");
      intituleLabel.setAttribute("for", `formation-intitule-${i}`);
      intituleLabel.textContent = `Formation #${i + 1} :`;

      const intituleTextarea = document.createElement("textarea");
      intituleTextarea.id = `formation-intitule-${i}`;
      intituleTextarea.placeholder = "Ex : Master en Informatique, Université X";
      intituleTextarea.value = previous.intitule;

      const anneeLabel = document.createElement("label");
      anneeLabel.setAttribute("for", `formation-annee-${i}`);
      anneeLabel.textContent = "Année(s) :";

      const anneeInput = document.createElement("input");
      anneeInput.type = "text";
      anneeInput.id = `formation-annee-${i}`;
      anneeInput.placeholder = "Ex : 2021 - 2023";
      anneeInput.value = previous.annee;

      wrapper.appendChild(intituleLabel);
      wrapper.appendChild(intituleTextarea);
      wrapper.appendChild(anneeLabel);
      wrapper.appendChild(anneeInput);
      formationContainer.appendChild(wrapper);
    }
  }

  createFormationFields(1);

  nbFormationsInput.addEventListener("input", () => {
    let count = parseInt(nbFormationsInput.value, 10);
    if (isNaN(count)) return;
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    createFormationFields(count);
  });

  nbFormationsInput.addEventListener("blur", () => {
    let count = parseInt(nbFormationsInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 10) count = 10;
    nbFormationsInput.value = count;
    createFormationFields(count);
  });

  // 🧠 Génération du CV
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const profil = document.getElementById("profil").value.trim();
    const competencesRaw = document.getElementById("competences").value.trim();

    // BUG FIX #3 : validation basique avant de générer le CV
    if (!nom || !prenom) {
      alert("Merci de renseigner au moins votre nom et votre prénom.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("L'adresse email saisie ne semble pas valide.");
      return;
    }

    // 🎓 Récupération des formations
    const formationBlocks = [];
    const nbForm = parseInt(nbFormationsInput.value, 10) || 1;
    for (let i = 0; i < nbForm; i++) {
      const intituleEl = document.getElementById(`formation-intitule-${i}`);
      const anneeEl = document.getElementById(`formation-annee-${i}`);
      const intitule = intituleEl ? intituleEl.value.trim() : "";
      const annee = anneeEl ? anneeEl.value.trim() : "";
      if (intitule || annee) {
        formationBlocks.push({ intitule, annee });
      }
    }

    // 🔁 Récupération des expériences
    const experienceBlocks = [];
    const nbExp = parseInt(nbExperiencesInput.value, 10) || 1;
    for (let i = 0; i < nbExp; i++) {
      const posteEl = document.getElementById(`poste-${i}`);
      const descEl = document.getElementById(`desc-${i}`);
      const anneeEl = document.getElementById(`annee-${i}`);
      const poste = posteEl ? posteEl.value.trim() : "";
      const desc = descEl ? descEl.value.trim() : "";
      const annee = anneeEl ? anneeEl.value.trim() : "";
      if (poste || desc) {
        experienceBlocks.push({ poste, desc, annee });
      }
    }

    // BUG FIX #2 : ne pas générer de <li> vides si le champ compétences est vide
    const competencesList = competencesRaw
      ? competencesRaw
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
      : [];

    // Conversion des sauts de ligne en <br> APRÈS échappement (fix XSS)
    const profilHTML = escapeHTML(profil).replace(/\n/g, "<br>");

    // 🧾 Construction du CV (toutes les valeurs utilisateur sont échappées → fix #5 XSS)
    const cvHTML = `
      <div class="cv-left">
        ${photoSrc ? `<img src="${photoSrc}" alt="Photo de profil">` : `<div class="cv-photo-placeholder">${escapeHTML((prenom[0] || "") + (nom[0] || ""))}</div>`}
        <h2>${escapeHTML(prenom)} ${escapeHTML(nom)}</h2>
        <p>${escapeHTML(email)}</p>
        <p>${escapeHTML(telephone) || "Téléphone non renseigné"}</p>
        ${
          competencesList.length > 0
            ? `<h3>Compétences</h3>
        <ul>
          ${competencesList.map((c) => `<li>${escapeHTML(c)}</li>`).join("")}
        </ul>`
            : ""
        }
      </div>

      <div class="cv-right">
        <h1>${escapeHTML(prenom)} ${escapeHTML(nom)}</h1>

        <div class="cv-section">
          <h3>Profil</h3>
          <p>${profilHTML || "Pas de description fournie."}</p>
        </div>

        <div class="cv-section">
          <h3>Formation</h3>
          ${
            formationBlocks.length === 0
              ? "<p>Non renseignée</p>"
              : formationBlocks
                  .map(
                    (form) => `
            <div class="cv-formation-item">
              <p><strong>${escapeHTML(form.intitule) || "Formation non précisée"}</strong>${form.annee ? ` <span class="cv-date">(${escapeHTML(form.annee)})</span>` : ""}</p>
            </div>
          `
                  )
                  .join("")
          }
        </div>

        <div class="cv-section">
          <h3>Expérience</h3>
          ${
            experienceBlocks.length === 0
              ? "<p>Aucune expérience.</p>"
              : experienceBlocks
                  .map(
                    (exp) => `
            <div class="cv-experience-item">
              <p><strong>${escapeHTML(exp.poste) || "Poste non précisé"}</strong>${exp.annee ? ` <span class="cv-date">(${escapeHTML(exp.annee)})</span>` : ""}</p>
              <p>${escapeHTML(exp.desc) || "Description non fournie."}</p>
            </div>
          `
                  )
                  .join("")
          }
        </div>
      </div>
    `;

    preview.innerHTML = cvHTML;
    preview.style.height = "auto";
    downloadBtn.disabled = false;
  });

  // 📄 Téléchargement PDF
  downloadBtn.addEventListener("click", function () {
    const element = document.getElementById("cv-preview");
    if (!element.innerHTML.trim()) {
      alert("Veuillez générer le CV avant de télécharger.");
      return;
    }

    element.style.height = "auto";
    element.style.overflow = "visible";
    const scrollHeight = element.scrollHeight;
    window.scrollTo(0, 0);

    // Petit indicateur de chargement pendant la génération
    const originalLabel = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = "⏳ Génération en cours...";

    const opt = {
      margin: 0.5,
      filename: "mon-cv.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        dpi: 300,
        windowWidth: document.documentElement.offsetWidth,
        height: scrollHeight + 200,
        scrollX: 0,
        scrollY: 0,
        onclone: (doc) => {
          const clonedElement = doc.getElementById("cv-preview");
          clonedElement.style.height = scrollHeight + "px";
          clonedElement.style.overflow = "visible";
          clonedElement.style.display = "block";
          clonedElement.style.position = "relative";
        },
      },
      // BUG FIX #4 : évite de couper une section en deux entre deux pages
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.save();
      })
      .catch((error) => {
        console.error("Erreur lors de la génération du PDF:", error);
        alert("Une erreur est survenue lors de la génération du PDF.");
      })
      .finally(() => {
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalLabel;
      });
  });
});
