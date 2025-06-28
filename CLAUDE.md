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
│   ├── layouts/     # レイアウトコンポーネント
│   │   ├── Layout.astro                # 基本レイアウト（Tailwind CSS適用済み）
│   │   └── MarkdownPostLayout.astro    # マークダウン投稿用レイアウト（Tailwind CSS適用済み）
│   └── pages/       # Astroページファイル（.astro、.md形式）
│       ├── index.astro     # ルートページ（Tailwind CSS適用済み）
│       ├── about.astro     # Aboutページ（Astroの動的機能を活用）
│       └── posts/          # ブログ投稿（マークダウン）
│           ├── first-development-journey.md            # 初回開発記録
│           ├── astro-dynamic-features.md               # Astro動的機能記録
│           ├── github-actions-workflow-optimization.md # GitHub Actions最適化記録
│           └── github-actions-debugging-journey.md     # GitHub Actionsデバッグ記録
├── .github/
│   └── workflows/    # GitHub Actions ワークフロー
│       └── pr_control.yaml         # PR制御ボット（コメントでの承認・却下）
├── astro.config.mjs # Astro設定ファイル（Tailwind統合設定済み）
├── tailwind.config.js # Tailwind CSS設定ファイル
├── tsconfig.json    # TypeScript設定（astro/tsconfigs/strictを継承）
└── package.json     # プロジェクト依存関係
```

## 技術スタック

- **フレームワーク**: Astro 5.10.1
- **言語**: TypeScript（strictモード）
- **ページルーティング**: ファイルベースルーティング（src/pages/）
- **コンテンツ管理**: Markdown + フロントマター（ブログ投稿用）
- **スタイリング**: Tailwind CSS 3.4.17（Astro統合）

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
pubDate: YYYY-MM-DD
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

### 既存の投稿

- **開発記録**: `/posts/first-development-journey` - プロジェクトの開発プロセスをまとめた最初の投稿
- **Astro動的機能**: `/posts/astro-dynamic-features` - Astroの動的機能を活用したAboutページ改善記録
- **GitHub Actions最適化**: `/posts/github-actions-workflow-optimization` - PR制御ワークフローの最適化プロセス記録
- **GitHub Actionsデバッグ**: `/posts/github-actions-debugging-journey` - 5つのエラーを解決した実践的デバッグ記録

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
      <span class="tag">{tag}</span>
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

## Tailwind CSS統合

### 設定概要
- **統合パッケージ**: `@astrojs/tailwind` 6.0.2
- **Tailwind CSS**: `tailwindcss` 3.4.17
- **設定ファイル**: `tailwind.config.js`（コンテンツパス設定済み）
- **Astro統合**: `astro.config.mjs`に統合設定済み

### デザインシステム
- **カラーパレット**: 青・紫のグラデーション、グレースケール
- **タイポグラフィ**: レスポンシブテキストサイズ、適切な行間
- **レイアウト**: モバイルファーストのレスポンシブデザイン
- **コンポーネント**: カード型レイアウト、ホバーエフェクト、SVGアイコン

### スタイル適用状況
- **基本レイアウト**: `Layout.astro` - ベースタイポグラフィとカラー
- **トップページ**: `index.astro` - グラデーションヘッダー、カード型ブログリスト
- **投稿ページ**: `MarkdownPostLayout.astro` - アイコン付きメタデータ、プロース対応
- **レスポンシブ**: 全ページでモバイル・タブレット・デスクトップ対応

## 開発時の注意点

- **Astroページ**: `src/pages/` ディレクトリに `.astro` 形式で作成
- **ブログ投稿**: `src/pages/posts/` ディレクトリに `.md` 形式で作成
- **レイアウト**: `src/layouts/` ディレクトリにレイアウトコンポーネントを配置
- **静的アセット**: `public/` ディレクトリに配置
- **TypeScript**: strict モードで設定済み
- **コンポーネント**: `src/components/` に配置することを推奨（現在は未作成）
- **動的機能**: フロントマターでのJavaScript活用を積極的に行う
- **スタイリング**: Tailwind CSSクラスを使用（カスタムCSSは最小限に）

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