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
│   │   ├── Layout.astro                # 基本レイアウト
│   │   └── MarkdownPostLayout.astro    # マークダウン投稿用レイアウト
│   └── pages/       # Astroページファイル（.astro、.md形式）
│       ├── index.astro     # ルートページ
│       ├── about.astro     # Aboutページ（Astroの動的機能を活用）
│       └── posts/          # ブログ投稿（マークダウン）
│           └── first-development-journey.md
├── astro.config.mjs # Astro設定ファイル
├── tsconfig.json    # TypeScript設定（astro/tsconfigs/strictを継承）
└── package.json     # プロジェクト依存関係
```

## 技術スタック

- **フレームワーク**: Astro 5.10.1
- **言語**: TypeScript（strictモード）
- **ページルーティング**: ファイルベースルーティング（src/pages/）
- **コンテンツ管理**: Markdown + フロントマター（ブログ投稿用）

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

### 開発ワークフロー
1. **作業開始前**: 必ず新しいブランチを作成
   ```bash
   git checkout -b feature/新機能名
   ```
2. **開発・テスト**: ブランチ上で開発とビルド確認
3. **プルリク前のリベース**: mainの最新状態に合わせる
   ```bash
   git pull --rebase origin main
   ```
4. **プッシュとPR作成**: GitHubにプッシュしてPull Request作成
   ```bash
   git push -u origin feature/新機能名
   ```

### 重要な注意事項
- **直接mainブランチでの作業禁止**: 必ずブランチを切る
- **ビルド確認必須**: `npm run build` でエラーがないことを確認
- **自動デプロイ**: mainへのマージで本番サイトに即座に反映

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

## Astroの動的機能活用

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

## 開発時の注意点

- **Astroページ**: `src/pages/` ディレクトリに `.astro` 形式で作成
- **ブログ投稿**: `src/pages/posts/` ディレクトリに `.md` 形式で作成
- **レイアウト**: `src/layouts/` ディレクトリにレイアウトコンポーネントを配置
- **静的アセット**: `public/` ディレクトリに配置
- **TypeScript**: strict モードで設定済み
- **コンポーネント**: `src/components/` に配置することを推奨（現在は未作成）
- **動的機能**: フロントマターでのJavaScript活用を積極的に行う