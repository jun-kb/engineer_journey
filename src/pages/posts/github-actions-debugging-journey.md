---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'GitHub Actions デバッグ記録：権限エラーから完全動作まで'
pubDate: 2025-06-28
description: 'PR制御ワークフローが動かない原因を特定し、段階的に修正して完全動作させるまでの実践記録'
author: 'jun-kb'
tags: ["GitHub Actions", "デバッグ", "トラブルシューティング", "CI/CD", "権限"]
---

# GitHub Actions デバッグ記録：権限エラーから完全動作まで

前回最適化したPR制御ワークフローが実際に動かず、数々のエラーと格闘した実践的なデバッグ記録です。

## 問題の発覚

3つ目の記事をPRで公開し、`/approve` コメントでワークフローをテストしたところ、全く動作しませんでした。

```bash
gh pr comment 11 --body "/approve"
# → ワークフロー失敗...
```

## エラー1: GitHub CLI認証不足

### 症状
```
gh: To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN environment variable.
```

### 原因
GitHub CLI (`gh`コマンド) に認証トークンが設定されていない。

### 修正
```yaml
# Before（認証なし）
- run: |
    gh pr review "${{ github.event.issue.pull_request.url }}" --approve

# After（GH_TOKEN追加）
- run: |
    gh pr review "${{ github.event.issue.pull_request.url }}" --approve
  env:
    GH_TOKEN: ${{ github.token }}
```

## エラー2: Gitリポジトリ不足

### 症状
```
failed to run git: fatal: not a git repository (or any of the parent directories): .git
```

### 原因
GitHub CLI がGitコンテキストを必要とするが、リポジトリがチェックアウトされていない。

### 修正
```yaml
# Before（チェックアウトなし）
steps:
  - run: |

# After（チェックアウト追加）
steps:
  - uses: actions/checkout@v4
  - run: |
```

## エラー3: PR参照形式の誤り

### 症状
```
no pull requests found for branch "https://api.github.com/repos/jun-kb/engineer_journey/pulls/13"
```

### 原因
GitHub CLI は完全URLではなく、PR番号を期待している。

### 修正
```yaml
# Before（URL形式）
gh pr review "${{ github.event.issue.pull_request.url }}" --approve

# After（番号形式）
gh pr review ${{ github.event.issue.number }} --approve
```

## エラー4: 自己承認の権限制限

### 症状
```
failed to create review: GraphQL: GitHub Actions is not permitted to approve pull requests.
```

### 原因
GitHub Actions は自分自身でPRを承認することができない権限制限。

### 調査と解決策の発見

この時点で、専用のアクションを探すことに。`hmarr/auto-approve-action` を発見し、ドキュメントを確認：

```yaml
# 基本的な使用例
- uses: hmarr/auto-approve-action@v4
  with:
    review-message: "Auto approved automated PR"
```

### 最終修正
```yaml
# Before（権限エラー）
- run: |
    if [[ "${{ github.event.comment.body }}" == *"/approve"* ]]; then
      gh pr review ${{ github.event.issue.number }} --approve
      gh pr merge ${{ github.event.issue.number }} --squash --delete-branch
    fi

# After（専用アクション使用）
- name: Auto approve PR
  if: contains(github.event.comment.body, '/approve')
  uses: hmarr/auto-approve-action@v4
  with:
    review-message: "Auto approved via /approve command"
- name: Merge PR
  if: contains(github.event.comment.body, '/approve')
  run: gh pr merge ${{ github.event.issue.number }} --squash --delete-branch
  env:
    GH_TOKEN: ${{ github.token }}
```

## 完成版ワークフロー

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
      - uses: actions/checkout@v4
      - name: Auto approve PR
        if: contains(github.event.comment.body, '/approve')
        uses: hmarr/auto-approve-action@v4
        with:
          review-message: "Auto approved via /approve command"
      - name: Merge PR
        if: contains(github.event.comment.body, '/approve')
        run: gh pr merge ${{ github.event.issue.number }} --squash --delete-branch
        env:
          GH_TOKEN: ${{ github.token }}
      - name: Close PR
        if: contains(github.event.comment.body, '/reject')
        run: gh pr close ${{ github.event.issue.number }}
        env:
          GH_TOKEN: ${{ github.token }}
```

## デバッグで学んだこと

### 1. 段階的なアプローチ

一度に全ての問題を解決しようとせず、一つずつエラーを特定・修正：

1. 認証エラー → `GH_TOKEN` 追加
2. Gitリポジトリエラー → `checkout` 追加
3. PR参照エラー → URL→番号形式に変更
4. 権限エラー → 専用アクション導入

### 2. ログの重要性

```bash
gh run view 15940103455 --log-failed
```

失敗したワークフローのログを詳細に確認することで、的確な原因特定が可能。

### 3. 権限とセキュリティの理解

GitHub Actions には適切なセキュリティ制限があり、それを理解して適切な回避策を選択することが重要。

### 4. 外部アクションの活用

自分で実装するより、信頼できる専用アクションを使うことで効率的に解決。

## 検証とテスト

最終的に以下の流れでテストし、完全動作を確認：

```bash
# テスト用PRを作成
git checkout -b test/final-workflow-check
echo "# Final workflow test" > final-test.md
git add . && git commit -m "test: 最終ワークフロー動作確認"
git push -u origin test/final-workflow-check
gh pr create --title "test: 最終ワークフロー動作確認" --body "修正されたPR制御ワークフローの最終動作確認"

# ワークフローをテスト
gh pr comment 14 --body "/approve"

# 結果確認
gh run list --limit 2
# → completed success ✅
# → PR状態: Merged ✅
```

## エラー5: auto-approve-actionのイベント制限

しかし、まだ終わりではありませんでした...

### 症状
```
This action must be run using a `pull_request` event or have an explicit `pull-request-number` provided
```

### 原因
`auto-approve-action` は `pull_request` イベントを前提としており、`issue_comment` イベントでは明示的にPR番号を指定する必要がある。

### 最終修正
```yaml
# Before（PR番号未指定）
- name: Auto approve PR
  uses: hmarr/auto-approve-action@v4
  with:
    review-message: "Auto approved via /approve command"

# After（PR番号明示）
- name: Auto approve PR
  uses: hmarr/auto-approve-action@v4
  with:
    review-message: "Auto approved via /approve command"
    pull-request-number: ${{ github.event.issue.number }}
```

### 最終動作確認

この修正により、ついに完全動作を達成：

```bash
# 最終テスト
gh pr create --title "test: 修正されたワークフローの最終テスト"
gh pr comment 16 --body "/approve"

# 結果確認
gh run list --limit 2
# → completed success ✅
# → PR状態: Merged ✅
# → 実行時間: 13秒で完了 ✅
```

## 教訓と学び

### 5つのエラーから学んだこと

1. **認証**: GitHub CLI には `GH_TOKEN` が必須
2. **コンテキスト**: Git操作には `actions/checkout` が必要
3. **参照形式**: GitHub CLI は番号形式を期待
4. **権限制限**: 自己承認は不可、専用アクションが必要
5. **イベント対応**: アクションごとに適切なパラメータ指定が必要

### デバッグのベストプラクティス

1. **ログ確認**: `gh run view --log-failed` でエラー詳細を把握
2. **段階的解決**: 一度に全てを修正せず、一つずつ対処
3. **ドキュメント確認**: 外部アクションの要件を正確に理解
4. **テスト駆動**: 修正後は必ず動作確認を実行

## まとめ

GitHub Actions のデバッグは以下のアプローチが効果的：

1. **ログファーストアプローチ**: まずログを詳細確認
2. **段階的修正**: 一つずつ問題を解決
3. **権限理解**: GitHub の制限とセキュリティを理解
4. **コミュニティ活用**: 適切な外部アクションを活用

この経験により、GitHub Actions の理解が深まり、より堅牢なワークフローを構築できるようになりました。

デバッグは時に frustrating ですが、一つ一つ解決していく過程で確実にスキルアップできる貴重な経験です。