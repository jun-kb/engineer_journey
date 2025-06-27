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
│   └── pages/       # Astroページファイル（.astro形式）
│       └── index.astro  # ルートページ
├── astro.config.mjs # Astro設定ファイル
├── tsconfig.json    # TypeScript設定（astro/tsconfigs/strictを継承）
└── package.json     # プロジェクト依存関係
```

## 技術スタック

- **フレームワーク**: Astro 5.10.1
- **言語**: TypeScript（strictモード）
- **ページルーティング**: ファイルベースルーティング（src/pages/）

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

## 開発時の注意点

- ページファイルは `src/pages/` ディレクトリに `.astro` 形式で作成
- 静的アセットは `public/` ディレクトリに配置
- TypeScriptは strict モードで設定済み
- コンポーネントは `src/components/` に配置することを推奨（現在は未作成）