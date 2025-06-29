# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astroフレームワークを使用したブログサイト。エンジニアの学習や開発の記録を目的とし、ミニマルデザインとコンテンツファーストの設計思想を採用。

## 開発コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（localhost:4321） |
| `npm run build` | 本番用ビルドを実行（./dist/に出力） |
| `npm run preview` | ビルド後のサイトをローカルでプレビュー |
| `npm test` | 単体テストを実行（vitest） |
| `npm run test:ui` | UIモードでテストを実行 |
| `npm run test:coverage` | カバレッジ付きでテストを実行 |

## プロジェクト構造

```
src/
├── components/    # 再利用可能なAstroコンポーネント
├── layouts/       # レイアウトコンポーネント
├── utils/         # ユーティリティ関数（*.test.ts含む）
└── pages/         # ページファイル（.astro、.md）
    ├── index.astro      # ルートページ
    ├── about.astro      # Aboutページ
    ├── calendar.astro   # 投稿カレンダーページ
    └── posts/           # ブログ投稿（.md）
```

## 技術スタック

- **フレームワーク**: Astro 5.10.1
- **言語**: TypeScript（strict）
- **テスト**: Vitest + jsdom
- **スタイリング**: プレーンHTML/CSS（ミニマルデザイン）
- **デプロイ**: Cloudflare Pages（自動デプロイ）

## 開発ルール

### 基本原則
- **ミニマルデザイン**: 装飾を排除し、コンテンツを最優先
- **TypeScript strict**: 型安全性を重視
- **テスト駆動**: 新機能には単体テストを追加
- **コンテンツファースト**: 読書体験を最適化

### ファイル配置
- **ページ**: `src/pages/` に `.astro` または `.md`
- **コンポーネント**: `src/components/` に `.astro`
- **ユーティリティ**: `src/utils/` に `.ts` と `.test.ts`
- **静的アセット**: `public/` に配置

### デザイン制約
- **色彩**: 黒・白・グレーのみ（SVGアイコン禁止）
- **幅制限**: 記事65ch、ナビ80ch
- **タイポグラフィ**: システムフォント、明確な階層

## Git運用ルール

### ブランチ戦略
- **main**: 本番環境（自動デプロイ）
- **feature/**: 新機能
- **fix/**: バグ修正
- **update/**: 既存機能改善

### 必須手順
1. mainから新ブランチ作成
2. 開発・テスト実行
3. `git pull --rebase origin main`
4. プッシュ・PR作成（issueから開始の場合は`Closes #XX`必須）
5. `/approve` でマージ

### 重要事項
- **mainブランチから作業開始**: 必ずmainを最新にしてからブランチ作成
- **ビルド確認必須**: `npm run build` でエラーがないことを確認
- **テスト実行**: 新機能には `npm test` で動作確認
- **issueリンク**: issueから開始した作業は必ずPR本文に`Closes #XX`を記載

## ブログ投稿

### 新規投稿作成
1. `src/pages/posts/投稿名.md` を作成
2. フロントマター設定（layout, title, pubDate, description, author, tags）
3. 本文をMarkdownで記述

### フロントマター例
```markdown
---
layout: ../../layouts/MarkdownPostLayout.astro
title: '投稿タイトル'
pubDate: YYYY-MM-DDTHH:MM:SS
description: '投稿の説明文'
author: '著者名'
tags: ["tag1", "tag2"]
---
```

## 投稿カレンダー

- **CalendarUtils.ts**: データ処理（型安全、エラーハンドリング）
- **CalendarComponent.astro**: UI表示
- **単体テスト**: 22テストケースで品質保証