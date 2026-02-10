import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const SuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Clear cart on successful payment
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="h-24 w-24 text-green-500" />
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                        Payment Successful!
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for your purchase. Your order has been confirmed and is being processed.
                    </p>

                    {sessionId && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <p className="text-sm text-gray-500 mb-2">Order Reference</p>
                            <p className="font-mono text-xs text-gray-700 break-all">{sessionId}</p>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mb-8">
                        A confirmation email has been sent to your email address with order details.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
