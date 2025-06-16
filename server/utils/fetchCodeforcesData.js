// utils/fetchCodeforcesData.js
const axios = require("axios");

const fetchCodeforcesRatings = async (handle) => {
  try {
    const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const history = res.data.result;
    if (!history.length) return { currentRating: null, maxRating: null };

    const currentRating = history.at(-1).newRating;
    const maxRating = Math.max(...history.map(e => e.newRating));
    return { currentRating, maxRating };
  } catch (err) {
    console.error(`[CF] Rating fetch failed for ${handle}:`, err.message);
    return { currentRating: null, maxRating: null };
  }
};

module.exports = { fetchCodeforcesRatings };
