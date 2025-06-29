---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'VitestとJSDOMで実現するAstroコンポーネントテスト'
pubDate: 2025-06-30T11:00:00
description: '高速テストフレームワークVitestと、ブラウザ環境をシミュレートするJSDOMを組み合わせ、Astroプロジェクトで堅牢なコンポーネントテストを構築する手法を解説します。'
author: 'jun-kb'
tags: ["Astro", "Vitest", "JSDOM", "Testing", "TypeScript", "Unit Testing"]
---

# VitestとJSDOMによるテスト戦略

Astroプロジェクトの品質を維持・向上させるためには、堅牢なテスト戦略が不可欠です。今回は、高速なテストランナーである**Vitest**と、Node.js環境でブラウザのDOMをシミュレートする**JSDOM**を組み合わせたテスト環境の構築と実践について、このブログの`CalendarUtils.ts`のテストを例に解説します。

## なぜVitestとJSDOMなのか？

### Vitestの利点

1.  **高速性**: ViteのHMR（ホットモジュールリプレイスメント）エンジンを活用し、非常に高速なテスト実行を実現します。
2.  **簡単な設定**: Viteプロジェクトとの親和性が高く、多くの場合、最小限の設定で導入できます。
3.  **Jest互換のAPI**: `describe`, `test`, `expect`など、Jestに慣れた開発者ならすぐに使いこなせます。
4.  **TypeScript/ESMサポート**: 最新のJavaScriptエコシステムに標準で対応しています。

### JSDOMの役割

AstroやReactなどのコンポーネントは、最終的にブラウザのDOM上でレンダリングされ、動作します。しかし、テストは通常Node.js環境で実行されるため、`document`や`window`といったブラウザ固有のグローバルオブジェクトが存在しません。

**JSDOM**は、この問題を解決します。Node.js内でDOM環境をシミュレートし、コンポーネントのレンダリング、イベント発火、DOM操作などのテストを可能にします。

## テスト環境のセットアップ

このプロジェクトでは、`vitest.config.js`でテスト環境を設定しています。

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

-   `environment: 'jsdom'`: これが重要な設定です。Vitestに対して、テスト実行環境としてJSDOMを使用するよう指示します。これにより、テストコード内で`document`や`window`などのブラウザAPIが利用可能になります。
-   `globals: true`: `describe`, `test`, `expect`などを、`import`文なしでグローバルに利用できるようにします。

## 実践例：`CalendarUtils.ts`の単体テスト

`CalendarUtils.ts`は、DOM操作を含まない純粋なデータ処理ロジックです。そのため、厳密にはJSDOM環境は不要ですが、プロジェクト全体でテスト環境を統一するために`jsdom`が設定されています。

以下は`src/utils/CalendarUtils.test.ts`からの抜粋です。

```typescript
// src/utils/CalendarUtils.test.ts
import { describe, test, expect } from 'vitest';
import {
  generateCalendarData,
  type Post,
} from './CalendarUtils';

describe('generateCalendarData', () => {
  test('空の投稿配列を正常処理', () => {
    const result = generateCalendarData([]);
    expect(result.totalPosts).toBe(0);
    expect(result.activeDates).toEqual([]);
    expect(result.postsByDate).toEqual({});
  });

  test('無効な日付形式を無視', () => {
    const invalidPosts: Post[] = [{
      frontmatter: { 
        pubDate: 'invalid-date',
        title: 'Test',
        tags: []
      },
      url: '/test'
    }];
    const result = generateCalendarData(invalidPosts);
    expect(result.totalPosts).toBe(0);
    expect(result.activeDates).toEqual([]);
  });

  test('正常な投稿データを正確に集計', () => {
    const validPosts: Post[] = [
      {
        frontmatter: {
          pubDate: '2025-06-29T19:30:00',
          title: 'Post 1',
          tags: ['test']
        },
        url: '/post1'
      }
    ];
    
    const result = generateCalendarData(validPosts);
    expect(result.totalPosts).toBe(1);
    expect(result.activeDates).toEqual(['2025-06-29']);
    expect(result.postsByDate['2025-06-29'].count).toBe(1);
  });
});
```

このテストでは、Vitestが提供する`describe`でテストスイートを定義し、`test`（または`it`）で個別のテストケースを記述しています。`expect`とマッチャー（`.toBe()`, `.toEqual()`など）を使って、関数の実行結果が期待通りであるかを検証します。

テストの実行は以下のコマンドで行います：

```bash
npm test
```

## Astroコンポーネントのテスト（今後の展望）

`CalendarUtils.ts`のようなロジック層のテストに加えて、JSDOMの真価が発揮されるのがコンポーネントテストです。

例えば、`CalendarComponent.astro`をテストする場合、Astro公式が推奨する`@testing-library/astro`を利用するのが一般的です。以下に仮想的なテストコードを示します。

```typescript
// CalendarComponent.test.ts (仮想的な例)
import { render, screen } from '@testing-library/astro';
import CalendarComponent from '../components/CalendarComponent.astro';
import { expect } from 'vitest';
import '@testing-library/jest-dom'; // .toBeInTheDocument()などのマッチャーを利用するために必要

test('カレンダーが表示されること', async () => {
  const posts = [/* ... test data ... */];
  
  // JSDOM環境でコンポーネントをレンダリング
  // Astroコンポーネントは非同期にレンダリングされることがあるため、awaitを使用
  await render(<CalendarComponent posts={posts} />);

  // レンダリング結果をDOMから取得して検証
  const calendarTitle = screen.getByText(/投稿カレンダー/);
  expect(calendarTitle).toBeInTheDocument();

  const totalPostsStat = screen.getByText(/総投稿数:/);
  expect(totalPostsStat.textContent).toContain('10'); // 例
});
```

この（仮想的な）テストでは、`@testing-library/astro` を使ってコンポーネントをJSDOM内にレンダリングし、`screen`オブジェクトを通じてDOM要素を取得・検証します。Astroコンポーネントのテストでは、`render`が非同期処理になることがあるため`await`を使うのがポイントです。これにより、UIが正しく表示されているか、ユーザーインタラクションが期待通りに機能するかを確認できます。

## まとめ

-   **Vitest**は、Viteベースの高速でモダンなテストフレームワークです。
-   **JSDOM**は、Node.js環境でブラウザDOMをシミュレートし、コンポーネントのテストを可能にします。
-   `vitest.config.js`の`environment: 'jsdom'`設定一つで、簡単にテスト環境を構築できます。
-   まずは純粋なロジックからテストを始め、徐々にコンポーネントテストへと範囲を広げていくのが効果的なアプローチです。

このブログでも、`CalendarUtils.ts`の単体テストを皮切りに、今後はコンポーネントレベルのテストを拡充し、より品質の高いサイトを目指していきます。
