import Office from "../model/officeSchema.js";


export const getAllOffices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      country,
      airlineName,
      verified,
      search,
      sortBy = "createdAt",
      order = "desc",
      exclude,
    } = req.query;

    const query = {};

    
    if (city) query["officeOverview.city"] = new RegExp(city, "i");
    if (country) query["officeOverview.country"] = new RegExp(country, "i");
    if (airlineName)
      query["officeOverview.airlineName"] = new RegExp(airlineName, "i");
    if (verified !== undefined)
      query["metadata.verified"] = verified === "true";
    
    
    if (exclude) {
      const excludeAirlines = exclude.split(',').map(airline => airline.trim());
      query["officeOverview.airlineName"] = { 
        $nin: excludeAirlines 
      };
    }

    
    if (search) {
      query.$or = [
        { "officeOverview.airlineName": new RegExp(search, "i") },
        { "officeOverview.city": new RegExp(search, "i") },
        { "officeOverview.country": new RegExp(search, "i") },
        { "airportLocation.airportName": new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const offices = await Office.find(query)
      .populate('airline', 'airlineName slug logo')
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Office.countDocuments(query);

    res.json({
      success: true,
      data: offices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getOfficeBySlug = async (req, res) => {
  try {
    const office = await Office.findOne({ slug: req.params.slug })
      .populate('airline', 'airlineName slug logo');

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.json({ success: true, data: office });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createOffice = async (req, res) => {
  try {
    let officeData;
    if (req.body.officeData) {
      officeData = JSON.parse(req.body.officeData);
    } else {
      officeData = { ...req.body };
    }

    const photoFile = req.files?.photo?.[0];
    const ogImageFile = req.files?.ogImage?.[0];

    if (photoFile) {
      officeData.photo = ("/" + photoFile.path).replace(/\\/g, "/");
    }

    if (ogImageFile) {
      if (!officeData.seo) officeData.seo = {};
      officeData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
    }

    // Strip immutable fields
    delete officeData._id;
    delete officeData.__v;

    if (!officeData.metadata) officeData.metadata = {};
    officeData.metadata.lastUpdated = new Date();

    const office = new Office(officeData);
    const savedOffice = await office.save();
    
    res.status(201).json({
      success: true,
      data: savedOffice,
      message: "Office created successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Office with this slug already exists",
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateOffice = async (req, res) => {
  try {
    let updateData;
    if (req.body.officeData) {
      updateData = JSON.parse(req.body.officeData);
    } else {
      updateData = { ...req.body };
    }

    const photoFile = req.files?.photo?.[0];
    const ogImageFile = req.files?.ogImage?.[0];

    if (photoFile) {
      updateData.photo = ("/" + photoFile.path).replace(/\\/g, "/");
    }

    if (ogImageFile) {
      if (!updateData.seo) updateData.seo = {};
      updateData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
    }

    // Strip immutable fields
    delete updateData._id;
    delete updateData.__v;

    if (!updateData.metadata) updateData.metadata = {};
    updateData.metadata.lastUpdated = new Date();

    const office = await Office.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true },
    );

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.json({
      success: true,
      data: office,
      message: "Office updated successfully",
    });
  } catch (err) {
    let errorMessage = "Failed to update office";
    if (err instanceof SyntaxError) {
      errorMessage = "Invalid JSON in officeData field.";
    }
    res
      .status(400)
      .json({ success: false, message: errorMessage, error: err.message });
  }
};


export const patchOffice = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (!updates.metadata) updates.metadata = {};
    updates["metadata.lastUpdated"] = new Date();

    const office = await Office.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.json({
      success: true,
      data: office,
      message: "Office updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const deleteOffice = async (req, res) => {
  try {
    const office = await Office.findOneAndDelete({ slug: req.params.slug });

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.json({
      success: true,
      message: "Office deleted successfully",
      data: office,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getOfficeStats = async (req, res) => {
  try {
    const totalOffices = await Office.countDocuments();
    const verifiedOffices = await Office.countDocuments({
      "metadata.verified": true,
    });

    const officesByCountry = await Office.aggregate([
      { $group: { _id: "$officeOverview.country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const officesByAirline = await Office.aggregate([
      {
        $group: {
          _id: "$officeOverview.airlineName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        totalOffices,
        verifiedOffices,
        officesByCountry,
        topAirlines: officesByAirline,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getNearbyOffices = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const offices = await Office.find({
      "airportMapLocation.latitude": { $exists: true },
      "airportMapLocation.longitude": { $exists: true },
    });

    const nearby = offices.filter((office) => {
      const distance = getDistance(
        parseFloat(lat),
        parseFloat(lng),
        office.airportMapLocation.latitude,
        office.airportMapLocation.longitude,
      );
      return distance <= maxDistance;
    });

    res.json({ success: true, data: nearby });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
