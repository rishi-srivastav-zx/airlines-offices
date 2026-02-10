const axios = require("axios");

const API_URL = "http://localhost:3001/api/airlines";

async function testAirlines() {
  try {
    console.log("🚀 Testing GET /api/airlines...");
    const getResponse = await axios.get(API_URL);
    console.log("✅ GET successful:", getResponse.data.success);
    console.log("📊 Total airlines found:", getResponse.data.pagination.totalItems);

    const testAirline = {
      airlineName: "Test Airline " + Date.now(),
      slug: "test-airline-" + Date.now(),
      firstName: "TestBrand",
      continents: ["Asia"],
      countries: ["India"],
      seo: {
        metaTitle: "Test Meta Title",
        metaDescription: "Test Meta Description"
      }
    };

    console.log("\n🚀 Testing POST /api/airlines...");
    const postResponse = await axios.post(API_URL, testAirline);
    console.log("✅ POST successful:", postResponse.data.success);
    const createdSlug = postResponse.data.data.slug;

    console.log("\n🚀 Testing GET /api/airlines/" + createdSlug + "...");
    const getOneResponse = await axios.get(`${API_URL}/${createdSlug}`);
    console.log("✅ GET one successful:", getOneResponse.data.success);

    console.log("\n🚀 Testing DELETE /api/airlines/" + createdSlug + "...");
    const deleteResponse = await axios.delete(`${API_URL}/${createdSlug}`);
    console.log("✅ DELETE successful:", deleteResponse.data.success);

    console.log("\n✨ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

testAirlines();
