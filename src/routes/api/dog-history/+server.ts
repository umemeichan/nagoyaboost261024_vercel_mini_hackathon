

import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

type DogEntry = {
	name: string;
	image: string;
	wikiUrl: string;
	articleFound: boolean;
	visitedAt: string;
};

const COOKIE = 'dog_history_id';
const LIMIT = 500;

function config() {
	const url =
		env.UPSTASH_REDIS_REST_URL ||
		env.KV_REST_API_URL;

	const token =
		env.UPSTASH_REDIS_REST_TOKEN ||
		env.KV_REST_API_TOKEN;

	if (!url || !token) {
		throw new Error('Upstashの環境変数が未設定です');
	}

	return { url, token };
}

async function command(args: (string | number)[]) {
	const { url, token } = config();

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(args)
	});

	const result = await response.json();

	if (!response.ok || result.error) {
		throw new Error(
			result.error || `Upstash: ${response.status}`
		);
	}

	return result.result;
}

function getKey(
	cookies: Parameters<RequestHandler>[0]['cookies']
) {
	let id = cookies.get(COOKIE);

	if (
		!id ||
		!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)
	) {
		id = crypto.randomUUID();

		cookies.set(COOKIE, id, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
	}

	return `dog-history:${id}`;
}

function sameOrigin(request: Request) {
	const origin = request.headers.get('origin');
	return (
		!origin ||
		origin === new URL(request.url).origin
	);
}

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const raw = (await command([
			'LRANGE',
			getKey(cookies),
			0,
			LIMIT - 1
		])) as string[] | null;

		const history: DogEntry[] = (raw ?? []).map(
			(item) => JSON.parse(item) as DogEntry
		);

		return json({ history });
	} catch (e) {
		console.error('履歴取得:', e);
		return json(
			{ error: '履歴を取得できませんでした' },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({
	cookies,
	request
}) => {
	if (!sameOrigin(request)) {
		return json(
			{ error: '許可されていないリクエストです' },
			{ status: 403 }
		);
	}

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return json(
			{ error: 'JSON形式が正しくありません' },
			{ status: 400 }
		);
	}

	if (!body || typeof body !== 'object') {
		return json(
			{ error: 'データがありません' },
			{ status: 400 }
		);
	}

	const value = body as Record<string, unknown>;

	if (
		typeof value.name !== 'string' ||
		!value.name.trim() ||
		value.name.length > 150 ||
		typeof value.image !== 'string' ||
		value.image.length > 2000 ||
		typeof value.wikiUrl !== 'string' ||
		value.wikiUrl.length > 2000 ||
		typeof value.articleFound !== 'boolean' ||
		!String(value.wikiUrl).startsWith(
			'https://ja.wikipedia.org/'
		)
	) {
		return json(
			{ error: '犬種データが正しくありません' },
			{ status: 400 }
		);
	}

	const entry: DogEntry = {
		name: value.name.trim(),
		image: value.image,
		wikiUrl: value.wikiUrl,
		articleFound: value.articleFound,
		visitedAt: new Date().toISOString()
	};

	try {
		const key = getKey(cookies);

		await command([
			'LPUSH',
			key,
			JSON.stringify(entry)
		]);

		await command([
			'LTRIM',
			key,
			0,
			LIMIT - 1
		]);

		return json({ entry });
	} catch (e) {
		console.error('履歴保存:', e);
		return json(
			{ error: '履歴を保存できませんでした' },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({
	cookies,
	request
}) => {
	if (!sameOrigin(request)) {
		return json(
			{ error: '許可されていないリクエストです' },
			{ status: 403 }
		);
	}

	try {
		await command(['DEL', getKey(cookies)]);
		return json({ success: true });
	} catch (e) {
		console.error('履歴削除:', e);
		return json(
			{ error: '履歴を削除できませんでした' },
			{ status: 500 }
		);
	}
};
