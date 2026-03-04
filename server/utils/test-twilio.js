require('dotenv').config();
const twilio = require('twilio');

async function testTwilio() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_NUMBER;
    const to = process.env.ADMIN_WHATSAPP_NUMBER;

    console.log('--- Twilio Test Script ---');
    console.log(`SID: ${sid ? '✅ (Found)' : '❌ (Missing)'}`);
    console.log(`Token: ${token ? '✅ (Found)' : '❌ (Missing)'}`);
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);

    if (!sid || !token || !from || !to) {
        console.error('❌ Error: Missing Twilio environment variables in .env');
        process.exit(1);
    }

    const client = twilio(sid, token);

    try {
        console.log('⏳ Sending test free-form message...');
        const freeform = await client.messages.create({
            from: `whatsapp:${from}`,
            to: `whatsapp:${to}`,
            body: '🛍️ *Unlimited Bags* - This is a test message from your server! If you see this, your Twilio setup is correct.'
        });
        console.log(`✅ Success! Free-form SID: ${freeform.sid}`);

        if (process.env.TWILIO_CONTENT_SID) {
            console.log('⏳ Sending test template message...');
            const date = new Date().toLocaleDateString('en-GB');
            const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const templated = await client.messages.create({
                from: `whatsapp:${from}`,
                to: `whatsapp:${to}`,
                contentSid: process.env.TWILIO_CONTENT_SID,
                contentVariables: JSON.stringify({
                    "1": date,
                    "2": time
                })
            });
            console.log(`✅ Success! Template SID: ${templated.sid}`);
        }

        console.log('\nCheck your WhatsApp for the test message(s).');
    } catch (error) {
        console.error('❌ Error sending message:');
        console.error(error.message);
        if (error.code) {
            console.error(`Twilio Error Code: ${error.code}`);
            if (error.code === 21211) {
                console.error('💡 Hint: The "To" number is invalid.');
            } else if (error.code === 21608) {
                console.error('💡 Hint: If using Sandbox, this number has not joined. Send "join <sandbox-word>" to your Twilio number.');
            } else if (error.code === 20003) {
                console.error('💡 Hint: Invalid Account SID or Auth Token.');
            } else if (error.code === 63013) {
                console.error('💡 Hint: Out-of-session message. You MUST use a template (ContentSid) to start a new conversation.');
            }
        }
    }
}

testTwilio();
