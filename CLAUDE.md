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

## 開発時の注意点

- ページファイルは `src/pages/` ディレクトリに `.astro` 形式で作成
- 静的アセットは `public/` ディレクトリに配置
- TypeScriptは strict モードで設定済み
- コンポーネントは `src/components/` に配置することを推奨（現在は未作成）