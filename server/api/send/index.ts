export default defineEventHandler(async () => {
	const { emails } = useResend();

	const result = await emails.send({
		from: "Th3mis <app@hello.th3mis.io>",
		to: ["charlestheveniau@gmail.com"],
		subject: "Hello from Nuxt Resend",
		text: "Hello world!",
	});

	return { email: 'sent', result }
});