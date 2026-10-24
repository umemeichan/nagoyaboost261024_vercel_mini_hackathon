
const MAX_HISTORY = 500;

let selected = $state<Entry | null>(null);
let history = $state<Entry[]>([]);
let loading = $state(false);
let error = $state('');
let showHistory = $state(false);
let searchText = $state('');
let failedImage = $state(false);

let filteredHistory = $derived(
	history.filter((item) =>
		item.name.includes(searchText.trim())
	)
);

onMount(() => {
	loadHistory();
});

async function loadHistory() {
	try {
		const response = await fetch('/api/dog-history');

		if (!response.ok) throw new Error('履歴取得失敗');

		const result = await response.json();
		history = result.history ?? [];
	} catch (e) {
		console.error(e);
		error = '履歴を読み込めませんでした。';
	}
}

function wikipediaSearchUrl(name: string) {
	return (
		'https://ja.wikipedia.org/wiki/特別:検索?search=' +
		encodeURIComponent(name)
	);
}

async function getWikipediaInfo(
	name: string
): Promise<Omit<Entry, 'visitedAt'>> {
	const fallback = {
		name,
		image: '',
		wikiUrl: wikipediaSearchUrl(name),
		articleFound: false
	};

	const params = new URLSearchParams({
		action: 'query',
		format: 'json',
		formatversion: '2',
		prop: 'pageimages|info',
		pithumbsize: '900',
		inprop: 'url',
		redirects: '1',
		titles: name,
		origin: '*'
	});

	try {
		const response = await fetch(
			'https://ja.wikipedia.org/w/api.php?' + params
		);

		if (!response.ok) return fallback;

		const result = await response.json();
		const page = result?.query?.pages?.[0];

		if (!page || page.missing === true || page.pageid == null) {
			return fallback;
		}

		return {
			name,
			image: page.thumbnail?.source ?? '',
			wikiUrl: page.fullurl ?? fallback.wikiUrl,
			articleFound: true
		};
	} catch {
		return fallback;
	}
}

async function recommend() {
	if (loading) return;

	loading = true;
	error = '';
	failedImage = false;

	const options = BREEDS.filter(
		(name) => name !== selected?.name
	);

	const name =
		options[Math.floor(Math.random() * options.length)];

	try {
		const info = await getWikipediaInfo(name);

		const response = await fetch('/api/dog-history', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(info)
		});

		if (!response.ok) throw new Error('保存失敗');

		const result = await response.json();

		selected = result.entry;
		history = [result.entry, ...history].slice(
			0,
			MAX_HISTORY
		);

		showHistory = false;
	} catch (e) {
		console.error(e);
		error = '履歴の保存に失敗しました。';
	} finally {
		loading = false;
	}
}

function openFromHistory(item: Entry) {
	selected = item;
	failedImage = false;
	error = '';
	showHistory = false;
}

async function clearHistory() {
	if (!window.confirm('閲覧履歴をすべて削除しますか？')) {
		return;
	}

	try {
		const response = await fetch('/api/dog-history', {
			method: 'DELETE'
		});

		if (!response.ok) throw new Error('削除失敗');

		history = [];
		error = '';
	} catch (e) {
		console.error(e);
		error = '履歴を削除できませんでした。';
	}
}

function formatDate(value: string) {
	const date = new Date(value);

	return Number.isNaN(date.getTime())
		? value
		: date.toLocaleString('ja-JP');
}
