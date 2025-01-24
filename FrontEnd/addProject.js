import { isConnected } from "./sessionManagement.js";

const API_URI = "http://localhost:5678/api/works";

// La fonction `addProject` reçoit désormais directement les arguments correspondants
export const addProject = async (title, categoryId, file) => {
  // Vérification de la connexion de l'utilisateur
  if (!isConnected()) {
    console.error("Utilisateur non authentifié. Veuillez vous connecter.");
    return;
  }

  // Vérification que tous les champs sont renseignés
  const missingFields = [];
  if (!title) missingFields.push("le titre");
  if (!categoryId) missingFields.push("la catégorie");
  if (!file) missingFields.push("une image");

  if (missingFields.length > 0) {
    alert(
      `Veuillez renseigner ${missingFields.join(
        ", "
      )} pour valider le formulaire.`
    );
    return;
  }

  // Validation du fichier image
  if (!(file instanceof File)) {
    console.error("Le fichier fourni n'est pas valide.");
    return;
  }

  // Vérification du type de fichier (JPEG ou PNG)
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert(
      "Type de fichier non valide. Seuls les formats JPEG et PNG sont acceptés."
    );
    console.error(
      "Type de fichier non valide. Seuls les formats JPEG et PNG sont acceptés."
    );
    return;
  }

  // Vérification de la taille du fichier (maximum 4 Mo)
  if (file.size > 4 * 1024 * 1024) {
    console.error(
      "Le fichier est trop volumineux. Il doit être inférieur à 4 Mo."
    );
    return;
  }

  // Création de l'objet FormData pour envoyer les données
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", categoryId); // Récupère dynamiquement l'ID de la catégorie

  try {
    // Envoi de la requête POST pour ajouter le projet
    const response = await fetch(API_URI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });

    // Gestion des erreurs de réponse
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur lors de l'ajout du projet :", errorData);
      return;
    }

    // Si le projet est ajouté avec succès
    const project = await response.json();
    console.log("Projet ajouté avec succès :", project);
    return project;
  } catch (error) {
    alert("Erreur lors de l'ajout du projet. Veuillez réessayer.");
    return;
  }
};
