export interface Quote {
  content: string;
  author: string;
}

// 根据语言和时区检查用户是否在中国
const isDomesticUser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const lang = navigator.language || 'en';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // 主要检查：简体中文语言
  if (lang.toLowerCase().includes('zh-cn')) return true;
  
  // 次要检查：中国时区
  if (timeZone === 'Asia/Shanghai' || timeZone === 'Asia/Chongqing' || timeZone === 'Asia/Harbin' || timeZone === 'Asia/Urumqi') return true;
  
  return false;
};

// API 失败时的备用名言
const fallbackQuotesCN: Quote[] = [
  {
    content: "未经审视的人生不值得过。",
    author: "苏格拉底"
  },
  {
    content: "我思故我在。",
    author: "笛卡尔"
  },
  {
    content: "知人者智，自知者明。",
    author: "老子"
  },
  {
    content: "学而不思则罔，思而不学则殆。",
    author: "孔子"
  },
  {
    content: "路漫漫其修远兮，吾将上下而求索。",
    author: "屈原"
  }
];

const fallbackQuotesEN: Quote[] = [
  {
    content: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    content: "I think, therefore I am.",
    author: "René Descartes"
  },
  {
    content: "Knowing others is intelligence; knowing yourself is true wisdom.",
    author: "Lao Tzu"
  },
  {
    content: "Stay hungry, stay foolish.",
    author: "Steve Jobs"
  },
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  }
];

export const fallbackQuotes: Quote[] = [...fallbackQuotesCN, ...fallbackQuotesEN];

const getFallbackQuote = (isDomestic: boolean = false): Quote => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = (today.getTime() - start.getTime()) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const targetQuotes = isDomestic ? fallbackQuotesCN : fallbackQuotesEN;
  const safeFallback = targetQuotes[0] ?? fallbackQuotesCN[0] ?? fallbackQuotesEN[0] ?? { content: "", author: "" };
  const index = Math.max(0, dayOfYear - 1) % targetQuotes.length;
  const picked = targetQuotes[index];
  
  return picked ?? safeFallback;
};

interface HitokotoResponse {
  hitokoto: string;
  from_who: string;
  from: string;
}

interface ZenQuoteResponse {
  q: string; // quote
  a: string; // author
}

export const fetchDailyQuote = async (): Promise<Quote> => {
  const isDomestic = isDomesticUser();
  
  try {
    if (isDomestic) {
      // 国内用户使用一言 (Hitokoto) API (哲学与文学类)
      const response = await fetch('https://v1.hitokoto.cn/?c=k&c=d');
      if (!response.ok) throw new Error('Hitokoto API failed');
      
      const data: HitokotoResponse = await response.json();
      return {
        content: data.hitokoto,
        author: data.from_who || data.from || '佚名'
      };
    } else {
      // 国际用户使用 ZenQuotes API
      // 注意：ZenQuotes 免费层可能有 CORS 限制.
      // 如果直接获取因 CORS 失败，可能需要代理或备用方案.
      // 在此演示中，我们尝试直接获取，如果失败则使用备用方案.
      try {
        const response = await fetch('https://zenquotes.io/api/random', {
          mode: 'cors' // 尝试标准 CORS 请求
        });
        
        if (!response.ok) throw new Error('ZenQuotes API failed');
        
        const data: ZenQuoteResponse[] = await response.json();
        if (data && data.length > 0 && data[0]) {
          return {
            content: data[0].q,
            author: data[0].a
          };
        }
      } catch (e) {
        console.warn('ZenQuotes fetch failed (likely CORS), falling back to local or alternative...', e);
        // 如果 ZenQuotes 失败 (例如 CORS)，回退到可靠的英语 API 或本地备用
        return getFallbackQuote(false);
      }
    }
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    return getFallbackQuote(isDomestic);
  }
  
  return getFallbackQuote(isDomestic);
};
