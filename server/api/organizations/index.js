const express = require("express");
const router = express.Router();

// Improved M2M token function
async function getM2MToken() {
  const kindeUrl = process.env.KINDE_URL;
  const clientId = process.env.KINDE_M2M_CLIENT_ID;
  const clientSecret = process.env.KINDE_M2M_CLIENT_SECRET;

  try {
    // The correct format for M2M token request
    const response = await fetch(`${kindeUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        audience: `${kindeUrl}/api`, 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get M2M token: ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const kindeUrl = process.env.KINDE_URL;
    if (!kindeUrl) {
      return res.status(500).json({ error: "KINDE_URL is not set" });
    }

    // Get M2M token
    const token = await getM2MToken();

    // API endpoint for organizations
    const apiUrl = `${kindeUrl}/api/v1/organizations`;

    // Make the API call with the M2M token
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API returned error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "OK",
      data: {
        organizations: data.organizations || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch organizations",
      message: error.message,
    });
  }
});

module.exports = router;
