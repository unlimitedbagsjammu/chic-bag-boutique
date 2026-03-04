const twilio = require('twilio');
const nodemailer = require('nodemailer');

const sendAdminNotifications = async (order) => {
    // 1. WhatsApp via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');

            // Construct details about the customer
            const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
            const customerContact = `${order.customer.email} | ${order.customer.phone}`;

            // 1a. Send detailed free-form message to Admin (Requires an open session/Sandbox)
            await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
                body: `🛍️ *New Order Received!*\n\n` +
                    `*Order ID:* ${order.orderId}\n` +
                    `*Customer:* ${customerName}\n` +
                    `*Contact:* ${customerContact}\n` +
                    `*Items:* ${itemsList}\n` +
                    `*Total:* ₹${order.total}\n\n` +
                    `🔗 *Payment Proof:* ${order.paymentScreenshot}\n\n` +
                    `Please check the admin dashboard for details.`,
                mediaUrl: [order.paymentScreenshot]
            });

            // 1b. Send Template-based message if SID is provided (Best for starting sessions or customer notifications)
            if (process.env.TWILIO_CONTENT_SID) {
                const date = new Date(order.createdAt).toLocaleDateString('en-GB');
                const time = new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                await client.messages.create({
                    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                    to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
                    contentSid: process.env.TWILIO_CONTENT_SID,
                    contentVariables: JSON.stringify({
                        "1": date,
                        "2": time
                    })
                });
                console.log('✅ Template WhatsApp notification sent to admin');
            }

            console.log('✅ WhatsApp notification sent to admin for order:', order.orderId);
        } catch (error) {
            console.error('❌ Error sending WhatsApp notification:', error.message);
            if (error.code) console.error('Error Code:', error.code);
        }
    }

    // 2. Email via SMTP
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const itemsHtml = order.items.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
                </tr>
            `).join('');

            await transporter.sendMail({
                from: `"Chic Bag Boutique" <${process.env.SMTP_USERNAME}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `New Order Received: ${order.orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #333; text-align: center;">New Order Notification</h2>
                        <p><strong>Order ID:</strong> ${order.orderId}</p>
                        <p><strong>Customer:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                        <p><strong>Email:</strong> ${order.customer.email}</p>
                        <p><strong>Phone:</strong> ${order.customer.phone}</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <thead>
                                <tr style="background-color: #f8f8f8;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: left;">Qty</th>
                                    <th style="padding: 10px; text-align: left;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 20px; text-align: right;">
                            <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>
                            <p><strong>Shipping:</strong> ₹${order.shippingCost}</p>
                            <h3 style="color: #d11;">Total Amount: ₹${order.total}</h3>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #777;">
                            This is an automated notification from Chic Bag Boutique.
                        </p>
                    </div>
                `,
            });
            console.log('✅ Email notification sent to admin');
        } catch (error) {
            console.error('❌ Error sending Email notification:', error);
        }
    }
};

module.exports = {
    sendAdminNotifications
};
