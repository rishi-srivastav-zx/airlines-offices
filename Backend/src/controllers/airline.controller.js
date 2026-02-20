import Airline from "../model/airlineschema.js";


export const getAllAirlines = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    
    if (search) {
      query.$or = [
        { airlineName: new RegExp(search, "i") },
        { firstName: new RegExp(search, "i") },
        { continents: new RegExp(search, "i") },
        { countries: new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const airlines = await Airline.find(query)
      .populate("continents")
      .populate("countries")
      .populate("cities")
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Airline.countDocuments(query);

    res.json({
      success: true,
      data: airlines,
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


export const getAirlineBySlug = async (req, res) => {
  try {
    const airline = await Airline.findOne({ slug: req.params.slug })
      .populate("continents")
      .populate("countries")
      .populate("cities");

    if (!airline) {
      return res.status(404).json({
        success: false,
        message: "Airline not found",
      });
    }

    res.json({ success: true, data: airline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createAirline = async (req, res) => {
  try {
    
    let airlineData;
    if (req.body.airlineData) {
      airlineData = JSON.parse(req.body.airlineData);
    } else {
      airlineData = { ...req.body };
    }

    const logoFile = req.files?.logo?.[0];
    const ogImageFile = req.files?.ogImage?.[0];

    if (logoFile) {
      airlineData.logo = ("/" + logoFile.path).replace(/\\/g, "/");
    }

    if (ogImageFile) {
      if (!airlineData.seo) airlineData.seo = {};
      airlineData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
    }

    const airline = new Airline(airlineData);
    const savedAirline = await airline.save();

    res.status(201).json({
      success: true,
      data: savedAirline,
      message: "Airline created successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Airline with this slug already exists",
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateAirline = async (req, res) => {
  try {
    let updateData;
    if (req.body.airlineData) {
      updateData = JSON.parse(req.body.airlineData);
    } else {
      updateData = { ...req.body };
    }

    const logoFile = req.files?.logo?.[0];
    const ogImageFile = req.files?.ogImage?.[0];

    if (logoFile) {
      updateData.logo = ("/" + logoFile.path).replace(/\\/g, "/");
    }

    if (ogImageFile) {
      if (!updateData.seo) updateData.seo = {};
      updateData.seo.ogImage = ("/" + ogImageFile.path).replace(/\\/g, "/");
    }

    if (!updateData.metadata) updateData.metadata = {};
    updateData.metadata.lastUpdated = new Date();

    const airline = await Airline.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!airline) {
      return res.status(404).json({
        success: false,
        message: "Airline not found",
      });
    }

    res.json({
      success: true,
      data: airline,
      message: "Airline updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const deleteAirline = async (req, res) => {
  try {
    const airline = await Airline.findOneAndDelete({ slug: req.params.slug });

    if (!airline) {
      return res.status(404).json({
        success: false,
        message: "Airline not found",
      });
    }

    res.json({
      success: true,
      message: "Airline deleted successfully",
      data: airline,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
