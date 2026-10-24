
<script lang="ts">
	import { onMount } from 'svelte';

	type DogEntry = {
		name: string;
		image: string;
		wikiUrl: string;
		articleFound: boolean;
		visitedAt: string;
	};

	// 犬種リスト
	const BREEDS = `
柴犬
秋田犬
北海道犬
甲斐犬
紀州犬
四国犬
日本スピッツ
狆
土佐犬
日本テリア
琉球犬
川上犬
縄文柴犬
豆柴
トイ・プードル
ミニチュア・プードル
スタンダード・プードル
ポメラニアン
チワワ
ロングコートチワワ
マルチーズ
ヨークシャー・テリア
シーズー
パピヨン
ペキニーズ
パグ
フレンチ・ブルドッグ
ボストン・テリア
ビション・フリーゼ
ハバニーズ
ボロニーズ
コトン・ド・テュレアール
ブリュッセル・グリフォン
プチ・ブラバンソン
ベルジアン・グリフォン
チャイニーズ・クレステッド・ドッグ
アーフェンピンシャー
ミニチュア・ピンシャー
イタリアン・グレーハウンド
キャバリア・キング・チャールズ・スパニエル
キング・チャールズ・スパニエル
ダックスフント
ミニチュア・ダックスフント
カニンヘン・ダックスフント
ジャック・ラッセル・テリア
パーソン・ラッセル・テリア
ウェスト・ハイランド・ホワイト・テリア
スコティッシュ・テリア
ケアーン・テリア
ノーフォーク・テリア
ノーリッチ・テリア
ボーダー・テリア
ウェルシュ・テリア
レークランド・テリア
ワイアー・フォックス・テリア
スムース・フォックス・テリア
トイ・フォックス・テリア
マンチェスター・テリア
ベドリントン・テリア
シーリハム・テリア
ダンディ・ディンモント・テリア
スカイ・テリア
オーストラリアン・テリア
シルキー・テリア
チェスキー・テリア
アイリッシュ・テリア
アイリッシュ・ソフトコーテッド・ウィートン・テリア
ミニチュア・シュナウザー
スタンダード・シュナウザー
ジャイアント・シュナウザー
ビーグル
バセット・ハウンド
バセット・フォーヴ・ド・ブルターニュ
プチ・バセット・グリフォン・バンデーン
ブラッドハウンド
ハリア
イングリッシュ・フォックスハウンド
アメリカン・フォックスハウンド
ダルメシアン
バセンジー
ファラオ・ハウンド
イビザン・ハウンド
ポデンコ・カナリオ
ローデシアン・リッジバック
タイ・リッジバック・ドッグ
ゴールデン・レトリーバー
ラブラドール・レトリーバー
フラットコーテッド・レトリーバー
カーリーコーテッド・レトリーバー
チェサピーク・ベイ・レトリーバー
ノヴァ・スコシア・ダック・トーリング・レトリーバー
アメリカン・コッカー・スパニエル
イングリッシュ・コッカー・スパニエル
イングリッシュ・スプリンガー・スパニエル
ウェルシュ・スプリンガー・スパニエル
フィールド・スパニエル
クランバー・スパニエル
サセックス・スパニエル
アイリッシュ・ウォーター・スパニエル
アメリカン・ウォーター・スパニエル
ポーチュギーズ・ウォーター・ドッグ
スパニッシュ・ウォーター・ドッグ
バルビー
ラゴット・ロマニョーロ
ワイマラナー
ビズラ
ワイアーヘアード・ビズラ
ジャーマン・ショートヘアード・ポインター
ジャーマン・ワイアーヘアード・ポインター
イングリッシュ・ポインター
イングリッシュ・セッター
アイリッシュ・セッター
ゴードン・セッター
アイリッシュ・レッド・アンド・ホワイト・セッター
ブリタニー・スパニエル
ブラーク・フランセ
コーイケルホンディエ
ボーダー・コリー
ラフ・コリー
スムース・コリー
シェットランド・シープドッグ
オーストラリアン・シェパード
ミニチュア・アメリカン・シェパード
オーストラリアン・キャトル・ドッグ
オーストラリアン・ケルピー
ウェルシュ・コーギー・ペンブローク
ウェルシュ・コーギー・カーディガン
オールド・イングリッシュ・シープドッグ
ビアデッド・コリー
ベルジアン・シェパード・ドッグ
ベルジアン・マリノア
ベルジアン・タービュレン
ベルジアン・グローネンダール
ジャーマン・シェパード・ドッグ
ホワイト・スイス・シェパード・ドッグ
ダッチ・シェパード
ブービエ・デ・フランダース
ブリアード
ボースロン
ピカルディー・シープドッグ
ポリッシュ・ローランド・シープドッグ
プーリー
プーミー
ムーディ
コモンドール
クーバース
ベルガマスコ・シェパード・ドッグ
マレンマ・シープドッグ
グレート・ピレニーズ
ピレニアン・マスティフ
チベタン・マスティフ
チベタン・テリア
チベタン・スパニエル
ラサ・アプソ
サモエド
シベリアン・ハスキー
アラスカン・マラミュート
グリーンランド・ドッグ
カナディアン・エスキモー・ドッグ
フィニッシュ・スピッツ
フィニッシュ・ラップフンド
スウェーディッシュ・ラップフンド
ノルウェジアン・エルクハウンド
ノルウェジアン・ブーフント
アイスランド・シープドッグ
キースホンド
ユーラシア
チャウチャウ
シャー・ペイ
アキタ・アメリカン
レオンベルガー
ニューファンドランド
ランドシーア
セント・バーナード
バーニーズ・マウンテン・ドッグ
グレーター・スイス・マウンテン・ドッグ
エントレブッハー・マウンテン・ドッグ
アッペンツェラー・キャトル・ドッグ
グレート・デーン
イングリッシュ・マスティフ
ブルマスティフ
ナポリタン・マスティフ
ボルドー・マスティフ
カネ・コルソ
ロットワイラー
ドーベルマン
ボクサー
ブルドッグ
アメリカン・ブルドッグ
ブル・テリア
ミニチュア・ブル・テリア
スタッフォードシャー・ブル・テリア
アメリカン・スタッフォードシャー・テリア
ドゴ・アルヘンティーノ
プレサ・カナリオ
グレーハウンド
ウィペット
サルーキ
アフガン・ハウンド
ボルゾイ
アイリッシュ・ウルフハウンド
スコティッシュ・ディアハウンド
アザワク
スルーギ
オッターハウンド
ブラック・アンド・タン・クーンハウンド
レッドボーン・クーンハウンド
ツリーイング・ウォーカー・クーンハウンド
イングリッシュ・トイ・テリア
ブービエ・デ・アルデンヌ
スキッパーキ
スウェーディッシュ・ヴァルフント
オーストラリアン・スタンピー・テイル・キャトル・ドッグ
ペルービアン・ヘアレス・ドッグ
ショロイツクインツレ
カロライナ・ドッグ
カタフーラ・レパード・ドッグ
ブラック・マウス・カー
タマスカン・ドッグ
	`
		.trim()
		.split('\n')
		.map((name) => name.trim())
		.filter(Boolean);

	const MAX_HISTORY = 500;

	let selected = $state<DogEntry | null>(null);
	let history = $state<DogEntry[]>([]);
	let loading = $state(false);
	let historyLoading = $state(true);
	let deleting = $state(false);
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
		void loadHistory();
	});

	async function loadHistory() {
		historyLoading = true;

		try {
			const response = await fetch('/api/dog-history');

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const data = await response.json();
			history = data.history ?? [];
		} catch (e) {
			console.error('履歴読み込みエラー', e);
			error =
				'Upstashから履歴を読み込めませんでした。';
		} finally {
			historyLoading = false;
		}
	}

	function searchUrl(name: string) {
		return (
			'https://ja.wikipedia.org/wiki/特別:検索?search=' +
			encodeURIComponent(name)
		);
	}

	// Wikipediaの記事・画像を取得
	async function getWiki(name: string) {
		const fallback = {
			name,
			image: '',
			wikiUrl: searchUrl(name),
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
				'https://ja.wikipedia.org/w/api.php?' +
					params.toString()
			);

			if (!response.ok) return fallback;

			const data = await response.json();
			const page = data?.query?.pages?.[0];

			if (
				!page ||
				page.missing === true ||
				page.pageid == null
			) {
				return fallback;
			}

			return {
				name,
				image: page.thumbnail?.source ?? '',
				wikiUrl: page.fullurl ?? fallback.wikiUrl,
				articleFound: true
			};
		} catch (e) {
			console.error('Wikipedia取得エラー', e);
			return fallback;
		}
	}

	// おすすめ犬種をランダムで選ぶ
	async function recommend() {
		if (loading) return;

		loading = true;
		error = '';
		failedImage = false;

		const candidates = BREEDS.filter(
			(name) => name !== selected?.name
		);

		const name =
			candidates[
				Math.floor(Math.random() * candidates.length)
			];

		try {
			const info = await getWiki(name);

			const response = await fetch(
				'/api/dog-history',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(info)
				}
			);

			if (!response.ok) {
				throw new Error(
					`Upstash保存失敗: ${response.status}`
				);
			}

			const data = await response.json();
			const entry: DogEntry = data.entry;

			selected = entry;
			history = [entry, ...history].slice(
				0,
				MAX_HISTORY
			);
			showHistory = false;
		} catch (e) {
			console.error(e);
			error =
				'履歴を保存できませんでした。Upstashの設定を確認してください。';
		} finally {
			loading = false;
		}
	}

	// 履歴にある犬種を再表示
	function openHistory(item: DogEntry) {
		selected = item;
		failedImage = false;
		error = '';
		showHistory = false;
	}

	// Upstashから履歴を削除
	async function clearHistory() {
		if (deleting) return;

		if (
			!window.confirm(
				'Upstashに保存された閲覧履歴をすべて削除しますか？'
			)
		) {
			return;
		}

		deleting = true;
		error = '';

		try {
			const response = await fetch(
				'/api/dog-history',
				{ method: 'DELETE' }
			);

			if (!response.ok) {
				throw new Error(
					`削除失敗: ${response.status}`
				);
			}

			history = [];
		} catch (e) {
			console.error(e);
			error = '履歴を削除できませんでした。';
		} finally {
			deleting = false;
		}
	}

	function formatDate(value: string) {
		const date = new Date(value);

		return Number.isNaN(date.getTime())
			? value
			: date.toLocaleString('ja-JP');
	}
</script>

<svelte:head>
	<title>わんこ図鑑 | おすすめ犬種</title>
	<meta
		name="description"
		content="約200犬種からおすすめの犬を紹介。Wikipedia画像とUpstash閲覧履歴付き。"
	/>
</svelte:head>

<main class="app">
	<header>
		<div class="logo">🐾</div>
		<h1>わんこ図鑑</h1>
		<p>
			{BREEDS.length}種類の候補から、
			お気に入りのわんちゃんを見つけよう！
		</p>
	</header>

	<nav class="tabs" aria-label="画面切り替え">
		<button
			class:active={!showHistory}
			onclick={() => (showHistory = false)}
		>
			🐶 おすすめ
		</button>

		<button
			class:active={showHistory}
			onclick={() => (showHistory = true)}
		>
			📚 閲覧履歴 ({history.length})
		</button>
	</nav>

	{#if error}
		<p class="error" role="alert">
			⚠️ {error}
		</p>
	{/if}

	{#if !showHistory}
		<section class="panel center">
			<button
				class="recommend"
				onclick={recommend}
				disabled={loading}
			>
				{loading
					? '犬種を探しています…'
					: selected
						? '🎲 別の犬種を見つける'
						: '🎲 おすすめの犬種を見つける'}
			</button>

			{#if selected}
				<article class="dog-card">
					{#if selected.image && !failedImage}
						<img
							class="dog-image"
							src={selected.image}
							alt={`${selected.name}の参考画像`}
							onerror={() => (failedImage = true)}
						/>
					{:else}
						<div class="placeholder">
							🐕
						</div>
					{/if}

					<div class="dog-info">
						<span class="eyebrow">
							TODAY'S RECOMMENDATION
						</span>

						<h2>{selected.name}</h2>

						<p class="date">
							{formatDate(selected.visitedAt)}
						</p>

						{#if !selected.articleFound}
							<p class="notice">
								Wikipedia日本語版に
								同名の記事が見つかりませんでした。
								検索ページをご案内します。
							</p>
						{:else if !selected.image || failedImage}
							<p class="notice">
								画像を取得できませんでした。
								記事のリンクから確認できます。
							</p>
						{/if}

						<a
							class="wiki"
							href={selected.wikiUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{selected.articleFound
								? '📖 Wikipediaで詳しく見る ↗'
								: '🔎 Wikipediaで検索する ↗'}
						</a>
					</div>
				</article>
			{:else}
				<div class="welcome">
					<div class="welcome-icon">
						🐕 🐩 🦮
					</div>
					<h2>どんな犬に出会えるかな？</h2>
					<p>
						ボタンを押して犬種を発見しよう！
					</p>
				</div>
			{/if}
		</section>
	{:else}
		<section class="panel">
			<div class="history-header">
				<div>
					<h2>📚 閲覧履歴</h2>
					<p>
						Upstash Redisに保存された履歴
					</p>
				</div>

				{#if history.length > 0}
					<button
						class="clear"
						onclick={clearHistory}
						disabled={deleting}
					>
						{deleting
							? '削除中…'
							: '履歴を全削除'}
					</button>
				{/if}
			</div>

			{#if historyLoading}
				<div class="empty">
					<p>履歴を読み込み中…</p>
				</div>
			{:else if history.length > 0}
				<input
					class="search"
					type="search"
					placeholder="犬種名で検索"
					aria-label="履歴を犬種名で検索"
					bind:value={searchText}
				/>

				{#if filteredHistory.length > 0}
					<div class="history-list">
						{#each filteredHistory as item, i (`${item.visitedAt}-${i}`)}
							<button
								class="history-item"
								onclick={() => openHistory(item)}
							>
								{#if item.image}
									<img
										src={item.image}
										alt=""
										loading="lazy"
									/>
								{:else}
									<span class="small-placeholder">
										🐾
									</span>
								{/if}

								<span class="history-text">
									<strong>{item.name}</strong>
									<small>
										{formatDate(item.visitedAt)}
									</small>
								</span>

								<span class="arrow">›</span>
							</button>
						{/each}
					</div>
				{:else}
					<div class="empty">
						<p>該当する履歴はありません。</p>
					</div>
				{/if}
			{:else}
				<div class="empty">
					<div class="welcome-icon">📖</div>
					<h2>まだ履歴がありません</h2>
					<p>
						おすすめを表示すると、
						Upstashに記録されます。
					</p>
				</div>
			{/if}
		</section>
	{/if}

	<footer>
		<p>犬種・参考画像：Wikipedia</p>
		<p>
			閲覧履歴はUpstash Redisに保存されます。
		</p>
	</footer>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #fff9f2;
		color: #614934;
		font-family:
			'Hiragino Kaku Gothic ProN',
			'Yu Gothic',
			sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app {
		max-width: 800px;
		margin: 0 auto;
		padding: 30px 16px 45px;
	}

	header {
		text-align: center;
		margin-bottom: 26px;
	}

	.logo {
		font-size: 45px;
	}

	h1 {
		font-size: clamp(28px, 5vw, 38px);
		margin: 5px 0 10px;
		color: #67452d;
	}

	header p {
		font-size: 14px;
		color: #a08772;
		line-height: 1.8;
	}

	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: 18px;
	}

	button {
		font: inherit;
		cursor: pointer;
	}

	.tabs button {
		background: white;
		color: #896e58;
		border: 1px solid #ead8c6;
		border-radius: 14px;
		padding: 14px 8px;
		font-weight: bold;
	}

	.tabs button.active {
		background: #fff0e4;
		color: #b7633d;
		border-color: #f39d76;
	}

	.panel {
		background: white;
		padding: 28px;
		border-radius: 22px;
		box-shadow: 0 8px 28px #94714c18;
	}

	.center {
		text-align: center;
	}

	.recommend {
		background:
			linear-gradient(135deg, #ffab62, #ff8094);
		color: white;
		border: none;
		border-radius: 100px;
		padding: 17px 28px;
		font-size: 16px;
		font-weight: bold;
		box-shadow: 0 6px 18px #ff968555;
		transition: transform 0.2s;
	}

	.recommend:hover:not(:disabled) {
		transform: translateY(-3px);
	}

	.recommend:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.dog-card {
		margin-top: 30px;
		border: 1px solid #f0e5d9;
		border-radius: 22px;
		overflow: hidden;
		animation: appear 0.4s ease;
	}

	.dog-image {
		display: block;
		width: 100%;
		height: 350px;
		object-fit: contain;
		background: #fff0e1;
	}

	.placeholder {
		height: 350px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff0e1;
		font-size: 95px;
	}

	.dog-info {
		padding: 28px 18px;
	}

	.eyebrow {
		font-size: 11px;
		color: #ec9970;
		letter-spacing: 2px;
		font-weight: bold;
	}

	.dog-info h2 {
		font-size: clamp(22px, 5vw, 32px);
		margin: 12px 0;
		overflow-wrap: anywhere;
	}

	.date {
		font-size: 12px;
		color: #a18b7a;
	}

	.notice {
		color: #9c8170;
		font-size: 13px;
		line-height: 1.8;
	}

	.wiki {
		display: inline-block;
		background: #fff1e5;
		color: #b46540;
		border: 1px solid #ffc29e;
		padding: 14px 23px;
		border-radius: 30px;
		text-decoration: none;
		font-weight: bold;
		font-size: 14px;
		margin-top: 18px;
	}

	.wiki:hover {
		background: #ffe2cd;
	}

	.welcome {
		padding: 65px 15px;
		margin-top: 30px;
		background: #fffdf9;
		border: 2px dashed #f2d8bd;
		border-radius: 20px;
	}

	.welcome-icon {
		font-size: 43px;
	}

	.welcome h2 {
		font-size: 18px;
		margin-top: 20px;
	}

	.welcome p {
		color: #a38d7c;
		font-size: 13px;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 20px;
	}

	.history-header h2 {
		margin: 0 0 6px;
		font-size: 23px;
	}

	.history-header p {
		margin: 0;
		color: #9e8a79;
		font-size: 13px;
	}

	.clear {
		border: 1px solid #dca7a2;
		color: #b05350;
		background: white;
		border-radius: 11px;
		padding: 9px 12px;
		font-size: 12px;
		white-space: nowrap;
	}

	.clear:disabled {
		opacity: 0.5;
	}

	.search {
		width: 100%;
		font: inherit;
		padding: 13px;
		border: 1px solid #e9d8c8;
		border-radius: 12px;
		margin-bottom: 18px;
		outline-color: #f4ae86;
	}

	.history-list {
		display: grid;
		gap: 10px;
	}

	.history-item {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 14px;
		background: #fffdfa;
		border: 1px solid #f0e3d7;
		border-radius: 14px;
		text-align: left;
		padding: 10px;
	}

	.history-item:hover {
		background: #fff3e7;
	}

	.history-item img,
	.small-placeholder {
		width: 70px;
		height: 70px;
		object-fit: contain;
		border-radius: 10px;
		background: #fff0e1;
		flex-shrink: 0;
	}

	.small-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
	}

	.history-text {
		flex: 1;
		min-width: 0;
	}

	.history-text strong,
	.history-text small {
		display: block;
		overflow-wrap: anywhere;
	}

	.history-text small {
		font-size: 11px;
		color: #9b8575;
		margin-top: 6px;
	}

	.arrow {
		font-size: 28px;
		color: #c4a18a;
		margin-right: 6px;
	}

	.empty {
		text-align: center;
		padding: 55px 15px;
	}

	.empty h2 {
		font-size: 18px;
	}

	.empty p {
		font-size: 13px;
		color: #9c8877;
	}

	.error {
		background: #fff0ed;
		border: 1px solid #efb0a8;
		padding: 13px;
		border-radius: 12px;
		color: #af4545;
		font-size: 13px;
		margin-bottom: 15px;
	}

	footer {
		margin-top: 25px;
		text-align: center;
		font-size: 11px;
		color: #a99381;
		line-height: 1.5;
	}

	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 520px) {
		.panel {
			padding: 17px;
		}

		.dog-image,
		.placeholder {
			height: 250px;
		}

		.history-header {
			flex-direction: column;
		}

		.history-item img,
		.small-placeholder {
			width: 58px;
			height: 58px;
		}
	}
</style>
