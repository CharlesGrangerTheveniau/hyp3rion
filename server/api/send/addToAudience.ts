export default defineEventHandler(async (event) => {
	const { contacts } = useResend();
    const body = await readBody(event)

	const result = await contacts.create({
		email: body.email,
        unsubscribed: false,
        audience_id: '88b65ef4-6371-4148-a0b0-f52a1d463b9a',
	});

	return { contact: 'sent', result }
});