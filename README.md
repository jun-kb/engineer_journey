# Engineer Journey: An AI-Powered Blog

このリポジトリは、**Claude Code**（Anthropic社のAI開発ツール）を使用して開発・運用されているブログプロジェクトです。設計からコーディング、記事執筆、デプロイまで、多くの作業をAIアシスタントが担当しています。

## 🤖 このプロジェクトについて

このブログは、「AI開発ツールを使って実際にどこまで効率的に開発できるか」を検証するための実験的プロジェクトです。人間が高レベルな指示を与え、Claude CodeのAIアシスタントが具体的な実装を担当する協働開発を実践しています。

### 主な特徴

- **Claude Codeによる効率開発**: Anthropic社のClaude CodeとClaude AIを使用して、機能実装、UI改善、記事作成を行っています。
- **人間とAIの協業**: 人間が「こんな機能が欲しい」「この記事を書いて」といった指示を与え、AIが具体的な実装とコード生成を担当します。
- **開発プロセスの一部公開**: 主要な開発体験や学習プロセスをブログ記事として記録・公開しています。

## 🚀 技術スタック

- **フレームワーク**: [Astro](https://astro.build/) 5.10.1
- **言語**: TypeScript (strict), Markdown
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/) 3.4.17
- **AI開発ツール**: [Claude Code](https://claude.ai/code) by Anthropic
- **AIアシスタント**: Claude (Anthropic)
- **CI/CD**: GitHub Actions (PR制御ワークフロー)
- **デプロイ**: Cloudflare Pages

## 🧞 コマンド

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存関係をインストールします                            |
| `npm run dev`             | 開発サーバーを `localhost:4321` で起動します      |
| `npm run build`           | プロダクション用にサイトを `./dist/` にビルドします          |
| `npm run preview`         | ビルドをローカルでプレビューします     |

## 🛠️ 開発環境

このプロジェクトは **Claude Code** を使用して開発されています：

- **Claude Code**: Anthropic社が提供するAI駆動開発ツール
- **特徴**: 自然言語での指示から直接コード生成・編集が可能
- **ワークフロー**: プロンプト → AI実装 → 人間レビュー → デプロイ

## 🌐 ライブサイト

実際のブログサイトをご覧ください：
**https://engineer-journey.pages.dev/**

## 📝 開発記録

主要な開発プロセスはブログ記事として公開しています：

1. **[Engineer Journey ブログサイト開発記録](/posts/first-development-journey)** - 初期開発プロセスとAstro・Tailwind導入
2. **[Astroの動的機能でAboutページを進化させた話](/posts/astro-dynamic-features)** - 動的機能を活用したページ改善
3. **[GitHub Actions ワークフロー最適化：冗長なコードを削ぎ落とす](/posts/github-actions-workflow-optimization)** - PR制御ワークフローの最適化記録
4. **[GitHub Actions デバッグ記録：権限エラーから完全動作まで](/posts/github-actions-debugging-journey)** - 5つのエラーを解決した実践的デバッグガイド

## 🔧 自動化機能

### GitHub Actions PR制御
- **コメント制御**: PRに `/approve` または `/reject` コメントで自動制御
- **自動承認・マージ**: `/approve` でPRを承認し、squash mergeでブランチ削除  
- **自動却下**: `/reject` でPRをクローズ
- **権限制限**: 指定ユーザーのみ操作可能

## 👀 もっと知りたい方へ

Claude Codeを使った実際の開発体験や、AI協働開発の可能性について詳しく知りたい方は、ぜひブログをご覧ください。