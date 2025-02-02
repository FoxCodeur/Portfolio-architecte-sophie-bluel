// On importe les fonctions des autres fichiers
import { deleteProject } from "./deleteProject.js";
import { addProject } from "./addProject.js";
import { isConnected } from "./sessionManagement.js";

export const displayGallery = (projects) => {
  let gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modal-gallery");
  const addPhotoButton = document.querySelector(".photo-add-btn");
  const modalTitleContainer = document.querySelector(".modal-title-container");
  const homepageEditButton = document.querySelector(".homepage-edit-btn");

  // Extraire toutes les catégories uniques ligne 170
  const categories = [
    ...new Map(
      // Key = id de la catégorie, Value = catégorie
      projects.map((project) => [project.category.id, project.category])
    ).values(),
  ];
  // on souhaite lier l'id à la catégorie

  //-------------------------------------------------------------------------------
  // Si la galerie n'existe pas, on la crée
  if (!gallery) {
    gallery = document.createElement("div");
    gallery.classList.add("gallery");
    document.getElementById("portfolio").append(gallery);
  }

  // On vide la galerie avant d'y ajouter les nouveaux projets
  gallery.innerHTML = "";

  // Rendu des projets dans la galerie
  projects.forEach((project) => {
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl;
    imageElement.alt = project.title;
    const figCaption = document.createElement("figcaption");
    figCaption.textContent = project.title;
    figure.append(imageElement, figCaption);
    gallery.append(figure);
  });
  // -------------------------------------------------------------------------------
  // Affichage du titre de la modale et de la bordure noire
  if (modalTitleContainer) {
    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("modal-title");
    modalTitle.textContent = "Galerie photo";
    modalTitle.style.marginBottom = "2rem";
    modalTitleContainer.appendChild(modalTitle);
  }

  modalGallery.style.borderBottom = "1px solid black";

  // Ajout du nouveau titre en haut de la modale "ajout photo"
  addPhotoButton.addEventListener("click", () => {
    if (modalGallery) {
      modalGallery.innerHTML = "";
      modalGallery.style.borderBottom = "none";
      homepageEditButton.classList.add("appear");
      addPhotoButton.style.display = "none";

      const modalTitle = modalTitleContainer.querySelector(".modal-title");
      modalTitle.textContent = "Ajout photo";

      const formContainer = document.createElement("div");
      formContainer.classList.add("form-container");
      // -------------------------------------------------------------------------
      // Création de la zone de sélection et de prévisualisation d'images
      const chooseFileDiv = document.createElement("div");
      chooseFileDiv.classList.add("chooseFile");
      //les balises de l'input
      const imageInput = document.createElement("input");
      imageInput.classList.add("form-image-input");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("accept", "image/*");
      imageInput.style.display = "none";

      const customButton = document.createElement("button");
      customButton.textContent = "+ Ajouter photo";
      customButton.classList.add("custom-file-button");

      customButton.addEventListener("click", () => {
        imageInput.click();
      });
      // Lien vers la page d'accueil, sinon href
      homepageEditButton.addEventListener("click", () => {
        window.location.replace("./index.html");
      });
      // traitement de l'input qui permet de charger puis prévisualiser la photo
      imageInput.addEventListener("change", () => {
        if (imageInput.files.length > 0) {
          console.log("Fichier sélectionné :", imageInput.files[0].name);

          // Prévisualisation de l'image sélectionnée dans la div 'chooseFileDiv'
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const imgPreview = document.createElement("img");
            imgPreview.src = e.target.result;
            imgPreview.classList.add("image-preview");
            chooseFileDiv.appendChild(imgPreview);
          };

          fileReader.readAsDataURL(imageInput.files[0]);
        }
      });
      chooseFileDiv.append(customButton, imageInput);

      // Paragraphe sous le bouton JPG, PNG : 4 Mo max
      const fileInfoParagraph = document.createElement("p");
      fileInfoParagraph.textContent = "JPG, PNG : 4 Mo max";
      chooseFileDiv.append(fileInfoParagraph);
      // les champs titre et catégorie

      // Formulaire pour le titre
      const titleContainer = document.createElement("div");
      titleContainer.classList.add("form-title-container");
      const titleLabel = document.createElement("label");
      titleLabel.setAttribute("for", "form-title-input");
      titleLabel.textContent = "Titre";
      const titleInput = document.createElement("input");
      titleInput.classList.add("form-title-input");
      titleInput.setAttribute("type", "text");
      titleInput.setAttribute("id", "form-title-input");
      titleContainer.append(titleLabel, titleInput);

      // Formulaire pour la catégorie
      const categoryContainer = document.createElement("div");
      categoryContainer.classList.add("form-category-container");
      const categoryLabel = document.createElement("label");
      categoryLabel.setAttribute("for", "form-category-input");
      categoryLabel.textContent = "Catégorie";

      // Sélecteur de catégorie
      const categorySelect = document.createElement("select");
      categorySelect.setAttribute("id", "form-category-input");

      // Option vide par défaut
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Choisir une catégorie";
      categorySelect.appendChild(defaultOption);

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
      // Ajouter la ligne sous le sélecteur de catégorie
      const lineDiv = document.createElement("div");
      lineDiv.style.position = "absolute";
      lineDiv.style.bottom = "-1.5rem";
      lineDiv.style.left = "1.8rem";
      lineDiv.style.width = "90%";
      lineDiv.style.borderBottom = "1px solid black";

      // Ajouter les éléments dans le conteneur categoryContainer
      categoryContainer.append(categoryLabel, categorySelect, lineDiv);

      // Bouton de soumission de l'ajout des projets Valider
      const submitButton = document.createElement("button");
      submitButton.classList.add("photo-add-project");
      submitButton.textContent = "Valider";
      // Ajouter un projet
      submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const title = titleInput.value;
        // Vérification de la validité de la catégorie
        const categoryId = categorySelect.value;
        const image = imageInput.files[0];

        // ------------------------------------------------------------------------
        // Appel de la fonction addProject avec l'id de la catégorie
        const newProject = await addProject(title, categoryId, image);

        if (newProject) {
          const newFigure = document.createElement("figure");
          const newImage = document.createElement("img");
          // est utilisée pour créer un URL temporaire permettant d'afficher
          // l'image sur la page sans avoir besoin de l'envoyer sur un serveur.
          newImage.src = URL.createObjectURL(image);
          newImage.alt = title;

          const newCaption = document.createElement("figcaption");
          newCaption.textContent = title;

          newFigure.append(newImage, newCaption);
          gallery.append(newFigure);
          // Redirection après ajout
          window.location.replace("./index.html");
        } else {
          console.log("Erreur lors de l'ajout du projet.");
        }
      });

      formContainer.append(
        chooseFileDiv,
        titleContainer,
        categoryContainer,
        submitButton
      );
      modalGallery.append(formContainer);
    }
  });

  // --------------------------------------------------------------------------------
  // Affichage des projets dans la galerie modale et suppression des projets
  if (modalGallery) {
    projects.forEach((project) => {
      const modalFigure = document.createElement("figure");
      const modalImage = document.createElement("img");
      modalImage.src = project.imageUrl;
      modalImage.alt = project.title;
      const modalCaption = document.createElement("figcaption");
      modalCaption.textContent = project.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

      deleteBtn.addEventListener("click", async () => {
        // Appel de la fonction de suppression et suppression du DOM si succès
        if (await deleteProject(project.id)) {
          // Retire l'élément de la modale
          modalFigure.remove();
          // Retire l'élément de la galerie principale
          document
            .querySelector(`.gallery figure img[src="${project.imageUrl}"]`)
            ?.parentElement?.remove();
        } else {
          console.error("Erreur : impossible de supprimer le projet.");
        }
      });

      modalFigure.append(modalImage, modalCaption, deleteBtn);
      modalGallery.append(modalFigure);
    });
  }
};
