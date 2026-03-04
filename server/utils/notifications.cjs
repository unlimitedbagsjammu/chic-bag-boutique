const twilio = require('twilio');
const nodemailer = require('nodemailer');

const sendOrderNotifications = async (order) => {
    // 1. Setup Nodemailer Transporter
    let transporter = null;
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
        try {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_PORT == 465,
                auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
        } catch (error) {
            console.error('❌ Error setting up global transporter:', error);
        }
    }

    // 2. WhatsApp via Twilio (Admin Only)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');

            // Construct details about the customer
            const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
            const customerContact = `${order.customer.email} | ${order.customer.phone}`;

            // 2a. Send detailed free-form message to Admin
            // NOTE: mediaUrl requires a public URL. Since we use Base64/MongoDB, we don't send the media here.
            await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
                body: `🛍️ *New Order Received!*\n\n` +
                    `*Order ID:* ${order.orderId}\n` +
                    `*Customer:* ${customerName}\n` +
                    `*Contact:* ${customerContact}\n` +
                    `*Items:* ${itemsList}\n` +
                    `*Total:* ₹${order.total}\n\n` +
                    `✅ *Payment Proof:* Recieved (Base64 stored in DB)\n\n` +
                    `Please check the admin dashboard to view the screenshot.`,
            });

            // 2b. Send Template-based message if SID is provided (Best for starting sessions or customer notifications)
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

    // 3. Email via SMTP
    if (transporter) {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        // Common HTML skeleton
        const getEmailTemplate = (title, recipientName, introText, isForAdmin = false) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;">
                <h2 style="color: #000; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
                <p>Hello ${recipientName},</p>
                <p>${introText}</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.orderId}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                    ${isForAdmin ? `
                        <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                        <p style="margin: 5px 0;"><strong>Customer Phone:</strong> ${order.customer.phone}</p>
                        <p style="margin: 5px 0;"><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
                    ` : ''}
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #000; color: #fff;">
                            <th style="padding: 12px; text-align: left;">Item</th>
                            <th style="padding: 12px; text-align: center;">Qty</th>
                            <th style="padding: 12px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right; border-top: 2px solid #eee; pt: 10px;">
                    <p style="margin: 5px 0; font-size: 14px; color: #666;">Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #666;">Shipping: ₹${order.shippingCost.toLocaleString('en-IN')}</p>
                    <h3 style="color: #000; margin-top: 10px; font-size: 20px;">Total: ₹${order.total.toLocaleString('en-IN')}</h3>
                </div>

                ${!isForAdmin ? `
                <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; background-color: #fcfcfc; padding: 20px;">
                    <p style="font-size: 14px; color: #444; margin-bottom: 10px;">We are currently processing your order and will notify you once it has been shipped.</p>
                    <p style="font-weight: bold; color: #000; font-size: 16px;">Thank you for choosing Unlimited Bags!</p>
                </div>
                ` : ''}
                
                <p style="margin-top: 30px; font-size: 11px; color: #999; text-align: center; font-style: italic;">
                    This is an automated notification. Please do not reply to this email.
                </p>
            </div>
        `;

        try {
            // 3a. Send Email to Admin
            await transporter.sendMail({
                from: `"Unlimited Bags Admin" <${process.env.SMTP_USERNAME}>`,
                to: process.env.ADMIN_EMAIL,
                subject: `🚨 NEW ORDER RECEIVED: #${order.orderId}`,
                html: getEmailTemplate(
                    "Admin Notification",
                    "Admin",
                    `A new order has been placed by <strong>${order.customer.firstName} ${order.customer.lastName}</strong> (${order.customer.email}).`,
                    true
                ),
            });
            console.log('✅ Admin order email sent');

            // 3b. Send Email to Customer (Confirmation)
            await transporter.sendMail({
                from: `"Unlimited Bags" <${process.env.SMTP_USERNAME}>`,
                to: order.customer.email,
                subject: `🛍️ Order Confirmed! - #${order.orderId}`,
                html: getEmailTemplate(
                    "Order Confirmation",
                    order.customer.firstName,
                    "Thank you for your purchase! We've received your order and payment proof. Our team is now verifying your order details."
                ),
            });
            console.log('✅ Customer confirmation email sent to:', order.customer.email);

        } catch (error) {
            console.error('❌ Error sending Email notifications:', error);
        }
    }
};

module.exports = {
    sendOrderNotifications
};
