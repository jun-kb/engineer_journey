---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Astroの動的機能でAboutページを進化させた話'
pubDate: 2025-06-27T17:00:00
description: 'Astroチュートリアルを参考に、静的なAboutページを動的でインタラクティブなページに改善した開発記録'
author: 'エンジニア'
tags: ["Astro", "JavaScript", "フロントエンド", "動的レンダリング", "Web開発"]
---

# Aboutページ改善記録

今回は、このブログサイトのAboutページを改善した際に学んだ、**Astroの動的機能**について詳しく記録します。

## 改善前の課題

最初のAboutページは、完全に静的なHTMLで構築されていました：

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="About - engineer journey">
  <h1>About engineer journey</h1>
  <p>このサイトはエンジニアの学習と開発の記録を目的としたブログサイトです。</p>
  <!-- 固定的なコンテンツのみ -->
</Layout>
```

**問題点：**
- 内容が固定的でつまらない
- Astroの強力な機能を活用していない
- エンジニアとしての情報が不足
- 更新時にHTMLを直接編集する必要がある

## Astroの動的機能を活用した改善

[Astroの公式チュートリアル](https://docs.astro.build/ja/tutorial/2-pages/3/)を参考に、以下の動的機能を実装しました。

### 1. フロントマターでの変数定義

```astro
---
import Layout from '../layouts/Layout.astro';

// 動的変数の定義
const pageTitle = "About - engineer journey";

const identity = {
  name: "エンジニア",
  role: "ソフトウェア開発者",
  passion: "学習と成長"
};

const skills = [
  "JavaScript/TypeScript",
  "React/Next.js", 
  "Node.js",
  "Python",
  "Git/GitHub",
  "Astro",
  "Web開発"
];

const learningGoals = [
  "モダンなWeb開発技術の習得",
  "クリーンコードの実践",
  "DevOpsとインフラの理解",
  "オープンソース貢献"
];

const currentFocus = "Astroを使ったブログサイト構築";
const isLearning = true;
---
```

### 2. 変数埋め込み（Variable Interpolation）

HTMLテンプレート内で `{}` を使用して、JavaScriptの変数や式を直接埋め込めます：

```astro
<Layout title={pageTitle}>
  <h1>About engineer journey</h1>
  
  <h2>私について</h2>
  <p>こんにちは！私は<strong>{identity.name}</strong>として活動している<strong>{identity.role}</strong>です。</p>
  <p>特に<strong>{identity.passion}</strong>に情熱を注いでいます。</p>
</Layout>
```

### 3. 条件分岐レンダリング

論理AND演算子（`&&`）を使用した条件付きレンダリング：

```astro
{isLearning && <p>🌱 現在は「<strong>{currentFocus}</strong>」に集中して取り組んでいます。</p>}
```

この機能により、`isLearning`が`true`の場合のみ該当の要素が表示されます。

### 4. 動的リスト生成

JavaScript の `.map()` メソッドを使用して、配列から動的にリスト要素を生成：

```astro
<h2>技術スキル</h2>
<ul>
  {skills.map((skill) => <li>{skill}</li>)}
</ul>

<h2>学習目標</h2>
<ul>
  {learningGoals.map((goal) => <li>{goal}</li>)}
</ul>
```

## 改善結果

### Before（静的）
- 固定的なHTMLのみ
- 更新時はコードを直接編集
- 情報量が限定的

### After（動的）
- JavaScript変数による柔軟な管理
- 配列を使った効率的なリスト管理
- 条件分岐による動的表示
- 保守性とスケーラビリティの向上

## 学んだポイント

### 1. Astroの柔軟性
Astroは静的サイトジェネレーターでありながら、必要に応じて動的な要素を簡単に組み込める柔軟性があります。

### 2. JavaScript統合の自然さ
フロントマターでのJavaScript記述から、HTMLテンプレート内での変数利用まで、非常に自然に統合されています。

### 3. 保守性の向上
データ（スキルや目標）を変数として管理することで、コンテンツの更新が簡単になりました。

### 4. 型安全性
TypeScriptとの相性も良く、開発時の型チェックも効きます。

## 今後の展開

今回学んだ動的機能を活用して、以下の改善を検討中：

1. **プロジェクト一覧ページ**: 作成したプロジェクトを動的に表示
2. **タグベースのブログフィルタリング**: 記事のタグによる絞り込み機能
3. **コンポーネント化**: 再利用可能なコンポーネントの作成

## まとめ

Astroの動的機能を活用することで、静的なページを**インタラクティブで保守性の高い**ページに進化させることができました。

特に印象的だったのは：
- **学習コストの低さ**: 既存のJavaScriptとHTMLの知識でスムーズに実装
- **パフォーマンス**: ビルド時に最適化され、高速な静的サイトを維持
- **開発体験**: TypeScriptサポートと直感的なAPI

Astroは静的サイトジェネレーターでありながら、必要な部分だけ動的にできる絶妙なバランスが魅力的です。次回はさらに高度な機能にも挑戦してみたいと思います！

---

**関連リンク:**
- [Astro公式チュートリアル](https://docs.astro.build/ja/tutorial/)
- [プロジェクトのGitHubリポジトリ](https://github.com/jun-kb/engineer_journey)