import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        logo: {
            type: String,
        },

        photo: {
            type: String,
        },

        officeOverview: {
            airlineName: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            country: {
                type: String,
                required: true,
                trim: true,
            },

            address: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
            },

            hours: {
                start: {
                    type: String,
                    required: true,
                },
                end: {
                    type: String,
                    required: true,
                },
            },

            website: {
                type: String,
            },

            tollFreeNumber: {
                type: String,
            },
        },

        about: {
            airlineId: {
                type: String,
            },

            description: {
                type: String,
            },

            history: {
                type: String,
            },

            services: {
                type: [String],
                default: [],
            },

            additionalInfo: {
                type: String,
            },
        },

        airportLocation: {
            airportName: {
                type: String,
            },

            terminalInfo: {
                type: String,
            },

            iataCode: {
                type: String,
            },

            counterContact: {
                type: String,
            },

            airportAddress: {
                type: String,
            },
        },

        airportMapLocation: {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
            mapQuery: {
                type: String,
            },
            googleMapsUrl: {
                type: String,
            },
            embedUrl: {
                type: String,
            },
        },

        availableServices: {
            type: [String],
            default: [],
        },

        fleetOperations: {
            aircraftTypes: {
                type: [String],
                default: [],
            },

            totalFleet: {
                type: Number,
            },

            additionalDetails: {
                type: String,
            },
        },

        metadata: {
            rating: {
                type: Number,
                min: 0,
                max: 5,
            },

            reviewCount: {
                type: Number,
                default: 0,
            },

            verified: {
                type: Boolean,
                default: false,
            },

            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },
    },
    {
        timestamps: true,
    }
);

OfficeSchema.pre("save", function (next) {
    const hours = this.officeOverview?.hours;

    if (hours?.start && hours?.end && hours.start >= hours.end) {
        return next(new Error("Office end time must be later than start time"));
    }

    next();
});


export default mongoose.models.Office || mongoose.model("Office", OfficeSchema);
