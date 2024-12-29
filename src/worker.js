import { WorkerEntrypoint } from 'cloudflare:workers';
import setupPage from './setupPage.js';

export class GoogleFormsWorker extends WorkerEntrypoint {
	// Currently, entrypoints without a named handler are not supported
	async fetch() {
		return new Response(null, { status: 404 });
	}

	async openRegistration(fixedUrl, handler, handlerData) {
		const id = await this.env.UTILS.generateID(25);
		const key = await this.env.UTILS.generateID(50);
		await this.env.GOOGLE_FORMS.put(`registrationKey-${key}`, id, { expirationTtl: 3600 });
		await this.env.GOOGLE_FORMS.put(`registration-${id}`, JSON.stringify({ fixedUrl, handler, handlerData, key }), { expirationTtl: 3600 });
		return id;
	}
}

async function handleResponse(env, actionData, response) {
	console.log(actionData, response);
	if (actionData.handler === 'esn-recruitment') return await env.ESN_RECRUITMENT.handleResponse(actionData, response);
}

export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		try {
			const urlStack = request.url.split('googleforms/', 2)[1];

			if (request.method === 'POST') {
				const reqBody = await request.json();
				const [version, action] = urlStack.split('/', 2);
				const url = urlStack.substring(action.length + version.length + 2);
				const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('cf-connecting-ip') || '';

				if (version === 'v1') {
					if (action === 'register') {
						const rateLimitKey = `register-${ipAddress}-${reqBody.key}`;
						const { success } = await env.RATE_LIMITER.limit({ key: rateLimitKey });
						if (!success) return new Response('Rate limit exceeded. Please try again later.', { status: 429, headers: corsHeaders });

						try {
							const data = new Set(request.headers.get('user-agent').split(')', 1)[0].split('(', 2)[1].split('; '));
							const appsScriptId = Array.from(data)
								.filter((e) => e.startsWith('id: '))[0]
								.substring(4);
							if (data.has('Google-Apps-Script') && appsScriptId.length > 0) {
								if (!(await env.GOOGLE_FORMS.get(`registrationKey-${reqBody.key}`)))
									return new Response('Invalid or expired key.', { status: 404, headers: corsHeaders });
								await env.GOOGLE_FORMS.put(`registrationData-${reqBody.key}`, JSON.stringify({ ...reqBody, url, appsScriptId }), {
									cacheTtl: 600,
								}); // 10 min cache
								return new Response('Registration successful.', { status: 200, headers: corsHeaders });
							}
							return new Response('Invalid request format.', { status: 400, headers: corsHeaders });
						} catch (error) {
							console.error(error);
							return new Response('An error occurred during registration.', { status: 500, headers: corsHeaders });
						}
					} else if (action === 'validate') {
						const rateLimitKey = `validate-${ipAddress}-${reqBody.key}`;
						const { success } = await env.RATE_LIMITER.limit({ key: rateLimitKey });
						if (!success) return new Response('Rate limit exceeded. Please try again later.', { status: 429, headers: corsHeaders });

						try {
							const { key, code } = reqBody;
							const data = await env.GOOGLE_FORMS.get(`registrationData-${key}`, 'json');
							if (!data) return new Response('Invalid or expired key.', { status: 404, headers: corsHeaders });

							if (code === data.code) {
								const id = await env.GOOGLE_FORMS.get(`registrationKey-${key}`);
								const registrationData = await env.GOOGLE_FORMS.get(`registration-${id}`, 'json');
								if (!registrationData) return new Response('Registration data not found.', { status: 404, headers: corsHeaders });

								if (data.url.startsWith(registrationData.fixedUrl) || data.url.startsWith('/' + registrationData.fixedUrl)) {
									await env.GOOGLE_FORMS.put(
										`data-${data.url}`,
										JSON.stringify({
											handler: registrationData.handler,
											handlerData: registrationData.handlerData,
											appsScriptId: data.appsScriptId,
											formData: data.formData,
										})
									);
									await env.GOOGLE_FORMS.delete(`registration-${id}`);
									await env.GOOGLE_FORMS.delete(`registrationKey-${key}`);
									await env.GOOGLE_FORMS.delete(`registrationData-${key}`);
									return new Response('Validation successful.', { status: 200, headers: corsHeaders });
								}
								return new Response('URL mismatch.', { status: 400, headers: corsHeaders });
							}
							return new Response('Invalid code.', { status: 400, headers: corsHeaders });
						} catch (error) {
							console.error(error);
							return new Response('An error occurred during validation.', { status: 500, headers: corsHeaders });
						}
					} else if (action === 'response') {
						const actionData = await env.GOOGLE_FORMS.get(`data-${url}`, 'json');
						if (actionData) {
							try {
								const data = new Set(request.headers.get('user-agent').split(')', 1)[0].split('(', 2)[1].split('; '));
								if (data.has('Google-Apps-Script') && data.has(`id: ${actionData.appsScriptId}`)) {
									await handleResponse(env, actionData, reqBody);
									return new Response('Response handled.', { status: 200, headers: corsHeaders });
								}
							} catch (error) {
								console.error(error);
								return new Response('An error occurred while handling the response.', { status: 500, headers: corsHeaders });
							}
						} else return new Response('Resource not found.', { status: 404, headers: corsHeaders });
					}
				}
			} else if (request.method === 'GET') {
				// const id = await env.UTILS.generateID(25);
				// const key = await env.UTILS.generateID(50);
				// await env.GOOGLE_FORMS.put(`registrationKey-${key}`, id, { expirationTtl: 3600 });
				// await env.GOOGLE_FORMS.put(`registration-${id}`, JSON.stringify({ fixedUrl: "esn/recruitment", handler: "esn-recruitment", handlerData: { a: 1 }, key }), { expirationTtl: 3600 });
				// return;
				const data = await env.GOOGLE_FORMS.get(`registration-${urlStack}`, 'json');
				if (data) return new Response(setupPage(data.fixedUrl, data.key), { headers: { ...corsHeaders, 'Content-Type': 'text/html' } });
				return new Response('Resource not found.', { status: 404, headers: corsHeaders });
			}
		} catch (e) {
			console.error(e);
			return new Response('An unexpected error occurred.', { status: 500, headers: corsHeaders });
		}

		return new Response('Method not allowed.', { status: 405, headers: corsHeaders });
	},
};
