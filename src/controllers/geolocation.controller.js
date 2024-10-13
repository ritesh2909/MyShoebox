import { GeoLocation } from "../model/GeoLocation.model.js";
import axios from "axios";

export const locationSearch = async (req, res) => {
  try {
    const { input } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`;

    const response = await axios.get(url);
    console.log(JSON.stringify(response.data))
    return res.status(200).json(response.data)

  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}

export const setLocation = async (req, res) => {
  const { placeId } = req.body;
  try {
    // Check if location already exists in database
    let location = await GeoLocation.findOne({ placeId });
    if (!location) {
      // Fetch location details from Google Places API
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
      const detailsResponse = await axios.get(detailsUrl);
      // const { name, formatted_address, geometry } = detailsResponse.data;
      console.log(JSON.stringify(detailsResponse.data));

      // Save location details to database
      // location = new GeoLocation({
      //   placeId,
      //   name,
      //   formatted_address,
      //   location: {
      //     type: 'Point',
      //     coordinates: [geometry.location.lng, geometry.location.lat]
      //   }
      // });
      // await location.save();
    }

    res.json({ message: 'Location saved successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getLocation = async (req, res) =>{
  const { placeId } = req.query;
    try {
        // Check if location exists in database
        const location = await GeoLocation.findOne({ placeId });

        if (location) {
          console.log(location)
            res.json({ available: true, location: location });
        } else {
            res.json({ available: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to check availability' });
    }
}