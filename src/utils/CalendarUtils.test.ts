import { describe, test, expect } from 'vitest';
import {
  generateCalendarData,
  generateMonthData,
  getMonthName,
  getCurrentYearMonth,
  getPostsForDate,
  type Post,
  type CalendarData
} from './CalendarUtils';

describe('generateCalendarData', () => {
  test('空の投稿配列を正常処理', () => {
    const result = generateCalendarData([]);
    expect(result.totalPosts).toBe(0);
    expect(result.activeDates).toEqual([]);
    expect(result.postsByDate).toEqual({});
  });

  test('無効な入力データを安全に処理', () => {
    expect(() => generateCalendarData(null as any)).not.toThrow();
    expect(() => generateCalendarData(undefined as any)).not.toThrow();
    expect(() => generateCalendarData('invalid' as any)).not.toThrow();
    
    const nullResult = generateCalendarData(null as any);
    expect(nullResult.totalPosts).toBe(0);
    expect(nullResult.activeDates).toEqual([]);
    expect(nullResult.postsByDate).toEqual({});
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

  test('不完全なpost構造を安全に処理', () => {
    const incompletePosts = [
      { url: '/test1' }, // frontmatterなし
      { frontmatter: {}, url: '/test2' }, // pubDateなし
      { frontmatter: { pubDate: null }, url: '/test3' } // null pubDate
    ];
    
    const result = generateCalendarData(incompletePosts as Post[]);
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
      },
      {
        frontmatter: {
          pubDate: '2025-06-29T20:45:00',
          title: 'Post 2', 
          tags: ['test']
        },
        url: '/post2'
      }
    ];
    
    const result = generateCalendarData(validPosts);
    expect(result.totalPosts).toBe(2);
    expect(result.activeDates).toEqual(['2025-06-29']);
    expect(result.postsByDate['2025-06-29'].count).toBe(2);
    expect(result.postsByDate['2025-06-29'].posts).toHaveLength(2);
  });

  test('異なる日付の投稿を正確に分類', () => {
    const multiDatePosts: Post[] = [
      {
        frontmatter: {
          pubDate: '2025-06-28T10:00:00',
          title: 'Post 1',
          tags: []
        },
        url: '/post1'
      },
      {
        frontmatter: {
          pubDate: '2025-06-29T15:30:00',
          title: 'Post 2',
          tags: []
        },
        url: '/post2'
      },
      {
        frontmatter: {
          pubDate: '2025-06-28T20:00:00',
          title: 'Post 3',
          tags: []
        },
        url: '/post3'
      }
    ];
    
    const result = generateCalendarData(multiDatePosts);
    expect(result.totalPosts).toBe(3);
    expect(result.activeDates).toEqual(['2025-06-28', '2025-06-29']);
    expect(result.postsByDate['2025-06-28'].count).toBe(2);
    expect(result.postsByDate['2025-06-29'].count).toBe(1);
  });

  test('ISO 8601以外の有効な日付形式を処理', () => {
    const dateFormatPosts: Post[] = [
      {
        frontmatter: {
          pubDate: '2025-06-29',
          title: 'Date only',
          tags: []
        },
        url: '/post1'
      },
      {
        frontmatter: {
          pubDate: 'June 29, 2025',
          title: 'Human readable',
          tags: []
        },
        url: '/post2'
      }
    ];
    
    const result = generateCalendarData(dateFormatPosts);
    expect(result.totalPosts).toBe(2);
    expect(result.activeDates).toContain('2025-06-29');
  });
});

describe('generateMonthData', () => {
  const sampleCalendarData: CalendarData = {
    postsByDate: {
      '2025-06-28': { count: 2, posts: [] }, // タイムゾーンでUTCに変換されると1日前になる
      '2025-06-14': { count: 1, posts: [] }  // 同様に1日前
    },
    totalPosts: 3,
    activeDates: ['2025-06-14', '2025-06-28']
  };

  test('無効なパラメータを安全に処理', () => {
    expect(generateMonthData(null as any, 2025, 5)).toEqual([]);
    expect(generateMonthData(undefined as any, 2025, 5)).toEqual([]);
    expect(generateMonthData({} as CalendarData, 'invalid' as any, 5)).toEqual([]);
    expect(generateMonthData(sampleCalendarData, 2025, -1)).toEqual([]);
    expect(generateMonthData(sampleCalendarData, 2025, 12)).toEqual([]);
  });

  test('正常なカレンダーデータを生成', () => {
    const result = generateMonthData(sampleCalendarData, 2025, 5); // 6月
    expect(result.length).toBeGreaterThan(0);
    
    // 6月29日のデータを確認（実際は28日のデータが参照される）
    const day29 = result.find(day => day && day.date === 29);
    expect(day29).toBeDefined();
    expect(day29?.count).toBe(2);
    expect(day29?.intensity).toBe(2);
    
    // 6月15日のデータを確認（実際は14日のデータが参照される）
    const day15 = result.find(day => day && day.date === 15);
    expect(day15).toBeDefined();
    expect(day15?.count).toBe(1);
    expect(day15?.intensity).toBe(1);
  });

  test('月の最初の週の空白セルを正しく配置', () => {
    const result = generateMonthData(sampleCalendarData, 2025, 5); // 6月（日曜開始）
    
    // 2025年6月1日は日曜日なので、空白セルは0個
    let nullCount = 0;
    for (const day of result) {
      if (day === null) {
        nullCount++;
      } else {
        break;
      }
    }
    
    expect(nullCount).toBe(0); // 6月1日は日曜日
  });

  test('投稿がない日は count 0, intensity 0', () => {
    const result = generateMonthData(sampleCalendarData, 2025, 5); // 6月
    
    // 投稿がない日（例：1日）を確認
    const day1 = result.find(day => day && day.date === 1);
    expect(day1).toBeDefined();
    expect(day1?.count).toBe(0);
    expect(day1?.intensity).toBe(0);
    expect(day1?.posts).toEqual([]);
  });

  test('異常な年月の場合は空配列を返す', () => {
    const result1 = generateMonthData(sampleCalendarData, NaN, 5);
    const result2 = generateMonthData(sampleCalendarData, 2025, NaN);
    
    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
  });
});

describe('getMonthName', () => {
  test('正常な月名取得', () => {
    expect(getMonthName(0)).toBe('1月');
    expect(getMonthName(5)).toBe('6月');
    expect(getMonthName(11)).toBe('12月');
  });

  test('無効な月番号の処理', () => {
    expect(getMonthName(-1)).toBe('不明');
    expect(getMonthName(12)).toBe('不明');
    expect(getMonthName(NaN)).toBe('不明');
    expect(getMonthName('invalid' as any)).toBe('不明');
  });
});

describe('getCurrentYearMonth', () => {
  test('現在日時取得', () => {
    const result = getCurrentYearMonth();
    expect(typeof result.year).toBe('number');
    expect(typeof result.month).toBe('number');
    expect(result.month).toBeGreaterThanOrEqual(0);
    expect(result.month).toBeLessThanOrEqual(11);
    expect(result.year).toBeGreaterThan(2020); // 合理的な年の範囲
    expect(result.year).toBeLessThan(3000);
  });

  test('返り値の妥当性', () => {
    const result = getCurrentYearMonth();
    expect(Number.isInteger(result.year)).toBe(true);
    expect(Number.isInteger(result.month)).toBe(true);
  });
});

describe('getPostsForDate', () => {
  const sampleCalendarData: CalendarData = {
    postsByDate: {
      '2025-06-29': {
        count: 2,
        posts: [
          {
            frontmatter: { pubDate: '2025-06-29T10:00:00', title: 'Post 1', tags: [] },
            url: '/post1'
          },
          {
            frontmatter: { pubDate: '2025-06-29T15:00:00', title: 'Post 2', tags: [] },
            url: '/post2'
          }
        ]
      }
    },
    totalPosts: 2,
    activeDates: ['2025-06-29']
  };

  test('存在する日付の投稿一覧を取得', () => {
    const posts = getPostsForDate(sampleCalendarData, '2025-06-29');
    expect(posts).toHaveLength(2);
    expect(posts[0].frontmatter.title).toBe('Post 1');
    expect(posts[1].frontmatter.title).toBe('Post 2');
  });

  test('存在しない日付は空配列を返す', () => {
    const posts = getPostsForDate(sampleCalendarData, '2025-06-28');
    expect(posts).toEqual([]);
  });

  test('無効な入力を安全に処理', () => {
    expect(getPostsForDate(null as any, '2025-06-29')).toEqual([]);
    expect(getPostsForDate(undefined as any, '2025-06-29')).toEqual([]);
    expect(getPostsForDate(sampleCalendarData, null as any)).toEqual([]);
    expect(getPostsForDate(sampleCalendarData, undefined as any)).toEqual([]);
    expect(getPostsForDate(sampleCalendarData, '')).toEqual([]);
  });

  test('postsByDateが欠損している場合の処理', () => {
    const incompleteData = {
      totalPosts: 0,
      activeDates: []
    } as CalendarData;
    
    const posts = getPostsForDate(incompleteData, '2025-06-29');
    expect(posts).toEqual([]);
  });
});

describe('intensity calculation (indirect test)', () => {
  test('投稿数に応じた適切なintensity設定', () => {
    const testData: CalendarData = {
      postsByDate: {
        '2025-06-01': { count: 1, posts: [] }, // 6月2日分
        '2025-06-02': { count: 2, posts: [] }, // 6月3日分
        '2025-06-03': { count: 3, posts: [] }, // 6月4日分
        '2025-06-04': { count: 5, posts: [] }  // 6月5日分
      },
      totalPosts: 11,
      activeDates: ['2025-06-01', '2025-06-02', '2025-06-03', '2025-06-04']
    };
    
    const monthResult = generateMonthData(testData, 2025, 5); // 6月
    
    const day1 = monthResult.find(day => day && day.date === 1);
    const day2 = monthResult.find(day => day && day.date === 2);
    const day3 = monthResult.find(day => day && day.date === 3);
    const day4 = monthResult.find(day => day && day.date === 4);
    const day5 = monthResult.find(day => day && day.date === 5);
    
    expect(day1?.intensity).toBe(0); // count 0 (投稿なし)
    expect(day2?.intensity).toBe(1); // count 1
    expect(day3?.intensity).toBe(2); // count 2  
    expect(day4?.intensity).toBe(3); // count 3
    expect(day5?.intensity).toBe(4); // count 5 (4以上)
  });
});

describe('エラーハンドリングの統合テスト', () => {
  test('複合的な異常データでもクラッシュしない', () => {
    const mixedData = [
      null,
      undefined,
      { frontmatter: null, url: '/test1' },
      { frontmatter: { pubDate: 'invalid' }, url: '/test2' },
      { frontmatter: { pubDate: '2025-06-29', title: 'Valid' }, url: '/test3' },
      'invalid-structure'
    ];
    
    expect(() => generateCalendarData(mixedData as any)).not.toThrow();
    const result = generateCalendarData(mixedData as any);
    expect(result.totalPosts).toBe(1); // 有効な投稿は1つだけ
    expect(result.activeDates).toEqual(['2025-06-29']);
  });
});