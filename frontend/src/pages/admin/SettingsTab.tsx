import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Upload, Save, AlertCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../utils/imageUtils';

const SettingsTab: React.FC = () => {
    // Destructure everything needed from the context
    const { settings, loading, updateSettingsContext } = useSettings();

    // Local state for form handling
    const [storeName, setStoreName] = useState('');
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Sync local state with context settings when they change
    // This handles both initial load and updates from other components
    useEffect(() => {
        if (settings) {
            setStoreName(settings.storeName || '');

            if (settings.heroImage) {
                // Use centralized utility for preview
                setPreviewUrl(getImageUrl(settings.heroImage));
            }
        }
    }, [settings]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!storeName.trim()) {
            showMessage('error', 'Store name is required');
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();
            formData.append('storeName', storeName);

            if (heroImageFile) {
                formData.append('heroImage', heroImageFile);
            }

            // Use the function from context, which is available in scope now
            await updateSettingsContext(formData);

            setHeroImageFile(null);

            showMessage('success', '✅ Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            showMessage('error', 'Failed to update settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <SettingsIcon className="text-gray-600" size={28} />
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Store Settings</h1>
                </div>
                <p className="text-gray-500 text-sm">
                    Configure your store name and hero image for the homepage
                </p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <AlertCircle size={20} className="mt-0.5" />
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8">
                {/* Store Name */}
                <div className="mb-8">
                    <label htmlFor="storeName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name
                    </label>
                    <input
                        type="text"
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        placeholder="Digital Store"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        This name will appear in the navbar and throughout the site
                    </p>
                </div>

                {/* Hero Image */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hero Background Image
                    </label>

                    {/* Current/Preview Image */}
                    {previewUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                            <div className="aspect-[21/9] bg-gray-100">
                                <img
                                    src={previewUrl}
                                    alt="Hero preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* File Input */}
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300">
                            <Upload size={18} className="mr-2" />
                            <span className="text-sm font-medium">
                                {heroImageFile ? 'Change Image' : 'Upload New Image'}
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {heroImageFile && (
                            <span className="text-sm text-gray-600">
                                Selected: {heroImageFile.name}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Recommended size: 2560x1080px. Accepts JPG, PNG, or WebP (max 5MB)
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsTab;
