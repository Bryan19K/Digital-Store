import express from 'express';
import Stripe from 'stripe';
import { Resend } from 'resend';

const router = express.Router();

// Helper to get Stripe instance
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not defined in .env');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Initialize Resend only if API key is provided
let resend = null;
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('YOUR_RESEND_KEY_HERE')) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

// Create Stripe Checkout Session
router.post('/create-session', async (req, res) => {
    try {
        const stripe = getStripe();
        const { items, customerEmail } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Transform cart items to Stripe line items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name.en,
                    description: item.description?.en || '',
                    images: item.images && item.images.length > 0 ? [item.images[0]] : [],
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: customerEmail,
            metadata: {
                customerEmail: customerEmail || 'guest@example.com',
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
    }
});

// Webhook to handle successful payments and send confirmation email
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.metadata.customerEmail;

        // Send confirmation email (only if Resend is configured)
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Digital Store <onboarding@resend.dev>', // Replace with your verified domain
                    to: customerEmail,
                    subject: 'Order Confirmation - Digital Store',
                    html: `
                        <h1>Thank you for your purchase!</h1>
                        <p>Your order has been confirmed and is being processed.</p>
                        <p>Order ID: ${session.id}</p>
                        <p>Total: $${(session.amount_total / 100).toFixed(2)}</p>
                        <p>We'll send you another email when your order ships.</p>
                    `,
                });
                console.log('Confirmation email sent to:', customerEmail);
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
            }
        } else {
            console.log('Resend not configured - skipping email notification');
        }
    }

    res.json({ received: true });
});

export default router;
