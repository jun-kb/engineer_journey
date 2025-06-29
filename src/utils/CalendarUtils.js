/**
 * 学習カレンダー機能のユーティリティ関数
 * GitHub contribution graph風のカレンダー表示のためのデータ処理
 */

/**
 * ブログ投稿データからカレンダー表示用のデータを生成
 * @param {Array} posts - import.meta.glob()で取得したブログ投稿配列
 * @returns {Object} カレンダー表示用のデータ構造
 */
export function generateCalendarData(posts) {
  // 入力データバリデーション
  if (!posts || !Array.isArray(posts)) {
    console.warn('Invalid posts data provided to generateCalendarData');
    return {
      postsByDate: {},
      totalPosts: 0,
      activeDates: []
    };
  }

  // 投稿日別の集計データを作成
  const postsByDate = {};
  let validPostCount = 0;
  
  posts.forEach(post => {
    if (!post?.frontmatter?.pubDate) return;
    
    try {
      // ISO 8601形式の日時を日付のみに変換 (YYYY-MM-DD)
      const pubDate = new Date(post.frontmatter.pubDate);
      
      // 無効な日付の検証
      if (isNaN(pubDate.getTime())) {
        console.warn(`Invalid date format: ${post.frontmatter.pubDate} for post: ${post.frontmatter.title || 'Unknown'}`);
        return;
      }
      
      const dateKey = pubDate.toISOString().split('T')[0];
      
      if (!postsByDate[dateKey]) {
        postsByDate[dateKey] = {
          count: 0,
          posts: []
        };
      }
      
      postsByDate[dateKey].count++;
      postsByDate[dateKey].posts.push(post);
      validPostCount++;
    } catch (error) {
      console.error('Date parsing error:', error, 'for post:', post.frontmatter?.title || 'Unknown');
    }
  });
  
  return {
    postsByDate,
    totalPosts: validPostCount,
    activeDates: Object.keys(postsByDate).sort()
  };
}

/**
 * 指定した年・月のカレンダー表示用データを生成
 * @param {Object} calendarData - generateCalendarData()の結果
 * @param {number} year - 表示する年
 * @param {number} month - 表示する月 (0-11)
 * @returns {Array} カレンダー表示用の日付配列
 */
export function generateMonthData(calendarData, year, month) {
  // 入力パラメータのバリデーション
  if (!calendarData || typeof calendarData !== 'object') {
    console.warn('Invalid calendarData provided to generateMonthData');
    return [];
  }
  
  if (typeof year !== 'number' || typeof month !== 'number') {
    console.warn('Invalid year or month provided to generateMonthData');
    return [];
  }
  
  if (month < 0 || month > 11) {
    console.warn('Invalid month provided:', month, '(expected 0-11)');
    return [];
  }
  
  try {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay(); // 0 = 日曜日
    
    // 日付が無効でないかチェック
    if (isNaN(firstDay.getTime()) || isNaN(lastDay.getTime()) || daysInMonth <= 0) {
      console.warn('Invalid date calculation for year:', year, 'month:', month);
      return [];
    }
    
    const monthData = [];
    
    // 月の最初の週の空白セルを追加
    for (let i = 0; i < startWeekday; i++) {
      monthData.push(null);
    }
    
    // 月の各日を追加
    for (let day = 1; day <= daysInMonth; day++) {
      try {
        const date = new Date(year, month, day);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date created:', year, month, day);
          continue;
        }
        
        const dateKey = date.toISOString().split('T')[0];
        const dayData = calendarData.postsByDate && calendarData.postsByDate[dateKey];
        
        monthData.push({
          date: day,
          dateKey,
          posts: dayData ? dayData.posts : [],
          count: dayData ? dayData.count : 0,
          intensity: getIntensityLevel(dayData ? dayData.count : 0)
        });
      } catch (error) {
        console.error('Error processing day:', day, 'in month:', month, 'year:', year, error);
      }
    }
    
    return monthData;
  } catch (error) {
    console.error('Error in generateMonthData:', error);
    return [];
  }
}

/**
 * 投稿数に基づいて表示の濃淡レベルを計算
 * @param {number} count - その日の投稿数
 * @returns {number} 0-4のレベル (0: なし, 1-4: 薄い→濃い)
 */
function getIntensityLevel(count) {
  if (typeof count !== 'number' || isNaN(count)) {
    console.warn('Invalid count provided to getIntensityLevel:', count);
    return 0;
  }
  
  if (count < 0) {
    console.warn('Negative count provided to getIntensityLevel:', count);
    return 0;
  }
  
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4; // 4個以上
}

/**
 * 月名を日本語で取得
 * @param {number} month - 月 (0-11)
 * @returns {string} 日本語の月名
 */
export function getMonthName(month) {
  if (typeof month !== 'number' || month < 0 || month > 11) {
    console.warn('Invalid month provided to getMonthName:', month);
    return '不明';
  }
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return monthNames[month];
}

/**
 * 現在の年・月を取得
 * @returns {Object} 現在の年・月
 */
export function getCurrentYearMonth() {
  try {
    const now = new Date();
    if (isNaN(now.getTime())) {
      console.warn('Invalid current date detected');
      // フォールバック値を返す
      return {
        year: 2024,
        month: 0
      };
    }
    return {
      year: now.getFullYear(),
      month: now.getMonth()
    };
  } catch (error) {
    console.error('Error getting current year/month:', error);
    return {
      year: 2024,
      month: 0
    };
  }
}

/**
 * 指定した日付の投稿一覧を取得
 * @param {Object} calendarData - generateCalendarData()の結果
 * @param {string} dateKey - 日付キー (YYYY-MM-DD)
 * @returns {Array} その日の投稿一覧
 */
export function getPostsForDate(calendarData, dateKey) {
  if (!calendarData || typeof calendarData !== 'object') {
    console.warn('Invalid calendarData provided to getPostsForDate');
    return [];
  }
  
  if (!dateKey || typeof dateKey !== 'string') {
    console.warn('Invalid dateKey provided to getPostsForDate:', dateKey);
    return [];
  }
  
  if (!calendarData.postsByDate) {
    console.warn('calendarData.postsByDate is missing');
    return [];
  }
  
  const dayData = calendarData.postsByDate[dateKey];
  return dayData && Array.isArray(dayData.posts) ? dayData.posts : [];
}