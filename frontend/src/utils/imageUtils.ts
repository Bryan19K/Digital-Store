/**
 * Image URL Utilities for Production Deployment
 * 
 * Handles proper image URL construction for Vercel/Render deployment
 * where VITE_API_URL ends with /api but images are served from /uploads
 */

// Placeholder image for fallback when images fail to load
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Available%3C/text%3E%3C/svg%3E';

/**
 * Get the base URL for images by stripping /api from VITE_API_URL
 * 
 * Example:
 * - VITE_API_URL = "https://myapp.onrender.com/api"
 * - Returns: "https://myapp.onrender.com"
 */
export const getImageBaseUrl = (): string => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Strip /api from the end if present
    if (apiUrl.endsWith('/api')) {
        return apiUrl.slice(0, -4); // Remove last 4 characters ("/api")
    }

    return apiUrl;
};

/**
 * Construct a full image URL from a relative or absolute path
 * 
 * @param imagePath - The image path (e.g., "/uploads/image.jpg" or "https://example.com/image.jpg")
 * @returns Full image URL or placeholder if path is invalid
 */
export const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) {
        return PLACEHOLDER_IMAGE;
    }

    // If it's already an absolute URL (external image), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a relative path, construct full URL using base URL without /api
    if (imagePath.startsWith('/')) {
        const baseUrl = getImageBaseUrl();
        return `${baseUrl}${imagePath}`;
    }

    // If path doesn't start with /, assume it's a relative path and add /
    const baseUrl = getImageBaseUrl();
    return `${baseUrl}/${imagePath}`;
};

/**
 * Get error handler for img onError event to show placeholder
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
};
