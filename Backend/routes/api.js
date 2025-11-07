export async function searchGames(name) {
  try {
    const response = await fetch(`/games/search?name=${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error("Failed to fetch games");
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}