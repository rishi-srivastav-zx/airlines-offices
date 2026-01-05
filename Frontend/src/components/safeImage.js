"use client";

import React, { useState } from "react";

const SafeImage = ({ src, alt, className = "", fallbackSrc, onError }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const defaultFallback =
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800";

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            const newSrc = fallbackSrc || defaultFallback;
            setImgSrc(newSrc);
            if (onError) {
                onError();
            }
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
};

export default SafeImage;
