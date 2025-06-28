---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'GitHub Actions ワークフロー最適化：冗長なコードを削ぎ落とす'
pubDate: 2025-06-28T15:00:00
description: 'PR制御ボットのワークフローを43行から19行に最適化した実践記録'
author: 'jun-kb'
tags: ["GitHub Actions", "DevOps", "自動化", "最適化", "ワークフロー"]
---

# ワークフロー最適化記録

今回は、前回作成したPR制御ボットのGitHub Actionsワークフローを最適化し、43行から19行まで短縮した過程をまとめます。

## 最適化前の課題

元のワークフローには以下の冗長な部分がありました：

```yaml
# 不要な環境変数の定義
env:
  COMMENT_BODY: ${{ github.event.comment.body }}
  COMMENT_USER: ${{ github.event.comment.user.login }}
  ALLOWED_USER: jun-kb
  PR_URL: ${{ github.event.issue.pull_request.url }}

# デバッグ用のecho文
echo "コメントユーザー: $COMMENT_USER"
echo "コメント内容: $COMMENT_BODY"

# 冗長なユーザーチェック
if [ "$COMMENT_USER" != "$ALLOWED_USER" ]; then
  echo "許可されていないユーザーです。終了。"
  exit 0
fi
```

## 最適化のポイント

### 1. 条件の前倒し

ユーザーチェックをジョブレベルの`if`条件に移動：

```yaml
# Before
if: github.event.issue.pull_request != null

# After  
if: github.event.issue.pull_request && github.event.comment.user.login == 'jun-kb'
```

### 2. 環境変数の削除

直接GitHubコンテキストを参照することで環境変数を削除：

```yaml
# Before
env:
  PR_URL: ${{ github.event.issue.pull_request.url }}
run: gh pr review "$PR_URL" --approve

# After
run: gh pr review "${{ github.event.issue.pull_request.url }}" --approve
```

### 3. 不要な処理の削除

- デバッグ用のecho文
- step名の省略
- 無駄なelse文の削除

## 最適化後のワークフロー

```yaml
name: PR Control Bot

on:
  issue_comment:
    types: [created]

jobs:
  control-pr:
    if: github.event.issue.pull_request && github.event.comment.user.login == 'jun-kb'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: write
    steps:
      - run: |
          if [[ "${{ github.event.comment.body }}" == *"/approve"* ]]; then
            gh pr review "${{ github.event.issue.pull_request.url }}" --approve
            gh pr merge "${{ github.event.issue.pull_request.url }}" --squash --delete-branch
          elif [[ "${{ github.event.comment.body }}" == *"/reject"* ]]; then
            gh pr close "${{ github.event.issue.pull_request.url }}"
          fi
```

## 最適化の成果

- **行数**: 43行 → 19行（55%削減）
- **可読性**: 必要な処理のみに集約
- **保守性**: シンプルな構造で理解しやすい
- **性能**: 不要な処理を削減

## 学んだこと

### GitHub Actionsの効率的な書き方

1. **条件の適切な配置**: ジョブレベルでの条件分岐を活用
2. **コンテキストの直接利用**: 環境変数を経由しない
3. **必要最小限の実装**: デバッグ用コードは本番では削除

### 最適化のアプローチ

1. **現状分析**: 何が冗長かを特定
2. **段階的改善**: 一度に全部変えずに部分的に最適化
3. **動作確認**: 最適化後も期待通りに動作することを確認

## 次のステップ

今回の最適化により、ワークフローはより簡潔で理解しやすくなりました。次は以下を検討しています：

- 他のワークフローの最適化
- エラーハンドリングの追加
- 通知機能の拡張

## まとめ

コードの最適化は、単に行数を減らすだけでなく、可読性と保守性の向上にも繋がります。GitHub Actionsにおいても、必要最小限の実装を心がけることで、より効率的なワークフローを構築できることを実感しました。

継続的な改善を通じて、より良い開発環境を構築していきたいと思います。