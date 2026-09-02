import { sql } from "../lib/db.js";
import type { coordinates } from "../types/location.types.js";

export const syncUserLocationService = async (coords: coordinates, userId?: string) => {
  const { lat, lng } = coords;

  if (!lat || !lng) {
    throw new Error("No coordinates found");
  }

  const matchedPlace = await sql`
    SELECT id, name
    FROM transient_places 
    WHERE ST_Contains(
      ST_GeomFromGeoJSON(geo_shape), 
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
    )
    LIMIT 1
  `;

  const placeId = matchedPlace.length > 0 ? matchedPlace[0]?.id : null;
  const placeName = matchedPlace.length > 0 ? matchedPlace[0]?.name : null;

  if (userId) {
    await sql`
    UPDATE profiles 
    SET current_place_id = ${placeId}
    WHERE user_id = ${userId}
  `;
  }

  return {
    isInsidePlace: placeId !== null,
    placeId: placeId,
    placeName: placeName,
  };
};
