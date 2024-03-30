const faker = require("faker");

const POST_COUNT = 10; // Nombre de fois que le bot fera un post
const API_ENDPOINT = "http://127.0.0.1:3002/register"; // Remplacez par l'URL de l'API à laquelle vous souhaitez envoyer les données

async function makePost() {
  try {
    const postData = {
      // Génération de données aléatoires avec Faker.js
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      password: faker.internet.password(),
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();

    console.log(`Post réussi avec le message: "${postData.message}"`);
    return responseData;
  } catch (error) {
    console.error("Erreur lors de la tentative de post : ", error.message);
  }
}

async function main() {
  for (let i = 0; i < POST_COUNT; i++) {
    console.log(`Post numéro ${i + 1}`);
    await makePost();
    // Attendez quelques secondes avant de faire le prochain post (optionnel)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main();
