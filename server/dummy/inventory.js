// seedInventory.js

const mongoose = require("mongoose");
const inventoryModel = require("../models/inventory.model.js"); // Adjust path if needed

// Replace this with your MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/fuel-delivery"

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected successfully");

    try {

      const dummyInventoryData = [
        {
          name: "Oil Filter Premium",
          description: "High-performance oil filter for extended engine life.",
          category: "Filters",
          price: 19.99,
          quantity: 150,
          manufacturer: "Bosch",
          compatibleVehicles: [
            { make: "Toyota", model: "Camry", year: 2018 },
            { make: "Honda", model: "Civic", year: 2019 },
          ],
          images: [
            "https://www.google.com/imgres?q=images&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Fhrltx12pl8hq%2F28ECAQiPJZ78hxatLTa7Ts%2F2f695d869736ae3b0de3e56ceaca3958%2Ffree-nature-images.jpg%3Ffit%3Dfill%26w%3D1200%26h%3D630&imgrefurl=https%3A%2F%2Fwww.shutterstock.com%2Fdiscover%2Ffree-nature-images&docid=uEeA4F2Pf5UbvM&tbnid=cVgA8oYynNpqQM&vet=12ahUKEwju98jJjZaNAxWaSKQEHV_JHfAQM3oECGMQAA..i&w=1200&h=630&hcb=2&ved=2ahUKEwju98jJjZaNAxWaSKQEHV_JHfAQM3oECGMQAA",
          ],
          specifications: {
            Height: "3.4 inches",
            Diameter: "2.6 inches",
            Material: "Synthetic fiber",
          },
          sku: "I-01-TOY-IV",
          isActive: true,
          warranty: {
            duration: 12,
            description: "12-month warranty from date of purchase",
          },
        },
        {
          name: "Brake Pads Ceramic",
          description:
            "Ceramic brake pads for superior braking and minimal dust.",
          category: "Brake System",
          price: 59.99,
          quantity: 75,
          manufacturer: "Brembo",
          compatibleVehicles: [
            { make: "Ford", model: "Focus", year: 2020 },
            { make: "Chevrolet", model: "Cruze", year: 2021 },
          ],
          images: ["https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Felephant%2F&psig=AOvVaw1AIndXUl2a63hxbWgnXS0B&ust=1746870424879000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIjq_JSOlo0DFQAAAAAdAAAAABAE"],
          specifications: {
            Material: "Ceramic",
            Thickness: "12mm",
          },
          sku: "BR-02-RD-CH",
          isActive: true,
          warranty: {
            duration: 18,
            description: "18-month manufacturer warranty",
          },
        },
        {
          name: "Transmission Fluid ATF",
          description: "Automatic transmission fluid for smooth gear shifting.",
          category: "Transmission",
          price: 39.99,
          quantity: 200,
          manufacturer: "Valvoline",
          compatibleVehicles: [{ make: "Nissan", model: "Altima", year: 2017 }],
          images: ["E:\\Personal\\Private\\My Photo\\MyPhoto.jpg"],
          specifications: {
            Volume: "1 Quart",
            Viscosity: "75W-90",
          },
          sku: "TRN-03-NS-L",
          isActive: true,
          warranty: {
            duration: 6,
            description: "6-month warranty for product quality",
          },
        },
        {
          name: "Engine Mount",
          description: "OEM engine mount to reduce vibration and noise.",
          category: "Engine Parts",
          price: 89.95,
          quantity: 40,
          manufacturer: "Anchor",
          compatibleVehicles: [
            { make: "Hyundai", model: "Elantra", year: 2022 },
            { make: "Kia", model: "Forte", year: 2022 },
          ],
          images: ["https://www.google.com/imgres?q=images&imgurl=https%3A%2F%2Fimages.ctfassets.net%2Fhrltx12pl8hq%2F28ECAQiPJZ78hxatLTa7Ts%2F2f695d869736ae3b0de3e56ceaca3958%2Ffree-nature-images.jpg%3Ffit%3Dfill%26w%3D1200%26h%3D630&imgrefurl=https%3A%2F%2Fwww.shutterstock.com%2Fdiscover%2Ffree-nature-images&docid=uEeA4F2Pf5UbvM&tbnid=cVgA8oYynNpqQM&vet=12ahUKEwju98jJjZaNAxWaSKQEHV_JHfAQM3oECGMQAA..i&w=1200&h=630&hcb=2&ved=2ahUKEwju98jJjZaNAxWaSKQEHV_JHfAQM3oECGMQAA"],
          specifications: {
            Material: "Rubber & Steel",
            Weight: "3.5 lbs",
          },
          sku: "ENG-00-HY-K",
          isActive: true,
          warranty: {
            duration: 24,
            description: "2-year replacement warranty",
          },
        },
        {
          name: "Headlight Assembly Left",
          description: "Left-side headlight with halogen bulb included.",
          category: "Body Parts",
          price: 129.99,
          quantity: 30,
          manufacturer: "TYC",
          compatibleVehicles: [
            { make: "Subaru", model: "Impreza", year: 2020 },
          ],
          images: ["E:\\Personal\\Private\\My Photo\\MyPhoto.jpg"],
          specifications: {
            Position: "Front Left",
            "Bulb Type": "Halogen",
          },
          sku: "BDY-05-SU-I",
          isActive: true,
          warranty: {
            duration: 12,
            description: "1-year limited warranty",
          },
        },
      ];

      await inventoryModel.insertMany(dummyInventoryData);
      console.log("Dummy inventory data inserted successfully.");
    } catch (error) {
      console.error("Error seeding inventory data:", error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
