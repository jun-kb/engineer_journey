# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは「engineer_journey」という名前のブログサイトで、Astroフレームワークを使用して構築されています。Astroの最小構成テンプレートをベースにしており、エンジニアの学習や開発の記録を目的としたサイトです。

## 開発コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（localhost:4321） |
| `npm run build` | 本番用ビルドを実行（./dist/に出力） |
| `npm run preview` | ビルド後のサイトをローカルでプレビュー |
| `npm run astro` | Astro CLIコマンドを実行 |

## プロジェクト構造

```
/
├── public/           # 静的アセット（画像、favicon等）
├── src/
│   ├── components/  # 再利用可能なAstroコンポーネント
│   │   ├── Navigation.astro            # ナビゲーションコンポーネント
│   │   ├── Footer.astro                # フッターコンポーネント
│   │   └── CalendarComponent.astro     # 投稿カレンダーコンポーネント
│   ├── layouts/     # レイアウトコンポーネント
│   │   ├── Layout.astro                # 基本レイアウト（Navigation/Footer統合済み）
│   │   └── MarkdownPostLayout.astro    # マークダウン投稿用レイアウト
│   ├── utils/       # ユーティリティ関数
│   │   └── CalendarUtils.js            # カレンダーデータ処理関数
│   └── pages/       # Astroページファイル（.astro、.md形式）
│       ├── index.astro     # ルートページ
│       ├── about.astro     # Aboutページ（Astroの動的機能を活用）
│       ├── calendar.astro  # 投稿カレンダーページ
│       └── posts/          # ブログ投稿（マークダウン）
│           ├── first-development-journey.md            # 初回開発記録
│           ├── astro-dynamic-features.md               # Astro動的機能記録
│           ├── github-actions-workflow-optimization.md # GitHub Actions最適化記録
│           ├── github-actions-debugging-journey.md     # GitHub Actionsデバッグ記録
│           ├── minimal-design-philosophy.md            # ミニマルデザイン刷新記録
│           └── mobile-responsive-design-implementation.md # スマホ対応実装記録
├── .github/
│   └── workflows/    # GitHub Actions ワークフロー
│       └── pr_control.yaml         # PR制御ボット（コメントでの承認・却下）
├── astro.config.mjs # Astro設定ファイル
├── tsconfig.json    # TypeScript設定（astro/tsconfigs/strictを継承）
└── package.json     # プロジェクト依存関係
```

## 技術スタック

- **フレームワーク**: Astro 5.10.1
- **言語**: TypeScript（strictモード）
- **ページルーティング**: ファイルベースルーティング（src/pages/）
- **コンテンツ管理**: Markdown + フロントマター（ブログ投稿用）
- **コンポーネント**: Astroコンポーネント（Navigation, Footer等の再利用可能UI）
- **スタイリング**: プレーンHTML/CSS（ミニマルデザイン）

## デザインシステム（ミニマル設計）

### コンテンツファースト設計思想

このサイトは「読者が記事に集中できる」ことを最優先に設計されています：

#### カラーパレット
```css
:root {
  --color-black: #000000;      /* メインテキスト、見出し */
  --color-white: #ffffff;      /* 背景色 */
  --color-gray-50: #fafafa;    /* コードブロック背景 */
  --color-gray-100: #f5f5f5;   /* ボタン背景 */
  --color-gray-200: #e5e5e5;   /* 境界線、区切り線 */
  --color-gray-400: #a3a3a3;   /* 未使用 */
  --color-gray-600: #525252;   /* 補助テキスト、メタ情報 */
  --color-gray-900: #171717;   /* 本文テキスト */
}
```

#### タイポグラフィ
- **基本フォントサイズ**: フルードタイポグラフィ（`clamp(16px, 4vw, 18px)`）で可変
- **行間**: 1.7（快適な読書リズム）
- **フォントファミリー**: システムフォント（-apple-system, BlinkMacSystemFont等）
- **見出し階層**: 
  - **デスクトップ**: h1(2.25rem) → h2(1.875rem) → h3(1.5rem) → h4(1.25rem) → h5(1.125rem) → h6(1rem)
  - **モバイル**: h1(1.75rem) → h2(1.5rem) → h3(1.25rem) → h4(1.125rem) → h5(1rem) → h6(0.875rem)

#### レイアウト制約
- **読書幅**: `min(65ch, 100vw - 2rem)`（理想的な文字幅制限 + レスポンシブ対応）
- **広幅コンテンツ**: `min(80ch, 100vw - 2rem)`（ナビゲーション、フッター用）
- **余白**: 
  - **デスクトップ**: 1rem, 1.5rem, 2rem, 3rem 単位
  - **モバイル**: コンテナ内側1.5rem、ブレークポイント768px

#### ミニマル原則
1. **装飾の削除**: SVGアイコン、影、グラデーション、背景色を排除
2. **機能的UI**: 必要最小限の視覚的手がかりのみ
3. **タイポグラフィ中心**: フォント階層と余白で情報構造を表現
4. **直感的ナビゲーション**: シンプルで迷わない導線設計

### コンポーネント設計指針

#### Navigation.astro
- テキストのみ、アイコンなし
- アクティブ状態は下線（::after疑似要素）で表現
- ホバー時の色変化のみ

#### Footer.astro  
- 最小限の情報（著作権とAstroリンクのみ）
- 中央揃え、シンプルな境界線

#### MarkdownPostLayout.astro
- 記事幅65ch制限で最適な読書体験
- メタ情報（日付、読了時間、タグ）を控えめに配置
- 記事末尾にホームへ戻るリンク（読了後の自然な導線）

#### Layout.astro（グローバルスタイル）
- CSS変数による色彩管理
- 全要素のリセット（box-sizing, margin, padding）
- レスポンシブ対応のコンテナクラス

## デプロイメント

- **本番サイト**: https://engineer-journey.pages.dev/
- **デプロイ先**: Cloudflare Pages
- **GitHubリポジトリ**: https://github.com/jun-kb/engineer_journey（プライベート）
- **自動デプロイ**: GitHubへのプッシュで自動的にCloudflare Pagesにデプロイ

## Git運用ルール

### ブランチ戦略
- **メインブランチ**: `main` - 安定版のコード（本番環境に自動デプロイ）
- **開発ブランチ**: 機能追加・修正時は必ずブランチを作成
- **ブランチ命名規則**:
  - `feature/機能名` - 新機能追加
  - `fix/修正内容` - バグ修正  
  - `update/更新内容` - 既存機能の改善

### 開発ワークフロー（厳守）
**⚠️ 重要: 以下の手順を必ず順番通りに実行すること**

1. **mainブランチを最新状態に更新**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **mainから新しいブランチを作成**
   ```bash
   git checkout -b feature/新機能名
   ```

3. **開発・テスト**: ブランチ上で開発とビルド確認
   ```bash
   npm run build  # ビルドエラーがないことを確認
   ```

4. **プッシュ前のリベース**: mainの最新状態に合わせる
   ```bash
   git pull --rebase origin main
   ```

5. **プッシュとPR作成**: GitHubにプッシュしてPull Request作成
   ```bash
   git push -u origin feature/新機能名
   # またはリベース後は
   git push --force-with-lease origin feature/新機能名
   ```

### 重要な注意事項
- **mainブランチから作業開始**: 作業前に必ずmainを最新にしてからブランチを作成
- **リベース必須**: プッシュ前に必ず `git pull --rebase origin main` を実行
- **直接mainブランチでの作業禁止**: 必ずブランチを切る
- **ビルド確認必須**: `npm run build` でエラーがないことを確認
- **自動デプロイ**: mainへのマージで本番サイトに即座に反映

### 🚫 やってはいけないパターン
- mainを最新にせずにブランチを作成する
- 他のブランチから新しいブランチを作成する
- プッシュ前にリベースを行わない
- ビルド確認をせずにプッシュする

## ブログ機能（マークダウン投稿）

### 投稿の作成方法

1. **新しい投稿ファイル作成**: `src/pages/posts/投稿名.md` 形式で作成
2. **フロントマターの設定**: 各投稿の冒頭に以下の形式でメタデータを記述

```markdown
---
layout: ../../layouts/MarkdownPostLayout.astro
title: '投稿タイトル'
pubDate: YYYY-MM-DDTHH:MM:SS
description: '投稿の説明文'
author: '著者名'
tags: ["tag1", "tag2", "tag3"]
---

# 投稿内容をここに記述
```

### 投稿の特徴

- **自動URL生成**: ファイル名が自動的にURLになる（例：`post-name.md` → `/posts/post-name`）
- **専用レイアウト**: `MarkdownPostLayout.astro`で統一されたデザイン
- **メタデータ表示**: タイトル、公開日、著者、タグなどの自動表示
- **SEO対応**: フロントマターによる適切なメタデータ設定
- **正確なソート**: pubDateにISO 8601形式（YYYY-MM-DDTHH:MM:SS）を使用してトップページで正確な時系列表示

### 既存の投稿（最新順）

- **スマホ対応改善**: `/posts/mobile-responsive-design-implementation` - レスポンシブWebデザインの実践、フルードタイポグラフィと768px単一ブレークポイント設計
- **ミニマルデザイン刷新**: `/posts/minimal-design-philosophy` - コンテンツファースト設計の実装、SVGアイコン削除と65ch幅制限
- **GitHub Actionsデバッグ**: `/posts/github-actions-debugging-journey` - 5つのエラーを解決した実践的デバッグ記録
- **GitHub Actions最適化**: `/posts/github-actions-workflow-optimization` - PR制御ワークフローの最適化プロセス記録
- **Astro動的機能**: `/posts/astro-dynamic-features` - Astroの動的機能を活用したAboutページ改善記録
- **開発記録**: `/posts/first-development-journey` - プロジェクトの開発プロセスをまとめた最初の投稿

## Astroの動的機能活用

### トップページの動的ブログリスト機能

`src/pages/index.astro` では以下の動的機能を実装：

- **自動投稿取得**: `import.meta.glob()` を使用してブログ投稿を自動取得
- **日付ソート**: 公開日による降順ソート（最新投稿が上位表示）
- **動的リスト表示**: 投稿の追加で自動的にトップページに反映
- **メタデータ表示**: タイトル、説明、公開日、タグの自動表示

#### 実装パターン
```astro
---
// すべてのブログ投稿を取得
const posts = import.meta.glob('./posts/*.md', { eager: true });
const allPosts = Object.values(posts);

// 公開日で降順ソート（最新が上位）
const sortedPosts = allPosts.sort((a, b) => {
  return new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime();
});
---

<!-- 動的投稿リスト -->
{sortedPosts.map((post) => (
  <article>
    <h3><a href={post.url}>{post.frontmatter.title}</a></h3>
    <p>{post.frontmatter.description}</p>
    <!-- タグ表示 -->
    {post.frontmatter.tags.map((tag) => (
      <span>{tag}</span>
    ))}
  </article>
))}
```

### Aboutページの実装例
`src/pages/about.astro` では以下のAstroの動的機能を活用：

- **フロントマター変数**: JavaScript変数（identity、skills、learningGoals等）を定義
- **変数埋め込み**: `{変数名}` による動的コンテンツ表示
- **条件分岐**: `{条件 && <要素>}` による条件付きレンダリング
- **動的リスト**: `.map()` メソッドによる配列要素の自動生成

### 実装パターン
```astro
---
// フロントマターでJavaScript変数を定義
const skills = ["JavaScript", "React", "Astro"];
const isLearning = true;
---

<!-- 変数埋め込み -->
<h1>{pageTitle}</h1>

<!-- 条件分岐 -->
{isLearning && <p>🌱 現在学習中です</p>}

<!-- 動的リスト -->
<ul>
  {skills.map((skill) => <li>{skill}</li>)}
</ul>
```

### コンポーネント機能の活用

Astroのコンポーネント機能を活用して、再利用可能なUI要素を作成：

#### Navigationコンポーネント
`src/components/Navigation.astro` では以下の機能を実装：

- **アクティブ状態表示**: 現在のページに応じたナビゲーション項目のハイライト
- **プロパティ受け渡し**: `currentPath` プロパティによる動的状態制御
- **レスポンシブデザイン**: モバイル対応のナビゲーション
- **SVGアイコン**: 各項目のアイコン表示

```astro
---
interface Props {
	currentPath?: string;
}
const { currentPath } = Astro.props;
---

<nav>
	<a href="/" class={currentPath === '/' ? 'active' : ''}>
		ホーム
	</a>
	<a href="/about" class={currentPath === '/about' ? 'active' : ''}>
		このサイトについて
	</a>
</nav>
```

#### Footerコンポーネント
`src/components/Footer.astro` では以下の機能を実装：

- **動的年表示**: `new Date().getFullYear()` による自動年更新
- **グリッドレイアウト**: レスポンシブな3カラム構成
- **外部リンク**: 技術スタック関連の外部サイトへのリンク
- **統一されたスタイリング**: サイト全体の一貫したデザイン

#### Layout.astroでの統合
基本レイアウトにコンポーネントを統合し、全ページで共通のヘッダー・フッターを実現：

```astro
---
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';

interface Props {
	title: string;
	currentPath?: string;
}
const { title, currentPath } = Astro.props;
---

<body>
	<Navigation currentPath={currentPath} />
	<slot />
	<Footer />
</body>
```

#### コンポーネント使用時の利点
- **一元管理**: ナビゲーション・フッターの変更が全ページに自動反映
- **保守性向上**: コードの重複を排除し、メンテナンスを簡素化
- **統一性**: 全ページで一貫したデザインを保証
- **プロパティ制御**: 動的な表示制御により柔軟なUI実現

## 開発時の注意点

### 基本ルール
- **Astroページ**: `src/pages/` ディレクトリに `.astro` 形式で作成
- **ブログ投稿**: `src/pages/posts/` ディレクトリに `.md` 形式で作成
- **レイアウト**: `src/layouts/` ディレクトリにレイアウトコンポーネントを配置
- **静的アセット**: `public/` ディレクトリに配置
- **TypeScript**: strict モードで設定済み
- **コンポーネント**: `src/components/` に再利用可能なAstroコンポーネントを配置
- **動的機能**: フロントマターでのJavaScript活用を積極的に行う

### ミニマルデザイン実装ガイドライン

#### 🚫 使用禁止要素
- **SVGアイコン**: テキストのみで表現すること
- **影・グラデーション**: `box-shadow`, `background: linear-gradient()` 等は使用しない
- **背景色**: 白以外の背景色は基本的に使用しない（コードブロック等例外あり）
- **複雑なレイアウト**: Grid/Flexboxは最小限に留める

#### ✅ 推奨実装パターン
- **コンテナクラス**: 必ず `.container` (65ch) または `.container-wide` (80ch) を使用
- **色彩**: CSS変数 `var(--color-*)` のみ使用
- **余白**: 1rem, 1.5rem, 2rem, 3rem の一貫した単位
- **フォント**: システムフォントスタックを維持
- **ホバー効果**: 色変化と underline thickness のみ

#### 🎯 コンポーネント別指針
```astro
<!-- ❌ 悪い例: アイコン付きナビゲーション -->
<nav>
  <a href="/"><svg>...</svg> ホーム</a>
</nav>

<!-- ✅ 良い例: テキストのみナビゲーション -->
<nav>
  <a href="/" class={currentPath === '/' ? 'active' : ''}>ホーム</a>
</nav>

<!-- ❌ 悪い例: 装飾的なカード -->
<article class="card shadow-lg bg-gradient">
  <div class="badge primary">
    <svg>...</svg> タグ
  </div>
</article>

<!-- ✅ 良い例: ミニマルな記事レイアウト -->
<article>
  <div class="tags">
    <span class="tag">#タグ</span>
  </div>
</article>
```

#### 📏 レイアウト制約
- **記事コンテンツ**: 最大65ch幅で読書最適化
- **ナビゲーション・フッター**: 最大80ch幅
- **行間**: 本文1.7、見出し1.3を基準
- **余白の積み重ね**: margin-bottom で垂直リズム作成

## GitHub Actions ワークフロー

### PR制御ボット

`.github/workflows/pr_control.yaml` にて、コメント制御によるPR管理を自動化：

#### 機能
- **コメント制御**: PRに `/approve` または `/reject` コメントで自動制御
- **ユーザー制限**: `jun-kb` ユーザーのみ操作可能
- **自動承認・マージ**: `/approve` でPRを承認し、squash mergeでブランチ削除
- **自動却下**: `/reject` でPRをクローズ

#### 使用方法
```bash
# PR承認・マージ
/approve

# PR却下
/reject
```

#### ワークフロー構成
- **トリガー**: `issue_comment` イベント（PRコメント作成時）
- **条件**: PRへのコメント かつ 許可ユーザー
- **権限**: `pull-requests: write`, `contents: write`
- **認証**: `GH_TOKEN: ${{ github.token }}`

### 最適化の歴史
- **初期版**: 43行（環境変数、デバッグecho、冗長なチェック）
- **最適化版**: 19行（条件の前倒し、直接参照、最小限の実装）
- **修正版**: 認証トークン追加（GH_TOKEN環境変数）

## 投稿カレンダー機能

### 概要
GitHub風のcontribution graphライクな投稿頻度可視化機能。`/calendar`ページで投稿の継続性と頻度を視覚的に確認できます。

### 機能構成
- **CalendarComponent.astro**: カレンダー表示コンポーネント
- **CalendarUtils.js**: データ処理ユーティリティ関数
- **calendar.astro**: 投稿カレンダーページ

### 主要機能
- **投稿頻度の可視化**: 日別投稿数を色の濃淡で表示
- **統計情報**: 総投稿数、投稿日数の表示
- **最近の投稿一覧**: 直近投稿の日付別グループ化表示
- **レスポンシブ対応**: デスクトップ・モバイル両対応

### 技術仕様
- **データ取得**: `import.meta.glob()` で全投稿を自動取得
- **日付処理**: ISO 8601形式（YYYY-MM-DDTHH:MM:SS）対応
- **色彩設計**: ミニマルデザインに準拠したモノクロ濃淡表現
- **表示形式**: 現在月のカレンダー表示（GitHub風UI）