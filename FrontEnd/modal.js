import { isConnected } from "./sessionManagement.js";

// Fonction pour initialiser la modale
export const initializeModal = () => {
  const modalTitle = document.querySelector(".modal-title"); // Sélectionnez le titre de la modale

  // Vérifiez si l'élément modalTitle existe
  if (!modalTitle) {
    console.error("L'élément .modal-title est introuvable dans le DOM.");
    return; // Quittez la fonction si l'élément n'est pas trouvé
  }

  // Vérifiez si l'utilisateur est connecté
  if (!isConnected()) {
    console.log("Utilisateur non connecté : masquage du titre de la modale.");
    modalTitle.classList.add("hidden"); // Masque le titre si non connecté
    return; // Ne pas aller plus loin si non connecté
  }

  // Initialisation des éléments de la modale uniquement si l'utilisateur est connecté
  const modal = document.getElementById("modal1");
  const closeModal = document.querySelector(".close-btn");
  const modalLink = document.querySelector(".modal-link");

  if (!modal || !closeModal || !modalLink) {
    console.error(
      "Un ou plusieurs éléments de la modale sont introuvables dans le DOM."
    );
    return;
  }

  // Affiche le titre de la modale si l'utilisateur est connecté
  modalTitle.classList.remove("hidden");

  // Fonction pour ouvrir la modale
  const openModal = () => {
    modal.classList.add("active");
  };

  // Fonction pour fermer la modale
  const closeModalHandler = () => {
    modal.classList.remove("active");
  };

  // Événements
  modalLink.addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
  });

  closeModal.addEventListener("click", closeModalHandler);

  // Fermeture de la modale en cliquant à l'extérieur
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModalHandler();
    }
  });
};

// Conditionner l'appel de `initializeModal` selon l'état de connexion
initializeModal();
