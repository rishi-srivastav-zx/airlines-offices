import mongoose from 'mongoose';

const officeSchema = new mongoose.Schema(
    {
        airlineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Airline',
            required: [true, 'Airline reference is required'],
            index: true,
        },
        airlineName: {
            type: String,
            required: [true, 'Airline name is required'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
            index: true,
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
            index: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email',
            ],
        },
        hours: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        coordinates: {
            latitude: {
                type: Number,
                min: -90,
                max: 90,
            },
            longitude: {
                type: Number,
                min: -180,
                max: 180,
            },
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique office per airline in a city
officeSchema.index({ airlineId: 1, city: 1, country: 1 }, { unique: true });

// Index for search
officeSchema.index({ city: 'text', country: 'text', airlineName: 'text' });

const Office = mongoose.model('Office', officeSchema);

export default Office;
